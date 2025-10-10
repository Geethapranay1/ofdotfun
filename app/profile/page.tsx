"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useQuery } from "@tanstack/react-query";
import { fetchUserTokens } from "@/lib/actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  const { publicKey } = useWallet();
  const address = useMemo(() => publicKey?.toString() ?? "F3k...9s2A", [publicKey]);
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

  const avatarSrc =
    "https://i.pinimg.com/474x/0f/98/62/0f986200f68f8bfcd56d97e1dcb03139.jpg";

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 flex flex-col gap-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-4">
            <Avatar className="size-16">
              <AvatarImage src={avatarSrc} alt="avatar" />
              <AvatarFallback>USR</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-xl">Your Profile</span>
              <span className="text-muted-foreground text-sm">{short}</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-6">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Address:</span>
            <span className="font-mono text-sm break-all">{address}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Tokens</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading && (
              <>
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="border rounded-xl p-4 bg-card animate-pulse h-28" />
                ))}
              </>
            )}
            {!isLoading && tokens?.map((t) => (
              <Link key={t.mint} href={`/profile/${t.mint}`} className="group">
                <div className="border rounded-xl p-4 hover:shadow-md transition-shadow h-full bg-card">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 overflow-hidden rounded-lg border">
                      <Image
                        src={t.image}
                        alt={t.name}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {t.name} <span className="text-muted-foreground">· {t.symbol}</span>
                      </span>
                      <span className="text-xs text-muted-foreground">{t.marketCap}</span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button size="sm" className="w-full">Manage</Button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


