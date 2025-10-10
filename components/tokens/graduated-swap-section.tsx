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

export function GraduatedSwapSection({ activeTab = "buy", onTabChange }: GraduatedSwapSectionProps) {
  const [buyAmount, setBuyAmount] = useState("");
  const [sellAmount, setSellAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const GRADUATED_POOL_ADDRESS = TOKEN_GRADUATION_ADDRESS;

  const TOKEN_SYMBOL = "TOKEN";
  const SOL_BALANCE = 10.5;
  const TOKEN_BALANCE = 0;
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

    toast.loading("Please approve the transaction in your wallet", { id: toastId });

    const signedTx = await wallet.signTransaction(swapTx);
    toast.loading("Sending transaction...", { id: toastId });
    const signature = await connection.sendRawTransaction(signedTx.serialize(), {
      maxRetries: 5,
      skipPreflight: true,
      preflightCommitment: "confirmed",
    });

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
        label: "View on Solana Explorer",
        onClick: () =>
          window.open(
            `https://explorer.solana.com/tx/${signature}?cluster=devnet`,
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
    <Card className="sticky top-8">
      <CardHeader>
        <CardTitle>Trade</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={(v) => onTabChange?.(v as "buy" | "sell")} className="w-full">
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
                  <span className="text-xs text-muted-foreground">Balance: {SOL_BALANCE}</span>
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
                <Input id="buy-to" type="number" placeholder="0.0" readOnly value={""} />
                <div className="flex items-center justify-between px-3 py-2 bg-muted rounded-md">
                  <span className="text-sm font-medium">{TOKEN_SYMBOL}</span>
                  <span className="text-xs text-muted-foreground">Balance: {TOKEN_BALANCE}</span>
                </div>
              </div>
            </div>

            <Button
              onClick={handleBuy}
              className="w-full"
              size="lg"
              disabled={!wallet.connected || isLoading || !buyAmount || parseFloat(buyAmount) <= 0}
            >
              {!wallet.connected ? "Connect Wallet" : isLoading ? "Processing..." : "Buy Token"}
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
                  <span className="text-xs text-muted-foreground">Balance: {TOKEN_BALANCE}</span>
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
                <Input id="sell-to" type="number" placeholder="0.0" readOnly value={""} />
                <div className="flex items-center justify-between px-3 py-2 bg-muted rounded-md">
                  <span className="text-sm font-medium">SOL</span>
                  <span className="text-xs text-muted-foreground">Balance: {SOL_BALANCE}</span>
                </div>
              </div>
            </div>

            <Button
              onClick={handleSell}
              className="w-full"
              size="lg"
              variant="destructive"
              disabled={!wallet.connected || isLoading || !sellAmount || parseFloat(sellAmount) <= 0}
            >
              {!wallet.connected ? "Connect Wallet" : isLoading ? "Processing..." : "Sell Token"}
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

export default GraduatedSwapSection;


