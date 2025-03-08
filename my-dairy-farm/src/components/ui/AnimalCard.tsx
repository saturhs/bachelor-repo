import { Animal } from "@/types/animal";
import { format, differenceInYears, differenceInMonths, addDays } from "date-fns";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface AnimalCardProps {
  animal: Animal;
}

export function AnimalCard({ animal }: AnimalCardProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  
  // Calculate age from birthDate
  const calculateAge = (birthDate: Date) => {
    const birthDateObj = new Date(birthDate);
    const years = differenceInYears(new Date(), birthDateObj);
    const months = differenceInMonths(new Date(), birthDateObj) % 12;
    
    if (years === 0) {
      return `${months} months`;
    } else if (months === 0) {
      return `${years} years`;
    } else {
      return `${years} years, ${months} months`;
    }
  };
  
  // Format the dates
  const birthDate = animal.birthDate ? format(new Date(animal.birthDate), 'dd/MM/yyyy') : 'N/A';
  const age = animal.birthDate ? calculateAge(new Date(animal.birthDate)) : 'N/A';
  const lastHealthCheck = animal.lastHealthCheckDate 
    ? format(new Date(animal.lastHealthCheckDate), 'dd/MM/yyyy') 
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

  // Action button handlers (implemented to call API)
  const handleHealthCheckDone = async () => {
    setIsActionLoading(true);
    setActionError(null);
    setActionSuccess(null);
    
    try {
      const response = await fetch(`/api/animal-events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          animalId: animal.id,
          action: 'health-check',
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to record health check');
      }
      
      const data = await response.json();
      setActionSuccess('Health check recorded successfully. Next check scheduled.');
      
      // Refresh the animal data or update it locally
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error: any) {
      console.error('Error recording health check:', error);
      setActionError(error.message || 'Failed to record health check');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleHeatSymptoms = async () => {
    setIsActionLoading(true);
    setActionError(null);
    setActionSuccess(null);
    
    try {
      const response = await fetch(`/api/animal-events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          animalId: animal.id,
          action: 'heat-symptoms',
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to record heat symptoms');
      }
      
      const data = await response.json();
      setActionSuccess('Heat symptoms recorded. Insemination has been scheduled.');
      
      // Refresh the animal data or update it locally
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error: any) {
      console.error('Error recording heat symptoms:', error);
      setActionError(error.message || 'Failed to record heat symptoms');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleInseminationDone = async () => {
    setIsActionLoading(true);
    setActionError(null);
    setActionSuccess(null);
    
    try {
      const response = await fetch(`/api/animal-events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          animalId: animal.id,
          action: 'insemination',
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to record insemination');
      }
      
      const data = await response.json();
      setActionSuccess('Insemination recorded. Pregnancy check has been scheduled.');
      
      // Refresh the animal data or update it locally
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error: any) {
      console.error('Error recording insemination:', error);
      setActionError(error.message || 'Failed to record insemination');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handlePregnancyConfirmed = async () => {
    setIsActionLoading(true);
    setActionError(null);
    setActionSuccess(null);
    
    try {
      const response = await fetch(`/api/animal-events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          animalId: animal.id,
          action: 'pregnancy-confirmed',
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to confirm pregnancy');
      }
      
      const data = await response.json();
      setActionSuccess('Pregnancy confirmed. Dry-off and expected calving have been scheduled.');
      
      // Refresh the animal data or update it locally
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error: any) {
      console.error('Error confirming pregnancy:', error);
      setActionError(error.message || 'Failed to confirm pregnancy');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleNotPregnant = async () => {
    setIsActionLoading(true);
    setActionError(null);
    setActionSuccess(null);
    
    try {
      const response = await fetch(`/api/animal-events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          animalId: animal.id,
          action: 'not-pregnant',
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to record not pregnant status');
      }
      
      const data = await response.json();
      setActionSuccess('Animal marked as not pregnant and status updated to open.');
      
      // Refresh the animal data or update it locally
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error: any) {
      console.error('Error recording not pregnant status:', error);
      setActionError(error.message || 'Failed to record not pregnant status');
    } finally {
      setIsActionLoading(false);
    }
  };

  // Determine which buttons to show based on animal status
  const showHeatButton = animal.gender === 'female' && 
    (animal.reproductiveStatus === 'open' || animal.reproductiveStatus === 'not bred');
  
  const showInseminationButton = animal.gender === 'female' && 
    animal.lastHeatDay && 
    animal.reproductiveStatus === 'open';
  
  const showPregnancyCheckButtons = animal.gender === 'female' && 
    animal.reproductiveStatus === 'bred';

  return (
    <>
      <div 
        className="bg-white/80 backdrop-blur-sm shadow-sm p-6 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
        onClick={() => setIsDetailsOpen(true)}
      >
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-bold">Tag: {animal.tag}</h3>
          <span className={`px-2 py-1 text-sm rounded-full ${
            animal.reproductiveStatus === 'open' ? 'bg-blue-100 text-blue-800' : 
            animal.reproductiveStatus === 'bred' ? 'bg-yellow-100 text-yellow-800' :
            animal.reproductiveStatus === 'confirmed pregnant' ? 'bg-green-100 text-green-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {animal.reproductiveStatus}
          </span>
        </div>
        <div className="mt-4 space-y-2">
          <p><span className="font-medium">Age:</span> {age}</p>
          <p><span className="font-medium">Breed:</span> {animal.breed || 'Unknown'}</p>
          <p><span className="font-medium">BCS:</span> {animal.currentBCS || 'Not recorded'}</p>
          <p><span className="font-medium">Last Health Check:</span> {lastHealthCheck}</p>
        </div>
        <div className="mt-6 flex justify-end space-x-2">
          <button 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={(e) => {
              e.stopPropagation(); // Prevent opening the details dialog
            }}
          >
            Edit
          </button>
          <button 
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            onClick={(e) => {
              e.stopPropagation(); // Prevent opening the details dialog
              setIsDeleteDialogOpen(true);
            }}
          >
            Delete
          </button>
        </div>
      </div>
      
      {/* Details dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Animal Details: {animal.tag}</DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-500">General Information</h4>
                <p><span className="font-medium">Tag:</span> {animal.tag}</p>
                <p><span className="font-medium">Gender:</span> {animal.gender}</p>
                <p><span className="font-medium">Birth Date:</span> {birthDate}</p>
                <p><span className="font-medium">Age:</span> {age}</p>
                <p><span className="font-medium">Category:</span> {animal.category}</p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-500">Physical Information</h4>
                <p><span className="font-medium">Breed:</span> {animal.breed || 'Not recorded'}</p>
                <p><span className="font-medium">BCS:</span> {animal.currentBCS || 'Not recorded'}</p>
                <p><span className="font-medium">Weight:</span> {animal.currentWeight ? `${animal.currentWeight} kg` : 'Not recorded'}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-500">Reproductive Information</h4>
                <p><span className="font-medium">Reproductive Status:</span> {animal.reproductiveStatus}</p>
                <p><span className="font-medium">Lactation Status:</span> {animal.lactationStatus}</p>
                <p><span className="font-medium">Last Heat Day:</span> {animal.lastHeatDay ? format(new Date(animal.lastHeatDay), 'dd/MM/yyyy') : 'Not recorded'}</p>
                <p><span className="font-medium">Last Insemination:</span> {animal.lastInseminationDate ? format(new Date(animal.lastInseminationDate), 'dd/MM/yyyy') : 'Not recorded'}</p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-500">Management Information</h4>
                <p><span className="font-medium">Location:</span> {animal.location || 'Not assigned'}</p>
                <p><span className="font-medium">Acquisition Type:</span> {animal.acquisitionType || 'Not recorded'}</p>
                <p><span className="font-medium">Last Health Check:</span> {lastHealthCheck}</p>
              </div>
            </div>
          </div>
          
          {animal.notes && (
            <div className="border-t pt-4">
              <h4 className="font-medium text-gray-500">Notes</h4>
              <p className="text-sm">{animal.notes}</p>
            </div>
          )}
          
          {/* Animal actions section */}
          <div className="border-t pt-4">
            <h4 className="font-medium text-gray-500 mb-3">Actions</h4>
            
            {/* Action feedback messages */}
            {actionSuccess && (
              <div className="mb-3 p-2 bg-green-100 text-green-800 rounded text-sm">
                {actionSuccess}
              </div>
            )}
            
            {actionError && (
              <div className="mb-3 p-2 bg-red-100 text-red-800 rounded text-sm">
                {actionError}
              </div>
            )}
            
            <div className="space-y-3">
              {/* Health check button - always visible */}
              <div>
                <Button 
                  onClick={handleHealthCheckDone}
                  className="w-full bg-green-600 hover:bg-green-700"
                  disabled={isActionLoading}
                >
                  {isActionLoading ? 'Processing...' : 'Health Check Done'}
                </Button>
                <p className="text-xs text-gray-500 mt-1">
                  Mark health check as completed and schedule next one in 2 weeks
                </p>
              </div>
              
              {/* Heat symptoms button - only for females that aren't bred or pregnant */}
              {showHeatButton && (
                <div>
                  <Button 
                    onClick={handleHeatSymptoms}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    disabled={isActionLoading}
                  >
                    {isActionLoading ? 'Processing...' : 'Note Heat Symptoms'}
                  </Button>
                  <p className="text-xs text-gray-500 mt-1">
                    Record heat observation and set a reminder for insemination in 12 hours
                  </p>
                </div>
              )}
              
              {/* Insemination button - only for females in heat */}
              {showInseminationButton && (
                <div>
                  <Button 
                    onClick={handleInseminationDone}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                    disabled={isActionLoading}
                  >
                    {isActionLoading ? 'Processing...' : 'Insemination Done'}
                  </Button>
                  <p className="text-xs text-gray-500 mt-1">
                    Record insemination and set a reminder for pregnancy check in 30 days
                  </p>
                </div>
              )}
              
              {/* Pregnancy check buttons - only for females that have been inseminated */}
              {showPregnancyCheckButtons && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Pregnancy Check Result:</p>
                  <div className="grid grid-cols-2 gap-3">
                    <Button 
                      onClick={handlePregnancyConfirmed}
                      className="bg-green-600 hover:bg-green-700"
                      disabled={isActionLoading}
                    >
                      {isActionLoading ? 'Processing...' : 'Pregnancy Confirmed'}
                    </Button>
                    <Button 
                      onClick={handleNotPregnant}
                      className="bg-red-600 hover:bg-red-700"
                      disabled={isActionLoading}
                    >
                      {isActionLoading ? 'Processing...' : 'Not Pregnant'}
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">
                    Record pregnancy check result and update animal status
                  </p>
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button onClick={() => setIsDetailsOpen(false)} variant="outline">Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete confirmation dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will permanently delete animal with tag {animal.tag} from your records.
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