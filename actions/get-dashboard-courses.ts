import { Chapter, Course } from "@prisma/client";

import { db } from "@/lib/db";
import { getProgress } from "@/actions/get-progress";

type CourseWithProgress = Course & {
  chapters: Chapter[];
  progress: number | null;
};

// dashboard courses include two types: completedCourses and coursesInProgress
type DashboardCourses = {
  completedCourses: CourseWithProgress[];
  coursesInProgress: CourseWithProgress[];
}

export const getDashboardCourses = async (userId: string): Promise<DashboardCourses> => {
  try {
    // get courses user is enrolled in from the database
    const enrolledCourses = await db.enroll.findMany({
      where: {
        userId: userId,
      },
      select: {
        course: {
          include: {
            chapters: {
              where: {
                isPublished: true,
              }
            }
          }
        }
      }
    });

    const courses = enrolledCourses.map((enroll) => enroll.course) as CourseWithProgress[];

    // get course progress
    for (let course of courses) {
      const progress = await getProgress(userId, course.id);
      course["progress"] = progress;
    }

    const completedCourses = courses.filter((course) => course.progress === 100);
    const coursesInProgress = courses.filter((course) => (course.progress ?? 0) < 100);

    return {
      completedCourses,
      coursesInProgress,
    }
  } catch (error) {
    console.log("[GET_DASHBOARD_COURSES]", error);
    return {
      completedCourses: [],
      coursesInProgress: [],
    }
  }
}