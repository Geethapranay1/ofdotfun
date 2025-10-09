import { NextResponse } from "next/server";
import { Connection, PublicKey } from "@solana/web3.js";
import { DynamicBondingCurveClient } from "@meteora-ag/dynamic-bonding-curve-sdk";

const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL as string;
const POOL_CONFIG_KEY = process.env.POOL_CONFIG_KEY as string;

// Function to calculate market data from pool data
function calculateMarketData(poolState: any, progress: number) {
  try {
    console.log('Calculating market data with pool state:', poolState);
    console.log('Progress:', progress);
    
    // Try different possible field names for the amounts
    let baseAmount = poolState.baseAmount || poolState.baseReserve || poolState.base_amount || 0;
    let quoteAmount = poolState.quoteAmount || poolState.quoteReserve || poolState.quote_amount || 0;
    
    // Convert BigInt to Number if needed
    if (typeof baseAmount === 'bigint') {
      baseAmount = Number(baseAmount);
    }
    if (typeof quoteAmount === 'bigint') {
      quoteAmount = Number(quoteAmount);
    }
    
    console.log('Base amount:', baseAmount);
    console.log('Quote amount:', quoteAmount);
    
    if (baseAmount && quoteAmount && baseAmount > 0) {
      const price = Number(quoteAmount) / Number(baseAmount);
      const totalSupply = 1000000000; // 1B total supply
      const marketCap = price * totalSupply;
      
      // Better volume estimate based on actual reserves
      const volume = Number(quoteAmount) * 0.01; // Reduced multiplier for more realistic volume
      
      console.log('Calculated price:', price);
      console.log('Calculated market cap:', marketCap);
      console.log('Calculated volume:', volume);
      
      return {
        marketCap: marketCap > 1000000 ? `$${(marketCap / 1000000).toFixed(1)}M` : `$${(marketCap / 1000).toFixed(0)}K`,
        volume: volume > 1000 ? `$${(volume / 1000).toFixed(0)}K` : `$${volume.toFixed(0)}`,
        progress: Math.round(progress * 100), // Convert to percentage
        price: price.toFixed(8) // More precision for small prices
      };
    }
  } catch (error) {
    console.warn("Failed to calculate market data:", error);
  }
  
  // Fallback values
  return {
    marketCap: "$0K",
    volume: "$0",
    progress: Math.round(progress * 100), // Still use the progress if available
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

    // Get pool by base mint address
    const tokenPool = await client.state.getPoolByBaseMint(mintAddress);

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
    console.log('Pool account data:', JSON.stringify(poolAccount, null, 2));

    // Get curve progress
    let progress = 0;
    try {
      progress = await client.state.getPoolCurveProgress(poolAddress);
      console.log(`Pool progress: ${progress}`);
    } catch (error) {
      console.warn(`Failed to get progress for pool ${poolAddress}:`, error);
    }

    // Calculate market data using pool account data
    const marketData = calculateMarketData(poolAccount, progress);

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
      totalSupply: "1,000,000,000", // Standard total supply
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
