import { SensorData, DiagnosisResult, PotInfo, HistoricalData } from "@/types";

// ダミーのセンサーデータ
export const mockSensorData: SensorData[] = [
  {
    id: "1",
    timestamp: new Date().toISOString(),
    temperature: 23.5,
    soilMoisture: 65,
    nitrogenLevel: 120,
    potId: "pot1",
  },
  {
    id: "2",
    timestamp: new Date().toISOString(),
    temperature: 24.2,
    soilMoisture: 45,
    nitrogenLevel: 95,
    potId: "pot2",
  },
  {
    id: "3",
    timestamp: new Date().toISOString(),
    temperature: 22.8,
    soilMoisture: 78,
    nitrogenLevel: 140,
    potId: "pot3",
  },
];

// ダミーの診断結果
export const mockDiagnosisResults: DiagnosisResult[] = [
  {
    id: "1",
    timestamp: new Date().toISOString(),
    status: "good",
    message: "植木鉢1の環境は良好です。トマトは健康に育っています。",
    recommendations: [
      "定期的な水やりを継続してください",
      "日光の当たり方を確認してください",
    ],
    potId: "pot1",
  },
  {
    id: "2",
    timestamp: new Date().toISOString(),
    status: "warning",
    message: "植木鉢2の土壌が乾燥気味です。水やりを検討してください。",
    recommendations: [
      "今日中に水やりを行ってください",
      "土壌の状態を毎日確認してください",
    ],
    potId: "pot2",
  },
  {
    id: "3",
    timestamp: new Date().toISOString(),
    status: "good",
    message: "植木鉢3の環境は最適です。窒素レベルも良好です。",
    recommendations: ["現在の管理を継続してください", "成長を観察してください"],
    potId: "pot3",
  },
];

// ダミーの植木鉢情報
export const mockPotInfo: PotInfo[] = [
  {
    id: "pot1",
    name: "植木鉢1",
    variety: "ミニトマト",
    plantedDate: "2024-05-15",
    currentSensorData: mockSensorData[0],
    latestDiagnosis: mockDiagnosisResults[0],
  },
  {
    id: "pot2",
    name: "植木鉢2",
    variety: "大玉トマト",
    plantedDate: "2024-05-20",
    currentSensorData: mockSensorData[1],
    latestDiagnosis: mockDiagnosisResults[1],
  },
  {
    id: "pot3",
    name: "植木鉢3",
    variety: "フルーツトマト",
    plantedDate: "2024-05-18",
    currentSensorData: mockSensorData[2],
    latestDiagnosis: mockDiagnosisResults[2],
  },
];

// ダミーの履歴データ（過去7日分）
export const mockHistoricalData: HistoricalData[] = Array.from(
  { length: 7 },
  (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return {
      timestamp: date.toISOString(),
      temperature: 20 + Math.random() * 8, // 20-28℃
      soilMoisture: 40 + Math.random() * 40, // 40-80%
      nitrogenLevel: 80 + Math.random() * 80, // 80-160mg/L
    };
  }
);

// 各ポットの履歴データ
export const mockPotHistoricalData: Record<string, HistoricalData[]> = {
  pot1: mockHistoricalData,
  pot2: mockHistoricalData.map((data) => ({
    ...data,
    temperature: data.temperature + Math.random() * 2 - 1,
    soilMoisture: Math.max(20, data.soilMoisture - 10 + Math.random() * 5),
    nitrogenLevel: data.nitrogenLevel - 20 + Math.random() * 10,
  })),
  pot3: mockHistoricalData.map((data) => ({
    ...data,
    temperature: data.temperature - Math.random() * 2 + 1,
    soilMoisture: Math.min(90, data.soilMoisture + 5 + Math.random() * 5),
    nitrogenLevel: data.nitrogenLevel + 10 + Math.random() * 10,
  })),
};
