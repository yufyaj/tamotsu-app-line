import { Tables } from "@/database.types";
import { upsertUser } from "@/lib/supabase/database";
import getMyToken from "@/lib/token/getMyToken";
import { JWT } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest): Promise<NextResponse> {
  const params = await request.json();

  // const decodedFile = Buffer.from(params.profileImage.replace("data:image/jpeg;base64,",""), 'base64');
  // const file = new File([decodedFile], `fileName.jpg`, { type: 'image/jpeg' })
  // await upload(file);
  const token = await getMyToken(request) as unknown as JWT | null
  const now = new Date(Date.now())
  const users:Tables<"users"> = {
    billing_status: "false",
    id: token!.sub!,
    created_at: now.toISOString(),
    status: "active",
    role: "user"
  }
  console.log("users=>", users)
  await upsertUser(users);

  return new NextResponse();
}