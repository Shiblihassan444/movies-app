"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    function handleClick(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (
        !target.closest("#header-menu-btn") &&
        !target.closest("#header-menu-popup")
      ) {
        setMenuOpen(false);
      }
    }
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [menuOpen]);

  return (
    <header
      className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-4 py-2 bg-black/80 backdrop-blur-md
      sm:px-8 sm:py-3 sm:mx-auto sm:max-w-7xl sm:left-1/2 sm:-translate-x-1/2"
      style={{ boxSizing: "border-box" }}
    >
      <Link href="/" className="flex items-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo.png"
          alt="Logo"
          width={40}
          height={40}
          style={{ display: "block" }}
        />
        <span className="text-white text-xl font-bold tracking-wide select-none">
          Movies
        </span>
      </Link>
      <div className="relative">
        <button
          id="header-menu-btn"
          className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-white/10 transition-colors focus:outline-none"
          aria-label="Menu"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <svg
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-white"
          >
            <circle cx="12" cy="6" r="1.5" />
            <circle cx="12" cy="12" r="1.5" />
            <circle cx="12" cy="18" r="1.5" />
          </svg>
        </button>
        {menuOpen && (
          <div
            id="header-menu-popup"
            className="absolute right-0 mt-4 w-40 bg-black/95 rounded-lg shadow-lg py-2 border border-gray-800 animate-fade-in z-50"
          >
            <Link
              href="/"
              className="block px-4 py-2 text-white hover:bg-white/10 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/"
              className="block px-4 py-2 text-white hover:bg-white/10 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Contact
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
