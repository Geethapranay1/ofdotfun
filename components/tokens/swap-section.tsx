"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowDownUp } from "lucide-react";
import { DynamicBondingCurveClient } from "@meteora-ag/dynamic-bonding-curve-sdk";
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection } from "@solana/web3.js";
import BN from "bn.js";
import { toast } from "sonner";
import { TOKEN_POOL_ADDRESS } from "@/app/constant";

interface SwapSectionProps {
  tokenId: string;
}

export function SwapSection({ tokenId }: SwapSectionProps) {
  console.log("SwapSection");
  const [buyAmount, setBuyAmount] = useState("");
  const [sellAmount, setSellAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const POOL_ADDRESS = TOKEN_POOL_ADDRESS;

  const TOKEN_SYMBOL = "TOKEN";
  const SOL_BALANCE = 10.5;
  const PRICE_PER_TOKEN = 0.0012;
  const SLIPPAGE_BPS = 100; // 1%

  const wallet = useWallet();
  const connection = new Connection(
    process.env.NEXT_PUBLIC_RPC_URL!,
    "confirmed"
  );

  const getSwapQuote = async (amount: number, isBuy: boolean) => {
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

      const decimals = isBuy ? 9 : 6;
      const amountIn = new BN(Math.floor(amount * Math.pow(10, decimals)));

      const quote = await client.pool.swapQuote({
        virtualPool: virtualPoolState,
        config: poolConfigState,
        swapBaseForQuote: isBuy ? false : true,
        amountIn,
        slippageBps: SLIPPAGE_BPS,
        hasReferral: false,
        currentPoint,
      });

      return quote;
    } catch (error) {
      console.error("Failed to get swap quote:", error);
      throw error;
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
      const client = new DynamicBondingCurveClient(connection, "confirmed");

      toast.loading("Getting swap quote...", { id: toastId });
      const quote = await getSwapQuote(parseFloat(buyAmount), true);
      console.log("Swap quote:", quote);
      const swapParam = {
        amountIn: new BN(Math.floor(parseFloat(buyAmount) * 1e9)),
        minimumAmountOut: quote.minimumAmountOut,
        swapBaseForQuote: false,
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
      console.error("Swap failed:", error);
      toast.error(error?.message || "Failed to execute swap", { id: toastId });
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

    setIsLoading(true);
    const toastId = toast.loading("Preparing swap transaction...");

    try {
      const client = new DynamicBondingCurveClient(connection, "confirmed");
      toast.loading("Getting swap quote...", { id: toastId });
      const quote = await getSwapQuote(parseFloat(sellAmount), false);
      const swapParam = {
        amountIn: new BN(parseFloat(sellAmount) * 1e6),
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
    <Card className="sticky top-8 border-0 rounded-none p-0 gap-0">
      <CardContent className="p-0 gap-0">
        <Tabs defaultValue="buy" className="w-full">
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
              <div className="flex items-center justify-between bg-muted rounded-none top-0 right-0 py-6 px-8 absolute">
                <span className="text-sm font-medium">SOL</span>
              </div>
              <span className="text-xs text-muted-foreground text-right w-full">
                Balance: {SOL_BALANCE}
              </span>
            </div>

            <div className="space-y-2 relative">
              <div className="space-y-2">
                <Input
                  id="buy-to"
                  type="number"
                  placeholder="0.0"
                  className="sm:max-w-md border-0 rounded-none focus-visible:outline-0 focus-visible:ring-0 py-8 sm:text-lg"
                  readOnly
                  value={
                    buyAmount ? (parseFloat(buyAmount) * 833.33).toFixed(2) : ""
                  }
                />
                <div className="flex items-center justify-between bg-muted rounded-none top-0 right-0 py-6 px-8 absolute">
                  <span className="text-sm font-medium">{TOKEN_SYMBOL}</span>
                </div>
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
            <div className="relative">
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

            <div className="space-y-2 relative">
              <div className="space-y-2">
                <Input
                  id="sell-to"
                  type="number"
                  placeholder="0.0"
                  className="sm:max-w-md border-0 rounded-none focus-visible:outline-0 focus-visible:ring-0 py-8 sm:text-lg"
                  readOnly
                  value={
                    sellAmount
                      ? (parseFloat(sellAmount) / 833.33).toFixed(4)
                      : ""
                  }
                />
                <div className="flex items-center justify-between bg-muted rounded-none top-0 right-0 py-6 px-8 absolute">
                  <span className="text-sm font-medium">SOL</span>
                </div>
                <span className="text-xs text-muted-foreground text-right w-full">
                  Balance: {SOL_BALANCE}
                </span>
              </div>
            </div>

            <Button
              onClick={handleSell}
              className="w-full border-0 rounded-none py-8"
              size="lg"
              variant="destructive"
              disabled={!wallet.connected || isLoading || !sellAmount}
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
