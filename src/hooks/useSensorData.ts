"use client";

import { useState, useEffect } from "react";
import { SensorData } from "@/types";
import { api } from "@/lib/api";

export function useSensorData(potId?: string, refreshInterval?: number) {
  const [sensorData, setSensorData] = useState<SensorData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSensorData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await api.getSensorData(potId);
      setSensorData(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch sensor data"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSensorData();
  }, [potId]);

  // 自動更新の設定
  useEffect(() => {
    if (!refreshInterval) return;

    const interval = setInterval(fetchSensorData, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval, potId]);

  return {
    sensorData,
    isLoading,
    error,
    refetch: fetchSensorData,
  };
}
