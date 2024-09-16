import { getToken } from "next-auth/jwt"
import { NextRequest } from "next/server"
import { auth } from "../auth/auth"

const getMyToken = async (request: NextRequest) => {
  await auth()
  const secret = process.env.NEXTAUTH_SECRET!
  const token = await getToken({
    req: {headers: request.headers}, 
    secret,
    salt: "__Secure-authjs.session-token",
    secureCookie: true
  })

  return token
}

export default getMyToken