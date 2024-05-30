import { isInstructor } from "@/lib/instructor";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const InstructorLayout = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const { userId } = auth();

  // check if the user is the instructor or not
  if (!isInstructor(userId)) {
    // if not redirect to home
    return redirect("/");
  }

  return <>{children}</>
}
 
export default InstructorLayout;