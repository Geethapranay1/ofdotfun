"use client";

import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { MigrationCard } from "./migration-card";
import axios from "axios";
import React from "react";

interface TokenDetailsProps {
  tokenId: string;
}

export function TokenDetails({ tokenId }: TokenDetailsProps) {
  const token = {
    id: tokenId,
    name: "Doge Moon",
    symbol: "DOGEM",
    description:
      "The next generation of meme tokens taking us to the moon. Join our community and be part of the revolution. Diamond hands only!",
    image: "/globe.svg",
    marketCap: "$1.2M",
    volume: "$345K",
    progress: 100,
    price: "$0.0012",
    holders: "1,234",
    totalSupply: "1,000,000,000",
    contractAddress: "0x1234...5678",
    creator: "0xABCD...EFGH",
    poolAddress: "4sShgjDkQT5zsakYHrFXCHoCs2fK3ERYwYnAaHcS8rDX", // token pool address
    configAddress: "CUdxMBkGwYVJHmxBHpJcv2PLoYEULcVKFQGbiS8fahew", // token config address
    socialLinks: {
      twitter: "https://twitter.com/dogemoon",
      telegram: "https://t.me/dogemoon",
      website: "https://dogemoon.io",
    },
  };

  const fetchTokenData = async () => {
    const res = await axios.get(`/api/tokens/${tokenId}`);
    console.log("TokenDetailPage params:", res.data);
  };

  React.useEffect(() => {
    fetchTokenData();
  }, [tokenId]);

  return (
    <div className="space-y-6">
      {token.progress === 100 && (
        <MigrationCard
          tokenId={token.id}
          tokenName={token.name}
          tokenSymbol={token.symbol}
          poolAddress={token.poolAddress}
          configAddress={token.configAddress}
        />
      )}{" "}
      <Card>
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
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                Bonding Curve Progress
              </span>
              <span className="font-medium">{token.progress}%</span>
            </div>
            <Progress value={token.progress} className="h-3" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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

          <div className="space-y-3">
            <h3 className="font-semibold">Token Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Supply</span>
                <span className="font-medium">{token.totalSupply}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Contract Address</span>
                <span className="font-medium font-mono">
                  {token.contractAddress}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Creator</span>
                <span className="font-medium font-mono">{token.creator}</span>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
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