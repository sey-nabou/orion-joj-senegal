import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Send, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface Message {
  id: number;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
}

interface IncidentData {
  type: string;
  urgency: string;
  location: string;
  description: string;
}

const AIChat = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Bonjour ! Je suis ORION AI, votre assistant intelligent. Je vais vous aider à signaler un incident. Quel type d'incident souhaitez-vous signaler : sécurité, médical, technique ou autre ?",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [conversationStep, setConversationStep] = useState(0);
  const [incidentData, setIncidentData] = useState<IncidentData>({
    type: "",
    urgency: "",
    location: "",
    description: "",
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const analyzeMessage = (message: string): { type?: string; urgency?: string } => {
    const lowerMessage = message.toLowerCase();
    let detected: { type?: string; urgency?: string } = {};

    // Détection du type d'incident
    if (lowerMessage.includes("accident") || lowerMessage.includes("blessé") || lowerMessage.includes("médical") || lowerMessage.includes("santé")) {
      detected.type = "medical";
      detected.urgency = "urgent";
    } else if (lowerMessage.includes("vol") || lowerMessage.includes("danger") || lowerMessage.includes("sécurité") || lowerMessage.includes("suspect")) {
      detected.type = "security";
      detected.urgency = "urgent";
    } else if (lowerMessage.includes("panne") || lowerMessage.includes("technique") || lowerMessage.includes("équipement")) {
      detected.type = "technical";
    } else if (lowerMessage.includes("logistique")) {
      detected.type = "logistique";
    }

    // Détection de l'urgence
    if (lowerMessage.includes("urgent") || lowerMessage.includes("grave") || lowerMessage.includes("vite")) {
      detected.urgency = "urgent";
    }

    return detected;
  };

  const getAIResponse = (userMessage: string, step: number): string => {
    const analysis = analyzeMessage(userMessage);
    const lowerMessage = userMessage.toLowerCase();

    switch (step) {
      case 0: // Après le type d'incident
        if (analysis.type) {
          const typeNames: Record<string, string> = {
            medical: "médical",
            security: "sécurité",
            technical: "technique",
            logistique: "logistique",
          };
          return `J'ai compris, il s'agit d'un incident ${typeNames[analysis.type] || "autre"}. Pouvez-vous me décrire brièvement ce qui s'est passé ?`;
        } else if (lowerMessage.includes("sécurité") || lowerMessage.includes("securite")) {
          return "D'accord, un incident de sécurité. Pouvez-vous me décrire brièvement ce qui s'est passé ?";
        } else if (lowerMessage.includes("médical") || lowerMessage.includes("medical") || lowerMessage.includes("santé")) {
          return "Je vois, un incident médical. Pouvez-vous me décrire brièvement ce qui s'est passé ?";
        } else if (lowerMessage.includes("technique")) {
          return "Compris, un problème technique. Pouvez-vous me décrire brièvement ce qui s'est passé ?";
        } else if (lowerMessage.includes("logistique")) {
          return "D'accord, un problème logistique. Pouvez-vous me décrire brièvement ce qui s'est passé ?";
        }
        return "Merci. Pouvez-vous me décrire ce qui s'est passé ?";

      case 1: // Après la description
        return "Merci pour ces détails. Où se situe l'incident ? (Ex: Stade Lat Dior à Thiès, Université Cheikh Anta Diop à Dakar, etc.)";

      case 2: // Après la localisation
        if (analysis.urgency === "urgent") {
          return "Je localise l'endroit… Parfait ! D'après votre description, je détecte que c'est une situation urgente. Confirmez-vous le niveau d'urgence : Urgent ou Non urgent ?";
        }
        return "Je localise l'endroit… Parfait ! Quel est le niveau d'urgence de cet incident ? Urgent ou Non urgent ?";

      case 3: // Après l'urgence - résumé
        const typeLabel = incidentData.type === "medical" ? "Médical" :
                         incidentData.type === "security" ? "Sécurité" :
                         incidentData.type === "technical" ? "Technique" :
                         incidentData.type === "logistique" ? "Logistique" : "Autre";
        const urgencyLabel = incidentData.urgency === "urgent" ? "Urgent" : "Non urgent";
        
        return `Parfait ! Voici un résumé de votre signalement :

📋 Type : ${typeLabel}
🚨 Urgence : ${urgencyLabel}
📍 Lieu : ${incidentData.location}
📝 Description : ${incidentData.description}

Confirmez-vous l'envoi de ce signalement ?`;

      default:
        return "Je n'ai pas bien compris. Pouvez-vous reformuler ?";
    }
  };

  const updateIncidentData = (userMessage: string, step: number) => {
    const analysis = analyzeMessage(userMessage);
    const lowerMessage = userMessage.toLowerCase();
    const newData = { ...incidentData };

    switch (step) {
      case 0: // Type d'incident
        if (analysis.type) {
          newData.type = analysis.type;
          if (analysis.urgency) {
            newData.urgency = analysis.urgency;
          }
        } else if (lowerMessage.includes("sécurité") || lowerMessage.includes("securite")) {
          newData.type = "security";
        } else if (lowerMessage.includes("médical") || lowerMessage.includes("medical") || lowerMessage.includes("santé")) {
          newData.type = "medical";
        } else if (lowerMessage.includes("technique")) {
          newData.type = "technical";
        } else if (lowerMessage.includes("logistique")) {
          newData.type = "logistique";
        } else {
          newData.type = "autre";
        }
        break;

      case 1: // Description
        newData.description = userMessage;
        const descAnalysis = analyzeMessage(userMessage);
        if (descAnalysis.type && !newData.type) {
          newData.type = descAnalysis.type;
        }
        if (descAnalysis.urgency && !newData.urgency) {
          newData.urgency = descAnalysis.urgency;
        }
        break;

      case 2: // Localisation
        newData.location = userMessage;
        break;

      case 3: // Urgence
        if (lowerMessage.includes("urgent") || lowerMessage.includes("oui")) {
          newData.urgency = "urgent";
        } else if (lowerMessage.includes("non urgent") || lowerMessage.includes("non")) {
          newData.urgency = "non-urgent";
        }
        break;
    }

    setIncidentData(newData);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Mettre à jour les données selon l'étape
    updateIncidentData(inputValue, conversationStep);

    // Si c'est la confirmation finale
    if (conversationStep === 4) {
      const lowerMessage = inputValue.toLowerCase();
      if (lowerMessage.includes("oui") || lowerMessage.includes("confirme") || lowerMessage.includes("ok")) {
        setTimeout(() => {
          const aiMessage: Message = {
            id: messages.length + 2,
            text: "Votre signalement a été transmis avec succès à l'équipe ORION. Merci pour votre contribution à la sécurité des JOJ 2026 ! 🎉",
            sender: "ai",
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, aiMessage]);
          setIsTyping(false);

          // Sauvegarder dans localStorage
          const reports = JSON.parse(localStorage.getItem("orion-reports") || "[]");
          reports.push({
            id: Date.now().toString(),
            ...incidentData,
            timestamp: new Date().toISOString(),
            status: "En attente",
          });
          localStorage.setItem("orion-reports", JSON.stringify(reports));

          toast.success("Signalement enregistré avec succès");

          // Rediriger vers la confirmation
          setTimeout(() => {
            navigate("/confirmation", { state: incidentData });
          }, 2000);
        }, 1500);
        return;
      } else {
        setTimeout(() => {
          const aiMessage: Message = {
            id: messages.length + 2,
            text: "D'accord, le signalement a été annulé. Si vous souhaitez recommencer, retournez à l'accueil.",
            sender: "ai",
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, aiMessage]);
          setIsTyping(false);
        }, 1000);
        return;
      }
    }

    // Simuler le délai de réponse de l'IA
    setTimeout(() => {
      const aiResponse = getAIResponse(inputValue, conversationStep);
      const aiMessage: Message = {
        id: messages.length + 2,
        text: aiResponse,
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
      setConversationStep((prev) => prev + 1);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm p-4 flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/")}
          className="hover:bg-orion-blue/10"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">ORION AI</h1>
            <p className="text-xs text-muted-foreground">Assistant intelligent</p>
          </div>
        </div>
      </header>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-sm animate-fade-in ${
                message.sender === "user"
                  ? "bg-gray-200 text-gray-900"
                  : "gradient-primary text-white"
              }`}
            >
              <p className="text-sm whitespace-pre-line">{message.text}</p>
              <span
                className={`text-xs mt-1 block ${
                  message.sender === "user" ? "text-gray-600" : "text-white/80"
                }`}
              >
                {message.timestamp.toLocaleTimeString("fr-FR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="gradient-primary rounded-2xl px-4 py-3 shadow-sm">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex items-center gap-2 max-w-4xl mx-auto">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Écrivez votre message..."
            className="flex-1 rounded-full border-2 border-orion-blue/20 focus:border-orion-blue"
            disabled={isTyping}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isTyping}
            size="icon"
            className="rounded-full bg-orion-blue hover:bg-orion-blue/90 w-12 h-12"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
        <p className="text-xs text-center text-muted-foreground mt-2">
          L'IA ORION vous guide dans votre signalement
        </p>
      </div>
    </div>
  );
};

export default AIChat;
