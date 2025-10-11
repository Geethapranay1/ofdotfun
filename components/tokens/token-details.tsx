"use client";

import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { MigrationCard } from "./migration-card";
import React from "react";

interface TokenDetailsProps {
  tokenId: string;
}

export function TokenDetails({ tokenId }: TokenDetailsProps) {
  const getTokenData = (id: string) => {
    const tokens = {
      "1": {
        id: "1",
        name: "Solana Cat",
        symbol: "SOLCAT",
        description: "The cutest cat on Solana blockchain. Meow! 🐱",
        image:
          "https://i.pinimg.com/736x/78/63/e7/7863e7b608fd2bdff73e52b8ff5ca8d1.jpg",
        marketCap: "$2.5M",
        volume: "$450K",
        progress: 85,
        price: "$0.0025",
        holders: "2,456",
        totalSupply: "1,000,000,000",
        mint: "9Qw1xTokenMintExampleCat111111111111111111111111",
        creator: "PoolKey1ExampleCat111111111111111111111111111",
        poolAddress: "PoolKey1ExampleCat111111111111111111111111111",
        configAddress: "CUdxMBkGwYVJHmxBHpJcv2PLoYEULcVKFQGbiS8fahew",
        createdAt: "2024-01-15T10:30:00Z",
        socialLinks: {
          twitter: "https://twitter.com/solanacat",
          telegram: "https://t.me/solanacat",
          website: "https://solanacat.io",
        },
      },
      "2": {
        id: "2",
        name: "Doge Killer",
        symbol: "DOGEK",
        description: "The ultimate meme token that will moon to Mars! 🚀",
        image:
          "https://i.pinimg.com/736x/85/75/5f/85755fa2666278cc3765c2308891b410.jpg",
        marketCap: "$1.8M",
        volume: "$320K",
        progress: 67,
        price: "$0.0018",
        holders: "1,789",
        totalSupply: "1,000,000,000",
        mint: "3Zp2yTokenMintExampleDoge22222222222222222222222",
        creator: "PoolKey2ExampleDoge222222222222222222222222222",
        poolAddress: "PoolKey2ExampleDoge222222222222222222222222222",
        configAddress: "CUdxMBkGwYVJHmxBHpJcv2PLoYEULcVKFQGbiS8fahew",
        createdAt: "2024-01-20T14:45:00Z",
        socialLinks: {
          twitter: "https://twitter.com/dogekiller",
          telegram: "https://t.me/dogekiller",
          website: "https://dogekiller.io",
        },
      },
      "3": {
        id: "3",
        name: "Pepe Coin",
        symbol: "PEPE",
        description: "Ribbit ribbit! The most legendary frog in crypto! 🐸",
        image:
          "https://i.pinimg.com/736x/86/a5/8b/86a58b9342e9fc3414e5ce8db6fa5d87.jpg",
        marketCap: "$3.2M",
        volume: "$680K",
        progress: 92,
        price: "$0.0032",
        holders: "3,234",
        totalSupply: "1,000,000,000",
        mint: "7Kp3zTokenMintExamplePepe33333333333333333333333",
        creator: "PoolKey3ExamplePepe333333333333333333333333333",
        poolAddress: "PoolKey3ExamplePepe333333333333333333333333333",
        configAddress: "CUdxMBkGwYVJHmxBHpJcv2PLoYEULcVKFQGbiS8fahew",
        createdAt: "2024-01-10T09:15:00Z",
        socialLinks: {
          twitter: "https://twitter.com/pepecoin",
          telegram: "https://t.me/pepecoin",
          website: "https://pepecoin.io",
        },
      },
      "4": {
        id: "4",
        name: "Safe Moon",
        symbol: "SAFEM",
        description: "To the moon and beyond! Safe journey guaranteed! 🌙",
        image:
          "https://i.pinimg.com/736x/8b/ce/29/8bce29d76ea2f9d6f1366a38a626a618.jpg",
        marketCap: "$950K",
        volume: "$180K",
        progress: 45,
        price: "$0.00095",
        holders: "1,123",
        totalSupply: "1,000,000,000",
        mint: "4Lm9nTokenMintExampleSafe44444444444444444444444",
        creator: "PoolKey4ExampleSafe444444444444444444444444444",
        poolAddress: "PoolKey4ExampleSafe444444444444444444444444444",
        configAddress: "CUdxMBkGwYVJHmxBHpJcv2PLoYEULcVKFQGbiS8fahew",
        createdAt: "2024-01-25T16:20:00Z",
        socialLinks: {
          twitter: "https://twitter.com/safemoon",
          telegram: "https://t.me/safemoon",
          website: "https://safemoon.io",
        },
      },
      "5": {
        id: "5",
        name: "Diamond Hands",
        symbol: "DIAMOND",
        description: "💎🙌 HODL strong! Diamond hands never fold!",
        image:
          "https://i.pinimg.com/1200x/47/58/e1/4758e16f6ee5601e1393f66fb7247755.jpg",
        marketCap: "$1.4M",
        volume: "$290K",
        progress: 78,
        price: "$0.0014",
        holders: "1,567",
        totalSupply: "1,000,000,000",
        mint: "8Qr5sTokenMintExampleDiamond555555555555555555555",
        creator: "PoolKey5ExampleDiamond555555555555555555555555",
        poolAddress: "PoolKey5ExampleDiamond555555555555555555555555",
        configAddress: "CUdxMBkGwYVJHmxBHpJcv2PLoYEULcVKFQGbiS8fahew",
        createdAt: "2024-01-18T12:00:00Z",
        socialLinks: {
          twitter: "https://twitter.com/diamondhands",
          telegram: "https://t.me/diamondhands",
          website: "https://diamondhands.io",
        },
      },
      "6": {
        id: "6",
        name: "Rocket Fuel",
        symbol: "ROCKET",
        description: "Fuel for your rocket to the moon! 🚀⛽",
        image:
          "https://i.pinimg.com/1200x/89/a1/c3/89a1c3821cb35f271d18a97031f1dad1.jpg",
        marketCap: "$2.1M",
        volume: "$410K",
        progress: 88,
        price: "$0.0021",
        holders: "2,345",
        totalSupply: "1,000,000,000",
        mint: "2Np6tTokenMintExampleRocket66666666666666666666666",
        creator: "PoolKey6ExampleRocket666666666666666666666666666",
        poolAddress: "PoolKey6ExampleRocket666666666666666666666666666",
        configAddress: "CUdxMBkGwYVJHmxBHpJcv2PLoYEULcVKFQGbiS8fahew",
        createdAt: "2024-01-12T08:30:00Z",
        socialLinks: {
          twitter: "https://twitter.com/rocketfuel",
          telegram: "https://t.me/rocketfuel",
          website: "https://rocketfuel.io",
        },
      },
      "7": {
        id: "7",
        name: "Moon Doge",
        symbol: "MOONDOGE",
        description: "The original doge that's going to the moon! 🌙🐕",
        image:
          "https://i.pinimg.com/736x/66/19/b7/6619b7de537178946949a0930a76408e.jpg",
        marketCap: "$4.2M",
        volume: "$890K",
        progress: 95,
        price: "$0.0042",
        holders: "4,567",
        totalSupply: "1,000,000,000",
        mint: "5Xm7uTokenMintExampleMoonDoge77777777777777777777777",
        creator: "PoolKey7ExampleMoonDoge777777777777777777777777777",
        poolAddress: "PoolKey7ExampleMoonDoge777777777777777777777777777",
        configAddress: "CUdxMBkGwYVJHmxBHpJcv2PLoYEULcVKFQGbiS8fahew",
        createdAt: "2024-01-08T11:45:00Z",
        socialLinks: {
          twitter: "https://twitter.com/moondoge",
          telegram: "https://t.me/moondoge",
          website: "https://moondoge.io",
        },
      },
      "8": {
        id: "8",
        name: "Crypto King",
        symbol: "KING",
        description: "Bow down to the king of all crypto! 👑💰",
        image:
          "https://i.pinimg.com/736x/79/34/d0/7934d03ebd8be3380a8a654c91b42f24.jpg",
        marketCap: "$1.7M",
        volume: "$380K",
        progress: 72,
        price: "$0.0017",
        holders: "2,123",
        totalSupply: "1,000,000,000",
        mint: "6Yn8vTokenMintExampleKing88888888888888888888888",
        creator: "PoolKey8ExampleKing888888888888888888888888888",
        poolAddress: "PoolKey8ExampleKing888888888888888888888888888",
        configAddress: "CUdxMBkGwYVJHmxBHpJcv2PLoYEULcVKFQGbiS8fahew",
        createdAt: "2024-01-22T13:15:00Z",
        socialLinks: {
          twitter: "https://twitter.com/cryptoking",
          telegram: "https://t.me/cryptoking",
          website: "https://cryptoking.io",
        },
      },
      "9": {
        id: "9",
        name: "Space Cat",
        symbol: "SPACECAT",
        description: "A cat that's been to space and back! 🚀🐱",
        image:
          "https://i.pinimg.com/1200x/05/21/ec/0521ec5ff74825698ad5273d37e45c18.jpg",
        marketCap: "$2.8M",
        volume: "$520K",
        progress: 89,
        price: "$0.0028",
        holders: "3,456",
        totalSupply: "1,000,000,000",
        mint: "7Zo9wTokenMintExampleSpaceCat99999999999999999999999",
        creator: "PoolKey9ExampleSpaceCat999999999999999999999999999",
        poolAddress: "PoolKey9ExampleSpaceCat999999999999999999999999999",
        configAddress: "CUdxMBkGwYVJHmxBHpJcv2PLoYEULcVKFQGbiS8fahew",
        createdAt: "2024-01-14T15:30:00Z",
        socialLinks: {
          twitter: "https://twitter.com/spacecat",
          telegram: "https://t.me/spacecat",
          website: "https://spacecat.io",
        },
      },
      "10": {
        id: "10",
        name: "Diamond Moon",
        symbol: "DIAMOON",
        description: "Diamonds in the sky, moon in our eyes! 💎🌙",
        image:
          "https://i.pinimg.com/1200x/81/41/fc/8141fcbdda3a1663e368e33e6a9ffca9.jpg",
        marketCap: "$3.5M",
        volume: "$720K",
        progress: 91,
        price: "$0.0035",
        holders: "3,789",
        totalSupply: "1,000,000,000",
        mint: "8Ap0xTokenMintExampleDiamoon000000000000000000000000",
        creator: "PoolKey0ExampleDiamoon000000000000000000000000000",
        poolAddress: "PoolKey0ExampleDiamoon000000000000000000000000000",
        configAddress: "CUdxMBkGwYVJHmxBHpJcv2PLoYEULcVKFQGbiS8fahew",
        createdAt: "2024-01-16T07:45:00Z",
        socialLinks: {
          twitter: "https://twitter.com/diamoon",
          telegram: "https://t.me/diamoon",
          website: "https://diamoon.io",
        },
      },
    };

    return tokens[id as keyof typeof tokens] || tokens["1"];
  };

  const token = getTokenData(tokenId);

  return (
    <div className="">
      <MigrationCard
        tokenId={token.id}
        tokenName={token.name}
        tokenSymbol={token.symbol}
        poolAddress={token.poolAddress}
        configAddress={token.configAddress}
      />
      <Card className="border-0 rounded-none">
        <CardHeader>
          <div className="flex items-start gap-6">
            <div className="relative w-24 h-24 flex-shrink-0">
              <Image
                src={token.image}
                alt={token.name}
                fill
                className="rounded-full object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">{token.name}</h1>
                <Badge variant="secondary" className="text-sm">
                  {token.symbol}
                </Badge>
              </div>
              <p className="text-muted-foreground">{token.description}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 p-0">
          <div className="space-y-2">
            <div className="flex justify-between text-sm px-6">
              <span className="text-muted-foreground">
                Bonding Curve Progress
              </span>
              <span className="font-medium">{token.progress}%</span>
            </div>
            <Progress value={token.progress} className="h-14" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Price</p>
              <p className="font-semibold text-lg">{token.price}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Market Cap</p>
              <p className="font-semibold text-lg">{token.marketCap}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Volume 24h</p>
              <p className="font-semibold text-lg">{token.volume}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Holders</p>
              <p className="font-semibold text-lg">{token.holders}</p>
            </div>
          </div>

          <Separator />

          <div className="space-y-3 px-6">
            <h3 className="font-semibold">Token Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Supply</span>
                <span className="font-medium">{token.totalSupply}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Mint Address</span>
                <span className="font-medium font-mono">{token.mint}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Creator</span>
                <span className="font-medium font-mono">{token.creator}</span>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-3 px-6">
            <h3 className="font-semibold">Social Links</h3>
            <div className="flex gap-3">
              {token.socialLinks.twitter && (
                <Link
                  href={token.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <span>Twitter</span>
                  <ExternalLink className="w-4 h-4" />
                </Link>
              )}
              {token.socialLinks.telegram && (
                <Link
                  href={token.socialLinks.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <span>Telegram</span>
                  <ExternalLink className="w-4 h-4" />
                </Link>
              )}
              {token.socialLinks.website && (
                <Link
                  href={token.socialLinks.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <span>Website</span>
                  <ExternalLink className="w-4 h-4" />
                </Link>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
