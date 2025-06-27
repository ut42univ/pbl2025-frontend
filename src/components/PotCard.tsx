import { PotInfo } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Thermometer, Droplets, Leaf, Calendar } from "lucide-react";

interface PotCardProps {
  pot: PotInfo;
  onClick: () => void;
}

export function PotCard({ pot, onClick }: PotCardProps) {
  const getStatusColor = (status: "good" | "warning" | "critical") => {
    switch (status) {
      case "good":
        return "success";
      case "warning":
        return "warning";
      case "critical":
        return "critical";
      default:
        return "default";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ja-JP");
  };

  const daysSincePlanted = Math.floor(
    (new Date().getTime() - new Date(pot.plantedDate).getTime()) /
      (1000 * 60 * 60 * 24)
  );

  return (
    <Card
      className="cursor-pointer transition-all hover:shadow-lg hover:scale-105 active:scale-95 touch-manipulation"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{pot.name}</CardTitle>
          {pot.latestDiagnosis && (
            <Badge variant={getStatusColor(pot.latestDiagnosis.status)}>
              {pot.latestDiagnosis.status === "good" && "良好"}
              {pot.latestDiagnosis.status === "warning" && "注意"}
              {pot.latestDiagnosis.status === "critical" && "警告"}
            </Badge>
          )}
        </div>
        <div className="text-sm text-muted-foreground">
          {pot.variety} • 栽培{daysSincePlanted}日目
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {pot.currentSensorData && (
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div className="flex items-center space-x-1">
              <Thermometer className="h-4 w-4 text-red-500" />
              <span className="font-medium">
                {pot.currentSensorData.temperature}°C
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <Droplets className="h-4 w-4 text-blue-500" />
              <span className="font-medium">
                {pot.currentSensorData.soilMoisture}%
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <Leaf className="h-4 w-4 text-green-500" />
              <span className="font-medium">
                {pot.currentSensorData.nitrogenLevel}mg/L
              </span>
            </div>
          </div>
        )}

        {pot.latestDiagnosis && (
          <div className="text-sm text-muted-foreground">
            {pot.latestDiagnosis.message.length > 50
              ? `${pot.latestDiagnosis.message.substring(0, 50)}...`
              : pot.latestDiagnosis.message}
          </div>
        )}

        <div className="flex items-center text-xs text-muted-foreground">
          <Calendar className="h-3 w-3 mr-1" />
          植付: {formatDate(pot.plantedDate)}
        </div>
      </CardContent>
    </Card>
  );
}
