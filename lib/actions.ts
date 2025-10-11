"use client";

import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";

export async function fetchSolBalance(
  connection: Connection,
  address: PublicKey
): Promise<number> {
  const lamports = await connection.getBalance(address);
  return lamports / LAMPORTS_PER_SOL;
}

export async function fetchUserTokens(
  _address: string
): Promise<TokenCardItem[]> {
  await new Promise((r) => setTimeout(r, 600));
  return [
    {
      id: "1",
      name: "Solana Cat",
      symbol: "SOLCAT",
      description: "The cutest cat on Solana blockchain. Meow! 🐱",
      image:
        "https://i.pinimg.com/736x/78/63/e7/7863e7b608fd2bdff73e52b8ff5ca8d1.jpg",
      marketCap: "$2.5M",
      volume: "$450K",
      progress: 85,
      createdAt: "2024-01-15T10:30:00Z",
      tokenMint: "9Qw1xTokenMintExampleCat111111111111111111111111",
      publicKey: "PoolKey1ExampleCat111111111111111111111111111",
      poolKey: "PoolKey1ExampleCat111111111111111111111111111",
      quoteMint: "So11111111111111111111111111111111111111112",
      tokenReserve: "1500000000000",
      quoteReserve: "2500000000000",
    },
    {
      id: "2",
      name: "Doge Killer",
      symbol: "DOGEK",
      description: "The ultimate meme token that will moon to Mars! 🚀",
      image:
        "https://i.pinimg.com/736x/85/75/5f/85755fa2666278cc3765c2308891b410.jpg",
      marketCap: "$1.8M",
      volume: "$320K",
      progress: 67,
      createdAt: "2024-01-20T14:45:00Z",
      tokenMint: "3Zp2yTokenMintExampleDoge22222222222222222222222",
      publicKey: "PoolKey2ExampleDoge222222222222222222222222222",
      poolKey: "PoolKey2ExampleDoge222222222222222222222222222",
      quoteMint: "So11111111111111111111111111111111111111112",
      tokenReserve: "2000000000000",
      quoteReserve: "1800000000000",
    },
    {
      id: "4",
      name: "Safe Moon",
      symbol: "SAFEM",
      description: "To the moon and beyond! Safe journey guaranteed! 🌙",
      image:
        "https://i.pinimg.com/736x/8b/ce/29/8bce29d76ea2f9d6f1366a38a626a618.jpg",
      marketCap: "$950K",
      volume: "$180K",
      progress: 45,
      createdAt: "2024-01-25T16:20:00Z",
      tokenMint: "4Lm9nTokenMintExampleSafe44444444444444444444444",
      publicKey: "PoolKey4ExampleSafe444444444444444444444444444",
      poolKey: "PoolKey4ExampleSafe444444444444444444444444444",
      quoteMint: "So11111111111111111111111111111111111111112",
      tokenReserve: "1200000000000",
      quoteReserve: "950000000000",
    },
    {
      id: "5",
      name: "Diamond Hands",
      symbol: "DIAMOND",
      description: "💎🙌 HODL strong! Diamond hands never fold!",
      image:
        "https://i.pinimg.com/1200x/47/58/e1/4758e16f6ee5601e1393f66fb7247755.jpg",
      marketCap: "$1.4M",
      volume: "$290K",
      progress: 78,
      createdAt: "2024-01-18T12:00:00Z",
      tokenMint: "8Qr5sTokenMintExampleDiamond555555555555555555555",
      publicKey: "PoolKey5ExampleDiamond555555555555555555555555",
      poolKey: "PoolKey5ExampleDiamond555555555555555555555555",
      quoteMint: "So11111111111111111111111111111111111111112",
      tokenReserve: "1800000000000",
      quoteReserve: "1400000000000",
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
  createdAt: string;
  publicKey: string | { toString(): string };
  poolKey: string | { toString(): string };
  quoteMint: string | { toString(): string };
  tokenReserve: string;
  quoteReserve: string;
  tokenMint?: string | { toString(): string };
};

export async function fetchAllTokens(): Promise<TokenCardItem[]> {
  await new Promise((r) => setTimeout(r, 500));
  return [
    {
      id: "1",
      name: "Solana Cat",
      symbol: "SOLCAT",
      description: "The cutest cat on Solana blockchain. Meow! 🐱",
      image:
        "https://i.pinimg.com/736x/78/63/e7/7863e7b608fd2bdff73e52b8ff5ca8d1.jpg",
      marketCap: "$2.5M",
      volume: "$450K",
      progress: 85,
      createdAt: "2024-01-15T10:30:00Z",
      tokenMint: "9Qw1xTokenMintExampleCat111111111111111111111111",
      publicKey: "PoolKey1ExampleCat111111111111111111111111111",
      poolKey: "PoolKey1ExampleCat111111111111111111111111111",
      quoteMint: "So11111111111111111111111111111111111111112",
      tokenReserve: "1500000000000",
      quoteReserve: "2500000000000",
    },
    {
      id: "2",
      name: "Doge Killer",
      symbol: "DOGEK",
      description: "The ultimate meme token that will moon to Mars! 🚀",
      image:
        "https://i.pinimg.com/736x/85/75/5f/85755fa2666278cc3765c2308891b410.jpg",
      marketCap: "$1.8M",
      volume: "$320K",
      progress: 67,
      createdAt: "2024-01-20T14:45:00Z",
      tokenMint: "3Zp2yTokenMintExampleDoge22222222222222222222222",
      publicKey: "PoolKey2ExampleDoge222222222222222222222222222",
      poolKey: "PoolKey2ExampleDoge222222222222222222222222222",
      quoteMint: "So11111111111111111111111111111111111111112",
      tokenReserve: "2000000000000",
      quoteReserve: "1800000000000",
    },
    {
      id: "3",
      name: "Pepe Coin",
      symbol: "PEPE",
      description: "Ribbit ribbit! The most legendary frog in crypto! 🐸",
      image:
        "https://i.pinimg.com/736x/86/a5/8b/86a58b9342e9fc3414e5ce8db6fa5d87.jpg",
      marketCap: "$3.2M",
      volume: "$680K",
      progress: 92,
      createdAt: "2024-01-10T09:15:00Z",
      tokenMint: "7Kp3zTokenMintExamplePepe33333333333333333333333",
      publicKey: "PoolKey3ExamplePepe333333333333333333333333333",
      poolKey: "PoolKey3ExamplePepe333333333333333333333333333",
      quoteMint: "So11111111111111111111111111111111111111112",
      tokenReserve: "3000000000000",
      quoteReserve: "3200000000000",
    },
    {
      id: "4",
      name: "Safe Moon",
      symbol: "SAFEM",
      description: "To the moon and beyond! Safe journey guaranteed! 🌙",
      image:
        "https://i.pinimg.com/736x/8b/ce/29/8bce29d76ea2f9d6f1366a38a626a618.jpg",
      marketCap: "$950K",
      volume: "$180K",
      progress: 45,
      createdAt: "2024-01-25T16:20:00Z",
      tokenMint: "4Lm9nTokenMintExampleSafe44444444444444444444444",
      publicKey: "PoolKey4ExampleSafe444444444444444444444444444",
      poolKey: "PoolKey4ExampleSafe444444444444444444444444444",
      quoteMint: "So11111111111111111111111111111111111111112",
      tokenReserve: "1200000000000",
      quoteReserve: "950000000000",
    },
    {
      id: "5",
      name: "Diamond Hands",
      symbol: "DIAMOND",
      description: "💎🙌 HODL strong! Diamond hands never fold!",
      image:
        "https://i.pinimg.com/1200x/47/58/e1/4758e16f6ee5601e1393f66fb7247755.jpg",
      marketCap: "$1.4M",
      volume: "$290K",
      progress: 78,
      createdAt: "2024-01-18T12:00:00Z",
      tokenMint: "8Qr5sTokenMintExampleDiamond555555555555555555555",
      publicKey: "PoolKey5ExampleDiamond555555555555555555555555",
      poolKey: "PoolKey5ExampleDiamond555555555555555555555555",
      quoteMint: "So11111111111111111111111111111111111111112",
      tokenReserve: "1800000000000",
      quoteReserve: "1400000000000",
    },
    {
      id: "6",
      name: "Rocket Fuel",
      symbol: "ROCKET",
      description: "Fuel for your rocket to the moon! 🚀⛽",
      image:
        "https://i.pinimg.com/1200x/89/a1/c3/89a1c3821cb35f271d18a97031f1dad1.jpg",
      marketCap: "$2.1M",
      volume: "$410K",
      progress: 88,
      createdAt: "2024-01-12T08:30:00Z",
      tokenMint: "2Np6tTokenMintExampleRocket66666666666666666666666",
      publicKey: "PoolKey6ExampleRocket666666666666666666666666666",
      poolKey: "PoolKey6ExampleRocket666666666666666666666666666",
      quoteMint: "So11111111111111111111111111111111111111112",
      tokenReserve: "2200000000000",
      quoteReserve: "2100000000000",
    },
    {
      id: "7",
      name: "Moon Doge",
      symbol: "MOONDOGE",
      description: "The original doge that's going to the moon! 🌙🐕",
      image:
        "https://i.pinimg.com/736x/66/19/b7/6619b7de537178946949a0930a76408e.jpg",
      marketCap: "$4.2M",
      volume: "$890K",
      progress: 95,
      createdAt: "2024-01-08T11:45:00Z",
      tokenMint: "5Xm7uTokenMintExampleMoonDoge77777777777777777777777",
      publicKey: "PoolKey7ExampleMoonDoge777777777777777777777777777",
      poolKey: "PoolKey7ExampleMoonDoge777777777777777777777777777",
      quoteMint: "So11111111111111111111111111111111111111112",
      tokenReserve: "4200000000000",
      quoteReserve: "4200000000000",
    },
    {
      id: "8",
      name: "Crypto King",
      symbol: "KING",
      description: "Bow down to the king of all crypto! 👑💰",
      image:
        "https://i.pinimg.com/736x/79/34/d0/7934d03ebd8be3380a8a654c91b42f24.jpg",
      marketCap: "$1.7M",
      volume: "$380K",
      progress: 72,
      createdAt: "2024-01-22T13:15:00Z",
      tokenMint: "6Yn8vTokenMintExampleKing88888888888888888888888",
      publicKey: "PoolKey8ExampleKing888888888888888888888888888",
      poolKey: "PoolKey8ExampleKing888888888888888888888888888",
      quoteMint: "So11111111111111111111111111111111111111112",
      tokenReserve: "1700000000000",
      quoteReserve: "1700000000000",
    },
    {
      id: "9",
      name: "Space Cat",
      symbol: "SPACECAT",
      description: "A cat that's been to space and back! 🚀🐱",
      image:
        "https://i.pinimg.com/1200x/05/21/ec/0521ec5ff74825698ad5273d37e45c18.jpg",
      marketCap: "$2.8M",
      volume: "$520K",
      progress: 89,
      createdAt: "2024-01-14T15:30:00Z",
      tokenMint: "7Zo9wTokenMintExampleSpaceCat99999999999999999999999",
      publicKey: "PoolKey9ExampleSpaceCat999999999999999999999999999",
      poolKey: "PoolKey9ExampleSpaceCat999999999999999999999999999",
      quoteMint: "So11111111111111111111111111111111111111112",
      tokenReserve: "2800000000000",
      quoteReserve: "2800000000000",
    },
    {
      id: "10",
      name: "Diamond Moon",
      symbol: "DIAMOON",
      description: "Diamonds in the sky, moon in our eyes! 💎🌙",
      image:
        "https://i.pinimg.com/1200x/81/41/fc/8141fcbdda3a1663e368e33e6a9ffca9.jpg",
      marketCap: "$3.5M",
      volume: "$720K",
      progress: 91,
      createdAt: "2024-01-16T07:45:00Z",
      tokenMint: "8Ap0xTokenMintExampleDiamoon000000000000000000000000",
      publicKey: "PoolKey0ExampleDiamoon000000000000000000000000000",
      poolKey: "PoolKey0ExampleDiamoon000000000000000000000000000",
      quoteMint: "So11111111111111111111111111111111111111112",
      tokenReserve: "3500000000000",
      quoteReserve: "3500000000000",
    },
  ];
}
