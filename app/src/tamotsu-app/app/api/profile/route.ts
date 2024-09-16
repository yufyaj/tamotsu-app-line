import { upload } from "@/lib/supabase/storage";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest): Promise<NextResponse> {
  const params = await request.json();

  const decodedFile = Buffer.from(params.profileImage.replace("data:image/jpeg;base64,",""), 'base64');
  const file = new File([decodedFile], `fileName.jpg`, { type: 'image/jpeg' })
  await upload(file);

  return new NextResponse();
}