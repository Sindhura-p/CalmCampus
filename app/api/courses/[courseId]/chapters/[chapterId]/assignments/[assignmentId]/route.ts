import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

// api for assignmentid 


// delete assignment
export async function DELETE(
  req: Request,
  { params }: { params: { chapterId: string, assignmentId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const courseOwner = await db.course.findUnique({
      where: {
        id: params.chapterId,
        userId: userId
      }
    });

    if (!courseOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const assignment = await db.assignment.delete({
      where: {
        chapterId: params.chapterId,
        id: params.assignmentId,
      }
    });

    return NextResponse.json(assignment);
  } catch (error) {
    console.log("ATTACHMENT_ID", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
