"use client";

interface TokenInfoCardProps {
  tokenId: string;
}

export function TokenInfoCard({ tokenId }: TokenInfoCardProps) {
  const tokenInfo = {
    description:
      "Mini pekka is a powerful token on the Solana blockchain, designed for fast and efficient transactions.",
    website: "https://onlyfounder.fun",
    telegram: "https://t.me/minipekka",
    twitter: "https://twitter.com/minipekka",
    totalTransactions: "12,453",
    uniqueHolders: "8,234",
    volume24h: "$45,678",
    priceChange24h: "+12.5%",
  };

  return (
    <div className="w-full h-fit border-t uppercase">
      <div className="p-4 space-y-4">
        <div>
          <h4 className="text-sm font-bold text-muted-foreground mb-2">
            Description
          </h4>
          <p className="text-sm normal-case leading-relaxed">
            {tokenInfo.description}
          </p>
        </div>

        <div>
          <h4 className="text-sm font-bold text-muted-foreground mb-2">
            Links
          </h4>
          <div className="flex flex-wrap gap-2">
            {tokenInfo.website && (
              <a
                href={tokenInfo.website}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 bg-secondary hover:bg-secondary/80 border text-xs transition-colors"
              >
                Website
              </a>
            )}
            {tokenInfo.telegram && (
              <a
                href={tokenInfo.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 bg-secondary hover:bg-secondary/80 border text-xs transition-colors"
              >
                Telegram
              </a>
            )}
            {tokenInfo.twitter && (
              <a
                href={tokenInfo.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 bg-secondary hover:bg-secondary/80 border text-xs transition-colors"
              >
                Twitter
              </a>
            )}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-bold text-muted-foreground mb-2">
            Statistics
          </h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">24h Volume:</span>
              <span className="font-bold">{tokenInfo.volume24h}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">24h Change:</span>
              <span
                className={`font-bold ${
                  tokenInfo.priceChange24h.startsWith("+")
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {tokenInfo.priceChange24h}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total Transactions:</span>
              <span className="font-bold">{tokenInfo.totalTransactions}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Unique Holders:</span>
              <span className="font-bold">{tokenInfo.uniqueHolders}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
