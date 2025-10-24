"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowDownUp } from "lucide-react";
import {
  DynamicBondingCurveClient,
  getCurrentPoint,
} from "@meteora-ag/dynamic-bonding-curve-sdk";
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection } from "@solana/web3.js";
import BN from "bn.js";
import { toast } from "sonner";
import { TOKEN_POOL_ADDRESS } from "@/app/constant";

interface SwapSectionProps {
  tokenId: string;
}

export function SwapSection({ tokenId }: SwapSectionProps) {
  const [buyAmount, setBuyAmount] = useState("");
  const [sellAmount, setSellAmount] = useState("");
  const [buyOutputAmount, setBuyOutputAmount] = useState("");
  const [sellOutputAmount, setSellOutputAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingQuote, setIsFetchingQuote] = useState(false);
  const [SOLPrice, setSOLPrice] = useState<number | null>(null);
  const [tokenPriceUSD, setTokenPriceUSD] = useState<string | null>(null);
  const [isFetchingPrice, setIsFetchingPrice] = useState(false);

  const buyDebounceTimer = useRef<NodeJS.Timeout | null>(null);
  const sellDebounceTimer = useRef<NodeJS.Timeout | null>(null);
  const priceRefetchTimer = useRef<NodeJS.Timeout | null>(null);

  const POOL_ADDRESS = TOKEN_POOL_ADDRESS;

  const fetchPrices = useCallback(async () => {
    setIsFetchingPrice(true);
    try {
      const response = await fetch("https://gated.chat/price/sol");
      const solPriceData = await response.json();
      setSOLPrice(solPriceData);

      try {
        const { outputAmount } = await getSwapQuote(1, true);
        const pricePerToken = solPriceData * outputAmount;
        setTokenPriceUSD(pricePerToken.toFixed(6));
      } catch (error) {
        console.error("Failed to fetch token quote:", error);
        setTokenPriceUSD(null);
      }
    } catch (error) {
      console.error("Failed to fetch SOL price:", error);
      setSOLPrice(null);
      setTokenPriceUSD(null);
    } finally {
      setIsFetchingPrice(false);
    }
  }, [POOL_ADDRESS]);

  useEffect(() => {
    fetchPrices();

    priceRefetchTimer.current = setInterval(() => {
      fetchPrices();
    }, 30000);

    return () => {
      if (priceRefetchTimer.current) {
        clearInterval(priceRefetchTimer.current);
      }
    };
  }, [fetchPrices]);

  const TOKEN_SYMBOL = "TOKEN";
  const SOL_BALANCE = 10.5;
  const SLIPPAGE_BPS = 100;

  const wallet = useWallet();
  const connection = new Connection(
    process.env.NEXT_PUBLIC_RPC_URL!,
    "confirmed"
  );

  const getSwapQuote = async (amount: number, isBuy: boolean) => {
    const client = new DynamicBondingCurveClient(connection, "confirmed");
    const virtualPoolState = await client.state.getPool(POOL_ADDRESS);
    const poolConfigState = await client.state.getPoolConfig(virtualPoolState.config);
    
    const currentPoint = await getCurrentPoint(connection, poolConfigState.activationType);
    
    const decimals = isBuy ? 9 : 6; // SOL:9, Token:6
    const amountIn = new BN(Math.floor(amount * Math.pow(10, decimals)));
  
    const quote = await client.pool.swapQuote({
      virtualPool: virtualPoolState,
      config: poolConfigState,
      swapBaseForQuote: !isBuy,
      amountIn,
      slippageBps: SLIPPAGE_BPS,
      hasReferral: false,
      currentPoint,
    });
  
    return { quote, outputAmount: parseFloat(quote.outputAmount.toString()) / Math.pow(10, isBuy ? 6 : 9) };
  };

  const fetchBuyQuote = useCallback(
    async (amount: string) => {
      if (!amount || parseFloat(amount) <= 0) {
        setBuyOutputAmount("");
        return;
      }
      setIsFetchingQuote(true);
      try {
        const { outputAmount } = await getSwapQuote(parseFloat(amount), true);
        setBuyOutputAmount(outputAmount.toFixed(9));
      } catch (error) {
        console.error("Failed to fetch buy quote:", error);
        setBuyOutputAmount("");
      } finally {
        setIsFetchingQuote(false);
      }
    },
    [POOL_ADDRESS, SLIPPAGE_BPS]
  );

  const fetchSellQuote = useCallback(
    async (amount: string) => {
      if (!amount || parseFloat(amount) <= 0) {
        setSellOutputAmount("");
        return;
      }

      setIsFetchingQuote(true);
      try {
        const { outputAmount } = await getSwapQuote(parseFloat(amount), false);
        setSellOutputAmount(outputAmount.toFixed(9));
      } catch (error) {
        console.error("Failed to fetch sell quote:", error);
        setSellOutputAmount("");
      } finally {
        setIsFetchingQuote(false);
      }
    },
    [POOL_ADDRESS, SLIPPAGE_BPS]
  );

  const handleBuyAmountChange = (value: string) => {
    setBuyAmount(value);

    if (buyDebounceTimer.current) {
      clearTimeout(buyDebounceTimer.current);
    }

    if (value && parseFloat(value) > 0) {
      buyDebounceTimer.current = setTimeout(() => {
        fetchBuyQuote(value);
      }, 500);
    } else {
      setBuyOutputAmount("");
    }
  };

  const handleSellAmountChange = (value: string) => {
    setSellAmount(value);

    if (sellDebounceTimer.current) {
      clearTimeout(sellDebounceTimer.current);
    }

    if (value && parseFloat(value) > 0) {
      sellDebounceTimer.current = setTimeout(() => {
        fetchSellQuote(value);
      }, 500);
    } else {
      setSellOutputAmount("");
    }
  };

  useEffect(() => {
    return () => {
      if (buyDebounceTimer.current) {
        clearTimeout(buyDebounceTimer.current);
      }
      if (sellDebounceTimer.current) {
        clearTimeout(sellDebounceTimer.current);
      }
    };
  }, []);

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
      const { quote } = await getSwapQuote(parseFloat(buyAmount), true);
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
            href={`https://solscan.io/tx/${signature}?cluster=devnet`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs underline"
          >
            View on Solscan
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
      const { quote } = await getSwapQuote(parseFloat(sellAmount), false);
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
            href={`https://solscan.io/tx/${signature}?cluster=devnet`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs underline"
          >
            View on Solscan
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
    <Card className="sticky top-20 border-0 rounded-none p-0 gap-0">
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
                onChange={(e) => handleBuyAmountChange(e.target.value)}
              />
              <div className="flex items-center justify-between bg-muted rounded-none top-0 right-0 py-6 px-8 absolute">
                <span className="text-sm font-medium">SOL</span>
              </div>
              <div className="flex justify-between items-center px-2 mt-1">
                <span className="text-xs text-muted-foreground">
                  Balance: {SOL_BALANCE}
                </span>
                <span className="text-xs text-muted-foreground">
                  {isFetchingPrice
                    ? "Loading..."
                    : tokenPriceUSD
                    ? `$${tokenPriceUSD}`
                    : "Price: N/A"}
                </span>
              </div>
            </div>

            <div className="space-y-2 relative">
              <div className="space-y-2">
                <Input
                  id="buy-to"
                  type="text"
                  placeholder="0.0"
                  className="sm:max-w-md border-0 rounded-none focus-visible:outline-0 focus-visible:ring-0 py-8 sm:text-lg"
                  readOnly
                  value={isFetchingQuote ? "Loading..." : buyOutputAmount}
                />
                <div className="flex items-center justify-between bg-muted rounded-none top-0 right-0 py-6 px-8 absolute">
                  <span className="text-sm font-medium">{TOKEN_SYMBOL}</span>
                </div>
                {buyOutputAmount && tokenPriceUSD && (
                  <span className="text-xs text-muted-foreground px-2">
                    ≈ $
                    {(
                      parseFloat(buyOutputAmount) * parseFloat(tokenPriceUSD)
                    ).toFixed(2)}{" "}
                    USD
                  </span>
                )}
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
                onChange={(e) => handleSellAmountChange(e.target.value)}
              />
              <div className="flex items-center justify-between bg-muted rounded-none top-0 right-0 py-6 px-8 absolute">
                <span className="text-sm font-medium">{TOKEN_SYMBOL}</span>
              </div>
              <div className="flex justify-end items-center px-2 mt-1">
                <span className="text-xs text-muted-foreground">
                  {isFetchingPrice
                    ? "Loading..."
                    : tokenPriceUSD
                    ? `$${tokenPriceUSD}`
                    : "Price: N/A"}
                </span>
              </div>
            </div>

            <div className="space-y-2 relative">
              <div className="space-y-2">
                <Input
                  id="sell-to"
                  type="text"
                  placeholder="0.0"
                  className="sm:max-w-md border-0 rounded-none focus-visible:outline-0 focus-visible:ring-0 py-8 sm:text-lg"
                  readOnly
                  value={isFetchingQuote ? "Loading..." : sellOutputAmount}
                />
                <div className="flex items-center justify-between bg-muted rounded-none top-0 right-0 py-6 px-8 absolute">
                  <span className="text-sm font-medium">SOL</span>
                </div>
                <div className="flex justify-between items-center px-2 mt-1">
                  <span className="text-xs text-muted-foreground">
                    Balance: {SOL_BALANCE}
                  </span>
                  {sellOutputAmount && SOLPrice && (
                    <span className="text-xs text-muted-foreground">
                      ≈ ${(parseFloat(sellOutputAmount) * SOLPrice).toFixed(2)}{" "}
                      USD
                    </span>
                  )}
                </div>
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
