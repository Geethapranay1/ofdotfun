"use client";

import { useMemo } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useQuery } from "@tanstack/react-query";
import { fetchUserTokens } from "@/lib/actions";
import { TokenCard } from "@/components/tokens/token-card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import BackButton from "@/components/BackButton";

export default function ProfilePage() {
  const { publicKey } = useWallet();
  const address = useMemo(
    () => publicKey?.toString() ?? "F3k...9s2A",
    [publicKey]
  );
  const short = useMemo(
    () => (address ? `${address.slice(0, 4)}...${address.slice(-4)}` : ""),
    [address]
  );

  const { data: tokens, isLoading } = useQuery({
    enabled: !!address,
    queryKey: ["user-tokens", address],
    queryFn: () => fetchUserTokens(address),
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });

  return (
    <div className="max-w-7xl border-x mx-auto">
      <BackButton href="/tokens" />
      <div className="border-b">
        <div className="flex items-center gap-4">
          <Avatar className="size-48 rounded-none border-r">
            <AvatarImage
              src={
                "https://i.pinimg.com/736x/63/47/e2/6347e2a6a61f9a5990ff1201673e5d42.jpg"
              }
              alt="avatar"
            />
            <AvatarFallback>USR</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-2xl font-bold">Your Profile</span>
            <span className="text-muted-foreground text-sm font-mono">
              {address}
            </span>
          </div>
        </div>
      </div>

      <div className="border-b">
        <h2 className="text-xl font-semibold py-4 px-6 border-b">Your Tokens</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 divide-y divide-x">
          {isLoading && (
            <div className="col-span-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 divide-y divide-x">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="border-0 rounded-none p-4 bg-card animate-pulse h-40"
                />
              ))}
            </div>
          )}
          {!isLoading &&
            tokens?.map((t) => <TokenCard key={t.createdAt} token={t} />)}
          {!isLoading && tokens?.length === 0 && (
            <div className="col-span-full text-center text-muted-foreground py-10">
              No tokens found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
