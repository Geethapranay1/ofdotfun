import { NextResponse } from "next/server";
import { Connection, PublicKey } from "@solana/web3.js";
import { DynamicBondingCurveClient } from "@meteora-ag/dynamic-bonding-curve-sdk";

const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL as string;
const POOL_CONFIG_KEY = process.env.POOL_CONFIG_KEY as string;

// Function to calculate market cap from pool data
function calculateMarketData(poolState: any) {
  try {
    const baseReserve = poolState.baseAmount || poolState.tokenAmount || 0;
    const quoteReserve = poolState.quoteAmount || poolState.solAmount || 0;
    
    if (baseReserve && quoteReserve) {
      const price = Number(quoteReserve) / Number(baseReserve);
      const marketCap = price * 1000000000; // Assuming 1B total supply
      const volume = Number(quoteReserve) * 0.1; // Rough estimate
      
      return {
        marketCap: marketCap > 1000000 ? `$${(marketCap / 1000000).toFixed(1)}M` : `$${(marketCap / 1000).toFixed(0)}K`,
        volume: volume > 1000 ? `$${(volume / 1000).toFixed(0)}K` : `$${volume.toFixed(0)}`,
        progress: Math.min(95, Math.max(5, (marketCap / 10000000) * 100)), // Progress towards 10M cap
        price: price.toFixed(6)
      };
    }
  } catch (error) {
    console.warn("Failed to calculate market data:", error);
  }
  
  // Fallback values
  return {
    marketCap: "$0.5M",
    volume: "$50K",
    progress: 50,
    price: "0.000001"
  };
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: mintAddress } = await params;

    if (!RPC_URL || !POOL_CONFIG_KEY) {
      return NextResponse.json(
        { error: "Missing environment variables" },
        { status: 500 }
      );
    }

    // Validate mint address format
    try {
      new PublicKey(mintAddress);
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid mint address format" },
        { status: 400 }
      );
    }

    const connection = new Connection(RPC_URL, "confirmed");
    const client = new DynamicBondingCurveClient(connection, "confirmed");

    console.log(`Fetching token details for mint: ${mintAddress}`);

    // Get all pools and find the one with this mint address
    const allPools = await client.state.getPools();
    const tokenPool = allPools.find((pool: any) => {
      const poolAccount = pool.account || pool;
      const baseMint = poolAccount.baseMint?.toString();
      const poolConfig = poolAccount.config?.toString();
      
      return baseMint === mintAddress && poolConfig === POOL_CONFIG_KEY;
    });

    if (!tokenPool) {
      return NextResponse.json(
        { error: "Token not found or not created on this platform" },
        { status: 404 }
      );
    }

    const poolAccount = tokenPool.account || tokenPool;
    const poolAddress = tokenPool.publicKey?.toString();

    if (!poolAddress) {
      return NextResponse.json(
        { error: "Pool address not found" },
        { status: 404 }
      );
    }

    console.log(`Found pool for token: ${poolAddress}`);

    // Get detailed pool state
    let poolState = null;
    try {
      poolState = await client.state.getPool(new PublicKey(poolAddress));
    } catch (error) {
      console.warn(`Failed to get pool state for ${poolAddress}:`, error);
      return NextResponse.json(
        { error: "Failed to fetch pool state" },
        { status: 500 }
      );
    }

    if (!poolState) {
      return NextResponse.json(
        { error: "Pool state not found" },
        { status: 404 }
      );
    }

    // Calculate market data
    const marketData = calculateMarketData(poolState);

    // Generate token metadata (since we don't have metadata accounts yet)
    const mintHash = mintAddress.slice(-8);
    const tokenData = {
      id: mintAddress,
      name: `Token ${mintHash}`,
      symbol: `TKN${mintHash.slice(0, 4)}`,
      description: "Dynamic bonding curve token created on our platform",
      image: "/globe.svg",
      marketCap: marketData.marketCap,
      volume: marketData.volume,
      progress: marketData.progress,
      price: `$${marketData.price}`,
      holders: "N/A", // Would need to calculate from token accounts
      totalSupply: "1,000,000,000", // Standard DBC supply
      contractAddress: mintAddress,
      creator: "Platform Creator", // Would need to get from pool creation transaction
      tokenMint: mintAddress,
      poolAddress: poolAddress,
      configAddress: POOL_CONFIG_KEY,
      socialLinks: {
        twitter: "",
        telegram: "",
        website: "",
      },
      createdAt: new Date().toISOString(), // Would need actual creation time
    };

    return NextResponse.json({
      success: true,
      token: tokenData,
    });

  } catch (error) {
    console.error("Failed to fetch token details:", error);
    return NextResponse.json(
      { 
        error: "Failed to fetch token details",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
