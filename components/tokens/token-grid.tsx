"use client";

import { TokenCard } from "./token-card";

const mockTokens = [
  {
    id: "1",
    name: "Doge Moon",
    symbol: "DOGEM",
    description: "The next generation of meme tokens taking us to the moon",
    image: "/globe.svg",
    marketCap: "$1.2M",
    volume: "$345K",
    progress: 75,
  },
  {
    id: "2",
    name: "Pepe Rocket",
    symbol: "PEPR",
    description: "Pepe is back and ready for liftoff",
    image: "/globe.svg",
    marketCap: "$890K",
    volume: "$123K",
    progress: 60,
  },
  {
    id: "3",
    name: "Shiba Launch",
    symbol: "SHIBL",
    description: "Launching Shiba to new heights",
    image: "/globe.svg",
    marketCap: "$2.5M",
    volume: "$678K",
    progress: 85,
  },
  {
    id: "4",
    name: "Moon Cat",
    symbol: "MCAT",
    description: "Cats ruling the crypto space",
    image: "/globe.svg",
    marketCap: "$567K",
    volume: "$89K",
    progress: 45,
  },
  {
    id: "5",
    name: "Rocket Inu",
    symbol: "RINU",
    description: "The fastest rocket in the crypto universe",
    image: "/globe.svg",
    marketCap: "$3.1M",
    volume: "$890K",
    progress: 92,
  },
  {
    id: "6",
    name: "Diamond Hands",
    symbol: "DHAND",
    description: "For true holders with diamond hands",
    image: "/globe.svg",
    marketCap: "$1.8M",
    volume: "$234K",
    progress: 70,
  },
];

export function TokenGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {mockTokens.map((token) => (
        <TokenCard key={token.id} {...token} />
      ))}
    </div>
  );
}
