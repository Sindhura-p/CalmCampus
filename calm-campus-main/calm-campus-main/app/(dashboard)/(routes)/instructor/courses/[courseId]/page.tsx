import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { LayoutDashboard, ListChecks, File } from "lucide-react";

import { db } from "@/lib/db";
import { IconBadge } from "@/components/icon-badge";

import { TitleForm } from "./_components/title-form";
import { DescriptionForm } from "./_components/description-form";
import { ImageForm } from "./_components/image-form";
import { ChaptersForm } from "./_components/chapters-form";
import { Banner } from "@/components/banner";
import { Actions } from "./_components/actions";


// Home page for course id 
const CourseIdPage = async ({
  params
}: {
  params: { courseId: string }
}) => {
  // get user form clerk
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  // get all the courses along with the modules form the database
  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
      userId
    },
    include: {
      chapters: {
        orderBy: {
          position: "asc",
        },
      },
    },
  });

  if (!course) {
    return redirect("/");
  }

  // Defining all the requiredfields for the course to be published
  const requiredFields = [
    course.title,
    course.description,
    course.imageUrl,
    course.chapters.some(chapter => chapter.isPublished),
  ];

  // totalfileds
  const totalFields = requiredFields.length;
  //calcualte the completed fields
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalFields})`

  const isComplete = requiredFields.every(Boolean);


  return ( 
    <>
      {!course.isPublished && (
        <Banner
          label="This course is unpublished. It will not be visible to the students."
        />
      )}
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-2xl font-medium">
            Course setup
          </h1>
          <span className="text-sm text-slate-700">
            Complete all fields {completionText}
          </span>
        </div>
        <Actions
          disabled={!isComplete}
          courseId={params.courseId}
          isPublished={course.isPublished}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        <div>
          <div className="flex items-center gap-x-2">
            <IconBadge icon={LayoutDashboard} />
            <h2 className="text-xl">
              Customize your course
            </h2>
          </div>
          <TitleForm
            initialData={course}
            courseId={course.id}
          />
          <DescriptionForm
            initialData={course}
            courseId={course.id}
          />
          <ImageForm
            initialData={course}
            courseId={course.id}
          />
        </div>
        <div className="space-y-6">
            <div>
                <div className="flex items-center gap-x-2">
                    <IconBadge icon={ListChecks}/>
                    <h2 className="text-xl">
                        Course modules
                    </h2>
                </div>
                <ChaptersForm
                // pass intial data
                initialData={course}
                courseId={course.id}
                />
            </div>
            <div>
          </div>
        </div>
      </div>
    </div>
    </>

   );
}
 
export default CourseIdPage;