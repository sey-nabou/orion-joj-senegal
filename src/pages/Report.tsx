import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Camera, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button-variants";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import mapDakar from "@/assets/map-dakar.jpg";

const Report = () => {
  const navigate = useNavigate();
  const [incidentType, setIncidentType] = useState("");
  const [urgency, setUrgency] = useState("non-urgent");
  const [location, setLocation] = useState("Stade Léopold Sédar Senghor - Dakar");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!incidentType || !description) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    // Simulate submission
    const reportData = {
      id: Math.random().toString(36).substr(2, 9),
      type: incidentType,
      urgency,
      location,
      description,
      timestamp: new Date().toISOString(),
      status: "En attente",
      photo: photo?.name,
    };

    // Store in localStorage
    const existingReports = JSON.parse(localStorage.getItem("orion-reports") || "[]");
    localStorage.setItem("orion-reports", JSON.stringify([reportData, ...existingReports]));

    navigate("/confirmation");
  };

  return (
    <div className="min-h-screen bg-orion-gray-light">
      {/* Header */}
      <header className="gradient-primary text-white p-4 shadow-elegant sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-xl font-bold">Signaler un incident</h1>
        </div>
      </header>

      {/* Form */}
      <main className="p-6 pb-20">
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
          {/* Incident Type */}
          <div className="space-y-2 animate-slide-up">
            <Label htmlFor="incident-type" className="text-base font-semibold text-foreground">
              Type d'incident *
            </Label>
            <Select value={incidentType} onValueChange={setIncidentType}>
              <SelectTrigger id="incident-type" className="h-12 rounded-xl bg-white">
                <SelectValue placeholder="Sélectionner le type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="securite">🔒 Sécurité</SelectItem>
                <SelectItem value="medical">🏥 Médical</SelectItem>
                <SelectItem value="technique">🔧 Technique / Logistique</SelectItem>
                <SelectItem value="autre">📋 Autre</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Urgency Level */}
          <div className="space-y-3 animate-slide-up" style={{ animationDelay: "0.1s" }}>
            <Label className="text-base font-semibold text-foreground">
              Niveau d'urgence *
            </Label>
            <RadioGroup value={urgency} onValueChange={setUrgency}>
              <div className="flex items-center space-x-3 p-4 rounded-xl bg-white border-2 border-transparent hover:border-orion-orange transition-colors cursor-pointer">
                <RadioGroupItem value="urgent" id="urgent" />
                <Label htmlFor="urgent" className="flex-1 cursor-pointer font-medium">
                  🔴 Urgent
                </Label>
              </div>
              <div className="flex items-center space-x-3 p-4 rounded-xl bg-white border-2 border-transparent hover:border-primary transition-colors cursor-pointer">
                <RadioGroupItem value="non-urgent" id="non-urgent" />
                <Label htmlFor="non-urgent" className="flex-1 cursor-pointer font-medium">
                  🟡 Non urgent
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Location */}
          <div className="space-y-2 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <Label htmlFor="location" className="text-base font-semibold text-foreground">
              Localisation
            </Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="h-12 pl-10 rounded-xl bg-white"
                placeholder="Entrer l'adresse"
              />
            </div>
            
            {/* Map Preview */}
            <div className="mt-3 rounded-xl overflow-hidden shadow-card">
              <img 
                src={mapDakar} 
                alt="Carte de localisation" 
                className="w-full h-48 object-cover"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2 animate-slide-up" style={{ animationDelay: "0.3s" }}>
            <Label htmlFor="description" className="text-base font-semibold text-foreground">
              Description du problème *
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-32 rounded-xl bg-white resize-none"
              placeholder="Décrivez l'incident en détail..."
            />
          </div>

          {/* Photo Upload */}
          <div className="space-y-2 animate-slide-up" style={{ animationDelay: "0.4s" }}>
            <Label htmlFor="photo" className="text-base font-semibold text-foreground">
              Ajouter une photo (optionnel)
            </Label>
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1 h-12 rounded-xl"
                onClick={() => document.getElementById('photo')?.click()}
              >
                <Camera className="w-5 h-5 mr-2" />
                {photo ? photo.name : "Choisir une photo"}
              </Button>
              <input
                id="photo"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setPhoto(e.target.files?.[0] || null)}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 animate-slide-up" style={{ animationDelay: "0.5s" }}>
            <Button
              type="submit"
              className={buttonVariants({ variant: "hero", size: "lg" })}
            >
              <AlertCircle className="w-5 h-5" />
              Envoyer le signalement
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default Report;
