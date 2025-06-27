import { NextRequest, NextResponse } from "next/server";

// ダミーユーザーデータ
const dummyUsers = [
  {
    id: "1",
    email: "admin@tomasapo.com",
    password: "admin123",
    name: "管理者",
  },
  {
    id: "2",
    email: "farmer@tomasapo.com",
    password: "farmer123",
    name: "農家太郎",
  },
  {
    id: "3",
    email: "demo@tomasapo.com",
    password: "demo123",
    name: "デモユーザー",
  },
];

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // 入力値の検証
    if (!email || !password) {
      return NextResponse.json(
        { message: "メールアドレスとパスワードが必要です" },
        { status: 400 }
      );
    }

    // ダミーユーザーから検索
    const user = dummyUsers.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      return NextResponse.json(
        { message: "メールアドレスまたはパスワードが正しくありません" },
        { status: 401 }
      );
    }

    // パスワードを除いてレスポンス
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      user: userWithoutPassword,
      accessToken: `dummy-token-${user.id}-${Date.now()}`,
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "サーバーエラーが発生しました" },
      { status: 500 }
    );
  }
}
