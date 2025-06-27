"use client";

import { useState } from "react";
import { mockPotInfo, mockDiagnosisResults } from "@/lib/mockData";
import { PotCard } from "@/components/PotCard";
import { PotDetail } from "@/components/PotDetail";
import { DiagnosisHistory } from "@/components/DiagnosisHistory";
import { LoginPage } from "@/components/LoginPage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sprout, Bell, Settings, RefreshCw, LogOut } from "lucide-react";
import { PotInfo } from "@/types";

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedPot, setSelectedPot] = useState<PotInfo | null>(null);
  const [currentView, setCurrentView] = useState<
    "dashboard" | "detail" | "history"
  >("dashboard");
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setSelectedPot(null);
    setCurrentView("dashboard");
  };

  const handlePotSelect = (pot: PotInfo) => {
    setSelectedPot(pot);
    setCurrentView("detail");
  };

  const handleBackToDashboard = () => {
    setSelectedPot(null);
    setCurrentView("dashboard");
  };

  const handleRefresh = () => {
    setLastUpdate(new Date());
    // ここで実際のデータ更新処理を行う
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("ja-JP", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // 認証されていない場合はログインページを表示
  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  if (currentView === "detail" && selectedPot) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6 max-w-4xl">
          <PotDetail pot={selectedPot} onBack={handleBackToDashboard} />
        </div>
      </div>
    );
  }

  if (currentView === "history") {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6 max-w-4xl">
          <div className="flex items-center space-x-4 mb-6">
            <Button variant="outline" size="sm" onClick={handleBackToDashboard}>
              ← ダッシュボード
            </Button>
            <h1 className="text-2xl font-bold">診断履歴</h1>
          </div>
          <DiagnosisHistory diagnoses={mockDiagnosisResults} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* ヘッダー */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <Sprout className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold">トマサポ</h1>
                <p className="text-sm text-muted-foreground">
                  トマト栽培みまもりシステム
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={handleRefresh}>
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="container mx-auto px-4 py-6 max-w-6xl">
        {/* ステータス概要 */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">システム概要</h2>
            <p className="text-sm text-muted-foreground">
              最終更新: {formatTime(lastUpdate)}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  総植木鉢数
                </CardTitle>
                <Sprout className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockPotInfo.length}</div>
                <p className="text-xs text-muted-foreground">監視中</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  正常な植木鉢
                </CardTitle>
                <div className="h-2 w-2 bg-green-500 rounded-full" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {
                    mockPotInfo.filter(
                      (pot) => pot.latestDiagnosis?.status === "good"
                    ).length
                  }
                </div>
                <p className="text-xs text-muted-foreground">問題なし</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">要注意</CardTitle>
                <div className="h-2 w-2 bg-yellow-500 rounded-full" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {
                    mockPotInfo.filter(
                      (pot) => pot.latestDiagnosis?.status === "warning"
                    ).length
                  }
                </div>
                <p className="text-xs text-muted-foreground">確認が必要</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 植木鉢一覧 */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">植木鉢一覧</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentView("history")}
            >
              診断履歴を見る
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockPotInfo.map((pot) => (
              <PotCard
                key={pot.id}
                pot={pot}
                onClick={() => handlePotSelect(pot)}
              />
            ))}
          </div>
        </div>

        {/* フッター情報 */}
        <div className="text-center text-sm text-muted-foreground border-t pt-4">
          <p>© 2025 トマサポ - 農業IoTシステム</p>
          <p className="mt-1">データは自動で収集・更新されます</p>
        </div>
      </main>
    </div>
  );
}
