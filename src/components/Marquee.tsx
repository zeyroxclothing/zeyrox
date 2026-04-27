import { motion, useScroll, useTransform, useSpring, useVelocity, useAnimationFrame, useMotionValue } from "framer-motion";
import { useRef } from "react";

// Local wrap function to avoid dependency issues
const wrap = (min: number, max: number, v: number) => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

interface MarqueeProps {
  baseVelocity?: number;
  content: string[];
  className?: string;
  direction?: "left" | "right";
  outline?: boolean;
}

export default function Marquee({ 
  content, 
  baseVelocity = 1, 
  className = "", 
  direction = "left",
  outline = false 
}: MarqueeProps) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 2], {
    clamp: false
  });

  const x = useTransform(baseX, (v) => `${wrap(-20, -45, v)}%`);

  const directionFactor = useRef<number>(direction === "left" ? 1 : -1);
  useAnimationFrame((t, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

    if (velocityFactor.get() < 0) {
      directionFactor.current = direction === "left" ? -1 : 1;
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = direction === "left" ? 1 : -1;
    }

    moveBy += directionFactor.current * moveBy * velocityFactor.get();

    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div className={`overflow-hidden whitespace-nowrap flex flex-nowrap py-6 md:py-10 relative z-10 ${className}`}>
      <motion.div 
        className={`flex whitespace-nowrap text-5xl md:text-[5rem] font-black uppercase tracking-tighter italic leading-none
          ${outline 
            ? "text-transparent bg-clip-text [-webkit-text-stroke:1px_rgba(5,17,187,0.3)] dark:[-webkit-text-stroke:1px_rgba(255,255,255,0.1)]" 
            : "text-slate-900/10 dark:text-white/[0.03]"}`} 
        style={{ x }}
      >
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <span key={i} className="flex items-center gap-10 mx-5">
            {content.map((text, idx) => (
              <span key={idx} className="flex items-center gap-10">
                <span className="hover:text-[#0511bb] dark:hover:text-blue-500 transition-all duration-500 cursor-default hover:scale-105 transform inline-block">
                  {text}
                </span>
                <span className="w-4 h-4 md:w-8 md:h-8 rounded-full border-2 border-[#0511bb]/20 dark:border-white/10" />
              </span>
            ))}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
