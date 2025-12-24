import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type VariantKey =
  | "fade"
  | "up"
  | "down"
  | "left"
  | "right"
  | "zoomIn"
  | "zoomOut"
  | "rotateIn"
  | "rotateOut"
  | "flipX"
  | "flipY"
  | "bounce";

const variants = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  up: {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -50 },
  },
  down: {
    initial: { opacity: 0, y: -50 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 50 },
  },
  left: {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  },
  right: {
    initial: { opacity: 0, x: -50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 50 },
  },
  zoomIn: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
  },
  zoomOut: {
    initial: { opacity: 0, scale: 1.2 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.2 },
  },
  rotateIn: {
    initial: { opacity: 0, rotate: -180 },
    animate: { opacity: 1, rotate: 0 },
    exit: { opacity: 0, rotate: 180 },
  },
  rotateOut: {
    initial: { opacity: 0, rotate: 0 },
    animate: { opacity: 1, rotate: -180 },
    exit: { opacity: 0, rotate: -360 },
  },
  flipX: {
    initial: { opacity: 0, rotateY: 90 },
    animate: { opacity: 1, rotateY: 0 },
    exit: { opacity: 0, rotateY: -90 },
  },
  flipY: {
    initial: { opacity: 0, rotateX: -90 },
    animate: { opacity: 1, rotateX: 0 },
    exit: { opacity: 0, rotateX: 90 },
  },
  bounce: {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0, transition: { type: "spring", bounce: 0.3 } },
    exit: { opacity: 0, y: -50, transition: { type: "spring", bounce: 0.3 } },
  },
};

const PageTransition: React.FC<{
  children: React.ReactNode;
  variant?: VariantKey;
  className?: string;
}> = ({ children, variant = "fade", className }) => {
  return (
    <motion.div
      className={cn(className)}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={variants[variant]}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
