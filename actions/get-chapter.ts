import { db } from "@/lib/db";
import { Assignment, Chapter } from "@prisma/client";


// API to get the chapters 
interface GetChapterProps {
  userId: string;
  courseId: string;
  chapterId: string;
};

// the parameters for this function are userId, courseId, chapterId
export const getChapter = async ({
  userId,
  courseId,
  chapterId,
}: GetChapterProps) => {
  try {
    const enroll = await db.enroll.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        }
      }
    });

    // get course from the database
    const course = await db.course.findUnique({
      where: {
        isPublished: true,
        id: courseId,
      },
      select: {
        price: true,
      }
    });

    // get chapter from the database
    const chapter = await db.chapter.findUnique({
      where: {
        id: chapterId,
        isPublished: true,
      }
    });

    if (!chapter || !course) {
      throw new Error("Chapter or course not found");
    }

    let muxData = null;
    let assignments: Assignment[] = [];
    let nextChapter: Chapter | null = null;

    

    // get assignments from the database
    assignments = await db.assignment.findMany({
        where: {
          chapterId: chapterId
        }
      });

    // if (chapter.isFree || enroll) {
      muxData = await db.muxData.findUnique({
        where: {
          chapterId: chapterId,
        }
      });

      // get next chapter from the database
      nextChapter = await db.chapter.findFirst({
        where: {
          courseId: courseId,
          isPublished: true,
          position: {
            gt: chapter?.position,
          }
        },
        orderBy: {
          position: "asc",
        }
      });

    // get userprogress
    const userProgress = await db.userProgress.findUnique({
      where: {
        userId_chapterId: {
          userId,
          chapterId,
        }
      }
    });

    return {
      chapter,
      course,
      muxData,
      assignments,
      nextChapter,
      userProgress,
      enroll,
    };
  } catch (error) {
    console.log("[GET_CHAPTER]", error);
    return {
      chapter: null,
      course: null,
      muxData: null,
      assignments: [],
      nextChapter: null,
      userProgress: null,
      enroll: null,
    }
  }
}