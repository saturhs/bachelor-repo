"use client";

import Image from "next/image";
import Link from "next/link";
import cowLogo from "@/assets/cow_400x400.png";
import { useRouter } from "next/navigation";
import { Button } from "./button";

export function Navbar() {
  const router = useRouter();

  const handleLogoClick = () => {
    if (window.location.pathname !== '/') { // Check if the current path is not the root
      router.back();
    }
  };

  return (
    <div className="h-16"> {/* Reduced from h-24 to h-16 to match actual navbar height */}
      <nav className="w-full py-1 px-4 fixed top-0 flex justify-between items-center bg-white shadow-sm z-50">
        <div className="w-16"> {/* Reduced from w-20 to w-16 */}
          <Image
            src={cowLogo}
            alt="Breeder Pro Logo"
            width={60}
            height={60} 
            priority
            className="transition-transform duration-300 ease-in-out transform hover:scale-110 active:scale-95"
            onClick={handleLogoClick}
          />
        </div>
        <div className="flex gap-6">
          <Button onClick={() => router.push('/statistics')} className="h-9">Statistics</Button>
          <Button onClick={() => router.push('/about')} className="h-9">About</Button>
        </div>
      </nav>
    </div>
  );
}