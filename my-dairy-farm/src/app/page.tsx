import { Navbar } from "@/components/ui/Navbar";
import { Hero } from "@/components/ui/Hero";
import { StatsContainer } from "@/components/ui/StatsContainer";


export default function Home() {
  console.log("Home component is rendering and GitHub also works ehe jebać żydów.");
  return (
    <main className="min-h-screen bg-[#faf9f6] relative flex flex-col justify-between">
      <Navbar />
      <div className="flex flex-col items-center justify-center flex-grow w-[80%] max-w-sm mx-auto">
        <Hero />
      </div>
      <StatsContainer />
    </main>
  );
}