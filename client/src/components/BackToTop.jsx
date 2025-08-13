import React, { useEffect, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaArrowUp } from "react-icons/fa";

const SCROLL_THRESHOLD = 280; 

export default function BackToTop({
  threshold = SCROLL_THRESHOLD,
  offsetBottom = 24, 
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setVisible(window.scrollY > threshold);
          ticking = false;
        });
        ticking = true;
      }
    };

    onScroll();

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  const scrollToTop = useCallback(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      window.scrollTo(0, 0);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          aria-label="Back to top"
          onClick={scrollToTop}
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 10 }}
          transition={{ duration: 0.18 }}
          className={[
            "fixed right-5 md:right-8 z-50",
            "h-12 w-12 rounded-full",
            "border border-white/20",
            "bg-white/10 text-white",
            "shadow-lg backdrop-blur-sm",
            "hover:bg-white/20 focus:outline-none",
            "focus-visible:ring-2 focus-visible:ring-cyan-400",
            "flex items-center justify-center",
          ].join(" ")}
          // Respect iOS safe area while keeping a sensible minimum offset
          style={{
            bottom: `calc(env(safe-area-inset-bottom, 0px) + ${offsetBottom}px)`,
          }}
        >
          <FaArrowUp className="text-lg" />
          <span className="sr-only">Back to top</span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
