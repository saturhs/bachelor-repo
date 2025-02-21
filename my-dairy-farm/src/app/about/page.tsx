import { Navbar } from "@/components/ui/Navbar";
import { GoBack } from "@/components/ui/Goback";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#faf9f6] relative">
      <Navbar />
      <GoBack />
      <div className="flex flex-col items-center justify-start pt-8">
        <h1 className="text-5xl font-bold mb-8">About</h1>
        <div className="w-[95%] md:w-[80%] lg:w-[60%] max-w-2xl mx-auto">
          {/* About content will go here */}
        </div>
      </div>
    </main>
  );
}