"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef } from "react";

const faqs = [
  {
    question: "What is a bonding curve?",
    answer:
      "A bonding curve is a mathematical formula that determines token price based on supply. As more tokens are bought, the price increases automatically, ensuring fair price discovery.",
  },
  {
    question: "How much does it cost to launch a token?",
    answer:
      "Token creation requires a small fee to cover Solana network costs and deployment. The exact amount varies based on network conditions.",
  },
  {
    question: "What happens when my token graduates?",
    answer:
      "When your token reaches the market cap target, liquidity automatically migrates to a Meteora DLMM pool, providing deeper liquidity and better trading experience.",
  },
  {
    question: "Can I add liquidity after launch?",
    answer:
      "The bonding curve automatically manages liquidity during the initial phase. After graduation, you can add liquidity to the Meteora pool like any other DEX.",
  },
  {
    question: "Is there a token listing fee?",
    answer:
      "No, there are no listing fees. You only pay for the initial token creation and Solana network transaction fees.",
  },
  {
    question: "How do I promote my token?",
    answer:
      "You can add social links during token creation. Share your token page, engage with the community, and let the fair launch mechanism do the rest.",
  },
];

export function FAQSection() {
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
            Frequently Asked <span className="text-primary">Questions</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about launching on Tokun.Lunchpad
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border-0 bg-card px-6"
              >
                <AccordionTrigger className="text-lg font-medium hover:no-underline py-6">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
