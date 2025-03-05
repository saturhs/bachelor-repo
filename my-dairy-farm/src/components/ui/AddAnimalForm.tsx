"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"

export function AddAnimalForm() {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const [formData, setFormData] = useState({
    name: "",
    tag: "",
    gender: "female",
    category: "adult",
    birthDate: "",
    status: "healthy",
    object_id: ""
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    // Create a payload for logging purposes
    const locationValue = formData.object_id;
    console.log("Location value before submission:", locationValue);
    
    // Create explicit payload with careful handling of object_id
    const payload = {
      name: formData.name.trim(),
      tag: formData.tag.trim(),
      gender: formData.gender,
      category: formData.category,
      birthDate: formData.birthDate,
      status: formData.status,
      // Ensure object_id is explicitly set and trimmed
      object_id: locationValue ? locationValue.trim() : ""
    };
    
    console.log("Final payload:", payload);

    try {
      // Send the request
      const response = await fetch("/api/animals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();
      console.log("Response data:", JSON.stringify(responseData, null, 2));

      if (!response.ok) {
        throw new Error(JSON.stringify(responseData));
      }

      // Reset form and close dialog
      setFormData({
        name: "",
        tag: "",
        gender: "female",
        category: "adult",
        birthDate: "",
        status: "healthy",
        object_id: ""
      });
      setIsOpen(false);
      
      // Force reload the page to get fresh data
      window.location.reload();
    } catch (error) {
      console.error("Error adding animal:", error);
      setError("Failed to add animal. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="h-12 px-8 text-lg bg-[#ff4f4f] hover:bg-[#ff4f4f]/90 text-white">
          Add New Animal
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Animal</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tag">ID Tag</Label>
              <Input
                id="tag"
                name="tag"
                value={formData.tag}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select 
                name="gender" 
                value={formData.gender} 
                onValueChange={(value) => handleSelectChange("gender", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="male">Male</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select 
                name="category" 
                value={formData.category} 
                onValueChange={(value) => handleSelectChange("category", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="adult">Adult</SelectItem>
                  <SelectItem value="baby">Calf</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="birthDate">Birth Date</Label>
            <Input
              id="birthDate"
              name="birthDate"
              type="date"
              value={formData.birthDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select 
              name="status" 
              value={formData.status} 
              onValueChange={(value) => handleSelectChange("status", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="healthy">Healthy</SelectItem>
                <SelectItem value="examination needed">Examination Needed</SelectItem>
                <SelectItem value="pregnant">Pregnant</SelectItem>
                <SelectItem value="sick">Sick</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="object_id">Building/Location</Label>
            <Input
              id="object_id"
              name="object_id"
              value={formData.object_id}
              onChange={handleChange}
              placeholder="e.g., Barn 1, Stall 5, etc."
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex justify-end gap-2">
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
              disabled={isSubmitting}
            >
              {isSubmitting ? "Adding..." : "Add Animal"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
