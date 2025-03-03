import { Navbar } from "@/components/ui/Navbar";
import { GoBack } from "@/components/ui/Goback";
import { AnimalCard } from "@/components/ui/AnimalCard";

// Temporary mock data until we have database
const mockAnimals = [
  {
    id: "1",
    name: "Bessie",
    tag: "TAG001",
    gender: "female",
    birthDate: new Date("2022-01-01"),
    status: "healthy"
  },
  {
    id: "2",
    name: "Daisy",
    tag: "TAG002",
    gender: "female",
    birthDate: new Date("2021-06-15"),
    status: "examination needed"
  },
  {
    id: "3",
    name: "Daisy",
    tag: "TAG002",
    gender: "female",
    birthDate: new Date("2021-06-15"),
    status: "examination needed"
  }
];

export default function AnimalsPage() {
  return (
    <main className="min-h-screen bg-[#faf9f6] relative">
      <Navbar />
      <GoBack />
      <div className="flex flex-col items-center justify-start pt-8">
        <h1 className="text-5xl font-bold mb-8">Animals</h1>
        <div className="w-[95%] md:w-[80%] lg:w-[60%] max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockAnimals.map((animal) => (
            <AnimalCard key={animal.id} animal={animal} />
          ))}
        </div>
      </div>
    </main>
  );
}