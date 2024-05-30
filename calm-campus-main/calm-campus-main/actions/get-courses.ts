import { Course } from "@prisma/client";

import { getProgress } from "@/actions/get-progress";
import { db } from "@/lib/db";

type CourseWithProgress = Course & {
  chapters: { id: string }[];
  progress: number | null;
};

type GetCourses = {
  userId: string;
  title?: string;
};

export const getCourses = async ({
  userId,
  title,
}: GetCourses): Promise<CourseWithProgress[]> => {
  try {
    // get courses with the with required parameters
    const courses = await db.course.findMany({
      where: {
        isPublished: true,
        title: {
          contains: title,
        },
      },
      include: {
        chapters: {
          where: {
            isPublished: true,
          },
          select: {
            id: true,
          }
        },
        enroll: {
          where: {
            userId,
          }
        }
      },
      orderBy: {
        createdAt: "desc",
      }
    });

    const coursesWithProgress: CourseWithProgress[] = await Promise.all(
      courses.map(async course => {
        if (course.enroll.length === 0) {
          return {
            ...course,
            progress: null,
          }
        }

        // get user progress
        const progressPercentage = await getProgress(userId, course.id);

        return {
          ...course,
          progress: progressPercentage,
        };
      })
    );

    return coursesWithProgress;
  } catch (error) {
    console.log("[GET_COURSES]", error);
    return [];
  }
}