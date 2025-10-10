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

    console.log("Fetching pools from DBC...");
    
    // Fetch all pools from the Dynamic Bonding Curve
    const allPools = await client.state.getPools();
    console.log(`Found ${allPools.length} total pools`);
    
    // Filter pools to only include those created with our platform's config
    const ourPlatformPools = allPools
      .filter((pool: any) => {
        const poolAccount = pool.account || pool;
        const poolConfig = poolAccount.config?.toString();
        return poolConfig === POOL_CONFIG_KEY;
      })
    //   .reverse() // Newest first
      .slice(0, 20); // Limit for performance
    
    console.log(`Found ${ourPlatformPools.length} pools created by our platform`);
    
    if (ourPlatformPools.length === 0) {
      return NextResponse.json({
        success: true,
        tokens: [],
        count: 0
      });
    }
    
    // Transform pool data into simple token format
    const tokens = ourPlatformPools.map((pool: any, index: number) => {
      const poolAccount = pool.account || pool;
      const baseMint = poolAccount.baseMint?.toString();
      const poolAddress = pool.publicKey?.toString();
      const mintHash = baseMint?.slice(-8) || 'unknown';
      
      return {
        id: baseMint,
        name: `Token ${mintHash}`,
        symbol: `TKN${mintHash.slice(0, 4)}`,
        description: "DBC Token",
        image: "/globe.svg",
        marketCap: "$1.2M",
        volume: "$156K",
        progress: 75,
        tokenMint: baseMint,
        poolAddress: poolAddress,
        createdAt: new Date(Date.now() - index * 3600000).toISOString(),
      };
    });

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
