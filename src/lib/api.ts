import {
  SensorData,
  DiagnosisResult,
  PotInfo,
  ApiResponse,
  ApiError,
} from "@/types";
import { getSession } from "next-auth/react";

// APIエンドポイントの設定
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.example.com";

// 認証トークンを取得する関数
async function getAuthToken(): Promise<string | null> {
  if (typeof window === "undefined") {
    // サーバーサイドでは直接トークンを取得できないため、null を返す
    return null;
  }

  const session = await getSession();
  return (session?.accessToken as string) || null;
}

// エラーハンドリング関数
function handleApiError(error: any): never {
  console.error("API Error:", error);

  // シンプルなエラーハンドリング
  if (error instanceof Error) {
    throw error;
  }

  if (typeof error === "string") {
    throw new Error(error);
  }

  // フェッチエラーの場合
  if (error.response) {
    const apiError: ApiError = {
      message: error.response.data?.message || "サーバーエラーが発生しました",
      statusCode: error.response.status,
      details: error.response.data,
    };
    throw apiError;
  }

  if (error.request) {
    throw new Error("ネットワークエラー: サーバーに接続できません");
  }

  throw new Error("予期しないエラーが発生しました");
}

// API クライアント設定
const apiClient = {
  get: async <T>(endpoint: string): Promise<T> => {
    try {
      const token = await getAuthToken();
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "GET",
        headers,
        cache: "no-store", // 常に最新データを取得
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      handleApiError(error);
    }
  },

  post: async <T>(endpoint: string, data: any): Promise<T> => {
    try {
      const token = await getAuthToken();
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers,
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      handleApiError(error);
    }
  },

  put: async <T>(endpoint: string, data: any): Promise<T> => {
    try {
      const token = await getAuthToken();
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      handleApiError(error);
    }
  },

  delete: async <T>(endpoint: string): Promise<T> => {
    try {
      const token = await getAuthToken();
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "DELETE",
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      handleApiError(error);
    }
  },
};

