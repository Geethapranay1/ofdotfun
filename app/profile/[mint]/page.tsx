"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

// Mock fetch by mint
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
    <div className="max-w-7xl mx-auto px-4 py-10 flex flex-col gap-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="relative w-14 h-14 overflow-hidden rounded-lg border">
              <Image
                src={token.image}
                alt={token.name}
                fill
                className="object-cover"
                sizes="56px"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl">{token.name} · {token.symbol}</span>
              <span className="text-muted-foreground text-xs break-all">{token.mint}</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Fees</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="text-sm text-muted-foreground">Claimable</div>
                <div className="text-2xl font-semibold">
                  {token.fees.claimable} {token.fees.currency}
                </div>
                <Button>Claim Fees</Button>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Edit Description</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your token..."
                  rows={6}
                />
                <div className="flex justify-end">
                  <Button>Save</Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Social Links</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm text-muted-foreground">Twitter</label>
                <Input value={twitter} onChange={(e) => setTwitter(e.target.value)} placeholder="https://x.com/..." />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm text-muted-foreground">Telegram</label>
                <Input value={telegram} onChange={(e) => setTelegram(e.target.value)} placeholder="https://t.me/..." />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm text-muted-foreground">Website</label>
                <Input value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://..." />
              </div>
              <div className="md:col-span-3 flex justify-end">
                <Button>Save</Button>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}


