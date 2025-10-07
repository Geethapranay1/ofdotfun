"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import Image from "next/image";

interface Activity {
  id: string;
  user: string;
  action: "bought" | "sold";
  token: string;
  amount: string;
  price: string;
  address: string;
}

const mockActivities: Activity[] = [
  {
    id: "1",
    user: "eholmes",
    action: "bought",
    token: "2HX...uBvN",
    amount: "0.20 SOL",
    price: "of",
    address: "2HX...uBvN",
  },
  {
    id: "2",
    user: "eholmes",
    action: "bought",
    token: "5QP...4Mva",
    amount: "0.49 SOL",
    price: "of",
    address: "5QP...4Mva",
  },
  {
    id: "3",
    user: "MNF",
    action: "sold",
    token: "b4E...GqY",
    amount: "0.50 SOL",
    price: "of",
    address: "b4E...GqY",
  },
  {
    id: "4",
    user: "eholmes",
    action: "bought",
    token: "B6N...jG9",
    amount: "0.16 SOL",
    price: "of",
    address: "B6N...jG9",
  },
  {
    id: "5",
    user: "cryptowhale",
    action: "bought",
    token: "7YZ...kL3",
    amount: "1.20 SOL",
    price: "of",
    address: "7YZ...kL3",
  },
  {
    id: "6",
    user: "trader_pro",
    action: "sold",
    token: "9XW...pQ2",
    amount: "0.75 SOL",
    price: "of",
    address: "9XW...pQ2",
  },
  {
    id: "7",
    user: "hodler123",
    action: "bought",
    token: "3MN...vB5",
    amount: "0.33 SOL",
    price: "of",
    address: "3MN...vB5",
  },
  {
    id: "8",
    user: "moonshot",
    action: "bought",
    token: "8PL...wR9",
    amount: "2.10 SOL",
    price: "of",
    address: "8PL...wR9",
  },
];

const activities = [...mockActivities, ...mockActivities];

export function ActivityTicker() {
  const [isPaused, setIsPaused] = useState(false);

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-md border-t border-secondary/10 overflow-hidden shadow-lg"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-card/95 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-card/95 to-transparent z-10 pointer-events-none" />

      <div className="relative h-12 flex items-center">
        <motion.div
          className="flex gap-8 items-center whitespace-nowrap"
          animate={
            isPaused
              ? {}
              : {
                  x: [0, "-50%"],
                }
          }
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 40,
              ease: "linear",
            },
          }}
        >
          {activities.map((activity, index) => (
            <div
              key={`${activity.id}-${index}`}
              className="flex items-center gap-2 text-sm"
            >
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <Image
                    src={`https://i.pinimg.com/736x/0b/80/51/0b8051e37168c1d6092de82ce8aa2ace.jpg`}
                    alt={activity.user}
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                </div>
                <span className="font-medium text-foreground">
                  {activity.user}
                </span>
              </div>

              <span
                className={`font-semibold ${
                  activity.action === "bought"
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {activity.action}
              </span>

              <span className="text-muted-foreground">{activity.price}</span>
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary/10 border border-primary/20">
                <span className="font-mono text-xs text-primary font-semibold">
                  {activity.token}
                </span>
              </div>

              <span className="font-semibold text-primary">
                {activity.amount}
              </span>

              <div className="w-px h-6 bg-border/50 mx-2" />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
