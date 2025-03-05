import { Animal } from "@/types/animal";
import { format } from "date-fns";
import { useState } from "react";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface AnimalCardProps {
  animal: Animal;
}

export function AnimalCard({ animal }: AnimalCardProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Format the dates
  const birthDate = animal.birthDate ? format(new Date(animal.birthDate), 'dd/MM/yyyy') : 'N/A';
  const lastExamination = animal.lastExamination 
    ? format(new Date(animal.lastExamination), 'dd/MM/yyyy') 
    : 'Never';

  // Delete animal handler
  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/animals?id=${animal.id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete animal');
      }
      
      // Refresh page to update the list
      window.location.reload();
      
    } catch (error: any) {
      console.error('Error deleting animal:', error);
      setError(error.message || 'Failed to delete animal. Please try again.');
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <>
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
          <p><span className="font-medium">Building/Location:</span> {animal.location || 'Not assigned'}</p>
        </div>
        <div className="mt-6 flex justify-end space-x-2">
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Edit
          </button>
          <button 
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            Delete
          </button>
        </div>
      </div>
      
      {/* Delete confirmation dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will permanently delete {animal.name} (Tag: {animal.tag}) from your records.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}