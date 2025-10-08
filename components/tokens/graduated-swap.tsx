"use client";

import React from "react";
import { Connection, PublicKey, SendTransactionError } from "@solana/web3.js";
import { CpAmm } from "@meteora-ag/cp-amm-sdk";
import BN from "bn.js";
import { toast } from "sonner";
import { useWallet } from "@solana/wallet-adapter-react";
import { Button } from "../ui/button";
import {
  DAMM_V2_MIGRATION_FEE_ADDRESS,
  deriveDammV2PoolAddress,
  DynamicBondingCurveClient,
} from "@meteora-ag/dynamic-bonding-curve-sdk";
import { TOKEN_PROGRAM_ID, getAssociatedTokenAddress, getAccount } from "@solana/spl-token";
import { TOKEN_GRADUATION_ADDRESS, TOKEN_MINT_ADDRESS, TOKEN_POOL_ADDRESS } from "@/app/constant";

export default function GraduatedSwap() {
  const connection = new Connection(
    process.env.NEXT_PUBLIC_RPC_URL!,
    "confirmed"
  );

  const POOL_ADDRESS = TOKEN_POOL_ADDRESS;
  const TOKEN_MINT = TOKEN_MINT_ADDRESS
  const GRADUATED_POOL_ADDRESS = TOKEN_GRADUATION_ADDRESS;

  const cpAmm = new CpAmm(connection);
  const wallet = useWallet();

  async function handleSwap() {
    if (!wallet.connected || !wallet.publicKey) {
      toast.error("Please connect your wallet");
      return;
    }

    if (!wallet.signTransaction) {
      toast.error("Wallet does not support transaction signing");
      return;
    }

    try {
      toast.loading("Fetching pool state...");

      const poolState = await cpAmm.fetchPoolState(GRADUATED_POOL_ADDRESS);
      console.log("Pool State:", poolState);

      if (!poolState) {
        toast.error("Pool state not found");
        throw new Error("Pool state not found");
      }

      const currentSlot = await connection.getSlot();
      console.log("Current Slot:", currentSlot);

      const blockTime = await connection.getBlockTime(currentSlot);
      console.log("Block Time:", blockTime);

      if (blockTime === null) {
        toast.error("Unable to fetch block time");
        throw new Error("Unable to fetch block time");
      }

      toast.loading("Calculating quote...");

      const quote = await cpAmm.getQuote({
        inAmount: new BN(100_000_000_000_000),
        inputTokenMint: poolState.tokenAMint,
        slippage: 0.5,
        poolState,
        currentTime: blockTime,
        currentSlot,
        tokenADecimal: 9,
        tokenBDecimal: 6,
      });

      console.log("Quote:", quote);
      toast.info(`Expected output: ${quote.minSwapOutAmount.toString()}`);
      toast.loading("Preparing swap transaction...");

      const swapTx = await cpAmm.swap({
        payer: wallet.publicKey,
        pool: GRADUATED_POOL_ADDRESS,
        inputTokenMint: poolState.tokenAMint,
        outputTokenMint: poolState.tokenBMint,
        amountIn: new BN(100_000_000_000_000),
        minimumAmountOut: quote.minSwapOutAmount,
        tokenAVault: poolState.tokenAVault,
        tokenBVault: poolState.tokenBVault,
        tokenAMint: poolState.tokenAMint,
        tokenBMint: poolState.tokenBMint,
        tokenAProgram: TOKEN_PROGRAM_ID,
        tokenBProgram: TOKEN_PROGRAM_ID,
        referralTokenAccount: null,
      });

      if (!swapTx) {
        toast.error("Swap transaction failed");
        throw new Error("Swap transaction failed");
      }

      console.log("Swap Transaction created:", swapTx);

      const { blockhash, lastValidBlockHeight } =
        await connection.getLatestBlockhash("confirmed");
      swapTx.recentBlockhash = blockhash;
      swapTx.lastValidBlockHeight = lastValidBlockHeight;
      swapTx.feePayer = wallet.publicKey;

      toast.info("Please approve the transaction in your wallet");

      const signedTx = await wallet.signTransaction(swapTx);
      console.log("Transaction signed");

      toast.loading("Sending transaction...");

      const signature = await connection.sendRawTransaction(
        signedTx.serialize(),
        {
          maxRetries: 5,
          skipPreflight: true,
          preflightCommitment: "confirmed",
        }
      );

      console.log("Transaction sent:", signature);
      toast.loading("Confirming transaction...");

      const confirmation = await connection.confirmTransaction(
        {
          signature,
          blockhash,
          lastValidBlockHeight,
        },
        "confirmed"
      );

      if (confirmation.value.err) {
        throw new Error("Transaction confirmation failed");
      }

      toast.success("Swap completed successfully!", {
        description: `Transaction: ${signature.slice(0, 8)}...`,
        duration: 10000,
        action: {
          label: "View on Solscan",
          onClick: () =>
            window.open(
              `https://explorer.solana.com/tx/${signature}?cluster=devnet`,
              "_blank"
            ),
        },
      });

      console.log("Swap completed successfully:", signature);
    } catch (error) {
      console.error("Error occurred during swap:", error);
      toast.error("Swap failed", {
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
      toast.dismiss();
    } finally {
      //   toast.dismiss();
    }
  }

  const client = new DynamicBondingCurveClient(connection, "confirmed");

  async function handlePoolState() {
    try {
      const poolState = await client.state.getPool(POOL_ADDRESS);
      if (!poolState) {
        console.error("Pool doesn't exist yet!");
      }

      const virtualPoolState = await client.state.getPool(POOL_ADDRESS);
      if (!virtualPoolState) {
        throw new Error("Pool not found");
      }

      const poolConfigState = await client.state.getPoolConfig(
        virtualPoolState.config
      );
      const dammV2PoolAddress = deriveDammV2PoolAddress(
        DAMM_V2_MIGRATION_FEE_ADDRESS[poolConfigState.migrationFeeOption],
        TOKEN_MINT,
        new PublicKey("So11111111111111111111111111111111111111112") // token program
      );
      console.log("Damm V2 Pool Address:", dammV2PoolAddress.toString());
      toast.success("Pool state fetched! Check console for details.");
      toast.success(`Damm V2 Pool Address: ${dammV2PoolAddress.toString()}`);
      const dammV2PoolState = await client.state.getPool(dammV2PoolAddress);
      if (!dammV2PoolState) {
        console.error("Damm V2 Pool doesn't exist yet!");
      } else {
        console.log("Damm V2 Pool State:", dammV2PoolState);
      }
    } catch (error) {
      console.error("Error occurred during swap:", error);
      // toast.error("Error occurred during swap");
    }
  }
  return (
    <div className="mb-4 p-4 flex gap-2">
      <Button onClick={handleSwap}>Swap</Button>
      <Button onClick={handlePoolState}>Get Pool State</Button>
    </div>
  );
}
