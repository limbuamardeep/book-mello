"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";

gsap.registerPlugin(useGSAP);
export default function Lab() {
  const container = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      gsap.to(".box", {
        x: 300,
        duration: 1,
      });
      gsap.from(".box", {
        rotation: 360,
      });
      gsap.from(".box", {
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: "back.out(1.7)",
        stagger: 0.15,
      });
    },
    { scope: container },
  );
  return (
    <div ref={container}>
      <div className="box h-24 w-24 bg-blue-500" />
      <div className="box h-24 w-24 bg-blue-500" />

      <div className="box h-24 w-24 bg-blue-500" />

      <div className="box h-24 w-24 bg-blue-500" />
    </div>
  );
}
