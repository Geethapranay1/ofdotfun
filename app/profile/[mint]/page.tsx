"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import BackButton from "@/components/BackButton";

function useMockToken(mint: string) {
  const token = useMemo(
    () => ({
      name: "MemeCat",
      symbol: "MCAT",
      mint,
      image:
        "https://i.pinimg.com/1200x/b7/8f/02/b78f023aa1bca7bdada28db1c30d1fe5.jpg",
      description:
        "The funniest cat on Solana. Community-owned, zero utility, full vibes.",
      socials: {
        twitter: "https://x.com/memecat",
        telegram: "https://t.me/memecat",
        website: "https://memecat.fun",
      },
      fees: {
        claimable: 1.234,
        currency: "SOL",
      },
    }),
    [mint]
  );
  return token;
}

export default function TokenManagePage() {
  const params = useParams<{ mint: string }>();
  const mint = typeof params?.mint === "string" ? params.mint : "";
  const token = useMockToken(mint);

  const [description, setDescription] = useState(token.description);
  const [twitter, setTwitter] = useState(token.socials.twitter);
  const [telegram, setTelegram] = useState(token.socials.telegram);
  const [website, setWebsite] = useState(token.socials.website);

  return (
    <div className="max-w-7xl border-x mx-auto">
      <BackButton />
      <div className="border-b p-8">
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
            <p className="text-muted-foreground font-mono text-sm">
              {token.mint}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x">
        <div className="p-8">
          <h2 className="text-xl font-bold mb-6">Fees</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Claimable</p>
              <p className="text-3xl font-bold">
                {token.fees.claimable} {token.fees.currency}
              </p>
            </div>
            <Button className="w-full rounded-none">Claim Fees</Button>
          </div>
        </div>

        <div className="lg:col-span-2 p-8 space-y-8">
          <div>
            <h2 className="text-xl font-bold mb-6">Edit Description</h2>
            <div className="space-y-4">
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your token..."
                rows={6}
                className="rounded-none"
              />
              <div className="flex justify-end">
                <Button className="rounded-none">Save Description</Button>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h2 className="text-xl font-bold mb-6">Social Links</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Twitter
                  </label>
                  <Input
                    value={twitter}
                    onChange={(e) => setTwitter(e.target.value)}
                    placeholder="https://x.com/..."
                    className="rounded-none"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Telegram
                  </label>
                  <Input
                    value={telegram}
                    onChange={(e) => setTelegram(e.target.value)}
                    placeholder="https://t.me/..."
                    className="rounded-none"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Website
                  </label>
                  <Input
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://..."
                    className="rounded-none"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button className="rounded-none">Save Social Links</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
