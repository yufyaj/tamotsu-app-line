import { auth } from "../auth/auth";

export async function verifyToken(accessToken: string) {  
  const verifyUrl = new URL("https://api.line.me/oauth2/v2.1/verify")
  verifyUrl.searchParams.append("access_token", accessToken!)

  const response = await fetch(verifyUrl.href)
  if (response.status == 200) {
    return true
  }

  return false
}