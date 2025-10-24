"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowDownUp } from "lucide-react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection, PublicKey } from "@solana/web3.js";
import { CpAmm } from "@meteora-ag/cp-amm-sdk";
import BN from "bn.js";
import { toast } from "sonner";
import { TOKEN_GRADUATION_ADDRESS } from "@/app/constant";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

interface GraduatedSwapSectionProps {
  activeTab?: "buy" | "sell";
  onTabChange?: (tab: "buy" | "sell") => void;
}

export function GraduatedSwapSection({
  activeTab = "buy",
  onTabChange,
}: GraduatedSwapSectionProps) {
  const [buyAmount, setBuyAmount] = useState("");
  const [sellAmount, setSellAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const GRADUATED_POOL_ADDRESS = TOKEN_GRADUATION_ADDRESS;

  const TOKEN_SYMBOL = "TKN";
  const SOL_BALANCE = 10.5;
  const SLIPPAGE = 0.5;

  const wallet = useWallet();
  const connection = new Connection(
    process.env.NEXT_PUBLIC_RPC_URL!,
    "confirmed"
  );

  const cpAmm = new CpAmm(connection);
  async function performCpAmmSwap(amountIn: BN, swapAToB: boolean) {
    if (!wallet.connected || !wallet.publicKey) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (!wallet.signTransaction) {
      toast.error("Wallet does not support transaction signing");
      return;
    }

    const toastId = toast.loading("Fetching pool state...");

    const poolState = await cpAmm.fetchPoolState(GRADUATED_POOL_ADDRESS);
    if (!poolState) {
      toast.error("Pool state not found", { id: toastId });
      throw new Error("Pool state not found");
    }

    const currentSlot = await connection.getSlot();
    const blockTime = await connection.getBlockTime(currentSlot);
    if (blockTime === null) {
      toast.error("Unable to fetch block time", { id: toastId });
      throw new Error("Unable to fetch block time");
    }

    toast.loading("Calculating quote...", { id: toastId });

    const inputMint = swapAToB ? poolState.tokenAMint : poolState.tokenBMint;
    const outputMint = swapAToB ? poolState.tokenBMint : poolState.tokenAMint;
    const tokenADecimal = 9;
    const tokenBDecimal = 6;

    const quote = await cpAmm.getQuote({
      inAmount: amountIn,
      inputTokenMint: inputMint,
      slippage: SLIPPAGE,
      poolState,
      currentTime: blockTime,
      currentSlot,
      tokenADecimal,
      tokenBDecimal,
    });

    toast.loading("Preparing swap transaction...", { id: toastId });

    const swapTx = await cpAmm.swap({
      payer: wallet.publicKey,
      pool: GRADUATED_POOL_ADDRESS,
      inputTokenMint: inputMint,
      outputTokenMint: outputMint,
      amountIn: amountIn,
      minimumAmountOut: quote.minSwapOutAmount,
      tokenAVault: poolState.tokenAVault,
      tokenBVault: poolState.tokenBVault,
      tokenAMint: poolState.tokenAMint,
      tokenBMint: poolState.tokenBMint,
      tokenAProgram: TOKEN_PROGRAM_ID,
      tokenBProgram: TOKEN_PROGRAM_ID,
      referralTokenAccount: null,
    });

    const { blockhash, lastValidBlockHeight } =
      await connection.getLatestBlockhash("confirmed");
    swapTx.recentBlockhash = blockhash;
    swapTx.lastValidBlockHeight = lastValidBlockHeight;
    swapTx.feePayer = wallet.publicKey;

    toast.loading("Please approve the transaction in your wallet", {
      id: toastId,
    });

    const signedTx = await wallet.signTransaction(swapTx);
    toast.loading("Sending transaction...", { id: toastId });
    const signature = await connection.sendRawTransaction(
      signedTx.serialize(),
      {
        maxRetries: 5,
        skipPreflight: true,
        preflightCommitment: "confirmed",
      }
    );

    toast.loading("Confirming transaction...", { id: toastId });
    const confirmation = await connection.confirmTransaction(
      { signature, blockhash, lastValidBlockHeight },
      "confirmed"
    );

    if (confirmation.value.err) {
      throw new Error("Transaction confirmation failed");
    }

    toast.success("Swap completed successfully!", {
      id: toastId,
      description: `Transaction: ${signature.slice(0, 8)}...`,
      duration: 10000,
      action: {
        label: "View on Solscan",
        onClick: () =>
          window.open(
            `https://solscan.io/tx/${signature}?cluster=devnet`,
            "_blank"
          ),
      },
    });
  }

  const handleBuy = async () => {
    if (!buyAmount || parseFloat(buyAmount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    try {
      setIsLoading(true);
      const lamports = new BN(Math.floor(parseFloat(buyAmount) * 1e9));
      await performCpAmmSwap(lamports, false);
      setBuyAmount("");
    } catch (e: any) {
      toast.error(e?.message || "Swap failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSell = async () => {
    if (!sellAmount || parseFloat(sellAmount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    try {
      setIsLoading(true);
      const baseUnits = new BN(Math.floor(parseFloat(sellAmount) * 1e6));
      await performCpAmmSwap(baseUnits, true);
      setSellAmount("");
    } catch (e: any) {
      toast.error(e?.message || "Swap failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-0 rounded-none p-0 gap-0">
      <CardContent className="p-0 gap-0">
        <Tabs
          value={activeTab}
          onValueChange={(v) => onTabChange?.(v as "buy" | "sell")}
          className="w-full "
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="buy">Buy</TabsTrigger>
            <TabsTrigger value="sell">Sell</TabsTrigger>
          </TabsList>
          <TabsContent value="buy" className="">
            <div className="relative">
              <Input
                className="sm:max-w-md border-0 rounded-none focus-visible:outline-0 focus-visible:ring-0 py-8 sm:text-lg"
                id="buy-from"
                type="number"
                placeholder="0.0"
                value={buyAmount}
                onChange={(e) => setBuyAmount(e.target.value)}
              />
              <div className="flex items-center justify-between bg-muted rounded-none top-0 right-0 h-full px-8 absolute">
                <span className="text-sm font-medium">SOL</span>
              </div>
            </div>
            <span className="text-xs text-muted-foreground text-right w-full">
              Balance: {SOL_BALANCE}
            </span>

            <div className="relative">
              <Input
                id="buy-to"
                type="number"
                placeholder="0.0"
                className="sm:max-w-md border-0 rounded-none focus-visible:outline-0 focus-visible:ring-0 py-8 sm:text-lg"
                readOnly
                value={""}
              />
              <div className="flex items-center justify-between bg-muted rounded-none top-0 right-0 h-full px-8 absolute">
                <span className="text-sm font-medium">{TOKEN_SYMBOL}</span>
              </div>
            </div>

            <Button
              onClick={handleBuy}
              className="w-full border-0 rounded-none py-8"
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

          <TabsContent value="sell" className="">
            <div className="relative border-b">
              <Input
                className="sm:max-w-md border-0 rounded-none focus-visible:outline-0 focus-visible:ring-0 py-8 sm:text-lg"
                id="sell-from"
                type="number"
                placeholder="0.0"
                value={sellAmount}
                onChange={(e) => setSellAmount(e.target.value)}
              />
              <div className="flex items-center justify-between bg-muted rounded-none top-0 right-0 py-6 px-8 absolute">
                <span className="text-sm font-medium">{TOKEN_SYMBOL}</span>
              </div>
            </div>

            <div className="relative">
              <Input
                id="sell-to"
                type="number"
                placeholder="0.0"
                className="sm:max-w-md border-0 rounded-none focus-visible:outline-0 focus-visible:ring-0 py-8 sm:text-lg"
                readOnly
                value={""}
              />
              <div className="flex items-center justify-between bg-muted rounded-none top-0 right-0 h-full px-8 absolute border-t">
                <span className="text-sm font-medium">SOL</span>
              </div>
            </div>

            <Button
              onClick={handleSell}
              className="w-full border-0 rounded-none py-8 border-t"
              size="lg"
              variant="destructive"
              disabled={
                !wallet.connected ||
                isLoading ||
                !sellAmount ||
                parseFloat(sellAmount) <= 0
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

export default GraduatedSwapSection;
