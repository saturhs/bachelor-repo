import { Navbar } from "@/components/ui/Navbar";
import { Button } from "@/components/ui/button";
import { GoBack } from "@/components/ui/Goback";
import Link from "next/link";

export default function MainMenu() {
  return (
    <main className="min-h-screen bg-[#faf9f6] relative">
      <Navbar />
      <GoBack />
      <div className="flex flex-col items-center justify-start pt-8">
        <h1 className="text-5xl font-bold mb-8">Main Menu</h1>
        
        <div className="flex flex-col gap-4 w-[80%] max-w-sm mx-auto">
          <Link href="/animals">
            <Button 
              className="w-full h-12 px-8 text-lg bg-[#ff4f4f] hover:bg-[#ff4f4f]/90 text-white"
            >
              Animals
            </Button>
          </Link>

          <Link href="/calendar">
            <Button 
              className="w-full h-12 px-8 text-lg bg-[#ff4f4f] hover:bg-[#ff4f4f]/90 text-white"
            >
              Calendar
            </Button>
          </Link>

          <Link href="/settings">
            <Button 
              className="w-full h-12 px-8 text-lg bg-[#ff4f4f] hover:bg-[#ff4f4f]/90 text-white"
            >
              Settings
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}