import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, CheckCircle, AlertCircle, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import mapDakar from "@/assets/map-dakar.jpg";

interface Report {
  id: string;
  type: string;
  urgency: string;
  location: string;
  description: string;
  timestamp: string;
  status: string;
  agent?: string;
}

const History = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  useEffect(() => {
    const storedReports = localStorage.getItem("orion-reports");
    if (storedReports) {
      setReports(JSON.parse(storedReports));
    }
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "En attente":
        return <Clock className="w-5 h-5 text-orion-orange" />;
      case "En cours de traitement":
        return <Loader className="w-5 h-5 text-orion-blue-light animate-spin" />;
      case "Résolu":
        return <CheckCircle className="w-5 h-5 text-orion-green" />;
      default:
        return <AlertCircle className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { className: string }> = {
      "En attente": { className: "bg-orion-orange/10 text-orion-orange border-orion-orange/20" },
      "En cours de traitement": { className: "bg-orion-blue-light/10 text-orion-blue-light border-orion-blue-light/20" },
      "Résolu": { className: "bg-orion-green/10 text-orion-green border-orion-green/20" },
    };
    return variants[status] || { className: "" };
  };

  const getTypeEmoji = (type: string) => {
    const emojis: Record<string, string> = {
      securite: "🔒",
      medical: "🏥",
      technique: "🔧",
      autre: "📋",
    };
    return emojis[type] || "📋";
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  if (selectedReport) {
    return (
      <div className="min-h-screen bg-orion-gray-light">
        {/* Header */}
        <header className="gradient-primary text-white p-4 shadow-elegant sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSelectedReport(null)}
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <h1 className="text-xl font-bold">Détails du signalement</h1>
          </div>
        </header>

        {/* Details */}
        <main className="p-6 space-y-6 max-w-2xl mx-auto">
          <Card className="shadow-card border-none animate-slide-up">
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-2xl flex items-center gap-2">
                  {getTypeEmoji(selectedReport.type)}
                  {selectedReport.type.charAt(0).toUpperCase() + selectedReport.type.slice(1)}
                </CardTitle>
                <Badge variant="outline" className={getStatusBadge(selectedReport.status).className}>
                  {getStatusIcon(selectedReport.status)}
                  {selectedReport.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Date et heure</p>
                <p className="font-medium">{formatDate(selectedReport.timestamp)}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">Urgence</p>
                <Badge variant="outline" className={
                  selectedReport.urgency === "urgent" 
                    ? "bg-orion-orange/10 text-orion-orange border-orion-orange/20"
                    : "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
                }>
                  {selectedReport.urgency === "urgent" ? "🔴 Urgent" : "🟡 Non urgent"}
                </Badge>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Localisation</p>
                <p className="font-medium mb-3">{selectedReport.location}</p>
                <img 
                  src={mapDakar} 
                  alt="Carte" 
                  className="w-full h-48 object-cover rounded-xl"
                />
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">Description</p>
                <p className="text-foreground leading-relaxed">{selectedReport.description}</p>
              </div>

              {selectedReport.status !== "En attente" && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Agent affecté</p>
                  <p className="font-medium">{selectedReport.agent || "Mamadou Ndiaye"}</p>
                </div>
              )}

              <div className="pt-2">
                <p className="text-sm text-muted-foreground mb-1">Référence</p>
                <p className="font-mono text-sm font-bold">ORN-{selectedReport.id.toUpperCase()}</p>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

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
          <h1 className="text-xl font-bold">Mes signalements</h1>
        </div>
      </header>

      {/* Reports List */}
      <main className="p-6 pb-20">
        <div className="max-w-2xl mx-auto space-y-4">
          {reports.length === 0 ? (
            <div className="text-center py-12 animate-fade-in">
              <AlertCircle className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Aucun signalement
              </h2>
              <p className="text-muted-foreground mb-6">
                Vous n'avez pas encore effectué de signalement.
              </p>
              <Button onClick={() => navigate("/report")}>
                Créer un signalement
              </Button>
            </div>
          ) : (
            reports.map((report, index) => (
              <Card
                key={report.id}
                className="shadow-card border-none cursor-pointer hover:shadow-elegant transition-shadow animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => setSelectedReport(report)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="text-3xl">{getTypeEmoji(report.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-semibold text-lg truncate">
                          {report.type.charAt(0).toUpperCase() + report.type.slice(1)}
                        </h3>
                        <Badge variant="outline" className={getStatusBadge(report.status).className}>
                          {getStatusIcon(report.status)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                        📍 {report.location}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(report.timestamp)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default History;
