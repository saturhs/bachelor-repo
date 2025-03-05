import { Animal } from "@/types/animal";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge"

interface AnimalCardProps {
  animal: Animal;
}

export function AnimalCard({ animal }: AnimalCardProps) {
  // Print detailed info about the animal object
  console.log("Animal in card:", JSON.stringify(animal, null, 2));

  // Format the dates
  const birthDate = animal.birthDate ? format(new Date(animal.birthDate), 'dd/MM/yyyy') : 'N/A';
  const lastExamination = animal.lastExamination 
    ? format(new Date(animal.lastExamination), 'dd/MM/yyyy') 
    : 'Never';
    
  // Debug log to check the animal object
  console.log("Animal object in card:", animal);
  
  // Use more verbose location logic with detailed logging
  let location = 'Not assigned';
  if (animal.object_id) {
    location = animal.object_id;
    console.log(`Found object_id: ${animal.object_id}`);
  } else if ((animal as any).location) {
    location = (animal as any).location;
    console.log(`Found location: ${(animal as any).location}`);
  } else {
    console.log("No location or object_id found", animal);
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm shadow-sm p-6 rounded-lg hover:bg-gray-50 transition-colors">
      <div className="flex justify-between items-start">
        <h3 className="text-xl font-bold">{animal.name}</h3>
        <span className={`px-2 py-1 text-sm rounded-full ${
          animal.status === 'healthy' ? 'bg-green-100 text-green-800' : 
          animal.status === 'examination needed' ? 'bg-yellow-100 text-yellow-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {animal.status}
        </span>
      </div>
      <div className="mt-4 space-y-2">
        <p><span className="font-medium">ID Tag:</span> {animal.tag}</p>
        <p><span className="font-medium">Gender:</span> {animal.gender}</p>
        <p><span className="font-medium">Birth Date:</span> {birthDate}</p>
        <p><span className="font-medium">Last Examination:</span> {lastExamination}</p>
        <p><span className="font-medium">Building/Object:</span> {location}</p>
      </div>
      <div className="mt-6 flex justify-end space-x-2">
        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Edit
        </button>
        <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
          Delete
        </button>
      </div>
    </div>
  );
}