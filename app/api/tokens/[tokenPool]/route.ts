import { DynamicBondingCurveClient } from "@meteora-ag/dynamic-bonding-curve-sdk";
import { Connection } from "@solana/web3.js";
import { NextRequest, NextResponse } from "next/server";


const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL as string;
if (!RPC_URL) {
  throw new Error("RPC_URL is not defined in environment variables");
}

const connection = new Connection(RPC_URL, "confirmed");
const dbcClient = new DynamicBondingCurveClient(connection, "confirmed");

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ tokenPool: string }> }
) {
  const { tokenPool } = await params;
    if (!tokenPool) {
    return NextResponse.json(
      { error: "Missing token pool address" },
      { status: 400 }
    );
  }

  try {
    const pool = await dbcClient.state.getPoolCurveProgress("bKNcn39qfznx3bQ29yJZTFjju4a5sXgVKvM1aN9SUHd");
    if (!pool) {
      return NextResponse.json(
        { error: "Pool not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ pool }, { status: 200 });
  } catch (error) {
    console.error("Error fetching pool data:", error);
    return NextResponse.json(
      { error: "Failed to fetch pool data" },
      { status: 500 }
    );
  }
}