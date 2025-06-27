"use client";

import { AuthGuard } from "@/components/auth/AuthGuard";
import { AppLayout } from "@/components/layout/AppLayout";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Bell,
  Database,
  Shield,
  Palette,
  Globe,
  Smartphone,
  Monitor,
  Moon,
  Sun,
  Save,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

export default function SettingsPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState("profile");
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">(
    "idle"
  );

  // 設定状態
  const [settings, setSettings] = useState({
    profile: {
      name: session?.user?.name || "",
      email: session?.user?.email || "",
      notifications: true,
      language: "ja",
    },
    notifications: {
      email: true,
      push: false,
      sms: false,
      criticalOnly: false,
      dailyReport: true,
      weeklyReport: true,
    },
    display: {
      theme: "light",
      dataRefreshInterval: 30,
      chartType: "line",
      showDetailedStats: true,
    },
    data: {
      retentionDays: 365,
      autoBackup: true,
      exportFormat: "csv",
    },
  });

  const tabs = [
    { id: "profile", name: "プロフィール", icon: User },
    { id: "notifications", name: "通知設定", icon: Bell },
    { id: "display", name: "表示設定", icon: Monitor },
    { id: "data", name: "データ管理", icon: Database },
  ];

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // TODO: 実際のAPI呼び出し
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSaveStatus("success");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch (error) {
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const updateSetting = (category: string, key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value,
      },
    }));
  };

  const renderProfileTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">基本情報</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ユーザー名
            </label>
            <input
              type="text"
              value={settings.profile.name}
              onChange={(e) => updateSetting("profile", "name", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              メールアドレス
            </label>
            <input
              type="email"
              value={settings.profile.email}
              onChange={(e) =>
                updateSetting("profile", "email", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">言語設定</h3>
        <select
          value={settings.profile.language}
          onChange={(e) => updateSetting("profile", "language", e.target.value)}
          className="w-full md:w-auto px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
        >
          <option value="ja">日本語</option>
          <option value="en">English</option>
        </select>
      </div>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">通知方法</h3>
        <div className="space-y-4">
          {[
            {
              key: "email",
              label: "メール通知",
              icon: <Globe className="h-5 w-5" />,
            },
            {
              key: "push",
              label: "プッシュ通知",
              icon: <Bell className="h-5 w-5" />,
            },
            {
              key: "sms",
              label: "SMS通知",
              icon: <Smartphone className="h-5 w-5" />,
            },
          ].map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="text-gray-500">{item.icon}</div>
                <span className="font-medium text-gray-900">{item.label}</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={
                    settings.notifications[
                      item.key as keyof typeof settings.notifications
                    ] as boolean
                  }
                  onChange={(e) =>
                    updateSetting("notifications", item.key, e.target.checked)
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          通知タイミング
        </h3>
        <div className="space-y-3">
          {[
            { key: "criticalOnly", label: "緊急時のみ" },
            { key: "dailyReport", label: "日次レポート" },
            { key: "weeklyReport", label: "週次レポート" },
          ].map((item) => (
            <label
              key={item.key}
              className="flex items-center gap-3 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={
                  settings.notifications[
                    item.key as keyof typeof settings.notifications
                  ] as boolean
                }
                onChange={(e) =>
                  updateSetting("notifications", item.key, e.target.checked)
                }
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <span className="text-gray-900">{item.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  const renderDisplayTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">テーマ設定</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              value: "light",
              label: "ライト",
              icon: <Sun className="h-5 w-5" />,
            },
            {
              value: "dark",
              label: "ダーク",
              icon: <Moon className="h-5 w-5" />,
            },
            {
              value: "auto",
              label: "自動",
              icon: <Monitor className="h-5 w-5" />,
            },
          ].map((theme) => (
            <div
              key={theme.value}
              onClick={() => updateSetting("display", "theme", theme.value)}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                settings.display.theme === theme.value
                  ? "border-green-500 bg-green-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="text-gray-600">{theme.icon}</div>
                <span className="font-medium text-gray-900">{theme.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          データ更新間隔
        </h3>
        <select
          value={settings.display.dataRefreshInterval}
          onChange={(e) =>
            updateSetting(
              "display",
              "dataRefreshInterval",
              Number(e.target.value)
            )
          }
          className="w-full md:w-auto px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
        >
          <option value={10}>10秒</option>
          <option value={30}>30秒</option>
          <option value={60}>1分</option>
          <option value={300}>5分</option>
        </select>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          チャート設定
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              デフォルトチャート種類
            </label>
            <select
              value={settings.display.chartType}
              onChange={(e) =>
                updateSetting("display", "chartType", e.target.value)
              }
              className="w-full md:w-auto px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="line">線グラフ</option>
              <option value="bar">棒グラフ</option>
              <option value="area">エリアグラフ</option>
            </select>
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.display.showDetailedStats}
              onChange={(e) =>
                updateSetting("display", "showDetailedStats", e.target.checked)
              }
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            />
            <span className="text-gray-900">詳細統計を表示</span>
          </label>
        </div>
      </div>
    </div>
  );

  const renderDataTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          データ保持設定
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              データ保持期間
            </label>
            <select
              value={settings.data.retentionDays}
              onChange={(e) =>
                updateSetting("data", "retentionDays", Number(e.target.value))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value={30}>30日</option>
              <option value={90}>90日</option>
              <option value={365}>1年</option>
              <option value={0}>無制限</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              エクスポート形式
            </label>
            <select
              value={settings.data.exportFormat}
              onChange={(e) =>
                updateSetting("data", "exportFormat", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="csv">CSV</option>
              <option value="json">JSON</option>
              <option value="xlsx">Excel</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          バックアップ設定
        </h3>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={settings.data.autoBackup}
            onChange={(e) =>
              updateSetting("data", "autoBackup", e.target.checked)
            }
            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
          />
          <span className="text-gray-900">自動バックアップを有効にする</span>
        </label>
        <p className="text-sm text-gray-600 mt-2 ml-7">
          データは毎日自動的にバックアップされます
        </p>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">データ管理</h3>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            全データをエクスポート
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            データを同期
          </Button>
          <Button
            variant="outline"
            className="flex items-center gap-2 text-red-600 border-red-300 hover:bg-red-50"
          >
            <AlertTriangle className="h-4 w-4" />
            古いデータを削除
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <AuthGuard>
      <AppLayout>
        <div className="space-y-6">
          {/* ヘッダー */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                設定
              </h1>
              <p className="text-gray-600 mt-1">システムの設定を管理できます</p>
            </div>
            <div className="flex items-center gap-3">
              {saveStatus === "success" && (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  <span className="text-sm">保存しました</span>
                </div>
              )}
              {saveStatus === "error" && (
                <div className="flex items-center gap-2 text-red-600">
                  <AlertTriangle className="h-5 w-5" />
                  <span className="text-sm">保存に失敗しました</span>
                </div>
              )}
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
              >
                {isSaving ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                保存
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* タブナビゲーション */}
            <Card className="lg:col-span-1 p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? "bg-green-100 text-green-700"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{tab.name}</span>
                    </button>
                  );
                })}
              </nav>
            </Card>

            {/* タブコンテンツ */}
            <Card className="lg:col-span-3 p-6">
              {activeTab === "profile" && renderProfileTab()}
              {activeTab === "notifications" && renderNotificationsTab()}
              {activeTab === "display" && renderDisplayTab()}
              {activeTab === "data" && renderDataTab()}
            </Card>
          </div>
        </div>
      </AppLayout>
    </AuthGuard>
  );
}
