"use client";

import { useState, useEffect, useCallback } from "react";
import { PotInfo } from "@/types";
import { api } from "@/lib/api";

export function usePotDetail(potId: string) {
  const [pot, setPot] = useState<PotInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPotDetail = useCallback(async () => {
    if (!potId) return;

    try {
      setIsLoading(true);
      setError(null);
      const data = await api.getPotDetail(potId);
      setPot(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch pot detail"
      );
    } finally {
      setIsLoading(false);
    }
  }, [potId]);

  useEffect(() => {
    fetchPotDetail();
  }, [fetchPotDetail]);

  return {
    pot,
    isLoading,
    error,
    refetch: fetchPotDetail,
  };
}
