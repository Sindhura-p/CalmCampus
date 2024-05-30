import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { SearchInput } from "@/components/search-input";
import { getCourses } from "@/actions/get-courses";
import { CoursesList } from "@/components/courses-list";

// browse courses page 
interface SearchPageProps {
  searchParams: {
    title: string;
  }
};

const SearchPage = async ({
  searchParams
}: SearchPageProps) => {
  //get user from clerk
  const { userId } = auth();

  // check user validation
  if (!userId) {
    return redirect("/");
  }

  // get courses from the database
  const courses = await getCourses({
    userId,
    ...searchParams,
  });

  return (
    <>
      <div className="px-6 pt-6 md:hidden md:mb-0 block">
        <SearchInput />
      </div>
      <div className="p-6 space-y-4">
        <CoursesList items={courses} />
      </div>
    </>
   );
}
 
export default SearchPage;