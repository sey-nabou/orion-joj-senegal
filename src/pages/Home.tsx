import { useNavigate } from "react-router-dom";
import { AlertCircle, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button-variants";
import orionLogo from "@/assets/orion-logo.png";
import heroBackground from "@/assets/hero-background.jpg";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background with gradient overlay */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${heroBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 gradient-hero opacity-90" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col">
        {/* Header */}
        <header className="p-4 flex justify-end">
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
            <User className="w-5 h-5 text-white" />
            <span className="text-white font-medium text-sm">Fatou Ba</span>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex flex-col items-center justify-center px-6 pb-20">
          <div className="w-full max-w-md space-y-8 animate-fade-in">
            {/* Logo */}
            <div className="flex justify-center">
              <img 
                src={orionLogo} 
                alt="ORION Logo" 
                className="w-32 h-32 drop-shadow-2xl"
              />
            </div>

            {/* Title and Slogan */}
            <div className="text-center space-y-3">
              <h1 className="text-5xl font-inter font-extrabold text-white tracking-tight">
                ORION
              </h1>
              <p className="text-xl text-white/90 font-medium">
                Signalez. Protégez. Coordonnez.
              </p>
              <p className="text-sm text-white/70 max-w-xs mx-auto">
                Jeux Olympiques de la Jeunesse 2026 - Sénégal
              </p>
            </div>

            {/* Main CTA Button */}
            <div className="pt-8">
              <Button
                onClick={() => navigate("/report")}
                className={buttonVariants({ variant: "alert", size: "lg" })}
                size="lg"
              >
                <AlertCircle className="w-6 h-6" />
                Signaler un incident
              </Button>
            </div>

            {/* Secondary Button */}
            <div className="flex justify-center">
              <Button
                onClick={() => navigate("/history")}
                variant="ghost"
                className="text-white hover:bg-white/20"
              >
                Voir mes signalements
              </Button>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="p-6 text-center">
          <p className="text-white/60 text-sm">
            © 2026 ORION - Plateforme JOJ Sénégal
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Home;
