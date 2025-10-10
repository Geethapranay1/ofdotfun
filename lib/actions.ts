"use client";

import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import axios from "axios";

export async function fetchSolBalance(
  connection: Connection,
  address: PublicKey
): Promise<number> {
  const lamports = await connection.getBalance(address);
  return lamports / LAMPORTS_PER_SOL;
}

export type TokenSummary = {
  name: string;
  symbol: string;
  mint: string;
  image: string;
  marketCap: string;
};

export async function fetchUserTokens(_address: string): Promise<TokenSummary[]> {
  await new Promise((r) => setTimeout(r, 600));
  return [
    {
      name: "MemeCat",
      symbol: "MCAT",
      mint: "9Qw1xTokenMintExampleCat111111111111111111111111",
      image:
        "https://i.pinimg.com/1200x/b7/8f/02/b78f023aa1bca7bdada28db1c30d1fe5.jpg",
      marketCap: "$120k",
    },
    {
      name: "PepeFun",
      symbol: "PEPEF",
      mint: "3Zp2yTokenMintExamplePepe22222222222222222222222",
      image:
        "https://i.pinimg.com/1200x/b7/8f/02/b78f023aa1bca7bdada28db1c30d1fe5.jpg",
      marketCap: "$75k",
    },
  ];
}

export type TokenCardItem = {
  id: string;
  name: string;
  symbol: string;
  description: string;
  image: string;
  marketCap: string;
  volume: string;
  progress: number;
  tokenMint?: string | { toString(): string };
};

export async function fetchAllTokens(): Promise<TokenCardItem[]> {
  const response = await axios.get("/api/tokens");
  return response.data.pools as TokenCardItem[];
}


