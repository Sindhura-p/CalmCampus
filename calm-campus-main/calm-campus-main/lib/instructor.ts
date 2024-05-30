// instructor check 
export const isInstructor = (userId?: string | null) => {
    return (userId === process.env.NEXT_PUBLIC_INSTRUCTOR_ID1 || userId === process.env.NEXT_PUBLIC_INSTRUCTOR_ID2 || userId === process.env.NEXT_PUBLIC_INSTRUCTOR_ID3);
  }