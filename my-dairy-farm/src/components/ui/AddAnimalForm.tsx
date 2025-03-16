"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function AddAnimalForm() {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("general")

  const [formData, setFormData] = useState({
    tag: "",
    gender: "female",
    birthDate: "",
    breed: "",
    acquisitionDate: "",
    acquisitionType: "born on farm",
    mothersTag: "",
    fathersTag: "",
    currentBCS: "",
    currentWeight: "",
    lastHealthCheckDate: "",
    lastHeatDay: "",
    lastInseminationDate: "",
    reproductiveStatus: "not bred",
    notes: "",
    location: "",
    category: "adult"
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch("/api/animals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add animal');
      }

      // Reset form and close dialog
      setFormData({
        tag: "",
        gender: "female",
        birthDate: "",
        breed: "",
        acquisitionDate: "",
        acquisitionType: "born on farm",
        mothersTag: "",
        fathersTag: "",
        currentBCS: "",
        currentWeight: "",
        lastHealthCheckDate: "",
        lastHeatDay: "",
        lastInseminationDate: "",
        reproductiveStatus: "not bred",
        notes: "",
        location: "",
        category: "adult"
      })
      setIsOpen(false)
      
      // Refresh the page
      window.location.reload()
    } catch (error: any) {
      console.error("Error adding animal:", error)
      setError(error.message || 'Failed to add animal. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="h-10 px-4 bg-[#ff4f4f] hover:bg-[#ff4f4f]/90 text-white w-full">
          Add New Animal
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Animal</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="physical">Physical</TabsTrigger>
            <TabsTrigger value="reproductive">Reproductive</TabsTrigger>
          </TabsList>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <TabsContent value="general" className="space-y-4">
              {/* General tab content */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tag">ID Tag *</Label>
                  <Input
                    id="tag"
                    name="tag"
                    value={formData.tag}
                    onChange={handleChange}
                    required
                    placeholder="e.g., PL123456789012"
                  />
                  <p className="text-xs text-gray-500">Format: 2 uppercase letters + 12 digits</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender *</Label>
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
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
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
                      <SelectItem value="calf">Calf</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="birthDate">Birth Date *</Label>
                  <Input
                    id="birthDate"
                    name="birthDate"
                    type="date"
                    value={formData.birthDate}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="acquisitionType">Acquisition Type</Label>
                  <Select 
                    name="acquisitionType" 
                    value={formData.acquisitionType} 
                    onValueChange={(value) => handleSelectChange("acquisitionType", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="born on farm">Born on farm</SelectItem>
                      <SelectItem value="purchased">Purchased</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="acquisitionDate">Acquisition Date</Label>
                  <Input
                    id="acquisitionDate"
                    name="acquisitionDate"
                    type="date"
                    value={formData.acquisitionDate}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Building/Location</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g., Barn A, Stall 5, etc."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="mothersTag">Mother's Tag</Label>
                  <Input
                    id="mothersTag"
                    name="mothersTag"
                    value={formData.mothersTag}
                    onChange={handleChange}
                    placeholder="e.g., PL987654321098"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fathersTag">Father's Tag</Label>
                  <Input
                    id="fathersTag"
                    name="fathersTag"
                    value={formData.fathersTag}
                    onChange={handleChange}
                    placeholder="e.g., PL876543210987"
                  />
                </div>
              </div>

              <div className="mt-2 flex justify-between">
                <div></div>
                <Button 
                  type="button"
                  onClick={() => setActiveTab("physical")}
                >
                  Next
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="physical" className="space-y-4">
              {/* Physical tab content */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="breed">Breed</Label>
                  <Input
                    id="breed"
                    name="breed"
                    value={formData.breed}
                    onChange={handleChange}
                    placeholder="e.g., Holstein"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currentBCS">Body Condition Score (1-5)</Label>
                  <Input
                    id="currentBCS"
                    name="currentBCS"
                    type="number"
                    min="1"
                    max="5"
                    step="0.1"
                    value={formData.currentBCS}
                    onChange={handleChange}
                    placeholder="e.g., 3.5"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currentWeight">Weight (kg)</Label>
                  <Input
                    id="currentWeight"
                    name="currentWeight"
                    type="number"
                    min="0"
                    value={formData.currentWeight}
                    onChange={handleChange}
                    placeholder="e.g., 650"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastHealthCheckDate">Last Health Check Date</Label>
                  <Input
                    id="lastHealthCheckDate"
                    name="lastHealthCheckDate"
                    type="date"
                    value={formData.lastHealthCheckDate}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Additional information about the animal..."
                  rows={3}
                />
              </div>

              <div className="mt-2 flex justify-between">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setActiveTab("general")}
                >
                  Previous
                </Button>
                <Button 
                  type="button"
                  onClick={() => setActiveTab("reproductive")}
                >
                  Next
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="reproductive" className="space-y-4">
              {/* Reproductive tab content */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="reproductiveStatus">Reproductive Status</Label>
                  <Select 
                    name="reproductiveStatus" 
                    value={formData.reproductiveStatus} 
                    onValueChange={(value) => handleSelectChange("reproductiveStatus", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="not bred">Not Bred</SelectItem>
                      <SelectItem value="bred">Bred</SelectItem>
                      <SelectItem value="confirmed pregnant">Confirmed Pregnant</SelectItem>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="dry">Dry</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastHeatDay">Last Heat Date</Label>
                  <Input
                    id="lastHeatDay"
                    name="lastHeatDay"
                    type="date"
                    value={formData.lastHeatDay}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="lastInseminationDate">Last Insemination Date</Label>
                  <Input
                    id="lastInseminationDate"
                    name="lastInseminationDate"
                    type="date"
                    value={formData.lastInseminationDate}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  {/* Empty div to maintain grid layout */}
                </div>
              </div>

              <div className="mt-2 flex justify-between">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setActiveTab("physical")}
                >
                  Previous
                </Button>
                {error && <p className="text-red-500 text-sm self-center">{error}</p>}
                <Button 
                  type="submit"
                  className="bg-[#ff4f4f] hover:bg-[#ff4f4f]/90 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Adding..." : "Add Animal"}
                </Button>
              </div>
            </TabsContent>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
