"use client";

import { useState, useMemo } from "react";
import { TokenCard } from "./token-card";
import { TokenFilters } from "./token-filters";

const mockTokens = [
  {
    id: "1",
    name: "Doge Moon",
    symbol: "DOGEM",
    description: "The next generation of meme tokens taking us to the moon",
    image: "https://i.pinimg.com/736x/b9/37/86/b93786cb0f1d2f721b9523f5cbbd4bb8.jpg",
    marketCap: "$1.2M",
    marketCapValue: 1200000,
    volume: "$345K",
    volumeValue: 345000,
    progress: 75,
    graduated: false,
    createdAt: new Date("2024-10-05"),
  },
  {
    id: "2",
    name: "Pepe Rocket",
    symbol: "PEPR",
    description: "Pepe is back and ready for liftoff",
    image: "https://i.pinimg.com/736x/b9/37/86/b93786cb0f1d2f721b9523f5cbbd4bb8.jpg",
    marketCap: "$890K",
    marketCapValue: 890000,
    volume: "$123K",
    volumeValue: 123000,
    progress: 60,
    graduated: false,
    createdAt: new Date("2024-10-06"),
  },
  {
    id: "3",
    name: "Shiba Launch",
    symbol: "SHIBL",
    description: "Launching Shiba to new heights",
    image: "https://i.pinimg.com/736x/b9/37/86/b93786cb0f1d2f721b9523f5cbbd4bb8.jpg",
    marketCap: "$2.5M",
    marketCapValue: 2500000,
    volume: "$678K",
    volumeValue: 678000,
    progress: 100,
    graduated: true,
    createdAt: new Date("2024-10-01"),
  },
  {
    id: "4",
    name: "Moon Cat",
    symbol: "MCAT",
    description: "Cats ruling the crypto space",
    image: "https://i.pinimg.com/736x/b9/37/86/b93786cb0f1d2f721b9523f5cbbd4bb8.jpg",
    marketCap: "$567K",
    marketCapValue: 567000,
    volume: "$89K",
    volumeValue: 89000,
    progress: 45,
    graduated: false,
    createdAt: new Date("2024-10-04"),
  },
  {
    id: "5",
    name: "Rocket Inu",
    symbol: "RINU",
    description: "The fastest rocket in the crypto universe",
    image: "https://i.pinimg.com/736x/b9/37/86/b93786cb0f1d2f721b9523f5cbbd4bb8.jpg",
    marketCap: "$3.1M",
    marketCapValue: 3100000,
    volume: "$890K",
    volumeValue: 890000,
    progress: 100,
    graduated: true,
    createdAt: new Date("2024-10-07"),
  },
  {
    id: "6",
    name: "Diamond Hands",
    symbol: "DHAND",
    description: "For true holders with diamond hands",
    image: "https://i.pinimg.com/736x/b9/37/86/b93786cb0f1d2f721b9523f5cbbd4bb8.jpg",
    marketCap: "$1.8M",
    marketCapValue: 1800000,
    volume: "$234K",
    volumeValue: 234000,
    progress: 70,
    graduated: false,
    createdAt: new Date("2024-10-03"),
  },
];

export function TokenGrid() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  const filteredAndSortedTokens = useMemo(() => {
    // Filter tokens based on search query
    let filtered = mockTokens.filter((token) => {
      const query = searchQuery.toLowerCase();
      return (
        token.name.toLowerCase().includes(query) ||
        token.symbol.toLowerCase().includes(query) ||
        token.description.toLowerCase().includes(query)
      );
    });

    // Sort tokens
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return b.createdAt.getTime() - a.createdAt.getTime();
        case "oldest":
          return a.createdAt.getTime() - b.createdAt.getTime();
        case "marketcap-high":
          return b.marketCapValue - a.marketCapValue;
        case "marketcap-low":
          return a.marketCapValue - b.marketCapValue;
        case "volume-high":
          return b.volumeValue - a.volumeValue;
        case "volume-low":
          return a.volumeValue - b.volumeValue;
        case "progress-high":
          return b.progress - a.progress;
        case "progress-low":
          return a.progress - b.progress;
        default:
          return 0;
      }
    });

    return sorted;
  }, [searchQuery, sortBy]);

  return (
    <div className="flex flex-col gap-6">
      <TokenFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />
      
      {filteredAndSortedTokens.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">No tokens found matching your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedTokens.map((token) => (
            <TokenCard key={token.id} {...token} />
          ))}
        </div>
      )}
    </div>
  );
}
