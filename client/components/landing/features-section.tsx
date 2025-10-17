"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  IconRocket,
  IconBoltFilled,
  IconShieldCheckFilled,
  IconChartArrowsVertical,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef } from "react";

const features = [
  {
    icon: IconRocket,
    title: "Launch Instantly",
    description:
      "Create and launch your meme token in seconds. No coding required.",
  },
  {
    icon: IconBoltFilled,
    title: "Fair Launch",
    description:
      "Dynamic bonding curve ensures fair distribution for all participants.",
  },
  {
    icon: IconShieldCheckFilled,
    title: "Secure & Verified",
    description:
      "Built on Solana with audited smart contracts for maximum security.",
  },
  {
    icon: IconChartArrowsVertical,
    title: "Auto Liquidity",
    description:
      "Automatic graduation to Meteora DLMM pools when targets are reached.",
  },
];

export function FeaturesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="max-w-7xl mx-auto border-x border-t">
      <div className="px-8 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-4 mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold">
            Why Choose <span className="text-primary">Tokun.Lunchpad</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            The most advanced meme token launchpad on Solana
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={
                  isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                }
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="border-0 rounded-none p-0 hover:bg-accent/50 transition-colors">
                  <CardContent className="p-8 space-y-4">
                    <div className="inline-flex items-center justify-center p-4 bg-primary/10">
                      <Icon className="size-8 text-primary" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold">{feature.title}</h3>
                      <p className="text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
