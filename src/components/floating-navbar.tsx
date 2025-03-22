"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { UserButton, useAuth } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LogOut } from "lucide-react";

interface NavItem {
  href: string;
  label: string;
}

interface FloatingNavbarProps {
  navItems: NavItem[];
  logoText?: string;
  showAuth?: boolean;
}

export function FloatingNavbar({
  navItems,
  logoText = "Blockchain Indexer",
  showAuth = true,
}: FloatingNavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const { isSignedIn, isLoaded } = useAuth();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-4 left-0 right-0 z-50 mx-auto w-11/12 max-w-7xl transition-all duration-300 ease-in-out",
        isScrolled
          ? "bg-black/70 backdrop-blur-lg border border-white/10 shadow-lg rounded-2xl"
          : "bg-transparent"
      )}
    >
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link
          href="/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <span className="self-center text-xl font-semibold whitespace-nowrap text-white">
            {logoText}
          </span>
        </Link>
        <div className="flex md:order-2 space-x-3 rtl:space-x-reverse items-center">
          {showAuth && isLoaded && (
            <>
              {isSignedIn ? (
                <div className="flex items-center space-x-4">
                  <Link 
                    href="/dashboard"
                    className="text-white hover:text-blue-400 hidden md:inline-block"
                  >
                    Dashboard
                  </Link>
                  <Link 
                    href="/sign-out" 
                    className="text-rose-400 hover:text-rose-300 hidden md:inline-block"
                    title="Sign Out"
                  >
                    <LogOut className="h-4 w-4" />
                  </Link>
                  <UserButton afterSignOutUrl="/" />
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link 
                    href="/auth/sign-in"
                    className="text-white hover:text-blue-400 hidden md:inline-block"
                  >
                    Sign In
                  </Link>
                  <Link 
                    href="/auth/sign-up"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </>
          )}
          <button
            data-collapse-toggle="navbar-sticky"
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-400 rounded-lg md:hidden hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600"
            aria-controls="navbar-sticky"
            aria-expanded="false"
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
        </div>
        <div
          className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
          id="navbar-sticky"
        >
          <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border rounded-lg md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 bg-transparent md:bg-transparent border-gray-700">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "block py-2 px-3 rounded md:p-0",
                    pathname === item.href
                      ? "text-white bg-blue-600 md:bg-transparent md:text-blue-400"
                      : "text-white hover:bg-gray-700 md:hover:bg-transparent md:hover:text-blue-500"
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
} 