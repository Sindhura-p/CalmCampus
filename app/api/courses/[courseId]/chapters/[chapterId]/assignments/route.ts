import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: { chapterId: string } }
) {
  try {
    const { userId } = auth();
    const { url } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }


    const assignment = await db.assignment.create({
      data: {
        url,
        name: url.split("/").pop(),
        chapterId: params.chapterId,
      }
    });

    return NextResponse.json(assignment);
  } catch (error) {
    console.log("COURSE_ID_ATTACHMENTS", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}