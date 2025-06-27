"use client";

import { useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, Mail, Lock, Sprout, Users } from "lucide-react";

// ダミーアカウント情報
const dummyAccounts = [
  {
    email: "admin@tomasapo.com",
    password: "admin123",
    name: "管理者",
    description: "すべての機能にアクセス可能",
  },
  {
    email: "farmer@tomasapo.com",
    password: "farmer123",
    name: "農家太郎",
    description: "一般ユーザー（農家）",
  },
  {
    email: "demo@tomasapo.com",
    password: "demo123",
    name: "デモユーザー",
    description: "デモ用アカウント",
  },
];

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showDummyAccounts, setShowDummyAccounts] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError(
          "ログインに失敗しました。メールアドレスとパスワードを確認してください。"
        );
      } else {
        // セッションを再取得して確実にログイン状態にする
        const session = await getSession();
        if (session) {
          router.push("/dashboard");
          router.refresh();
        }
      }
    } catch (err) {
      setError(
        "エラーが発生しました。しばらく時間をおいて再度お試しください。"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleDummyLogin = (account: (typeof dummyAccounts)[0]) => {
    setFormData({
      email: account.email,
      password: account.password,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ログインフォーム */}
        <Card className="p-8 shadow-lg">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-green-100 rounded-full">
                <Sprout className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">トマサポ</h1>
            <p className="text-gray-600">トマト栽培みまもりシステム</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                メールアドレス
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="例: user@example.com"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                パスワード
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="パスワードを入力"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ログイン中...
                </>
              ) : (
                "ログイン"
              )}
            </Button>
          </form>
        </Card>

        {/* ダミーアカウント */}
        <Card className="p-8 shadow-lg">
          <div className="flex items-center gap-2 mb-6">
            <Users className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">
              テスト用アカウント
            </h2>
          </div>

          <p className="text-sm text-gray-600 mb-6">
            以下のダミーアカウントでログインをテストできます。
            アカウントをクリックすると自動入力されます。
          </p>

          <div className="space-y-4">
            {dummyAccounts.map((account, index) => (
              <div
                key={index}
                onClick={() => handleDummyLogin(account)}
                className="p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 cursor-pointer transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">
                      {account.name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {account.description}
                    </p>
                    <div className="mt-2 space-y-1">
                      <p className="text-xs text-gray-500">
                        📧 {account.email}
                      </p>
                      <p className="text-xs text-gray-500">
                        🔑 {account.password}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDummyLogin(account);
                    }}
                  >
                    使用
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>注意:</strong> これらはデモ用のダミーアカウントです。
              実際の本番環境では使用しないでください。
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
