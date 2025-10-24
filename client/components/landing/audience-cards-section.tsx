"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef } from "react";
import { IconCheck, IconRocket, IconTrendingUp } from "@tabler/icons-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface AudienceCardProps {
  title: string;
  subtitle: string;
  bullets: string[];
  icon: string;
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
  icon,
  href,
  buttonText,
  buttonIcon: ButtonIcon,
  delay = 0,
  reverse = false,
}: AudienceCardProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, delay }}
      className="py-8"
    >
      <div
        className={`flex flex-col lg:flex-row gap-12 items-center ${reverse ? "lg:flex-row-reverse" : ""}`}
      >
        <div className="lg:w-1/2 flex justify-center">
          <motion.div
            initial={{ y: 100, x: -100, opacity: 0 }}
            animate={isInView ? { y: 0, x: 0, opacity: 1 } : { y: 100, x: -100, opacity: 0 }}
            transition={{ duration: 0.6, delay: delay + 0.2 }}
            className="relative"
          >
            <Image
              src={icon}
              alt="icon"
              className="relative z-10 md:scale-100 scale-75"
              height={350}
              width={350}
            />
            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full"></div>
          </motion.div>
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
      title:
        "Founders, investors and creators connect through proof and reputation.",
      subtitle:
        "Reputation becomes capital. Launch tokens. Raise funds. Build in public. Keep control.",
      bullets: [
        "Permissionless creation",
        "Reputation verified access",
        "Onchain fundraising with ownership intact",
      ],
      icon: "/rocket_transparent.png",
      href: "/create",
      buttonText: "Launch Your Token",
      buttonIcon: IconRocket,
      delay: 0,
      reverse: false,
    },
    {
      title: "Invest in Founder Capital Markets",
      subtitle:
        "Gain direct access to tokenized founder raises where reputation is the collateral and proof drives allocation.",
      bullets: [
        "Reputation verified founders",
        "Tokenized capital opportunities",
        "Fully transparent onchain performance",
      ],
      icon: "/person_transparent.png",
      href: "/tokens",
      buttonText: "Explore",
      buttonIcon: IconTrendingUp,
      delay: 0.3,
      reverse: true,
    },
  ];

  return (
    <section ref={ref} className="bg-background relative mx-auto border-y uppercase">
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
            Whether you&apos;re building, investing, or creating — we have the
            right tools for you
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
