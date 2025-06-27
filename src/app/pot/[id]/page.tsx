"use client";

import { use, Suspense, useState } from "react";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { AppLayout } from "@/components/layout/AppLayout";
import { usePotDetail } from "@/hooks/usePotDetail";
import { useSensorData } from "@/hooks/useSensorData";
import { useHistoricalData } from "@/hooks/useHistoricalData";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Thermometer,
  Droplets,
  Leaf,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  ArrowLeft,
  Calendar,
  TrendingUp,
  TrendingDown,
  Minus,
  Activity,
  BarChart3,
  LineChart as LineChartIcon,
  Download,
  ChevronDown,
  Filter,
} from "lucide-react";
import Link from "next/link";
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

interface PotDetailPageProps {
  params: Promise<{ id: string }>;
}

function PotDetailContent({ params }: PotDetailPageProps) {
  const { id } = use(params);
  const [selectedPeriod, setSelectedPeriod] = useState<number>(7);
  const [chartType, setChartType] = useState<"line" | "bar">("line");
  const [showHistoryFilters, setShowHistoryFilters] = useState(false);

  const {
    pot,
    isLoading: potLoading,
    error: potError,
    refetch: refetchPot,
  } = usePotDetail(id);
  const {
    sensorData,
    isLoading: sensorLoading,
    refetch: refetchSensor,
  } = useSensorData(id, 30000);
  const {
    historicalData,
    chartData: historyChartData,
    stats,
    isLoading: historyLoading,
    refetch: refetchHistory,
  } = useHistoricalData(id, selectedPeriod);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "good":
        return <CheckCircle className="h-6 w-6 text-green-600" />;
      case "warning":
        return <AlertTriangle className="h-6 w-6 text-yellow-600" />;
      case "critical":
        return <XCircle className="h-6 w-6 text-red-600" />;
      default:
        return <AlertTriangle className="h-6 w-6 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "good":
        return "bg-green-100 text-green-800";
      case "warning":
        return "bg-yellow-100 text-yellow-800";
      case "critical":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatValue = (value: number, unit: string) => {
    return `${value.toFixed(1)}${unit}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // チャート用のデータ変換
  const chartData = sensorData.slice(-24).map((data, index) => ({
    time: new Date(data.timestamp).toLocaleTimeString("ja-JP", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    temperature: data.temperature,
    soilMoisture: data.soilMoisture,
    nitrogenLevel: data.nitrogenLevel,
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

  const exportHistoryData = () => {
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
      `sensor-data-${pot?.name || id}-${selectedPeriod}days.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (potLoading) {
    return (
      <AuthGuard>
        <AppLayout>
          <div className="space-y-6 animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="p-6">
                  <div className="h-32 bg-gray-200 rounded"></div>
                </Card>
              ))}
            </div>
          </div>
        </AppLayout>
      </AuthGuard>
    );
  }

  if (potError || !pot) {
    return (
      <AuthGuard>
        <AppLayout>
          <Card className="p-8 text-center">
            <div className="space-y-4">
              <XCircle className="h-12 w-12 text-red-500 mx-auto" />
              <h2 className="text-xl font-semibold text-gray-900">
                植木鉢が見つかりません
              </h2>
              <p className="text-gray-600">
                {potError || "指定された植木鉢は存在しません"}
              </p>
              <Link href="/dashboard">
                <Button className="bg-green-600 hover:bg-green-700">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  ダッシュボードに戻る
                </Button>
              </Link>
            </div>
          </Card>
        </AppLayout>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <AppLayout>
        <div className="space-y-6">
          {/* ヘッダー */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  戻る
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {pot.name}
                </h1>
                <p className="text-gray-600 mt-1">
                  {pot.variety} • 植え付け: {formatDate(pot.plantedDate)}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                refetchPot();
                refetchSensor();
                refetchHistory();
              }}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              更新
            </Button>
          </div>

          {/* 現在の状態 */}
          {pot.latestDiagnosis && (
            <Card className="p-6">
              <div className="flex items-start gap-4">
                {getStatusIcon(pot.latestDiagnosis.status)}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-lg font-semibold text-gray-900">
                      現在の状態
                    </h2>
                    <Badge
                      className={getStatusColor(pot.latestDiagnosis.status)}
                    >
                      {pot.latestDiagnosis.status === "good" && "良好"}
                      {pot.latestDiagnosis.status === "warning" && "注意"}
                      {pot.latestDiagnosis.status === "critical" && "要対応"}
                    </Badge>
                  </div>
                  <p className="text-gray-700 mb-4">
                    {pot.latestDiagnosis.message}
                  </p>
                  {pot.latestDiagnosis.recommendations.length > 0 && (
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">
                        推奨アクション:
                      </h3>
                      <ul className="list-disc list-inside space-y-1">
                        {pot.latestDiagnosis.recommendations.map(
                          (rec, index) => (
                            <li key={index} className="text-sm text-gray-600">
                              {rec}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          )}

          {/* センサーデータ */}
          {pot.currentSensorData && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Thermometer className="h-8 w-8 text-red-500" />
                  <div>
                    <h3 className="font-semibold text-gray-900">温度</h3>
                    <p className="text-sm text-gray-600">現在の気温</p>
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900">
                  {formatValue(pot.currentSensorData.temperature, "°C")}
                </div>
                <div className="mt-2 flex items-center text-sm text-gray-600">
                  <Activity className="h-4 w-4 mr-1" />
                  更新:{" "}
                  {new Date(pot.currentSensorData.timestamp).toLocaleTimeString(
                    "ja-JP"
                  )}
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Droplets className="h-8 w-8 text-blue-500" />
                  <div>
                    <h3 className="font-semibold text-gray-900">土壌水分</h3>
                    <p className="text-sm text-gray-600">土の湿り具合</p>
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900">
                  {formatValue(pot.currentSensorData.soilMoisture, "%")}
                </div>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min(
                        pot.currentSensorData.soilMoisture,
                        100
                      )}%`,
                    }}
                  ></div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Leaf className="h-8 w-8 text-green-500" />
                  <div>
                    <h3 className="font-semibold text-gray-900">窒素濃度</h3>
                    <p className="text-sm text-gray-600">栄養レベル</p>
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900">
                  {formatValue(pot.currentSensorData.nitrogenLevel, "mg/L")}
                </div>
                <div className="mt-2 flex items-center text-sm text-gray-600">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  適正範囲: 30-60 mg/L
                </div>
              </Card>
            </div>
          )}

          {/* 詳細履歴データ */}
          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    詳細履歴データ
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    期間を指定してセンサーデータの推移を詳しく確認
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowHistoryFilters(!showHistoryFilters)}
                    className="flex items-center gap-2"
                  >
                    <Filter className="h-4 w-4" />
                    設定
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${
                        showHistoryFilters ? "rotate-180" : ""
                      }`}
                    />
                  </Button>
                  {historicalData.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={exportHistoryData}
                      className="flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      CSV
                    </Button>
                  )}
                </div>
              </div>

              {/* 履歴フィルター */}
              {showHistoryFilters && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      期間
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {[1, 3, 7, 14, 30].map((days) => (
                        <Button
                          key={days}
                          variant={
                            selectedPeriod === days ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => setSelectedPeriod(days)}
                          className="text-xs"
                        >
                          {days === 1 ? "24時間" : `${days}日`}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      チャートタイプ
                    </label>
                    <div className="flex gap-2">
                      <Button
                        variant={chartType === "line" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setChartType("line")}
                        className="flex items-center gap-2"
                      >
                        <LineChartIcon className="h-4 w-4" />
                        線グラフ
                      </Button>
                      <Button
                        variant={chartType === "bar" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setChartType("bar")}
                        className="flex items-center gap-2"
                      >
                        <BarChart3 className="h-4 w-4" />
                        棒グラフ
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* 統計情報 */}
              {stats && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-red-50 p-4 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <Thermometer className="h-5 w-5 text-red-500" />
                      <h3 className="font-medium text-gray-900">温度統計</h3>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">平均:</span>
                        <span className="font-medium">
                          {stats.temperature.avg.toFixed(1)}°C
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">最高/最低:</span>
                        <span className="font-medium">
                          {stats.temperature.max.toFixed(1)}° /{" "}
                          {stats.temperature.min.toFixed(1)}°
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">推移:</span>
                        <div className="flex items-center gap-1">
                          {getTrendIcon(stats.temperature.trend)}
                          <span className="font-medium text-xs">
                            {formatTrend(stats.temperature.trend, "°C")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <Droplets className="h-5 w-5 text-blue-500" />
                      <h3 className="font-medium text-gray-900">
                        土壌水分統計
                      </h3>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">平均:</span>
                        <span className="font-medium">
                          {stats.soilMoisture.avg.toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">最高/最低:</span>
                        <span className="font-medium">
                          {stats.soilMoisture.max.toFixed(1)}% /{" "}
                          {stats.soilMoisture.min.toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">推移:</span>
                        <div className="flex items-center gap-1">
                          {getTrendIcon(stats.soilMoisture.trend)}
                          <span className="font-medium text-xs">
                            {formatTrend(stats.soilMoisture.trend, "%")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <Leaf className="h-5 w-5 text-green-500" />
                      <h3 className="font-medium text-gray-900">
                        窒素濃度統計
                      </h3>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">平均:</span>
                        <span className="font-medium">
                          {stats.nitrogenLevel.avg.toFixed(1)}mg/L
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">最高/最低:</span>
                        <span className="font-medium">
                          {stats.nitrogenLevel.max.toFixed(1)} /{" "}
                          {stats.nitrogenLevel.min.toFixed(1)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">推移:</span>
                        <div className="flex items-center gap-1">
                          {getTrendIcon(stats.nitrogenLevel.trend)}
                          <span className="font-medium text-xs">
                            {formatTrend(stats.nitrogenLevel.trend, "mg/L")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 履歴チャート */}
              {historyLoading ? (
                <div className="h-80 flex items-center justify-center bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <RefreshCw className="h-8 w-8 text-gray-400 animate-spin mx-auto mb-2" />
                    <p className="text-gray-600">履歴データを読み込み中...</p>
                  </div>
                </div>
              ) : historyChartData.length > 0 ? (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    {chartType === "line" ? (
                      <LineChart data={historyChartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="time"
                          tick={{ fontSize: 12 }}
                          interval="preserveStartEnd"
                        />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip
                          labelClassName="text-gray-900"
                          contentStyle={{
                            backgroundColor: "white",
                            border: "1px solid #e5e7eb",
                            borderRadius: "6px",
                          }}
                          formatter={(value, name) => [
                            `${value}${
                              name === "temperature"
                                ? "°C"
                                : name === "soilMoisture"
                                ? "%"
                                : "mg/L"
                            }`,
                            name === "temperature"
                              ? "温度"
                              : name === "soilMoisture"
                              ? "土壌水分"
                              : "窒素濃度",
                          ]}
                        />
                        <Line
                          type="monotone"
                          dataKey="temperature"
                          stroke="#ef4444"
                          strokeWidth={2}
                          name="temperature"
                          dot={{ r: 3 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="soilMoisture"
                          stroke="#3b82f6"
                          strokeWidth={2}
                          name="soilMoisture"
                          dot={{ r: 3 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="nitrogenLevel"
                          stroke="#10b981"
                          strokeWidth={2}
                          name="nitrogenLevel"
                          dot={{ r: 3 }}
                        />
                      </LineChart>
                    ) : (
                      <BarChart data={historyChartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="time"
                          tick={{ fontSize: 12 }}
                          interval="preserveStartEnd"
                        />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip
                          labelClassName="text-gray-900"
                          contentStyle={{
                            backgroundColor: "white",
                            border: "1px solid #e5e7eb",
                            borderRadius: "6px",
                          }}
                          formatter={(value, name) => [
                            `${value}${
                              name === "temperature"
                                ? "°C"
                                : name === "soilMoisture"
                                ? "%"
                                : "mg/L"
                            }`,
                            name === "temperature"
                              ? "温度"
                              : name === "soilMoisture"
                              ? "土壌水分"
                              : "窒素濃度",
                          ]}
                        />
                        <Bar
                          dataKey="temperature"
                          fill="#ef4444"
                          name="temperature"
                        />
                        <Bar
                          dataKey="soilMoisture"
                          fill="#3b82f6"
                          name="soilMoisture"
                        />
                        <Bar
                          dataKey="nitrogenLevel"
                          fill="#10b981"
                          name="nitrogenLevel"
                        />
                      </BarChart>
                    )}
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-80 flex items-center justify-center bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <Calendar className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">
                      選択された期間のデータがありません
                    </p>
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* チャート */}
          {chartData.length > 0 && (
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                リアルタイム推移（直近24時間）
              </h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip
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
                </ResponsiveContainer>
              </div>
            </Card>
          )}

          {/* アクションボタン */}
          <div className="flex flex-wrap gap-4">
            <Link href={`/history?potId=${id}`}>
              <Button variant="outline" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                履歴ページで詳細確認
              </Button>
            </Link>
            <Button
              variant="outline"
              onClick={() => {
                refetchSensor();
                refetchHistory();
              }}
              className="flex items-center gap-2"
            >
              <Activity className="h-4 w-4" />
              全データを更新
            </Button>
          </div>
        </div>
      </AppLayout>
    </AuthGuard>
  );
}

export default function PotDetailPage({ params }: PotDetailPageProps) {
  return (
    <Suspense
      fallback={
        <AuthGuard>
          <AppLayout>
            <div className="space-y-6 animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="p-6">
                    <div className="h-32 bg-gray-200 rounded"></div>
                  </Card>
                ))}
              </div>
            </div>
          </AppLayout>
        </AuthGuard>
      }
    >
      <PotDetailContent params={params} />
    </Suspense>
  );
}
