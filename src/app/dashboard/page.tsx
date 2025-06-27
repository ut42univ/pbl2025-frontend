"use client";

import { AuthGuard } from "@/components/auth/AuthGuard";
import { AppLayout } from "@/components/layout/AppLayout";
import { usePots } from "@/hooks/usePots";
import { useSensorData } from "@/hooks/useSensorData";
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
  Plus,
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const {
    pots,
    isLoading: potsLoading,
    error: potsError,
    refetch: refetchPots,
  } = usePots();
  const {
    sensorData,
    isLoading: sensorLoading,
    refetch: refetchSensor,
  } = useSensorData(undefined, 30000); // 30秒ごとに更新

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "good":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case "critical":
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-400" />;
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

  return (
    <AuthGuard>
      <AppLayout>
        <div className="space-y-6">
          {/* ヘッダー */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                ダッシュボード
              </h1>
              <p className="text-gray-600 mt-1">
                トマトの栽培状況を確認できます
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  refetchPots();
                  refetchSensor();
                }}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                更新
              </Button>
              <Button className="flex items-center gap-2 bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4" />
                植木鉢を追加
              </Button>
            </div>
          </div>

          {/* エラー表示 */}
          {potsError && (
            <Card className="p-4 bg-red-50 border-red-200">
              <p className="text-red-600">
                データの取得に失敗しました: {potsError}
              </p>
            </Card>
          )}

          {/* ローディング表示 */}
          {(potsLoading || sensorLoading) && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="p-6 animate-pulse">
                  <div className="space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-8 bg-gray-200 rounded"></div>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 rounded"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* 植木鉢一覧 */}
          {!potsLoading && !potsError && pots.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pots.map((pot) => {
                const currentData = pot.currentSensorData;
                const diagnosis = pot.latestDiagnosis;

                return (
                  <Link key={pot.id} href={`/pot/${pot.id}`}>
                    <Card className="p-6 hover:shadow-lg transition-all duration-200 cursor-pointer">
                      <div className="space-y-4">
                        {/* 植木鉢情報 */}
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-lg text-gray-900">
                              {pot.name}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {pot.variety}
                            </p>
                          </div>
                          {diagnosis && (
                            <div className="flex items-center gap-2">
                              {getStatusIcon(diagnosis.status)}
                              <Badge
                                className={getStatusColor(diagnosis.status)}
                              >
                                {diagnosis.status === "good" && "良好"}
                                {diagnosis.status === "warning" && "注意"}
                                {diagnosis.status === "critical" && "要対応"}
                              </Badge>
                            </div>
                          )}
                        </div>

                        {/* センサーデータ */}
                        {currentData && (
                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <Thermometer className="h-4 w-4 text-red-500" />
                              <span className="text-sm text-gray-600">
                                温度
                              </span>
                              <span className="font-medium ml-auto">
                                {formatValue(currentData.temperature, "°C")}
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              <Droplets className="h-4 w-4 text-blue-500" />
                              <span className="text-sm text-gray-600">
                                土壌水分
                              </span>
                              <span className="font-medium ml-auto">
                                {formatValue(currentData.soilMoisture, "%")}
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              <Leaf className="h-4 w-4 text-green-500" />
                              <span className="text-sm text-gray-600">
                                窒素
                              </span>
                              <span className="font-medium ml-auto">
                                {formatValue(currentData.nitrogenLevel, "mg/L")}
                              </span>
                            </div>
                          </div>
                        )}

                        {/* 診断メッセージ */}
                        {diagnosis && (
                          <div className="pt-3 border-t">
                            <p className="text-sm text-gray-700 line-clamp-2">
                              {diagnosis.message}
                            </p>
                          </div>
                        )}

                        {/* データなしの場合 */}
                        {!currentData && (
                          <div className="text-center py-4">
                            <p className="text-sm text-gray-500">
                              センサーデータがありません
                            </p>
                          </div>
                        )}
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}

          {/* 植木鉢がない場合 */}
          {!potsLoading && !potsError && pots.length === 0 && (
            <Card className="p-8 text-center">
              <div className="space-y-4">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <Plus className="h-8 w-8 text-gray-400" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    植木鉢が登録されていません
                  </h3>
                  <p className="text-gray-600 mt-1">
                    最初の植木鉢を追加して栽培を始めましょう
                  </p>
                </div>
                <Button className="bg-green-600 hover:bg-green-700">
                  植木鉢を追加
                </Button>
              </div>
            </Card>
          )}
        </div>
      </AppLayout>
    </AuthGuard>
  );
}
