'use client';
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const [show, setShow] = useState(false);
  const [showButtons, setShowButtons] = useState(true);
  const lastScrollY = useRef(0);
  const heroRef = useRef(null);

  useEffect(() => {
    setTimeout(() => setShow(true), 100); // slight delay for animation
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY <= 20) {
        setShowButtons(true); // Show only عند أعلى الصفحة أو سحب بسيط
      } else {
        setShowButtons(false); // Hide عند أي سحب أكبر من 20 بكسل
      }
      lastScrollY.current = window.scrollY;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    gsap.fromTo(
      heroRef.current,
      { opacity: 1, y: 0 },
      {
        opacity: 0,
        y: -100,
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      }
    );
  }, []);

  return (
    <section
      ref={heroRef}
      className={`relative w-full min-h-screen flex items-center justify-center`}
    >
      {/* Background Video */}
      <video
        className="absolute inset-0 w-full h-full object-cover z-0 opacity-70 blur-sm"
        src="/hero-bg.mp4"
        autoPlay
        loop
        muted
        playsInline
      />
      {/* Overlay for better text visibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/40 z-10" />
      {/* Hero Content */}
      <div
        className={`relative z-20 flex flex-col items-center justify-center text-center px-4 transition-all duration-1000 ${
          show
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-16 scale-75"
        }`}
        style={{ minHeight: "60vh" }}
      >
        {/* الأزرار تظهر مباشرة بدون أي بوكس أو خلفية */}
        <AnimatePresence>
          {showButtons && (
            <motion.div
              key="hero-buttons"
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col sm:flex-row gap-2 mb-8 justify-center"
            >
              <a
                href="#"
                className="px-4 py-1 border border-white text-white uppercase tracking-wider font-semibold bg-white/10 hover:bg-white/30 transition-all duration-300 text-xs flex items-center gap-2 rounded backdrop-blur-sm hover:backdrop-blur-md"
              >
                <span className="text-base">↗</span>
                Browse Websites
              </a>
              <a
                href="#"
                className="px-4 py-1 border border-white text-white uppercase tracking-wider font-semibold bg-white/10 hover:bg-white/30 transition-all duration-300 text-xs flex items-center gap-2 rounded backdrop-blur-sm hover:backdrop-blur-md"
              >
                View Categories
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}