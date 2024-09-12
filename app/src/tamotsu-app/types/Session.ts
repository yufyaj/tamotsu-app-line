import { Session } from "next-auth";

declare module "next-auth" {
  interface SessionWithAccessToken extends Session {
    accessToken?: string;
  }
}