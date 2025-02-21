import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  import { Badge } from "@/components/ui/badge"
  
  interface Animal {
    id: string
    name: string
    tag: string
    gender: string
    birthDate: Date
    status: string
  }
  
  interface AnimalCardProps {
    animal: Animal
  }
  
  export function AnimalCard({ animal }: AnimalCardProps) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm hover:bg-gray-50 transition-colors">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{animal.name}</CardTitle>
              <CardDescription>Tag: {animal.tag}</CardDescription>
            </div>
            <Badge 
              variant={animal.status === "healthy" ? "default" : "destructive"}
            >
              {animal.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            <p className="text-sm text-gray-600">Gender: {animal.gender}</p>
            <p className="text-sm text-gray-600">
              Birth Date: {animal.birthDate.toLocaleDateString()}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }