"use client";

import { AuthGuard } from "@/components/auth/AuthGuard";
import { AppLayout } from "@/components/layout/AppLayout";
import { usePots } from "@/hooks/usePots";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Filter,
  Download,
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronDown,
  RefreshCw,
  BarChart3,
  LineChart as LineChartIcon,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { api } from "@/lib/api";
import { SensorData, PotInfo } from "@/types";
import { useSearchParams } from "next/navigation";

export default function HistoryPage() {
  const { pots, isLoading: potsLoading } = usePots();
  const [selectedPotId, setSelectedPotId] = useState<string>("all");
  const [selectedPeriod, setSelectedPeriod] = useState<number>(7);
  const [historicalData, setHistoricalData] = useState<SensorData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [chartType, setChartType] = useState<"line" | "bar">("line");
  const [showFilters, setShowFilters] = useState(false);

  const searchParams = useSearchParams();
  const initialPotId = searchParams.get("potId");

  // URLパラメータから初期値を設定
  useEffect(() => {
    if (initialPotId && pots.some((pot) => pot.id === initialPotId)) {
      setSelectedPotId(initialPotId);
    }
  }, [initialPotId, pots]);

  // データ取得
  useEffect(() => {
    const fetchHistoricalData = async () => {
      if (selectedPotId === "all") return;

      setIsLoading(true);
      try {
        const data = await api.getHistoricalData(selectedPotId, selectedPeriod);
        setHistoricalData(data);
      } catch (error) {
        console.error("Failed to fetch historical data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistoricalData();
  }, [selectedPotId, selectedPeriod]);

  // 統計計算
  const calculateStats = (data: SensorData[]) => {
    if (data.length === 0) return null;

    const temps = data.map((d) => d.temperature);
    const moistures = data.map((d) => d.soilMoisture);
    const nitrogens = data.map((d) => d.nitrogenLevel);

    const calculateMetrics = (values: number[]) => ({
      avg: values.reduce((a, b) => a + b, 0) / values.length,
      min: Math.min(...values),
      max: Math.max(...values),
      trend: values.length > 1 ? values[values.length - 1] - values[0] : 0,
    });

    return {
      temperature: calculateMetrics(temps),
      soilMoisture: calculateMetrics(moistures),
      nitrogenLevel: calculateMetrics(nitrogens),
      dataCount: data.length,
    };
  };

  const stats = calculateStats(historicalData);

  // チャート用データの変換
  const chartData = historicalData.map((data) => ({
    time: new Date(data.timestamp).toLocaleDateString("ja-JP", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
    }),
    fullTime: new Date(data.timestamp).toLocaleString("ja-JP"),
    temperature: Number(data.temperature.toFixed(1)),
    soilMoisture: Number(data.soilMoisture.toFixed(1)),
    nitrogenLevel: Number(data.nitrogenLevel.toFixed(1)),
  }));

  const getTrendIcon = (trend: number) => {
    if (trend > 0.1) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (trend < -0.1) return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <Minus className="h-4 w-4 text-gray-600" />;
  };

  const formatTrend = (trend: number, unit: string) => {
    const sign = trend > 0 ? "+" : "";
    return `${sign}${trend.toFixed(1)}${unit}`;
  };

  const exportData = () => {
    if (historicalData.length === 0) return;

    const csvContent = [
      ["日時", "温度(°C)", "土壌水分(%)", "窒素濃度(mg/L)"],
      ...historicalData.map((data) => [
        new Date(data.timestamp).toLocaleString("ja-JP"),
        data.temperature.toFixed(1),
        data.soilMoisture.toFixed(1),
        data.nitrogenLevel.toFixed(1),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `sensor-data-${selectedPotId}-${selectedPeriod}days.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AuthGuard>
      <AppLayout>
        <div className="space-y-6">
          {/* ヘッダー */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                履歴データ
              </h1>
              <p className="text-gray-600 mt-1">
                センサーデータの推移を確認できます
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                フィルター
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    showFilters ? "rotate-180" : ""
                  }`}
                />
              </Button>
              {historicalData.length > 0 && (
                <Button
                  variant="outline"
                  onClick={exportData}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  CSVエクスポート
                </Button>
              )}
            </div>
          </div>

          {/* フィルター */}
          {showFilters && (
            <Card className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    植木鉢を選択
                  </label>
                  <select
                    value={selectedPotId}
                    onChange={(e) => setSelectedPotId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="all">すべての植木鉢</option>
                    {pots.map((pot) => (
                      <option key={pot.id} value={pot.id}>
                        {pot.name} ({pot.variety})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    期間
                  </label>
                  <select
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value={1}>1日</option>
                    <option value={3}>3日</option>
                    <option value={7}>1週間</option>
                    <option value={14}>2週間</option>
                    <option value={30}>1ヶ月</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    表示タイプ
                  </label>
                  <div className="flex gap-2">
                    <Button
                      variant={chartType === "line" ? "default" : "outline"}
                      onClick={() => setChartType("line")}
                      className="flex items-center gap-2 flex-1"
                    >
                      <LineChartIcon className="h-4 w-4" />
                      線グラフ
                    </Button>
                    <Button
                      variant={chartType === "bar" ? "default" : "outline"}
                      onClick={() => setChartType("bar")}
                      className="flex items-center gap-2 flex-1"
                    >
                      <BarChart3 className="h-4 w-4" />
                      棒グラフ
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* データがない場合 */}
          {selectedPotId === "all" && (
            <Card className="p-8 text-center">
              <div className="space-y-4">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto" />
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    植木鉢を選択してください
                  </h3>
                  <p className="text-gray-600 mt-1">
                    履歴データを表示するには、特定の植木鉢を選択する必要があります
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* ローディング */}
          {isLoading && selectedPotId !== "all" && (
            <Card className="p-8 text-center">
              <RefreshCw className="h-8 w-8 animate-spin text-green-600 mx-auto mb-4" />
              <p className="text-gray-600">データを読み込み中...</p>
            </Card>
          )}

          {/* 統計情報 */}
          {stats && selectedPotId !== "all" && !isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">温度</h3>
                  {getTrendIcon(stats.temperature.trend)}
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-gray-900">
                    {stats.temperature.avg.toFixed(1)}°C
                  </div>
                  <div className="text-sm text-gray-600">
                    最低: {stats.temperature.min.toFixed(1)}°C / 最高:{" "}
                    {stats.temperature.max.toFixed(1)}°C
                  </div>
                  <div className="text-sm text-gray-600">
                    推移: {formatTrend(stats.temperature.trend, "°C")}
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">土壌水分</h3>
                  {getTrendIcon(stats.soilMoisture.trend)}
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-gray-900">
                    {stats.soilMoisture.avg.toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-600">
                    最低: {stats.soilMoisture.min.toFixed(1)}% / 最高:{" "}
                    {stats.soilMoisture.max.toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-600">
                    推移: {formatTrend(stats.soilMoisture.trend, "%")}
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">窒素濃度</h3>
                  {getTrendIcon(stats.nitrogenLevel.trend)}
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-gray-900">
                    {stats.nitrogenLevel.avg.toFixed(1)}mg/L
                  </div>
                  <div className="text-sm text-gray-600">
                    最低: {stats.nitrogenLevel.min.toFixed(1)}mg/L / 最高:{" "}
                    {stats.nitrogenLevel.max.toFixed(1)}mg/L
                  </div>
                  <div className="text-sm text-gray-600">
                    推移: {formatTrend(stats.nitrogenLevel.trend, "mg/L")}
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* チャート */}
          {chartData.length > 0 && selectedPotId !== "all" && !isLoading && (
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  {pots.find((p) => p.id === selectedPotId)?.name} -{" "}
                  {selectedPeriod}日間の推移
                </h2>
                <Badge variant="outline">{chartData.length}件のデータ</Badge>
              </div>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  {chartType === "line" ? (
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip
                        labelFormatter={(label, payload) => {
                          const data = payload?.[0]?.payload;
                          return data ? data.fullTime : label;
                        }}
                        labelClassName="text-gray-900"
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #e5e7eb",
                          borderRadius: "6px",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="temperature"
                        stroke="#ef4444"
                        strokeWidth={2}
                        name="温度 (°C)"
                      />
                      <Line
                        type="monotone"
                        dataKey="soilMoisture"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        name="土壌水分 (%)"
                      />
                      <Line
                        type="monotone"
                        dataKey="nitrogenLevel"
                        stroke="#10b981"
                        strokeWidth={2}
                        name="窒素濃度 (mg/L)"
                      />
                    </LineChart>
                  ) : (
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip
                        labelFormatter={(label, payload) => {
                          const data = payload?.[0]?.payload;
                          return data ? data.fullTime : label;
                        }}
                        labelClassName="text-gray-900"
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #e5e7eb",
                          borderRadius: "6px",
                        }}
                      />
                      <Bar
                        dataKey="temperature"
                        fill="#ef4444"
                        name="温度 (°C)"
                      />
                      <Bar
                        dataKey="soilMoisture"
                        fill="#3b82f6"
                        name="土壌水分 (%)"
                      />
                      <Bar
                        dataKey="nitrogenLevel"
                        fill="#10b981"
                        name="窒素濃度 (mg/L)"
                      />
                    </BarChart>
                  )}
                </ResponsiveContainer>
              </div>
            </Card>
          )}
        </div>
      </AppLayout>
    </AuthGuard>
  );
}
