import { SensorData, DiagnosisResult, PotInfo } from "@/types";

// APIエンドポイントの設定
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.example.com";

// API クライアント設定
const apiClient = {
  get: async (endpoint: string) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // 認証ヘッダーを追加する場合
        // 'Authorization': `Bearer ${getAuthToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  post: async (endpoint: string, data: any) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // 認証ヘッダーを追加する場合
        // 'Authorization': `Bearer ${getAuthToken()}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },
};

// API関数（将来のバックエンド接続用）
export const api = {
  // 植木鉢情報を取得
  async getPots(): Promise<PotInfo[]> {
    try {
      return await apiClient.get("/pots");
    } catch (error) {
      console.error("Failed to fetch pots:", error);
      throw error;
    }
  },

  // 特定の植木鉢の詳細情報を取得
  async getPotDetail(potId: string): Promise<PotInfo> {
    try {
      return await apiClient.get(`/pots/${potId}`);
    } catch (error) {
      console.error("Failed to fetch pot detail:", error);
      throw error;
    }
  },

  // センサーデータを取得
  async getSensorData(potId?: string): Promise<SensorData[]> {
    try {
      const endpoint = potId ? `/sensor-data?potId=${potId}` : "/sensor-data";
      return await apiClient.get(endpoint);
    } catch (error) {
      console.error("Failed to fetch sensor data:", error);
      throw error;
    }
  },

  // 履歴データを取得
  async getHistoricalData(
    potId: string,
    days: number = 7
  ): Promise<SensorData[]> {
    try {
      return await apiClient.get(
        `/sensor-data/history?potId=${potId}&days=${days}`
      );
    } catch (error) {
      console.error("Failed to fetch historical data:", error);
      throw error;
    }
  },

  // 診断結果を取得
  async getDiagnosisResults(potId?: string): Promise<DiagnosisResult[]> {
    try {
      const endpoint = potId ? `/diagnosis?potId=${potId}` : "/diagnosis";
      return await apiClient.get(endpoint);
    } catch (error) {
      console.error("Failed to fetch diagnosis results:", error);
      throw error;
    }
  },

  // 認証
  async login(
    username: string,
    password: string
  ): Promise<{ token: string; user: any }> {
    try {
      return await apiClient.post("/auth/login", { username, password });
    } catch (error) {
      console.error("Failed to login:", error);
      throw error;
    }
  },

  // 手動でデータ更新をリクエスト
  async requestDataUpdate(): Promise<void> {
    try {
      await apiClient.post("/sensor-data/update", {});
    } catch (error) {
      console.error("Failed to request data update:", error);
      throw error;
    }
  },
};

// データ取得のためのヘルパー関数
export const dataFetcher = {
  // リアルタイムデータ取得（WebSocket用）
  connectWebSocket: (onMessage: (data: any) => void) => {
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000/ws";
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log("WebSocket connected");
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
      } catch (error) {
        console.error("Failed to parse WebSocket message:", error);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
      // 再接続ロジックを追加することも可能
    };

    return ws;
  },
};

// 認証トークン管理
export const authManager = {
  setToken: (token: string) => {
    localStorage.setItem("authToken", token);
  },

  getToken: (): string | null => {
    return localStorage.getItem("authToken");
  },

  removeToken: () => {
    localStorage.removeItem("authToken");
  },

  isAuthenticated: (): boolean => {
    return !!authManager.getToken();
  },
};
