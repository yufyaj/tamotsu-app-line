import { selectNutritionistProfileList } from "@/lib/db/nutritionist";
import getMyToken from "@/lib/token/getMyToken";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const token = await getMyToken(request)
    const sub = token?.sub
    const url = new URL(request.url)
    const query = url.searchParams.get("query")
    const page = url.searchParams.get("page")

    console.log("query:", query, ", page:", page)

    if (!sub) {
      return new NextResponse(null)
    }

    if (!page) {
      return new NextResponse(null)
    }

    const nutritionists = await selectNutritionistProfileList(query??"", Number(page))

    if (nutritionists === null) {
      return new NextResponse(null)
    }
    return new NextResponse(JSON.stringify(nutritionists))
  } catch (error) {
    return new NextResponse(null)
  }
}