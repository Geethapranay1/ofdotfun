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
        { status: 500 }
      );
    }

    const pools = await dbcClient.state.getPoolsByConfig(CONFIG_KEY);
    return NextResponse.json({ pools }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create DynamicBondingCurveClient" },
      { status: 500 }
    );
  }
}
