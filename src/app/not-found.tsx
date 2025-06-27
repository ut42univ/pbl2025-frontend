"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Home, ArrowLeft, Sprout } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 text-center shadow-lg">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-green-100 rounded-full">
            <Sprout className="h-12 w-12 text-green-600" />
          </div>
        </div>

        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          ページが見つかりません
        </h2>
        <p className="text-gray-600 mb-8">
          お探しのページは存在しないか、移動された可能性があります。
        </p>

        <div className="space-y-3">
          <Link href="/dashboard" className="block">
            <Button className="w-full bg-green-600 hover:bg-green-700 flex items-center justify-center gap-2">
              <Home className="h-4 w-4" />
              ダッシュボードに戻る
            </Button>
          </Link>

          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="w-full flex items-center justify-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            前のページに戻る
          </Button>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            問題が続く場合は、管理者にお問い合わせください。
          </p>
        </div>
      </Card>
    </div>
  );
}
