import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button-variants";

const Confirmation = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Auto redirect after 5 seconds
    const timer = setTimeout(() => {
      navigate("/");
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen gradient-hero flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full space-y-8 text-center animate-fade-in">
        {/* Success Icon */}
        <div className="flex justify-center animate-success-bounce">
          <div className="rounded-full bg-orion-green p-6 shadow-elegant">
            <CheckCircle2 className="w-20 h-20 text-white" strokeWidth={3} />
          </div>
        </div>

        {/* Success Message */}
        <div className="space-y-4">
          <h1 className="text-3xl font-inter font-bold text-white">
            Signalement envoyé !
          </h1>
          <p className="text-lg text-white/90 leading-relaxed">
            Votre signalement a été transmis avec succès à l'équipe ORION.
          </p>
          <p className="text-base text-white/80">
            Merci pour votre contribution à la sécurité des JOJ 2026.
          </p>
        </div>

        {/* Reference Number */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
          <p className="text-sm text-white/70 mb-1">Numéro de référence</p>
          <p className="text-xl font-mono font-bold text-white">
            ORN-{Math.random().toString(36).substr(2, 8).toUpperCase()}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-6">
          <Button
            onClick={() => navigate("/")}
            className={buttonVariants({ variant: "hero", size: "lg" })}
          >
            Retour à l'accueil
          </Button>
          <Button
            onClick={() => navigate("/history")}
            variant="ghost"
            className="text-white hover:bg-white/20 w-full"
          >
            Voir mes signalements
          </Button>
        </div>

        {/* Auto redirect info */}
        <p className="text-sm text-white/60">
          Redirection automatique dans quelques secondes...
        </p>
      </div>
    </div>
  );
};

export default Confirmation;
