"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { IconArrowRight } from "@tabler/icons-react";
import { motion } from "motion/react";

const stats = [
  { value: "1000+", label: "Tokens Launched" },
  { value: "$5M+", label: "Total Volume" },
  { value: "50K+", label: "Active Users" },
  { value: "100%", label: "Fair Launch" },
];

export function HeroSection() {
  return (
    <section className="max-w-7xl mx-auto border-x min-h-[calc(100vh-5rem)] flex items-center">
      <div className="w-full px-8 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
              Launch Your <span className="text-primary">Meme Token</span> in
              Seconds
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              The easiest way to create, launch, and trade meme tokens on
              Solana. Fair launches powered by bonding curves.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4"
          >
            <Link href="/create">
              <Button
                size="lg"
                className="border-0 rounded-none py-8 px-12 text-lg"
              >
                Create Token
                <IconArrowRight className="ml-2" />
              </Button>
            </Link>
            <Link href="/tokens">
              <Button
                variant="outline"
                size="lg"
                className="border-0 rounded-none py-8 px-12 text-lg"
              >
                Explore Tokens
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-12"
          >
            {stats.map((stat, index) => (
              <div key={index} className="space-y-2">
                <div className="text-3xl md:text-4xl font-bold text-primary">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
