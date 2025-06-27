export interface SensorData {
  id: string;
  timestamp: string;
  temperature: number; // 温度 (℃)
  soilMoisture: number; // 土壌水分 (%)
  nitrogenLevel: number; // 窒素濃度 (mg/L)
  potId: string; // 植木鉢ID
}

export interface DiagnosisResult {
  id: string;
  timestamp: string;
  status: "good" | "warning" | "critical";
  message: string;
  recommendations: string[];
  potId: string;
}

export interface PotInfo {
  id: string;
  name: string;
  variety: string; // トマトの品種
  plantedDate: string;
  currentSensorData?: SensorData;
  latestDiagnosis?: DiagnosisResult;
}

export interface HistoricalData {
  timestamp: string;
  temperature: number;
  soilMoisture: number;
  nitrogenLevel: number;
}

// 認証関連の型
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name: string;
  confirmPassword: string;
}

// API レスポンス関連の型
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  statusCode: number;
  details?: any;
}

// フォームの状態管理用
export interface FormState {
  isLoading: boolean;
  error: string | null;
  success: boolean;
}
