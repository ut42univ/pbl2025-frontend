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
