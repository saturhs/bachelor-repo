"use client";

import Image from "next/image";
import Link from "next/link";
import cowLogo from "@/assets/cow_400x400.png";
import { useRouter } from "next/navigation";
import { Button } from "./button";

export function Navbar() {
  const router = useRouter();

  const handleLogoClick = () => {
    router.back();
  };

  return (
    <div className="h-20">
      <nav className="w-full p-4 fixed top-0 flex justify-between items-center bg-white/80 backdrop-blur-sm shadow-sm z-50">
        <div className="w-32">
          <Image
            src={cowLogo}
            alt="Breeder Pro Logo"
            width={100}
            height={100}
            priority
            className="transition-transform duration-300 ease-in-out transform hover:scale-110 active:scale-95"
            onClick={handleLogoClick}
          />
        </div>
        <div className="flex gap-6">
          <Button onClick={() => router.push('/statistics')}>Statistics</Button>
          <Button onClick={() => router.push('/about')}>About</Button>
        </div>
      </nav>
    </div>
  );
}