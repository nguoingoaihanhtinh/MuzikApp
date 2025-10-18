"use client";

import { addToQueue } from "@/services/queue.service";
import type { Song } from "@/types/global";
import { useTransition } from "react";
import { toast } from "react-toastify";

export default function AddToQueueButton({ song }: { song: Song }) {
  const [isPending, startTransition] = useTransition();

  const onAdd = () => {
    startTransition(async () => {
      try {
        await addToQueue(song.id);
        toast.success("Added to queue");
      } catch (e: any) {
        toast.error(e?.data?.description || "Failed to add to queue");
      }
    });
  };

  return (
    <button
      aria-label={"Add " + song.songName + " to queue"}
      onClick={onAdd}
      disabled={isPending}
      className="px-2 py-1 text-xs rounded bg-zinc-800 hover:bg-zinc-700 text-white disabled:opacity-50"
    >
      {isPending ? "Adding..." : "Add to queue"}
    </button>
  );
}
