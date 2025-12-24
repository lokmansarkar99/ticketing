"use client";
import { motion } from "framer-motion";
import { HeroHighlight } from "./HeroHighlight";
import { FC, ReactNode } from "react";
import { cn } from "@/lib/utils";
import PageTransition from "./PageTransition";

interface IDotEffectProps {
  children: ReactNode;
  className?: string;
}
const DotEffect: FC<IDotEffectProps> = ({ children, className }) => {
  return (
    <PageTransition>
      <HeroHighlight className={cn(className)}>
        <motion.h1
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: [20, -5, 0],
          }}
          transition={{
            duration: 0.5,
            ease: [0.4, 0.0, 0.2, 1],
          }}
        >
          {children}
        </motion.h1>
      </HeroHighlight>
    </PageTransition>
  );
};

export default DotEffect;
