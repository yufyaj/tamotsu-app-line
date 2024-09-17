import { NextAuthConfig } from "next-auth";
import line from "next-auth/providers/line";
import { JWT } from "next-auth/jwt";


export default {
  providers: [
    line({
      clientId: process.env.AUTH_LINE_ID,
      clientSecret: process.env.AUTH_LINE_SECRET,
      checks:["state"],
    })
  ],
  session: {strategy: "jwt"},
  callbacks: {
    async jwt({ token, account }) {
      console.log("jwt_token=>", token);
      if (account) {
        token.accessToken  = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt    = Date.now() + (account.expires_in as number * 1000); // + 30日間
      }
      
      // アクセストークンが期限切れの場合、更新を試みる
      if (Date.now() < (token.expiresAt as number)) {
        return token;
      }

      return refreshAccessToken(token);
    },

    // async redirect({ url, baseUrl }) {
    //   return url
    // }
  }
} satisfies NextAuthConfig

async function refreshAccessToken(token: JWT) {
  try {
    const url = "https://api.line.me/oauth2/v2.1/token";
    const bodyParams = new URLSearchParams();
    bodyParams.set("grant_type", "refresh_token");
    bodyParams.set("refresh_token", token.refreshToken as string);
    bodyParams.set("client_id", process.env.AUTH_LINE_ID as string);
    bodyParams.set("client_secret", process.env.AUTH_LINE_SECRET as string);

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