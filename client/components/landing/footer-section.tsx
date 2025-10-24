"use client";

import Link from "next/link";
import Image from "next/image";
import { Send } from "lucide-react";
import { useState } from "react";
import { HowItWorksModal } from "./how-it-works-modal";
import {
  IconBrandGmail,
  IconBrandLinkedinFilled,
  IconBrandX,
} from "@tabler/icons-react";

export function FooterSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <footer className="bg-background relative border-b uppercase">
      <div className="top-0 -left-10 w-full h-10 pointer-events-none bg-[image:repeating-linear-gradient(315deg,_#0000000d_0,_#0000000d_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] bg-fixed dark:border-x-[#ffffff1a] dark:bg-[image:repeating-linear-gradient(315deg,_#ffffff1a_0,_#ffffff0a_1px,_transparent_0,_transparent_50%)]" />
      <div className="px-8 py-16 border-t">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2 space-y-8">
            <div className="flex items-start gap-4">
              <Image
                src="/onlyfoundersdotfun cat-Photoroom.png"
                alt="OnlyFounders Logo"
                width={80}
                height={80}
                className="flex-shrink-0"
              />
              <p className="text-muted-foreground text-sm max-w-sm pt-2">
                The world&apos;s first launchpad turning founders reputation
                into liquid, onchain capital.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <Link
                href="https://x.com/ofdotfun"
                target="_blank"
                className="text-primary transition-colors"
              >
                <IconBrandX size={20} />
              </Link>
              <Link
                href="https://www.linkedin.com/company/foundershubnetwork"
                target="_blank"
                className="text-primary transition-colors"
              >
                <IconBrandLinkedinFilled size={20} />
              </Link>
              <Link
                href="https://t.me/onlyfoundersofficial/1"
                target="_blank"
                className="text-primary transition-colors"
              >
                <Send size={20} />
              </Link>
              <Link
                href="mailto:moe@foundershub.network"
                className="text-primary transition-colors"
              >
                <IconBrandGmail size={20} />
              </Link>
            </div>

            <div>
              <p className="text-foreground mb-4 font-bold">Built on</p>
              <div className="flex items-center gap-6">
                <Link
                  href="https://solana.com"
                  target="_blank"
                  className="opacity-70 hover:opacity-100 transition-opacity"
                >
                  <Image
                    src="/solana.svg"
                    alt="Solana"
                    width={24}
                    height={24}
                  />
                </Link>
                <Link
                  href="https://www.meteora.ag/"
                  target="_blank"
                  className="opacity-70 hover:opacity-100 transition-opacity"
                >
                  <Image
                    src="/meteora.svg"
                    alt="Meteora"
                    width={24}
                    height={24}
                  />
                </Link>
                <Link
                  href="https://triton.one/"
                  target="_blank"
                  className="opacity-70 hover:opacity-100 transition-opacity"
                >
                  <Image
                    src="/triton.png"
                    alt="Triton"
                    width={24}
                    height={24}
                  />
                </Link>
                <Link
                  href="https://jup.ag/"
                  target="_blank"
                  className="opacity-70 hover:opacity-100 transition-opacity"
                >
                  <Image src="/jup.svg" alt="Jupiter" width={24} height={24} />
                </Link>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-4">Platform</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/tokens"
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                >
                  Browse Markets
                </Link>
              </li>
              <li>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="text-muted-foreground uppercase hover:text-foreground transition-colors text-sm"
                >
                  How it Works
                </button>
              </li>
              <li>
                <Link
                  href="/create"
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                >
                  Create Token
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Resources</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="https://only-founder.gitbook.io/only-founder-docs"
                  target="_blank"
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.onlyfounders.xyz/about"
                  target="_blank"
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.onlyfounders.xyz/blogs"
                  target="_blank"
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-muted-foreground text-sm">
              © 2025 OnlyFounders. All rights reserved.
            </p>
          </div>
        </div>
      </div>
      <HowItWorksModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </footer>
  );
}
