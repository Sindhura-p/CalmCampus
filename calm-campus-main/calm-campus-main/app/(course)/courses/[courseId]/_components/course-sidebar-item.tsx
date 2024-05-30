"use client";

import { usePathname, useRouter } from "next/navigation";

import { cn } from "@/lib/utils";

interface CourseSidebarItemProps {
  label: string;
  id: string;
  isCompleted: boolean;
  courseId: string;
};

export const CourseSidebarItem = ({
  label,
  id,
  isCompleted,
  courseId,
}: CourseSidebarItemProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = pathname?.includes(id);


  // on button click redirected to individual chapter
  const onClick = () => {
    router.push(`/courses/${courseId}/chapters/${id}`);
  }

  return (
    <button
      onClick={onClick}
      type="button"
      className={cn(
        "flex items-center gap-x-2 text-slate-500 text-sm font-[500] pl-6 transition-all hover:text-slate-600 hover:bg-slate-300/20",
        isActive && "text-slate-700 bg-slate-200/20 hover:bg-slate-200/20 hover:text-slate-700",
        isCompleted && "text-emerald-700 hover:text-emerald-700",
        isCompleted && isActive && "bg-emerald-200/20",
      )}
    >
      <div className="flex items-center gap-x-2 py-4">
        {label}
      </div>
      <div className={cn(
        "ml-auto opacity-0 border-2 border-slate-700 h-full transition-all",
        isActive && "opacity-100",
        isCompleted && "border-emerald-700"
      )} />
    </button>
  )
}