import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface TokenCardProps {
  token: any; // Pool data from Meteora SDK
}

export function TokenCard({ token }: TokenCardProps) {
  const poolKey =
    token.publicKey?.toString() || token.poolKey?.toString() || "unknown";
  const tokenMint = token.tokenMint?.toString() || "N/A";
  const quoteMint = token.quoteMint?.toString() || "N/A";

  const formatAddress = (address: string) => {
    if (address.length < 8) return address;
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };
  const progress = token.progress || 0;
  const tokenReserve = token.tokenReserve?.toString() || "0";
  const quoteReserve = token.quoteReserve?.toString() || "0";

  return (
    <Link href={`/tokens/${poolKey}`}>
      <Card className="hover:shadow-lg transition-shadow gap-0 cursor-pointer h-full rounded-none border-0 p-0">
        <CardHeader className="pb-4 px-0">
          <div className="flex items-start gap-4">
            <div className="relative w-26 h-26 flex-shrink-0">
              <Image
                src={token.image || "https://i.pinimg.com/1200x/b7/8f/02/b78f023aa1bca7bdada28db1c30d1fe5.jpg"}
                alt={token.name || "Token"}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0 py-4">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-lg truncate">
                  {token.name || formatAddress(tokenMint)}
                </h3>
                <Badge variant="secondary" className="text-xs">
                  {token.symbol || "TKN"}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {token.description || `Pool: ${formatAddress(poolKey)}`}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 px-0">
          <div className="grid grid-cols-2 gap-4 px-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Token Mint</p>
              <p className="font-semibold text-xs font-mono">
                {formatAddress(tokenMint)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Quote Mint</p>
              <p className="font-semibold text-xs font-mono">
                {formatAddress(quoteMint)}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 px-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">
                Token Reserve
              </p>
              <p className="font-semibold text-xs">
                {(Number(tokenReserve) / 1e9).toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">
                Quote Reserve
              </p>
              <p className="font-semibold text-xs">
                {(Number(quoteReserve) / 1e9).toFixed(2)}
              </p>
            </div>
          </div>
          <div className="space-y-2 relative">
            <div className="flex justify-between text-sm absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-8 w-full">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-10" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
