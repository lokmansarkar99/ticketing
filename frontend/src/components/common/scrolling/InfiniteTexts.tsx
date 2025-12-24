"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import { Paragraph } from "../typography/Paragraph";

export const InfiniteTexts = ({
  items,
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  className,
}: {
  items: string[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const scrollingRef = React.useRef<HTMLUListElement>(null);

  useEffect(() => {
    addAnimation();
  }, []);
  const [start, setStart] = useState(false);
  function addAnimation() {
    if (containerRef.current && scrollingRef.current) {
      const scrollingContent = Array.from(scrollingRef.current.children);

      scrollingContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true);
        if (scrollingRef.current) {
          scrollingRef.current.appendChild(duplicatedItem);
        }
      });

      getDirection();
      getSpeed();
      setStart(true);
    }
  }
  const getDirection = () => {
    if (containerRef.current) {
      if (direction === "left") {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "forwards"
        );
      } else {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "reverse"
        );
      }
    }
  };
  const getSpeed = () => {
    if (containerRef.current) {
      if (speed === "fast") {
        containerRef.current.style.setProperty("--animation-duration", "20s");
      } else if (speed === "normal") {
        containerRef.current.style.setProperty("--animation-duration", "40s");
      } else {
        containerRef.current.style.setProperty("--animation-duration", "800s");
      }
    }
  };
  return (
    <div
      ref={containerRef}
      className={cn(
        "scroller relative z-20 top-8 max-w-7xl px-2 md:px-4 mx-auto bg-[#e8dee9] dark:bg-background dark:border-t py-2 overflow-hidden  [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)] ",
        className
      )}
    >
      <ul
        ref={scrollingRef}
        className={cn(
          "flex truncate gap-x-6 min-w-full shrink-0 w-max flex-nowrap",
          start && "animate-scroll ",
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}
      >
        {[]
          .concat(...Array(10).fill(items))
          .map((item: string, index: number) => (
            <Paragraph className="text-sm" key={index}>
              {item?.trim()}
              <span className="pl-6 text-primary">◉</span>
            </Paragraph>
          ))}
      </ul>
    </div>
  );
};
