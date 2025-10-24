"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { IconArrowRight } from "@tabler/icons-react";
import { motion } from "motion/react";

export function HeroSection() {
  return (
    <section className="bg-background relative uppercase min-h-[calc(100vh-5rem)] flex items-center">
      <div className="w-full px-4 md:px-8 py-16 md:py-24">
        <div className="flex items-center justify-center text-center">
          <div className="space-y-8 w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-3 max-w-3xl mx-auto"
            >
              <h2 className="text-sm md:text-xl font-bold tracking-tight">
                Powered by <span className="text-primary">Founder</span>{" "}
                Reputation
              </h2>
              <h1 className="text-3xl md:text-7xl font-bold tracking-tight leading-tight">
                The First Onchain{" "}
                <span className="text-primary">Launchpad</span>
              </h1>
              <p className="text-sm md:text-xl max-w-2xl mx-auto text-muted-foreground">
                Where conviction, proof and reputation convert into liquid
                capital. Welcome to the Internet Capital Markets. The new
                foundation for founder led fundraising.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
            >
              <Link href="/create" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="border-0 uppercase rounded-none py-8 px-8 md:text-lg w-full"
                >
                  Start Raising
                  <IconArrowRight className="ml-2 size-6 -rotate-45" />
                </Button>
              </Link>
              <Link href="/tokens" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-0 rounded-none uppercase py-8 px-8 md:text-lg w-full"
                >
                  Explore Markets
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
