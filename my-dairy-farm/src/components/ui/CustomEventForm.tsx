"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

export function CustomEventForm({ onEventAdded }: { onEventAdded: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    defaultPriority: "Medium",
    reminderTime: {
      value: 1,
      unit: "month" // Default to month since most farm schedules are longer term
    },
    animalCategories: [] as string[]
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryToggle = (category: string) => {
    setFormData(prev => {
      const categories = [...prev.animalCategories];
      
      if (categories.includes(category)) {
        return {
          ...prev,
          animalCategories: categories.filter(c => c !== category)
        };
      } else {
        return {
          ...prev,
          animalCategories: [...categories, category]
        };
      }
    });
  };

  const handleReminderChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      reminderTime: {
        ...prev.reminderTime,
        [field]: field === "value" ? Number(value) : value
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Validate at least one category is selected
    if (formData.animalCategories.length === 0) {
      setError("Please select at least one animal category");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/custom-event-types", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add custom event type');
      }

      // Reset form and close dialog
      setFormData({
        name: "",
        description: "",
        defaultPriority: "Medium",
        reminderTime: {
          value: 1,
          unit: "month"
        },
        animalCategories: []
      });
      
      setIsOpen(false);
      onEventAdded(); // Callback to refresh the list
    } catch (error: any) {
      console.error("Error adding custom event type:", error);
      setError(error.message || 'Failed to add custom event type. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#ff4f4f] hover:bg-[#ff4f4f]/90 text-white">
          Add Custom Event Type
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Custom Event Type</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Event Name *</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="e.g., Vaccination, Hoof Trimming, etc."
              maxLength={100}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Brief description of this event type"
              maxLength={500}
              rows={3}
            />
            <p className="text-xs text-gray-500 text-right">{formData.description.length}/500</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="defaultPriority">Default Priority *</Label>
            <Select 
              name="defaultPriority" 
              value={formData.defaultPriority} 
              onValueChange={(value) => handleSelectChange("defaultPriority", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Schedule Next Event After *</Label>
            <div className="flex gap-2">
              <Input
                type="number"
                min="1"
                value={formData.reminderTime.value}
                onChange={(e) => handleReminderChange("value", e.target.value)}
                className="w-24"
              />
              
              <Select 
                value={formData.reminderTime.unit} 
                onValueChange={(value) => handleReminderChange("unit", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hour">Hour(s)</SelectItem>
                  <SelectItem value="day">Day(s)</SelectItem>
                  <SelectItem value="week">Week(s)</SelectItem>
                  <SelectItem value="month">Month(s)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <p className="text-xs text-gray-500">How long before the next event is scheduled</p>
          </div>
          
          <div className="space-y-3">
            <Label>Applicable Animal Categories *</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="adult-female" 
                  checked={formData.animalCategories.includes('adult female')}
                  onCheckedChange={() => handleCategoryToggle('adult female')}
                />
                <Label htmlFor="adult-female" className="cursor-pointer">Adult Females</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="adult-male" 
                  checked={formData.animalCategories.includes('adult male')}
                  onCheckedChange={() => handleCategoryToggle('adult male')}
                />
                <Label htmlFor="adult-male" className="cursor-pointer">Adult Males</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="calf" 
                  checked={formData.animalCategories.includes('calf')}
                  onCheckedChange={() => handleCategoryToggle('calf')}
                />
                <Label htmlFor="calf" className="cursor-pointer">Calves</Label>
              </div>
            </div>
            {formData.animalCategories.length === 0 && (
              <p className="text-xs text-red-500">Please select at least one category</p>
            )}
          </div>
          
          {error && <p className="text-red-500 text-sm">{error}</p>}
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className="bg-[#ff4f4f] hover:bg-[#ff4f4f]/90 text-white"
              disabled={isSubmitting || formData.animalCategories.length === 0}
            >
              {isSubmitting ? "Adding..." : "Add Event Type"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
