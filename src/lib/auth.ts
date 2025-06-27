import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // 直接認証ロジックを実行（内部API呼び出しを避ける）
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

          // ユーザー認証
          const user = dummyUsers.find(
            (u) => u.email === credentials.email && u.password === credentials.password
          );

          if (!user) {
            console.error("Authentication failed: Invalid credentials");
            return null;
          }

          // アクセストークンの生成（ダミー）
          const accessToken = `token_${user.id}_${Date.now()}`;

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            accessToken: accessToken,
          };
        } catch (error) {
          console.error("Authentication error:", error);
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: any }) {
      if (user) {
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: JWT }) {
      session.accessToken = token.accessToken;
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};
