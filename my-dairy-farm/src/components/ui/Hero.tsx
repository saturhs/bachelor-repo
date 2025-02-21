import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Hero() {
  return (
    <div className="text-center flex flex-col items-center justify-center">
      <h1 className="text-5xl font-bold mb-12">Breeding App</h1>
      <Link href="/main-menu">
        <Button 
          className="h-12 px-8 text-lg bg-[#ff4f4f] hover:bg-[#ff4f4f]/90 text-white"
        >
          Go to main menu
        </Button>
      </Link>
    </div>
  );
}