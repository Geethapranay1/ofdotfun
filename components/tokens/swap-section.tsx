"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowDownUp } from "lucide-react";
import {
  DynamicBondingCurveClient,
  getCurrentPoint,
  prepareSwapAmountParam,
} from "@meteora-ag/dynamic-bonding-curve-sdk";
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection, PublicKey } from "@solana/web3.js";
import BN from 'bn.js'

interface SwapSectionProps {
  tokenId: string;
}

export function SwapSection({ tokenId }: SwapSectionProps) {
  const [buyAmount, setBuyAmount] = useState("");
  const [sellAmount, setSellAmount] = useState("");
  const POOL_ADDRESS = new PublicKey(
    "Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS"
  );
  const wallet = useWallet();
  const connection = new Connection(
    process.env.NEXT_PUBLIC_RPC_URL!,
    "confirmed"
  );

  const handleSwap = async () => {
    const amountIn = await prepareSwapAmountParam(
      1,
      wallet.publicKey!,
      connection
    );
    const client = new DynamicBondingCurveClient(connection, "confirmed");
    const virtualPoolState = await client.state.getPool(POOL_ADDRESS);
    const poolConfigState = await client.state.getPoolConfig(
      virtualPoolState.config
    );

    const currentPoint = await getCurrentPoint(
      connection,
      poolConfigState.activationType
    );

    const quote = await client.pool.swapQuote({
      virtualPool: virtualPoolState,
      config: poolConfigState,
      swapBaseForQuote: false,
      amountIn,
      slippageBps: 50,
      hasReferral: false,
      currentPoint,
    });

    const transaction = await client.pool.swap({
      owner: new PublicKey("boss1234567890abcdefghijklmnopqrstuvwxyz"),
      amountIn: new BN(1000000000),
      minimumAmountOut: new BN(0),
      swapBaseForQuote: false,
      pool: new PublicKey("abcdefghijklmnopqrstuvwxyz1234567890"),
      referralTokenAccount: null,
      payer: new PublicKey("boss1234567890abcdefghijklmnopqrstuvwxyz"),
    });
  };

  const handleBuy = () => {
    console.log("Buy:", buyAmount);
  };

  const handleSell = () => {
    console.log("Sell:", sellAmount);
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
                    Balance: 10.5
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
                  <span className="text-sm font-medium">DOGEM</span>
                  <span className="text-xs text-muted-foreground">
                    Balance: 0
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Price per token</span>
                <span className="font-medium">$0.0012</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Slippage</span>
                <span className="font-medium">1%</span>
              </div>
            </div>

            <Button onClick={handleBuy} className="w-full" size="lg">
              Buy Token
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
                  <span className="text-sm font-medium">DOGEM</span>
                  <span className="text-xs text-muted-foreground">
                    Balance: 0
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
                    Balance: 10.5
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Price per token</span>
                <span className="font-medium">$0.0012</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Slippage</span>
                <span className="font-medium">1%</span>
              </div>
            </div>

            <Button
              onClick={handleSell}
              className="w-full"
              size="lg"
              variant="destructive"
            >
              Sell Token
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
