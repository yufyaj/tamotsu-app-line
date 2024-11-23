import { NextAuthConfig } from "next-auth";
import crypto from "crypto";
import line from "next-auth/providers/line";
import { JWT } from "next-auth/jwt";


export default {
  providers: [
    line({
      clientId: process.env.AUTH_LINE_ID,
      clientSecret: process.env.AUTH_LINE_SECRET,
      authorization: {
        params: {
          scope: 'profile openid', // openidスコープを追加
          nonce: randomString(), // nonceを追加
        }
      },
      checks: ["state", "nonce"], // nonceチェックを追加
    })
  ],
  session: {strategy: "jwt"},
  callbacks: {
    async jwt({ token, account }) {
      if (account?.id_token) {
        // id_tokenからsub値を取得
        const decoded = JSON.parse(
          Buffer.from(account.id_token.split('.')[1], 'base64').toString()
        );
        token.sub = decoded.sub; // 一貫したsub値を設定
      }
      console.log("LINE_sub値=>", token.sub);
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

// ランダムな文字列を生成する関数
function randomString() {
  return crypto.randomBytes(32).toString('hex');
}