import { PotInfo } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Thermometer,
  Droplets,
  Leaf,
  Clock,
  ArrowLeft,
  TrendingUp,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { mockPotHistoricalData } from "@/lib/mockData";

interface PotDetailProps {
  pot: PotInfo;
  onBack: () => void;
}

export function PotDetail({ pot, onBack }: PotDetailProps) {
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

  const historicalData = mockPotHistoricalData[pot.id] || [];

  const chartData = historicalData
    .map((data, index) => ({
      day: `${index + 1}日前`,
      temperature: Math.round(data.temperature * 10) / 10,
      soilMoisture: Math.round(data.soilMoisture),
      nitrogenLevel: Math.round(data.nitrogenLevel),
    }))
    .reverse();

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString("ja-JP", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const daysSincePlanted = Math.floor(
    (new Date().getTime() - new Date(pot.plantedDate).getTime()) /
      (1000 * 60 * 60 * 24)
  );

  return (
    <div className="space-y-4">
      {/* ヘッダー */}
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{pot.name}</h1>
          <p className="text-muted-foreground">
            {pot.variety} • 栽培{daysSincePlanted}日目
          </p>
        </div>
        {pot.latestDiagnosis && (
          <Badge
            variant={getStatusColor(pot.latestDiagnosis.status)}
            className="px-3 py-1"
          >
            {pot.latestDiagnosis.status === "good" && "良好"}
            {pot.latestDiagnosis.status === "warning" && "注意"}
            {pot.latestDiagnosis.status === "critical" && "警告"}
          </Badge>
        )}
      </div>

      {/* 現在のセンサー値 */}
      {pot.currentSensorData && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">温度</CardTitle>
              <Thermometer className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {pot.currentSensorData.temperature}°C
              </div>
              <p className="text-xs text-muted-foreground">
                更新: {formatTime(pot.currentSensorData.timestamp)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">土壌水分</CardTitle>
              <Droplets className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {pot.currentSensorData.soilMoisture}%
              </div>
              <p className="text-xs text-muted-foreground">
                更新: {formatTime(pot.currentSensorData.timestamp)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">窒素濃度</CardTitle>
              <Leaf className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {pot.currentSensorData.nitrogenLevel}mg/L
              </div>
              <p className="text-xs text-muted-foreground">
                更新: {formatTime(pot.currentSensorData.timestamp)}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* AI診断結果 */}
      {pot.latestDiagnosis && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>AI診断結果</span>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm">{pot.latestDiagnosis.message}</p>

            {pot.latestDiagnosis.recommendations.length > 0 && (
              <div>
                <h4 className="font-medium text-sm mb-2">推奨アクション:</h4>
                <ul className="space-y-1">
                  {pot.latestDiagnosis.recommendations.map((rec, index) => (
                    <li
                      key={index}
                      className="text-sm text-muted-foreground flex items-start"
                    >
                      <span className="mr-2">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <p className="text-xs text-muted-foreground">
              診断時刻: {formatTime(pot.latestDiagnosis.timestamp)}
            </p>
          </CardContent>
        </Card>
      )}

      {/* 履歴グラフ */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>過去7日間の推移</span>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* 温度グラフ */}
            <div>
              <h4 className="text-sm font-medium mb-2 flex items-center">
                <Thermometer className="h-4 w-4 text-red-500 mr-2" />
                温度 (°C)
              </h4>
              <ResponsiveContainer width="100%" height={150}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="temperature"
                    stroke="#ef4444"
                    strokeWidth={2}
                    dot={{ fill: "#ef4444", strokeWidth: 2, r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* 土壌水分グラフ */}
            <div>
              <h4 className="text-sm font-medium mb-2 flex items-center">
                <Droplets className="h-4 w-4 text-blue-500 mr-2" />
                土壌水分 (%)
              </h4>
              <ResponsiveContainer width="100%" height={150}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="soilMoisture"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ fill: "#3b82f6", strokeWidth: 2, r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* 窒素濃度グラフ */}
            <div>
              <h4 className="text-sm font-medium mb-2 flex items-center">
                <Leaf className="h-4 w-4 text-green-500 mr-2" />
                窒素濃度 (mg/L)
              </h4>
              <ResponsiveContainer width="100%" height={150}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="nitrogenLevel"
                    stroke="#22c55e"
                    strokeWidth={2}
                    dot={{ fill: "#22c55e", strokeWidth: 2, r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
