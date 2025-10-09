<<<<<<< HEAD
import { DynamicBondingCurveClient } from "@meteora-ag/dynamic-bonding-curve-sdk";
import { Connection } from "@solana/web3.js";
import { NextRequest, NextResponse } from "next/server";

const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL as string;
if (!RPC_URL) {
  throw new Error("RPC_URL is not defined in environment variables");
}

const connection = new Connection(RPC_URL, "confirmed");
const dbcClient = new DynamicBondingCurveClient(connection, "confirmed");

export async function GET(req: NextRequest) {
  try {
    const CONFIG_KEY = process.env.POOL_CONFIG_KEY as string;
    if (!CONFIG_KEY) {
      return NextResponse.json(
        { error: "POOL_CONFIG_KEY is not defined in environment variables" },
=======
import { NextResponse } from "next/server";
import { Connection, PublicKey } from "@solana/web3.js";
import { DynamicBondingCurveClient } from "@meteora-ag/dynamic-bonding-curve-sdk";

const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL as string;
const POOL_CONFIG_KEY = process.env.POOL_CONFIG_KEY as string;

// Function to calculate market data from pool data
function calculateMarketData(poolState: any, progress: number) {
  try {
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
    
    if (baseAmount && quoteAmount && baseAmount > 0) {
      const price = Number(quoteAmount) / Number(baseAmount);
      const totalSupply = 1000000000; // 1B total supply
      const marketCap = price * totalSupply;
      
      // Volume estimate based on actual reserves
      const volume = Number(quoteAmount) * 0.01;
      
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

export async function GET() {
  try {
    if (!RPC_URL || !POOL_CONFIG_KEY) {
      return NextResponse.json(
        { error: "Missing environment variables" },
>>>>>>> 418eb17 (fetch req)
        { status: 500 }
      );
    }

<<<<<<< HEAD
    const pools = await dbcClient.state.getPoolsByConfig(CONFIG_KEY);
    return NextResponse.json({ pools }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create DynamicBondingCurveClient" },
      { status: 500 }
    );
  }
}
=======
    const connection = new Connection(RPC_URL, "confirmed");
    const client = new DynamicBondingCurveClient(connection, "confirmed");

    console.log("Fetching pools from DBC using config key...");
    
    // Fetch pools by our specific config key
    const ourPlatformPools = await client.state.getPoolsByConfig(POOL_CONFIG_KEY);
    console.log(`Found ${ourPlatformPools.length} pools created by our platform`);
    
    if (ourPlatformPools.length === 0) {
      return NextResponse.json({
        success: true,
        tokens: [],
        count: 0
      });
    }
    
    // Transform pool data into token format with actual data
    const tokens = await Promise.all(
      ourPlatformPools.slice(0, 20).map(async (pool: any, index: number) => {
        const poolAccount = pool.account || pool;
        const baseMint = poolAccount.baseMint?.toString();
        const poolAddress = pool.publicKey?.toString();
        const mintHash = baseMint?.slice(-8) || 'unknown';
        
        // Get curve progress for this pool
        let progress = 0;
        try {
          if (poolAddress) {
            progress = await client.state.getPoolCurveProgress(poolAddress);
          }
        } catch (error) {
          console.warn(`Failed to get progress for pool ${poolAddress}:`, error);
        }
        
        // Calculate market data using pool account data
        const marketData = calculateMarketData(poolAccount, progress);
        
        return {
          id: baseMint,
          name: `Token ${mintHash}`,
          symbol: `TKN${mintHash.slice(0, 4)}`,
          description: "Dynamic bonding curve token",
          image: "/globe.svg",
          marketCap: marketData.marketCap,
          volume: marketData.volume,
          progress: marketData.progress,
          price: `$${marketData.price}`,
          tokenMint: baseMint,
          poolAddress: poolAddress,
          createdAt: new Date(Date.now() - index * 3600000).toISOString(),
        };
      })
    );

    return NextResponse.json({
      success: true,
      tokens: tokens,
      count: tokens.length
    });

  } catch (error) {
    console.error("Failed to fetch tokens:", error);
    return NextResponse.json(
      { 
        error: "Failed to fetch tokens",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
>>>>>>> 418eb17 (fetch req)
