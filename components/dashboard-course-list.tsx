import { Course } from "@prisma/client";

import { DashboardCourseCard } from "./dashboard-course-card";

type CourseWithProgress = Course & {
  chapters: { id: string }[];
  progress: number | null;
};

interface DashboardCoursesListProps {
  items: CourseWithProgress[];
}

export const DashboardCoursesList = ({
  items
}: DashboardCoursesListProps) => {
  return (
    <div>
      <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
        {items.map((item) => (
          <DashboardCourseCard
            key={item.id}
            id={item.id}
            title={item.title}
            imageUrl={item.imageUrl!}
            chaptersLength={item.chapters.length}
            progress={item.progress!}
          />
        ))}
      </div>
      {items.length === 0 && (
        <div className="text-center text-sm text-muted-foreground mt-10">
          No courses found
        </div>
      )}
    </div>
  )
}