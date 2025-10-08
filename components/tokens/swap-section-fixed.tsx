"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowDownUp, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  DynamicBondingCurveClient,
  getCurrentPoint,
  prepareSwapAmountParam,
} from "@meteora-ag/dynamic-bonding-curve-sdk";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  Connection,
  PublicKey,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import BN from "bn.js";
import { toast } from "sonner";

interface SwapSectionProps {
  tokenId: string;
}

export function SwapSection({ tokenId }: SwapSectionProps) {
  const [buyAmount, setBuyAmount] = useState("");
  const [sellAmount, setSellAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [estimatedOutput, setEstimatedOutput] = useState("");
  const [estimatedInput, setEstimatedInput] = useState("");
  const [tokenMint, setTokenMint] = useState("");
  const [poolAddress, setPoolAddress] = useState("");
  const [poolExists, setPoolExists] = useState(false);

  // Use tokenId as the mint address if it's a valid public key, otherwise use empty
  const TOKEN_MINT = tokenMint ? new PublicKey(tokenMint) : null;
  const POOL_ADDRESS = poolAddress ? new PublicKey(poolAddress) : null;

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

  // Initialize token data when component mounts
  useEffect(() => {
    const initializeTokenData = async () => {
      try {
        // Try to use tokenId as mint address if it's a valid PublicKey
        if (tokenId && tokenId.length >= 32) {
          setTokenMint(tokenId);
          
          // Try to find the pool for this token
          const client = new DynamicBondingCurveClient(connection, "confirmed");
          const allPools = await client.state.getPools();
          const foundPool = allPools.find((p: any) => {
            const baseMint = p.account?.baseMint || p.baseMint;
            return baseMint?.toString?.() === tokenId;
          });

          if (foundPool) {
            const pubkey = (foundPool as any).publicKey;
            if (pubkey?.toString) {
              setPoolAddress(pubkey.toString());
              setPoolExists(true);
            }
          }
        }
      } catch (error) {
        console.warn("Failed to initialize token data:", error);
      }
    };

    initializeTokenData();
  }, [tokenId, connection]);

  const getSwapQuote = async (amountInSol: number, isBuy: boolean) => {
    if (!POOL_ADDRESS) {
      throw new Error("Pool address not available");
    }

    try {
      const client = new DynamicBondingCurveClient(connection, "confirmed");

      const virtualPoolState = await client.state.getPool(POOL_ADDRESS);
      if (!virtualPoolState) {
        throw new Error("Pool not found");
      }

      const poolConfigState = await client.state.getPoolConfig(
        virtualPoolState.config
      );

      if (!virtualPoolState.sqrtPrice || virtualPoolState.sqrtPrice.isZero()) {
        throw new Error("Invalid pool state: sqrtPrice is zero or undefined");
      }

      if (!poolConfigState.curve || poolConfigState.curve.length === 0) {
        throw new Error("Invalid config state: curve is empty");
      }

      const currentPoint = new BN(0);
      const amountIn = new BN(Math.floor(amountInSol * 1e9)); 

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

    if (!POOL_ADDRESS || !poolExists) {
      toast.error("Pool not found for this token");
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
      const swapParam = {
        amountIn: new BN(Math.floor(parseFloat(buyAmount) * 1e9)),
        minimumAmountOut: quote.minimumAmountOut,
        swapBaseForQuote: false,
        owner: wallet.publicKey,
        pool: POOL_ADDRESS, // This is now guaranteed to be non-null
        referralTokenAccount: null,
      };

      toast.loading("Creating swap transaction...", { id: toastId });
      const swapTransaction = await client.pool.swap(swapParam);

      // Set blockhash and fee payer for the transaction
      const { blockhash } = await connection.getLatestBlockhash("confirmed");
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

    if (!POOL_ADDRESS || !poolExists) {
      toast.error("Pool not found for this token");
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
        pool: POOL_ADDRESS, // This is now guaranteed to be non-null
        referralTokenAccount: null,
      };

      toast.loading("Creating swap transaction...", { id: toastId });
      const swapTransaction = await client.pool.swap(swapParam);

      // Set blockhash and fee payer for the transaction
      const { blockhash } = await connection.getLatestBlockhash("confirmed");
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
        {!poolExists && (
          <Alert className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Pool not found for this token. Please enter the token mint and pool addresses manually.
            </AlertDescription>
          </Alert>
        )}

        {!poolExists && (
          <div className="space-y-4 mb-6">
            <div className="space-y-2">
              <Label htmlFor="token-mint">Token Mint Address</Label>
              <Input
                id="token-mint"
                placeholder="Enter token mint address"
                value={tokenMint}
                onChange={(e) => setTokenMint(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pool-address">Pool Address</Label>
              <Input
                id="pool-address"
                placeholder="Enter pool address"
                value={poolAddress}
                onChange={(e) => setPoolAddress(e.target.value)}
              />
            </div>
            <Button
              onClick={() => {
                try {
                  if (!tokenMint || !poolAddress) {
                    toast.error("Please enter both addresses");
                    return;
                  }
                  
                  // Validate that addresses are valid PublicKeys
                  new PublicKey(tokenMint);
                  new PublicKey(poolAddress);
                  
                  setPoolExists(true);
                  toast.success("Pool addresses set successfully");
                } catch (error) {
                  toast.error("Invalid address format. Please enter valid Solana addresses.");
                }
              }}
              className="w-full"
            >
              Set Pool Addresses
            </Button>
          </div>
        )}

        <Tabs defaultValue="buy" className="w-full"
          style={{ display: poolExists ? 'block' : 'none' }}
        >
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
                parseFloat(buyAmount) <= 0 ||
                !poolExists
              }
            >
              {!wallet.connected
                ? "Connect Wallet"
                : !poolExists
                ? "Pool Not Available"
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
                TOKEN_BALANCE <= 0 ||
                !poolExists
              }
            >
              {!wallet.connected
                ? "Connect Wallet"
                : !poolExists
                ? "Pool Not Available"
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
