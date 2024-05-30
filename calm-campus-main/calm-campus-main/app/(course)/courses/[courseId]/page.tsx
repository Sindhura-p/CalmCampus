import { db } from "@/lib/db";
import axios from "axios";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";


// Page for each course 
const CourseIdPage = async ({
  params
}: {
  params: { courseId: string; }
}) => {
  // get course from the database with the courseId from the params
  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
    },
    include: {
      chapters: {
        where: {
          isPublished: true,
        },
        orderBy: {
          position: "asc"
        }
      }
    }
  });

  // if course does not exist redirect 
  if (!course) {
    return redirect("/");
  }

  // get current user from clerk
  const user = await currentUser();

    // check if the user is authorised or not
  if (!user || !user.id || !user.emailAddresses?.[0]?.emailAddress) {
    return new NextResponse("Unauthorized", { status: 401 });
  } 

    // check if the user is already enrolled or not. 
  const enroll = await db.enroll.findUnique({
    where: {
      userId_courseId: {
        userId: user.id,
        courseId: params.courseId
      }
    }
  });

    //enroll the user in the course
  if(!enroll){
    const enrolled = await db.enroll.create({
      data: {
          userId: user.id,
          courseId: params.courseId,
      }
    });

  }

  // after enrolling, redirect to the first chapter of the course. 
  return redirect(`/courses/${course.id}/chapters/${course.chapters[0].id}`);
}
 
export default CourseIdPage;