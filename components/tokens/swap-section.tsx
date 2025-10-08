"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowDownUp } from "lucide-react";
import { DynamicBondingCurveClient } from "@meteora-ag/dynamic-bonding-curve-sdk";
import { CpAmm } from "@meteora-ag/cp-amm-sdk";
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection } from "@solana/web3.js";
import BN from "bn.js";
import { toast } from "sonner";
import { TOKEN_GRADUATION_ADDRESS, TOKEN_POOL_ADDRESS } from "@/app/constant";
import { getMigrateStatus } from "./migrateStatus";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

interface SwapSectionProps {
  tokenId: string;
}

export function SwapSection({ tokenId }: SwapSectionProps) {
  const [buyAmount, setBuyAmount] = useState("");
  const [sellAmount, setSellAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const POOL_ADDRESS = TOKEN_POOL_ADDRESS;

  const TOKEN_SYMBOL = "TOKEN";
  const SOL_BALANCE = 10.5;
  const TOKEN_BALANCE = 0;
  const PRICE_PER_TOKEN = 0.0012;
  const SLIPPAGE_BPS = 100; // 1%

  const wallet = useWallet();
  const connection = new Connection(
    process.env.NEXT_PUBLIC_RPC_URL!,
    "confirmed"
  );

  const getSwapQuote = async (
    amountInSol: number,
    isBuy: boolean,
    gPoolState?: any
  ): Promise<any> => {
    // Check if it's a graduated pool (CP-AMM)
    if (gPoolState) {
      try {
        const cpAmm = new CpAmm(connection);
        const currentSlot = await connection.getSlot();
        const blockTime = await connection.getBlockTime(currentSlot);

        if (blockTime === null) {
          toast.error("Unable to fetch block time");
          throw new Error("Unable to fetch block time");
        }

        toast.loading("Calculating quote...");

        const quote = await cpAmm.getQuote({
          inAmount: new BN(Math.floor(amountInSol * 1e9)),
          inputTokenMint: gPoolState.tokenAMint,
          slippage: 0.5,
          poolState: gPoolState,
          currentTime: blockTime,
          currentSlot,
          tokenADecimal: 9,
          tokenBDecimal: 6,
        });

        console.log("Graduated Pool Quote:", quote);
        toast.info(`Expected output: ${quote.minSwapOutAmount.toString()}`);
        return quote;
      } catch (error) {
        console.error("Failed to get graduated pool quote:", error);
        throw error;
      }
    } else {
      // Non-graduated pool (Dynamic Bonding Curve)
      try {
        const client = new DynamicBondingCurveClient(connection, "confirmed");
        const virtualPoolState = await client.state.getPool(POOL_ADDRESS);
        if (!virtualPoolState) {
          throw new Error("Pool not found");
        }

        const poolConfigState = await client.state.getPoolConfig(
          virtualPoolState.config
        );

        const currentPoint = new BN(0);
        const amountIn = new BN(Math.floor(amountInSol * 1e9));

        const quote = await client.pool.swapQuote({
          virtualPool: virtualPoolState,
          config: poolConfigState,
          swapBaseForQuote: isBuy,
          amountIn,
          slippageBps: SLIPPAGE_BPS,
          hasReferral: false,
          currentPoint,
        });

        console.log("Regular Pool Quote:", quote);

        return quote;
      } catch (error) {
        console.error("Failed to get swap quote:", error);
        throw error;
      }
    }
  };

  const handleBuy = async () => {
    if (!wallet.connected || !wallet.publicKey) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (!buyAmount || parseFloat(buyAmount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    setIsLoading(true);
    const toastId = toast.loading("Preparing swap transaction...");

    try {
      // Check if pool is graduated (CP-AMM)
      const cpAmm = new CpAmm(connection);
      let gPoolState = null;

      try {
        gPoolState = await cpAmm.fetchPoolState(TOKEN_GRADUATION_ADDRESS);
      } catch (error) {
        console.log("Graduated pool not found, using bonding curve pool");
      }

      // Check if pool is migrated
      const client = new DynamicBondingCurveClient(connection, "confirmed");
      const nonGPoolState = await client.state.getPool(POOL_ADDRESS);
      const migrationStatus = nonGPoolState ? nonGPoolState.isMigrated : false;

      toast.loading("Getting swap quote...", { id: toastId });
      const quote = await getSwapQuote(parseFloat(buyAmount), true, gPoolState);
      console.log("Swap quote:", quote);

      let globalSwapTransaction: any;

      if (migrationStatus && gPoolState) {
        // Graduated pool - using CP-AMM
        const swapTx = await cpAmm.swap({
          payer: wallet.publicKey,
          pool: TOKEN_GRADUATION_ADDRESS,
          inputTokenMint: gPoolState.tokenAMint,
          outputTokenMint: gPoolState.tokenBMint,
          amountIn: new BN(Math.floor(parseFloat(buyAmount) * 1e9)),
          minimumAmountOut: quote.minSwapOutAmount,
          tokenAVault: gPoolState.tokenAVault,
          tokenBVault: gPoolState.tokenBVault,
          tokenAMint: gPoolState.tokenAMint,
          tokenBMint: gPoolState.tokenBMint,
          tokenAProgram: TOKEN_PROGRAM_ID,
          tokenBProgram: TOKEN_PROGRAM_ID,
          referralTokenAccount: null,
        });
        globalSwapTransaction = swapTx;
      } else {
        // Non-migrated pool - using Dynamic Bonding Curve
        const swapParam = {
          amountIn: new BN(Math.floor(parseFloat(buyAmount) * 1e9)),
          minimumAmountOut: quote.minimumAmountOut,
          swapBaseForQuote: true, // true when buying tokens with SOL
          owner: wallet.publicKey,
          pool: POOL_ADDRESS,
          referralTokenAccount: null,
        };

        toast.loading("Creating swap transaction...", { id: toastId });
        const swapTransaction = await client.pool.swap(swapParam);
        globalSwapTransaction = swapTransaction;
      }

      const { blockhash, lastValidBlockHeight } =
        await connection.getLatestBlockhash();
      globalSwapTransaction.recentBlockhash = blockhash;
      globalSwapTransaction.feePayer = wallet.publicKey;
      globalSwapTransaction.lastValidBlockHeight = lastValidBlockHeight;

      toast.loading("Awaiting confirmation...", { id: toastId });

      if (!wallet.signTransaction) {
        throw new Error("Wallet does not support transaction signing");
      }

      const signedTx = await wallet.signTransaction(globalSwapTransaction);
      const signature = await connection.sendRawTransaction(
        signedTx.serialize(),
        {
          skipPreflight: true,
          maxRetries: 5,
        }
      );

      await connection.confirmTransaction(signature, "confirmed");

      toast.success(
        <div className="flex flex-col gap-1">
          <p>Swap successful!</p>
          <a
            href={`https://explorer.solana.com/tx/${signature}?cluster=devnet`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs underline"
          >
            View on Solana Explorer
          </a>
        </div>,
        { id: toastId, duration: 5000 }
      );

      setBuyAmount("");
    } catch (error: any) {
      console.error("Buy swap failed:", error);
      toast.error(error?.message || "Failed to execute swap", {
        id: toastId,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSell = async () => {
    if (!wallet.connected || !wallet.publicKey) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (!sellAmount || parseFloat(sellAmount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (TOKEN_BALANCE <= 0) {
      toast.error("Insufficient token balance");
      return;
    }

    setIsLoading(true);
    const toastId = toast.loading("Preparing swap transaction...");

    try {
      const client = new DynamicBondingCurveClient(connection, "confirmed");
      toast.loading("Getting swap quote...", { id: toastId });
      const quote = await getSwapQuote(parseFloat(sellAmount), false);
      const swapParam = {
        amountIn: new BN(Math.floor(parseFloat(sellAmount) * 1e9)),
        minimumAmountOut: quote.minimumAmountOut,
        swapBaseForQuote: true,
        owner: wallet.publicKey,
        pool: POOL_ADDRESS,
        referralTokenAccount: null,
      };

      toast.loading("Creating swap transaction...", { id: toastId });
      const swapTransaction = await client.pool.swap(swapParam);

      const { blockhash } = await connection.getLatestBlockhash();
      swapTransaction.recentBlockhash = blockhash;
      swapTransaction.feePayer = wallet.publicKey;

      toast.loading("Awaiting confirmation...", { id: toastId });

      if (!wallet.signTransaction) {
        throw new Error("Wallet does not support transaction signing");
      }

      const signedTx = await wallet.signTransaction(swapTransaction);
      const signature = await connection.sendRawTransaction(
        signedTx.serialize(),
        {
          skipPreflight: true,
          maxRetries: 5,
        }
      );

      await connection.confirmTransaction(signature, "confirmed");

      toast.success(
        <div className="flex flex-col gap-1">
          <p>Swap successful!</p>
          <a
            href={`https://explorer.solana.com/address/${signature}?cluster=devnet`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs underline"
          >
            View on Solana Explorer
          </a>
        </div>,
        { id: toastId, duration: 5000 }
      );

      setSellAmount("");
    } catch (error: any) {
      console.error("Swap failed:", error);
      toast.error(error?.message || "Failed to execute swap", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="sticky top-8">
      <CardHeader>
        <CardTitle>Trade</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="buy" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="buy">Buy</TabsTrigger>
            <TabsTrigger value="sell">Sell</TabsTrigger>
          </TabsList>
          <TabsContent value="buy" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="buy-from">From</Label>
              <div className="space-y-2">
                <Input
                  id="buy-from"
                  type="number"
                  placeholder="0.0"
                  value={buyAmount}
                  onChange={(e) => setBuyAmount(e.target.value)}
                />
                <div className="flex items-center justify-between px-3 py-2 bg-muted rounded-md">
                  <span className="text-sm font-medium">SOL</span>
                  <span className="text-xs text-muted-foreground">
                    Balance: {SOL_BALANCE}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="rounded-full bg-muted p-2">
                <ArrowDownUp className="w-4 h-4" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="buy-to">To (estimated)</Label>
              <div className="space-y-2">
                <Input
                  id="buy-to"
                  type="number"
                  placeholder="0.0"
                  readOnly
                  value={
                    buyAmount ? (parseFloat(buyAmount) * 833.33).toFixed(2) : ""
                  }
                />
                <div className="flex items-center justify-between px-3 py-2 bg-muted rounded-md">
                  <span className="text-sm font-medium">{TOKEN_SYMBOL}</span>
                  <span className="text-xs text-muted-foreground">
                    Balance: {TOKEN_BALANCE}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Price per token</span>
                <span className="font-medium">${PRICE_PER_TOKEN}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Slippage</span>
                <span className="font-medium">{SLIPPAGE_BPS / 100}%</span>
              </div>
            </div>

            <Button
              onClick={handleBuy}
              className="w-full"
              size="lg"
              disabled={
                !wallet.connected ||
                isLoading ||
                !buyAmount ||
                parseFloat(buyAmount) <= 0
              }
            >
              {!wallet.connected
                ? "Connect Wallet"
                : isLoading
                ? "Processing..."
                : "Buy Token"}
            </Button>
          </TabsContent>
          <TabsContent value="sell" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sell-from">From</Label>
              <div className="space-y-2">
                <Input
                  id="sell-from"
                  type="number"
                  placeholder="0.0"
                  value={sellAmount}
                  onChange={(e) => setSellAmount(e.target.value)}
                />
                <div className="flex items-center justify-between px-3 py-2 bg-muted rounded-md">
                  <span className="text-sm font-medium">{TOKEN_SYMBOL}</span>
                  <span className="text-xs text-muted-foreground">
                    Balance: {TOKEN_BALANCE}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="rounded-full bg-muted p-2">
                <ArrowDownUp className="w-4 h-4" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sell-to">To (estimated)</Label>
              <div className="space-y-2">
                <Input
                  id="sell-to"
                  type="number"
                  placeholder="0.0"
                  readOnly
                  value={
                    sellAmount
                      ? (parseFloat(sellAmount) / 833.33).toFixed(4)
                      : ""
                  }
                />
                <div className="flex items-center justify-between px-3 py-2 bg-muted rounded-md">
                  <span className="text-sm font-medium">SOL</span>
                  <span className="text-xs text-muted-foreground">
                    Balance: {SOL_BALANCE}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Price per token</span>
                <span className="font-medium">${PRICE_PER_TOKEN}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Slippage</span>
                <span className="font-medium">{SLIPPAGE_BPS / 100}%</span>
              </div>
            </div>

            <Button
              onClick={handleSell}
              className="w-full"
              size="lg"
              variant="destructive"
              disabled={
                !wallet.connected ||
                isLoading ||
                !sellAmount ||
                parseFloat(sellAmount) <= 0 ||
                TOKEN_BALANCE <= 0
              }
            >
              {!wallet.connected
                ? "Connect Wallet"
                : isLoading
                ? "Processing..."
                : "Sell Token"}
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
