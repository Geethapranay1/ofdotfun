"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { useRef } from "react";
import { useInView } from "motion/react";

const brands = [
  { name: "Solana", path: "/brands/Solana.svg" },
  { name: "Microsoft", path: "/brands/Microsoft.svg" },
  { name: "OpenCampus", path: "/brands/OpenCampus.svg" },
  { name: "Circle", path: "/brands/Circle.avif" },
  { name: "Meteora", path: "/brands/meteora.png" },
  { name: "Jupiter", path: "/brands/jupiter.png" },
];

export function BrandSlider() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="border-t uppercase">
      <div className="">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center border-b relative flex items-center justify-center"
        >
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none border-x-[#0000000d] bg-[image:repeating-linear-gradient(315deg,_#0000000d_0,_#0000000d_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] bg-fixed dark:border-x-[#ffffff1a] dark:bg-[image:repeating-linear-gradient(315deg,_#ffffff1a_0,_#ffffff0a_1px,_transparent_0,_transparent_50%)]" />
          <p className="text-xs font-medium text-muted-foreground py-3 px-8 w-fit">
            Trusted by industry leaders
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 py-16 bg-background relative items-center">
          {brands.map((brand, index) => (
            <motion.div
              key={brand.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={
                isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }
              }
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex justify-center"
            >
              <div className="relative w-[120px] h-[60px]">
                <Image
                  src={brand.path}
                  alt={brand.name}
                  fill
                  className={`object-contain grayscale hover:grayscale-0 duration-300 transition-all"
                  sizes="120px ${brand.name === "Jupiter" ? "scale-200" : ""}`}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
