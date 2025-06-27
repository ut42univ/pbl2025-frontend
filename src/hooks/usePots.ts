"use client";

import { useState, useEffect } from "react";
import { PotInfo } from "@/types";
import { api } from "@/lib/api";

export function usePots() {
  const [pots, setPots] = useState<PotInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPots = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await api.getPots();
      setPots(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch pots");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPots();
  }, []);

  return {
    pots,
    isLoading,
    error,
    refetch: fetchPots,
  };
}
