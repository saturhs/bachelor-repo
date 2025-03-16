import { Animal } from "@/types/animal";
import { format, differenceInYears, differenceInMonths, addDays } from "date-fns";
import { useState, useEffect } from "react";
import { CustomEventType } from "@/types/customEventType";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  const [isInseminationDialogOpen, setIsInseminationDialogOpen] = useState(false);
  const [inseminationData, setInseminationData] = useState({
    bullTag: "",
    semenSerialNumber: "",
    producer: "",
    notes: ""
  });
  const [actionCompleted, setActionCompleted] = useState(false);
  const [isCustomEventDialogOpen, setIsCustomEventDialogOpen] = useState(false);
  const [customEventTypes, setCustomEventTypes] = useState<CustomEventType[]>([]);
  const [loadingCustomEvents, setLoadingCustomEvents] = useState(false);
  const [selectedCustomEvent, setSelectedCustomEvent] = useState<string | null>(null);
  const [customEventNotes, setCustomEventNotes] = useState("");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    currentBCS: animal.currentBCS || '',
    currentWeight: animal.currentWeight || '',
    notes: animal.notes || '',
    location: animal.location || '',
    tags: animal.tags ? animal.tags.join(', ') : '',
  });
  const [isEditLoading, setIsEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  
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

  // Handle closing the details dialog - add page refresh when an action was completed
  const handleCloseDetailsDialog = () => {
    setIsDetailsOpen(false);
    
    // If an action was completed, refresh the page after dialog closes
    if (actionCompleted) {
      window.location.reload();
    }
  };

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
    setActionCompleted(false);
    
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
      setActionCompleted(true); // Mark that an action was completed
      
      // Remove the auto-refresh setTimeout
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
    setActionCompleted(false);
    
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
      setActionCompleted(true); // Mark that an action was completed
      
      // Remove the auto-refresh setTimeout
    } catch (error: any) {
      console.error('Error recording heat symptoms:', error);
      setActionError(error.message || 'Failed to record heat symptoms');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleInseminationFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsActionLoading(true);
    setActionError(null);
    setActionSuccess(null);
    setActionCompleted(false);
    
    try {
      const response = await fetch(`/api/animal-events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          animalId: animal.id,
          action: 'insemination',
          semenDetails: {
            bullTag: inseminationData.bullTag,
            serialNumber: inseminationData.semenSerialNumber,
            producer: inseminationData.producer
          },
          notes: inseminationData.notes
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to record insemination');
      }
      
      const data = await response.json();
      setActionSuccess('Insemination recorded. Pregnancy check has been scheduled.');
      setActionCompleted(true); // Mark that an action was completed
      
      // Close the insemination dialog
      setIsInseminationDialogOpen(false);
      
      // Reset the form
      setInseminationData({
        bullTag: "",
        semenSerialNumber: "",
        producer: "",
        notes: ""
      });
      
      // Remove the auto-refresh setTimeout
    } catch (error: any) {
      console.error('Error recording insemination:', error);
      setActionError(error.message || 'Failed to record insemination');
    } finally {
      setIsActionLoading(false);
    }
  };
  
  const handleInseminationInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setInseminationData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePregnancyConfirmed = async () => {
    setIsActionLoading(true);
    setActionError(null);
    setActionSuccess(null);
    setActionCompleted(false);
    
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
      setActionCompleted(true); // Mark that an action was completed
      
      // Remove the auto-refresh setTimeout
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
    setActionCompleted(false);
    
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
      setActionCompleted(true); // Mark that an action was completed
      
      // Remove the auto-refresh setTimeout
    } catch (error: any) {
      console.error('Error recording not pregnant status:', error);
      setActionError(error.message || 'Failed to record not pregnant status');
    } finally {
      setIsActionLoading(false);
    }
  };

  // Add new action handlers for dry-off and calving
  const handleDryOffCompleted = async () => {
    setIsActionLoading(true);
    setActionError(null);
    setActionSuccess(null);
    setActionCompleted(false);
    
    try {
      const response = await fetch(`/api/animal-events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          animalId: animal.id,
          action: 'dry-off-completed',
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to record dry-off');
      }
      
      const data = await response.json();
      setActionSuccess('Dry-off completed. Animal status updated to dry.');
      setActionCompleted(true);
    } catch (error: any) {
      console.error('Error recording dry-off:', error);
      setActionError(error.message || 'Failed to record dry-off');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleCalvingCompleted = async () => {
    setIsActionLoading(true);
    setActionError(null);
    setActionSuccess(null);
    setActionCompleted(false);
    
    try {
      const response = await fetch(`/api/animal-events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          animalId: animal.id,
          action: 'calving-completed',
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to record calving');
      }
      
      const data = await response.json();
      setActionSuccess('Calving completed. Animal status reset for new breeding cycle.');
      setActionCompleted(true);
    } catch (error: any) {
      console.error('Error recording calving:', error);
      setActionError(error.message || 'Failed to record calving');
    } finally {
      setIsActionLoading(false);
    }
  };

  // Fetch custom event types that are applicable to this animal
  useEffect(() => {
    const fetchCustomEventTypes = async () => {
      try {
        setLoadingCustomEvents(true);
        const res = await fetch('/api/custom-event-types');
        
        if (!res.ok) {
          throw new Error('Failed to fetch custom event types');
        }
        
        const data = await res.json();
        
        // Filter custom events based on animal category and gender
        const animalCategory = animal.category === 'adult' 
          ? `adult ${animal.gender}` 
          : 'calf';
        
        const filteredEvents = data.filter((eventType: CustomEventType) => 
          eventType.animalCategories.includes(animalCategory as any)
        );
        
        setCustomEventTypes(filteredEvents);
      } catch (error) {
        console.error('Error fetching custom event types:', error);
      } finally {
        setLoadingCustomEvents(false);
      }
    };

    if (isCustomEventDialogOpen) {
      fetchCustomEventTypes();
    }
  }, [isCustomEventDialogOpen, animal.category, animal.gender]);

  // Handle custom event submission
  const handleCustomEventSubmit = async () => {
    if (!selectedCustomEvent) return;
    
    setIsActionLoading(true);
    setActionError(null);
    setActionSuccess(null);
    setActionCompleted(false);
    
    try {
      // Find the selected event details
      const eventType = customEventTypes.find(et => et.id === selectedCustomEvent);
      if (!eventType) throw new Error('Selected event type not found');
      
      // Create the custom event via API
      const response = await fetch('/api/custom-events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          animalId: animal.id,
          customEventTypeId: selectedCustomEvent,
          notes: customEventNotes
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to record custom event');
      }
      
      // Reset form and show success message
      setActionSuccess(`${eventType.name} recorded successfully`);
      setActionCompleted(true);
      setIsCustomEventDialogOpen(false);
      setSelectedCustomEvent(null);
      setCustomEventNotes("");
      
    } catch (error: any) {
      console.error('Error recording custom event:', error);
      setActionError(error.message || 'Failed to record custom event');
    } finally {
      setIsActionLoading(false);
    }
  };

  // Handle edit form input changes
  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle edit form submission
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditLoading(true);
    setEditError(null);
    
    try {
      // Convert form data to proper types
      const formattedData = {
        id: animal.id, // Include the animal ID in the request
        currentBCS: editFormData.currentBCS ? parseFloat(editFormData.currentBCS as string) : undefined,
        currentWeight: editFormData.currentWeight ? parseFloat(editFormData.currentWeight as string) : undefined,
        notes: editFormData.notes,
        location: editFormData.location,
        tags: editFormData.tags ? editFormData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
      };
      
      // Validate BCS
      if (formattedData.currentBCS !== undefined && 
          (formattedData.currentBCS < 1 || formattedData.currentBCS > 5 || isNaN(formattedData.currentBCS))) {
        throw new Error('Body Condition Score must be between 1 and 5');
      }
      
      // Validate weight
      if (formattedData.currentWeight !== undefined && 
          (formattedData.currentWeight <= 0 || isNaN(formattedData.currentWeight))) {
        throw new Error('Weight must be a positive number');
      }

      const response = await fetch(`/api/animals`, {
        method: 'PATCH', // Use PATCH instead of PUT
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update animal');
      }
      
      // Close dialog and refresh page to show updated data
      setIsEditDialogOpen(false);
      window.location.reload();
      
    } catch (error: any) {
      console.error('Error updating animal:', error);
      setEditError(error.message || 'Failed to update animal. Please try again.');
      setIsEditLoading(false);
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

  const showDryOffButton = animal.gender === 'female' && 
    animal.reproductiveStatus === 'confirmed pregnant';
  
  const showCalvingButton = animal.gender === 'female' && 
    (animal.reproductiveStatus === 'confirmed pregnant' || animal.reproductiveStatus === 'dry');

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
              setIsEditDialogOpen(true);
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
      <Dialog open={isDetailsOpen} onOpenChange={handleCloseDetailsDialog}>
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
                    onClick={() => setIsInseminationDialogOpen(true)}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                    disabled={isActionLoading}
                  >
                    {isActionLoading ? 'Processing...' : 'Insemination Done'}
                  </Button>
                  <p className="text-xs text-gray-500 mt-1">
                    Record insemination details and schedule pregnancy check
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

              {/* Dry off button - only for confirmed pregnant females */}
              {showDryOffButton && (
                <div>
                  <Button 
                    onClick={handleDryOffCompleted}
                    className="w-full bg-orange-600 hover:bg-orange-700"
                    disabled={isActionLoading}
                  >
                    {isActionLoading ? 'Processing...' : 'Dry Off Completed'}
                  </Button>
                  <p className="text-xs text-gray-500 mt-1">
                    Mark animal as dried off (status will change to "dry")
                  </p>
                </div>
              )}
              
              {/* Calving button - only for confirmed pregnant or dry females */}
              {showCalvingButton && (
                <div>
                  <Button 
                    onClick={handleCalvingCompleted}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                    disabled={isActionLoading}
                  >
                    {isActionLoading ? 'Processing...' : 'Calving Completed'}
                  </Button>
                  <p className="text-xs text-gray-500 mt-1">
                    Record calving and reset reproductive status
                  </p>
                </div>
              )}

              {/* New Custom Event Button - add this at the end of the actions section */}
              <div>
                <Button 
                  onClick={() => setIsCustomEventDialogOpen(true)}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  disabled={isActionLoading}
                >
                  <span className="mr-1 text-lg">+</span> Record Custom Event
                </Button>
                <p className="text-xs text-gray-500 mt-1">
                  Record a custom event type for this animal
                </p>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button onClick={handleCloseDetailsDialog} variant="outline">Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Insemination Form Dialog */}
      <Dialog open={isInseminationDialogOpen} onOpenChange={setIsInseminationDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Record Insemination Details</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleInseminationFormSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="bullTag">Bull Tag/ID</Label>
              <Input
                id="bullTag"
                name="bullTag"
                value={inseminationData.bullTag}
                onChange={handleInseminationInputChange}
                placeholder="Enter bull identification"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="semenSerialNumber">Semen Serial Number</Label>
              <Input
                id="semenSerialNumber"
                name="semenSerialNumber"
                value={inseminationData.semenSerialNumber}
                onChange={handleInseminationInputChange}
                placeholder="Enter serial number"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="producer">Producer/Company</Label>
              <Input
                id="producer"
                name="producer"
                value={inseminationData.producer}
                onChange={handleInseminationInputChange}
                placeholder="Enter producer name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Input
                id="notes"
                name="notes"
                value={inseminationData.notes}
                onChange={handleInseminationInputChange}
                placeholder="Additional notes about this insemination"
              />
            </div>
            
            {actionError && (
              <div className="p-2 bg-red-100 text-red-800 rounded text-sm">
                {actionError}
              </div>
            )}
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsInseminationDialogOpen(false)}
                disabled={isActionLoading}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-purple-600 hover:bg-purple-700"
                disabled={isActionLoading}
              >
                {isActionLoading ? 'Processing...' : 'Save Insemination Record'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Custom Event Dialog */}
      <Dialog open={isCustomEventDialogOpen} onOpenChange={setIsCustomEventDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Record Custom Event</DialogTitle>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            {loadingCustomEvents ? (
              <div className="text-center py-4">Loading custom event types...</div>
            ) : customEventTypes.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-sm text-gray-600">No custom event types available for this animal.</p>
                <p className="text-sm text-gray-600 mt-2">
                  You can create custom event types in Settings.
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <Label>Select Event Type *</Label>
                  <Select 
                    value={selectedCustomEvent || ""} 
                    onValueChange={setSelectedCustomEvent}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose event type" />
                    </SelectTrigger>
                    <SelectContent>
                      {customEventTypes.map(eventType => (
                        <SelectItem 
                          key={eventType.id} 
                          value={eventType.id}
                        >
                          {eventType.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="eventNotes">Notes</Label>
                  <Textarea
                    id="eventNotes"
                    value={customEventNotes}
                    onChange={(e) => setCustomEventNotes(e.target.value)}
                    placeholder="Add any additional details about this event"
                    rows={3}
                  />
                </div>
                
                {actionError && (
                  <div className="p-2 bg-red-100 text-red-800 rounded text-sm">
                    {actionError}
                  </div>
                )}
              </>
            )}
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsCustomEventDialogOpen(false)}
              disabled={isActionLoading}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCustomEventSubmit}
              className="bg-purple-600 hover:bg-purple-700"
              disabled={isActionLoading || !selectedCustomEvent || loadingCustomEvents || customEventTypes.length === 0}
            >
              {isActionLoading ? "Processing..." : "Record Event"}
            </Button>
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

      {/* Edit Animal Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Animal: {animal.tag}</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleEditSubmit} className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="currentBCS">Body Condition Score (1-5)</Label>
                <Input
                  id="currentBCS"
                  name="currentBCS"
                  value={editFormData.currentBCS}
                  onChange={handleEditInputChange}
                  placeholder="1.0 - 5.0"
                  type="number"
                  min="1"
                  max="5"
                  step="0.1"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="currentWeight">Weight (kg)</Label>
                <Input
                  id="currentWeight"
                  name="currentWeight"
                  value={editFormData.currentWeight}
                  onChange={handleEditInputChange}
                  placeholder="Enter weight in kg"
                  type="number"
                  min="1"
                  step="1"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                value={editFormData.location}
                onChange={handleEditInputChange}
                placeholder="e.g., Barn A, Pasture 2"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <Input
                id="tags"
                name="tags"
                value={editFormData.tags}
                onChange={handleEditInputChange}
                placeholder="e.g., first-lactation, purchased, premium"
              />
              <p className="text-xs text-gray-500">Separate multiple tags with commas</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                value={editFormData.notes}
                onChange={handleEditInputChange}
                placeholder="Additional information about this animal"
                rows={3}
              />
            </div>
            
            {editError && (
              <div className="p-2 bg-red-100 text-red-800 rounded text-sm">
                {editError}
              </div>
            )}
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsEditDialogOpen(false)}
                disabled={isEditLoading}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-blue-600 hover:bg-blue-700"
                disabled={isEditLoading}
              >
                {isEditLoading ? 'Updating...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}