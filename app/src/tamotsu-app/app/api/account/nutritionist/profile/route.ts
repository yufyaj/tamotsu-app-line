import { selectNutritionistProfile, upsertNutritionistProfile } from "@/lib/db/nutritionist"
import { insertUser, selectUser } from "@/lib/db/user"
import { upload } from "@/lib/supabase/storage"
import getMyToken from "@/lib/token/getMyToken"
import { Tables } from "@/types/database.types"
import { NextRequest, NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"

export async function GET(request: NextRequest) {
  const token = await getMyToken(request)
  const sub = token?.sub

  if (!sub) {
    return new NextResponse(null)
  }

  const savedUser = await selectUser(sub)
  if (savedUser === null) {
    return new NextResponse(null)
  }

  const profile = await selectNutritionistProfile(savedUser.id)
  return new NextResponse(JSON.stringify(profile))
}

export async function POST(request: NextRequest) {
  const token = await getMyToken(request)
  const sub = token?.sub
  const reqBody = await request.json();

  if (!sub) {
    return new NextResponse(null, {status: 400});
  }

  const savedUser = await selectUser(sub)

  // TODO: もう少し良い書き方ない？
  const now = new Date(Date.now())
  const id  = (savedUser === null) ? uuidv4() : savedUser.id
  const user:Tables<"users"> = {
    billing_status: "disactive",
    id: id,
    role: "nutritionist",
    sub: sub,
    status: "Profiled",
    created_at: now.toISOString()
  }

  try {
    await insertUser(user);
  } catch (error) {
    console.log("error=>", error)
  }

  let profileImageUrl = null
  if (reqBody.profileImage !== null) {
    const decodedFile = Buffer.from(reqBody.profileImage.replace("data:image/jpeg;base64,",""), 'base64');
    const file = new File([decodedFile], `fileName.jpg`, { type: 'image/jpeg' })
    await upload(file);  
  }

  const nutritionistProfile:Tables<"nutritionist_profiles"> = {
    user_id: id,
    name: reqBody.name,
    specialty: reqBody.specialty,
    bio: reqBody.bio,
    profile_image_url: profileImageUrl,
    license:reqBody.license,
    created_at: now.toISOString(),
  }
  try {
    await upsertNutritionistProfile(nutritionistProfile);
  } catch (error) {
    console.log("error=>", error)
  }
  return new NextResponse(null, {status: 200});
}