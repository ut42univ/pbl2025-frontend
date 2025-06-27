"use client";

import { useState, useEffect } from "react";
import { SensorData } from "@/types";
import { api } from "@/lib/api";

export function useHistoricalData(potId?: string, periodDays: number = 7) {
  const [historicalData, setHistoricalData] = useState<SensorData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistoricalData = async () => {
    if (!potId) {
      setHistoricalData([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const data = await api.getHistoricalData(potId, periodDays);
      setHistoricalData(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch historical data"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistoricalData();
  }, [potId, periodDays]);

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
      hour: periodDays <= 1 ? "2-digit" : undefined,
    }),
    fullTime: new Date(data.timestamp).toLocaleString("ja-JP"),
    temperature: Number(data.temperature.toFixed(1)),
    soilMoisture: Number(data.soilMoisture.toFixed(1)),
    nitrogenLevel: Number(data.nitrogenLevel.toFixed(1)),
  }));

  return {
    historicalData,
    chartData,
    stats,
    isLoading,
    error,
    refetch: fetchHistoricalData,
  };
}
