"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef } from "react";
import { IconCheck, IconRocket, IconTrendingUp } from "@tabler/icons-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

interface AudienceCardProps {
  title: string;
  subtitle: string;
  bullets: string[];
  href: string;
  buttonText: string;
  buttonIcon: React.ComponentType<{ className?: string }>;
  delay?: number;
  reverse?: boolean;
}

const AudienceCard = ({
  title,
  subtitle,
  bullets,
  href,
  buttonText,
  buttonIcon: ButtonIcon,
  delay = 0,
  reverse = false,
}: AudienceCardProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { theme } = useTheme();
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, delay }}
      className="py-8"
    >
      <div
        className={`flex flex-col lg:flex-row gap-12 items-center ${
          reverse ? "lg:flex-row-reverse" : ""
        }`}
      >
        <div className="lg:w-1/2 lg:block hidden">
          {title === "OnlyFounders" ? (
            <div className="grid md:grid-cols-3 gap-3">
              <div className="relative h-[450px] overflow-hidden border">
                <Image
                  src="/feat1.jpeg"
                  alt="OnlyFounders Platform Overview"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="relative h-[450px] overflow-hidden border">
                <Image
                  src="/feat2.jpeg"
                  alt="OnlyFounders Platform Overview"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="relative h-[450px] overflow-hidden border">
                <Image
                  src="/feat3.jpeg"
                  alt="OnlyFounders Platform Overview"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="relative h-[150px] overflow-hidden border">
                <Image
                  src="/feat4.jpeg"
                  alt="OnlyFounders Platform Overview"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="relative h-[150px] overflow-hidden border">
                <Image
                  src="/feat5.jpeg"
                  alt="OnlyFounders Platform Overview"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="relative h-[150px] overflow-hidden border">
                <Image
                  src="/feat6.jpeg"
                  alt="OnlyFounders Platform Overview"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
          )}
        </div>

        <div className="lg:w-1/2 space-y-6">
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold leading-tight mb-4">
              {title}
            </h2>
            <p className="md:text-lg text-sm text-muted-foreground leading-relaxed mb-6">
              {subtitle}
            </p>

            <div className="md:space-y-3 mb-8">
              {bullets.map((bullet, index) => (
                <div key={index} className="flex items-start md:gap-3 gap-2">
                  <IconCheck className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                  <span className="text-muted-foreground md:text-base text-sm leading-relaxed">
                    {bullet}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <Link href={href}>
            <Button
              size="lg"
              className="border-0 rounded-none inline-flex items-center gap-3"
            >
              {buttonText}
              <ButtonIcon className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export function AudienceCardsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const cards = [
    {
      title: "OnlyFounders",
      subtitle:
        "A permissionless network where founders, investors, and creators connect through proof and reputation. Here, reputation becomes capital — launch tokens, raise funds, and build in public while keeping full ownership.",
      bullets: [
        "Permissionless Creation — anyone can start, anyone can rise.",
        "Reputation-Verified Access — credibility replaces gatekeeping.",
        "Onchain Fundraising — transparent, aligned, and founder-first.",
      ],
      icon: "/rocket.png",
      href: "/create",
      buttonText: "Launch Your Token",
      buttonIcon: IconRocket,
      delay: 0,
      reverse: false,
    },
    {
      title: "Invest in Founder Capital Markets",
      subtitle:
        "Get early access to tokenized founder raises, where reputation is the collateral and proof drives allocation. Support the next generation of builders — transparently, verifiably, and onchain.",
      bullets: [
        "Reputation verified founders",
        "Tokenized capital opportunities",
        "Fully transparent onchain performance",
      ],
      icon: "/cat.png",
      href: "/tokens",
      buttonText: "Explore",
      buttonIcon: IconTrendingUp,
      delay: 0.3,
      reverse: true,
    },
  ];

  return (
    <section
      ref={ref}
      className="bg-background relative mx-auto border-y uppercase"
    >
      <div className="px-4 md:px-8 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-4 mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold">
            Choose Your <span className="text-primary">Path</span>
          </h2>
          <p className="text-sm md:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
            Whether you&apos;re building, investing, or creating, we give you
            the tools to grow, fund, and scale — transparently and on your
            terms.
          </p>
        </motion.div>

        <div className="space-y-8">
          {cards.map((card, index) => (
            <AudienceCard key={index} {...card} />
          ))}
        </div>
      </div>
    </section>
  );
}
