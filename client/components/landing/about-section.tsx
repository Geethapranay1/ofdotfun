"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef } from "react";
import Image from "next/image";

export function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="bg-background relative uppercase">
       <div className="top-0 -left-10 w-full h-10 pointer-events-none border-b bg-[image:repeating-linear-gradient(315deg,_#0000000d_0,_#0000000d_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] bg-fixed dark:border-x-[#ffffff1a] dark:bg-[image:repeating-linear-gradient(315deg,_#ffffff1a_0,_#ffffff0a_1px,_transparent_0,_transparent_50%)]" />
      <div className="px-4 md:px-8 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-4 mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold">
            About <span className="text-primary">OnlyFounders</span>
          </h2>
          <p className="text-sm md:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
            The world&apos;s first founder capital markets launchpad, where
            reputation becomes liquid capital
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-2 relative overflow-hidden border-0 rounded-none"
          >
            <div className="relative h-[400px] md:h-[600px]">
              <Image
                src="/background.png"
                alt="OnlyFounders Platform Overview"
                fill
                className="object-cover"
              />
            </div>
          </motion.div>

          <div className="flex flex-col gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col justify-between gap-6 bg-primary/10 border-0 rounded-none p-8"
            >
              <div className="h-12 w-12 bg-primary/20 flex items-center justify-center">
                <span className="text-2xl">🚀</span>
              </div>
              <div>
                <h3 className="mb-2 text-xl font-bold">
                  Launch Your Founder Token
                </h3>
                <p className="text-muted-foreground text-sm">
                  Convert your reputation into tradable founder tokens. Let
                  supporters invest in your growth while you retain full
                  ownership and control.
                </p>
              </div>
              <Link href="/tokens" className="w-full">
                <Button
                  size="lg"
                  className="border-0 rounded-none w-full"
                >
                  Tokenize Now
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="relative h-[200px] md:h-[280px] overflow-hidden border-0 rounded-none"
            >
              <Image
                src="/logogreen.png"
                alt="Founder Token Creation"
                fill
                className="object-cover"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
