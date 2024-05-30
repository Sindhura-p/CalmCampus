import { auth } from "@clerk/nextjs"
import { redirect } from "next/navigation";

import { getDashboardCourses } from "@/actions/get-dashboard-courses";

import { DashboardCoursesList } from "@/components/dashboard-course-list";


// this is the root page 
export default async function Dashboard() {
  // get userId from clerk
  const { userId } = auth();

  // if userId does not exist redirect to home
  if (!userId) {
    return redirect("/");
  }

  // get completedCoures and coursesInProgress from getDashboardCourses
  const {
    completedCourses,
    coursesInProgress
  } = await getDashboardCourses(userId);

  return (
    <div className="p-6 space-y-4">
      <DashboardCoursesList
        items={[...coursesInProgress, ...completedCourses]}
      />
    </div>
  )
}