"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Hero from "./Hero";

export default function LayoutContent({ children }) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  return (
    <>
      <div className="relative bg-[url('/images/bg-hero.png')] bg-cover bg-center bg-no-repeat">
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60"></div>

        {/* Content */}
        <div className="relative z-10">
          <Navbar />
          {isHomePage && <Hero />}
        </div>
      </div>

      {children}
    </>
  );
}