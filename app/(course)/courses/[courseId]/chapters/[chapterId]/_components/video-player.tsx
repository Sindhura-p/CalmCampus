"use client";

import axios from "axios";
import MuxPlayer from "@mux/mux-player-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Loader2, Lock } from "lucide-react";

import { cn } from "@/lib/utils";

// Defining the videoplayer component
interface VideoPlayerProps {
  playbackId: string;
  courseId: string;
  chapterId: string;
  nextChapterId?: string;
  completeOnEnd: boolean;
  title: string;
};

export const VideoPlayer = ({
  playbackId,
  courseId,
  chapterId,
  nextChapterId,
  completeOnEnd,
  title,
}: VideoPlayerProps) => {
  const [isReady, setIsReady] = useState(false);

  const router = useRouter();

  const onEnd = async () => {
    try {
      if (completeOnEnd) {
        await axios.put(`/api/courses/${courseId}/chapters/${chapterId}/progress`, {
          isCompleted: true,
        });

        toast.success("Progress updated");
        router.refresh();

        if (nextChapterId) {
          router.push(`/courses/${courseId}/chapters/${nextChapterId}`)
        }
      }
    } catch {
      toast.error("Something went wrong");
    }
  }
  return (
    <div className="relative aspect-video">
        <MuxPlayer
        title={title}
        className={cn(
          !isReady && "hidden"
        )}
        onCanPlay={() => setIsReady(true)}
        onEnded={() => {}}
        autoPlay
        playbackId={playbackId}
        />
    </div>
  )
}