// API関数（将来のバックエンド接続用）
export const api = {
  // 植木鉢情報を取得
  async getPots(): Promise<PotInfo[]> {
    try {
      // ダミーデータを返す（本番では実際のAPIを呼び出し）
      return await new Promise((resolve) => {
        setTimeout(() => {
          resolve([
            {
              id: "pot-1",
              name: "トマト鉢 #1",
              variety: "桃太郎",
              plantedDate: "2024-12-01",
              currentSensorData: {
                id: "sensor-1",
                timestamp: new Date().toISOString(),
                temperature: 22.5,
                soilMoisture: 65.2,
                nitrogenLevel: 45.8,
                potId: "pot-1",
              },
              latestDiagnosis: {
                id: "diag-1",
                timestamp: new Date().toISOString(),
                status: "good",
                message:
                  "植物の状態は良好です。適切な水分と栄養が保たれています。",
                recommendations: [
                  "定期的な水やりを続けてください",
                  "日当たりの良い場所に置いてください",
                ],
                potId: "pot-1",
              },
            },
            {
              id: "pot-2",
              name: "トマト鉢 #2",
              variety: "アイコ",
              plantedDate: "2024-11-15",
              currentSensorData: {
                id: "sensor-2",
                timestamp: new Date().toISOString(),
                temperature: 25.1,
                soilMoisture: 42.3,
                nitrogenLevel: 38.2,
                potId: "pot-2",
              },
              latestDiagnosis: {
                id: "diag-2",
                timestamp: new Date().toISOString(),
                status: "warning",
                message: "土壌の水分が不足しています。早めの水やりが必要です。",
                recommendations: [
                  "すぐに水やりを行ってください",
                  "土壌の乾燥状態を確認してください",
                ],
                potId: "pot-2",
              },
            },
            {
              id: "pot-3",
              name: "トマト鉢 #3",
              variety: "フルティカ",
              plantedDate: "2024-11-20",
              currentSensorData: {
                id: "sensor-3",
                timestamp: new Date().toISOString(),
                temperature: 18.7,
                nitrogenLevel: 52.1,
                soilMoisture: 78.9,
                potId: "pot-3",
              },
              latestDiagnosis: {
                id: "diag-3",
                timestamp: new Date().toISOString(),
                status: "critical",
                message:
                  "温度が低すぎます。植物の成長に悪影響を与える可能性があります。",
                recommendations: [
                  "温室または暖かい場所に移動してください",
                  "温度管理システムの確認をしてください",
                ],
                potId: "pot-3",
              },
            },
          ]);
        }, 500);
      });
    } catch (error) {
      console.error("Failed to fetch pots:", error);
      throw error;
    }
  },

  // 特定の植木鉢の詳細情報を取得
  async getPotDetail(potId: string): Promise<PotInfo> {
    try {
      // ダミーデータを返す（本番では実際のAPIを呼び出し）
      const allPots = await this.getPots();
      const pot = allPots.find((p) => p.id === potId);

      if (!pot) {
        throw new Error(`植木鉢ID ${potId} が見つかりません`);
      }

      return pot;
    } catch (error) {
      console.error("Failed to fetch pot detail:", error);
      throw error;
    }
  },

  // センサーデータを取得
  async getSensorData(potId?: string): Promise<SensorData[]> {
    try {
      // ダミーデータを返す（本番では実際のAPIを呼び出し）
      return await new Promise((resolve) => {
        setTimeout(() => {
          const allData = [
            {
              id: "sensor-1",
              timestamp: new Date(Date.now() - 60000).toISOString(),
              temperature: 22.5,
              soilMoisture: 65.2,
              nitrogenLevel: 45.8,
              potId: "pot-1",
            },
            {
              id: "sensor-2",
              timestamp: new Date(Date.now() - 120000).toISOString(),
              temperature: 25.1,
              soilMoisture: 42.3,
              nitrogenLevel: 38.2,
              potId: "pot-2",
            },
            {
              id: "sensor-3",
              timestamp: new Date(Date.now() - 180000).toISOString(),
              temperature: 18.7,
              soilMoisture: 78.9,
              nitrogenLevel: 52.1,
              potId: "pot-3",
            },
          ];

          const filteredData = potId
            ? allData.filter((data) => data.potId === potId)
            : allData;

          resolve(filteredData);
        }, 300);
      });
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
      // ダミーデータを返す（本番では実際のAPIを呼び出し）
      return await new Promise((resolve) => {
        setTimeout(() => {
          const historicalData: SensorData[] = [];
          const now = new Date();

          // 指定された日数分のデータを生成
          for (let i = 0; i < days * 24; i++) {
            const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000);
            historicalData.push({
              id: `historical-${potId}-${i}`,
              timestamp: timestamp.toISOString(),
              temperature: 20 + Math.random() * 10,
              soilMoisture: 40 + Math.random() * 40,
              nitrogenLevel: 30 + Math.random() * 40,
              potId: potId,
            });
          }

          resolve(historicalData.reverse());
        }, 400);
      });
    } catch (error) {
      console.error("Failed to fetch historical data:", error);
      throw error;
    }
  },

  // 診断結果を取得
  async getDiagnosisResults(potId?: string): Promise<DiagnosisResult[]> {
    try {
      // ダミーデータを返す（本番では実際のAPIを呼び出し）
      return await new Promise((resolve) => {
        setTimeout(() => {
          const allDiagnoses = [
            {
              id: "diag-1",
              timestamp: new Date().toISOString(),
              status: "good" as const,
              message:
                "植物の状態は良好です。適切な水分と栄養が保たれています。",
              recommendations: [
                "定期的な水やりを続けてください",
                "日当たりの良い場所に置いてください",
              ],
              potId: "pot-1",
            },
            {
              id: "diag-2",
              timestamp: new Date(Date.now() - 60000).toISOString(),
              status: "warning" as const,
              message: "土壌の水分が不足しています。早めの水やりが必要です。",
              recommendations: [
                "すぐに水やりを行ってください",
                "土壌の乾燥状態を確認してください",
              ],
              potId: "pot-2",
            },
            {
              id: "diag-3",
              timestamp: new Date(Date.now() - 120000).toISOString(),
              status: "critical" as const,
              message:
                "温度が低すぎます。植物の成長に悪影響を与える可能性があります。",
              recommendations: [
                "温室または暖かい場所に移動してください",
                "温度管理システムの確認をしてください",
              ],
              potId: "pot-3",
            },
          ];

          const filteredDiagnoses = potId
            ? allDiagnoses.filter((diag) => diag.potId === potId)
            : allDiagnoses;

          resolve(filteredDiagnoses);
        }, 300);
      });
    } catch (error) {
      console.error("Failed to fetch diagnosis results:", error);
      throw error;
    }
  },

  // 認証（NextAuth.jsで処理されるため、ここでは使用しない）
  async login(
    username: string,
    password: string
  ): Promise<{ token: string; user: any }> {
    try {
      // NextAuth.jsで処理されるため、ダミー実装
      return await new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            token: `dummy-token-${Date.now()}`,
            user: { id: "1", name: "ダミーユーザー", email: username },
          });
        }, 500);
      });
    } catch (error) {
      console.error("Failed to login:", error);
      throw error;
    }
  },

  // 手動でデータ更新をリクエスト
  async requestDataUpdate(): Promise<void> {
    try {
      // ダミー実装（実際には何もしない）
      return await new Promise((resolve) => {
        setTimeout(() => {
          console.log("データ更新がリクエストされました（ダミー）");
          resolve();
        }, 200);
      });
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
    // ダミー実装：定期的にランダムデータを送信
    console.log("ダミーWebSocket接続を開始");

    const interval = setInterval(() => {
      const dummyData = {
        type: "sensor-update",
        data: {
          id: `sensor-${Math.random()}`,
          timestamp: new Date().toISOString(),
          temperature: 20 + Math.random() * 10,
          soilMoisture: 40 + Math.random() * 40,
          nitrogenLevel: 30 + Math.random() * 40,
          potId: `pot-${Math.floor(Math.random() * 3) + 1}`,
        },
      };
      onMessage(dummyData);
    }, 5000); // 5秒ごとに更新

    // ダミーWebSocketオブジェクトを返す
    return {
      close: () => {
        clearInterval(interval);
        console.log("ダミーWebSocket接続を終了");
      },
      readyState: 1, // OPEN状態
    };
  },
};

// 認証トークン管理（NextAuth.jsで管理されるため、ダミー実装）
export const authManager = {
  setToken: (token: string) => {
    // NextAuth.jsで管理されるため、ダミー実装
    console.log("トークンが設定されました（ダミー）:", token);
  },

  getToken: (): string | null => {
    // NextAuth.jsで管理されるため、ダミー実装
    return "dummy-token";
  },

  removeToken: () => {
    // NextAuth.jsで管理されるため、ダミー実装
    console.log("トークンが削除されました（ダミー）");
  },

  isAuthenticated: (): boolean => {
    // NextAuth.jsで管理されるため、ダミー実装
    return true;
  },
};
