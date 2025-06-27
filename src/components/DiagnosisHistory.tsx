import { DiagnosisResult } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MessageSquare } from "lucide-react";

interface DiagnosisHistoryProps {
  diagnoses: DiagnosisResult[];
}

export function DiagnosisHistory({ diagnoses }: DiagnosisHistoryProps) {
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

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString("ja-JP", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusText = (status: "good" | "warning" | "critical") => {
    switch (status) {
      case "good":
        return "良好";
      case "warning":
        return "注意";
      case "critical":
        return "警告";
      default:
        return "unknown";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MessageSquare className="h-5 w-5" />
          <span>診断履歴</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {diagnoses.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              診断履歴がありません
            </p>
          ) : (
            diagnoses.map((diagnosis) => (
              <div
                key={diagnosis.id}
                className="border-l-4 border-muted pl-4 space-y-2"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge variant={getStatusColor(diagnosis.status)}>
                      {getStatusText(diagnosis.status)}
                    </Badge>
                    <span className="text-sm text-muted-foreground flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatTime(diagnosis.timestamp)}
                    </span>
                  </div>
                </div>

                <p className="text-sm">{diagnosis.message}</p>

                {diagnosis.recommendations.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">
                      推奨アクション:
                    </p>
                    <ul className="space-y-1">
                      {diagnosis.recommendations.map((rec, index) => (
                        <li
                          key={index}
                          className="text-xs text-muted-foreground flex items-start"
                        >
                          <span className="mr-2">•</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
