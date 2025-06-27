"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, History, Settings, LogOut, Menu, X, Sprout } from "lucide-react";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // モバイルメニューが開いている時のbodyスクロール制御
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // クリーンアップ関数
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  const navigation = [
    { name: "ダッシュボード", href: "/dashboard", icon: Home },
    { name: "履歴", href: "/history", icon: History },
    { name: "設定", href: "/settings", icon: Settings },
  ];

  if (!session) {
    router.push("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Mobile menu button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="bg-white shadow-md hover:shadow-lg transition-shadow"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
      </div>

      {/* Mobile menu overlay with blur */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-30 transition-opacity duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-40 w-64 h-screen bg-white shadow-xl border-r border-gray-200
          transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-2 p-6 border-b">
            <Sprout className="h-8 w-8 text-green-600" />
            <h1 className="text-xl font-bold text-gray-900">トマサポ</h1>
          </div>

          {/* User info */}
          <div className="p-4 border-b">
            <p className="text-sm text-gray-600">ようこそ</p>
            <p className="font-medium text-gray-900">
              {session.user?.name || session.user?.email}
            </p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-3 text-gray-700 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-all duration-200 active:bg-gray-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Sign out button */}
          <div className="p-4 border-t">
            <Button
              variant="outline"
              onClick={handleSignOut}
              className="w-full flex items-center gap-2"
            >
              <LogOut size={16} />
              ログアウト
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="md:ml-64">
        <div className="p-4 pt-16 md:pt-8 md:p-8">{children}</div>
      </main>
    </div>
  );
}
