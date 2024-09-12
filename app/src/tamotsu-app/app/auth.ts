import { SupabaseAdapter } from "@auth/supabase-adapter";
import NextAuth from "next-auth"
import { Adapter } from "next-auth/adapters";
import { JWT } from "next-auth/jwt";
import LINE from "next-auth/providers/line"
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  providers: [LINE({
    clientId: process.env.AUTH_LINE_ID,
    clientSecret: process.env.AUTH_LINE_SECRET,
    checks:["state"],
  })],
  adapter: SupabaseAdapter ({
    url: process.env.SUPABASE_URL ?? '',
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
  }) as Adapter,
  callbacks: {
    async jwt({ token, account }) {
      console.log("account=>", account);
      if (account) {
        token.accessToken  = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt    = Date.now() + (account.expires_in as number * 1000); // + 29日間
      }
      // アクセストークンが期限切れの場合、更新を試みる
      if (Date.now() < (token.expiresAt as number)) {
        return token;
      }

      return refreshAccessToken(token);
    },
    async redirect({ url, baseUrl }) {
      return "https://5a9e-240b-250-3fe1-b700-ac59-9b24-1585-fe13.ngrok-free.app/login";
    }
  }
})

async function refreshAccessToken(token: JWT) {
  try {
    const url = "https://api.line.me/oauth2/v2.1/token";
    const bodyParams = new URLSearchParams();
    bodyParams.set("grant_type", "refresh_token");
    bodyParams.set("refresh_token", token.refreshToken as string);
    bodyParams.set("client_id", process.env.LINE_CLIENT_ID as string);
    bodyParams.set("client_secret", process.env.LINE_CLIENT_SECRET as string);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: bodyParams,
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw refreshedTokens;
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      expiresAt: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
    };
  } catch (error) {
    console.error("アクセストークンの更新に失敗しました", error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}