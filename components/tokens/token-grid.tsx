"use client";

import React from "react";
import { TokenCard } from "./token-card";
import { useQuery } from "@tanstack/react-query";
import { fetchAllTokens } from "@/lib/actions";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function TokenGrid() {
  const { data: tokens, isLoading } = useQuery({
    queryKey: ["all-tokens"],
    queryFn: fetchAllTokens,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });

  const [search, setSearch] = React.useState("");
  const [sortBy, setSortBy] = React.useState<string>("name-asc");

  const filteredAndSorted = React.useMemo(() => {
    const list = (tokens ?? []).filter((t) => {
      const q = search.trim().toLowerCase();
      if (!q) return true;
      const name = (t.name ?? "").toLowerCase();
      const symbol = (t.symbol ?? "").toLowerCase();
      const desc = (t.description ?? "").toLowerCase();
      const mint = (t.tokenMint?.toString?.() ?? "").toLowerCase();
      return (
        name.includes(q) ||
        symbol.includes(q) ||
        desc.includes(q) ||
        mint.includes(q)
      );
    });

    const byNumber = (value: unknown): number => {
      if (typeof value === "number") return value;
      if (typeof value === "string") {
        const cleaned = value.replace(/[$,]/g, "").trim();
        const n = Number(cleaned);
        return Number.isFinite(n) ? n : 0;
      }
      const n = Number(value);
      return Number.isFinite(n) ? n : 0;
    };

    const sorted = [...list];
    switch (sortBy) {
      case "name-asc":
        sorted.sort((a, b) => (a.name ?? "").localeCompare(b.name ?? ""));
        break;
      case "name-desc":
        sorted.sort((a, b) => (b.name ?? "").localeCompare(a.name ?? ""));
        break;
      case "progress-desc":
        sorted.sort((a, b) => byNumber(b.progress) - byNumber(a.progress));
        break;
      case "progress-asc":
        sorted.sort((a, b) => byNumber(a.progress) - byNumber(b.progress));
        break;
      case "marketcap-desc":
        sorted.sort((a: any, b: any) => byNumber(b.marketCap) - byNumber(a.marketCap));
        break;
      case "marketcap-asc":
        sorted.sort((a: any, b: any) => byNumber(a.marketCap) - byNumber(b.marketCap));
        break;
      default:
        break;
    }
    return sorted;
  }, [tokens, search, sortBy]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <Input
          placeholder="Search by name, symbol, description, or mint..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sm:max-w-md"
        />
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Sort by</span>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="min-w-[180px]">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name-asc">Name (A → Z)</SelectItem>
              <SelectItem value="name-desc">Name (Z → A)</SelectItem>
              <SelectItem value="progress-desc">Progress (High → Low)</SelectItem>
              <SelectItem value="progress-asc">Progress (Low → High)</SelectItem>
              <SelectItem value="marketcap-desc">Market Cap (High → Low)</SelectItem>
              <SelectItem value="marketcap-asc">Market Cap (Low → High)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading && (
          <>
            {[...Array(6)].map((_, i) => (
              <div key={i} className="border rounded-xl p-4 bg-card animate-pulse h-40" />
            ))}
          </>
        )}
        {!isLoading && filteredAndSorted.map((token) => (
          <TokenCard key={token.id} token={token} />
        ))}
        {!isLoading && filteredAndSorted.length === 0 && (
          <div className="col-span-full text-center text-muted-foreground py-10">No tokens found.</div>
        )}
      </div>
    </div>
  );
}
