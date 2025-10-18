"use client";

import { useCallback } from "react";
import { getQueue } from "@/services/queue.service";
import { advanceQueue } from "@/services/queue-advance.service";
import usePlayerStore from "@/stores/player-store";
import { useQueueStore } from "@/stores/queue-store";

export function useQueueSync() {
  const setPlayerPlaylist = usePlayerStore((s) => s.setPlaylist);
  const activeSong = usePlayerStore((s) => s.activeSong);
  const setActiveTrack = usePlayerStore((s) => s.setActiveTrack);
  const setQueue = useQueueStore((s) => s.setQueue);

  const refreshQueue = useCallback(async () => {
    const dto = await getQueue();
    const current = dto.current ?? null;
    const upcoming = dto.upcoming ?? [];

    // Update local queue store
    setQueue(current ?? null, upcoming);

    // Build player playlist
    const list = current ? [current, ...upcoming] : [...upcoming];
    setPlayerPlaylist(list);

    // If nothing is playing, or current is different, set the active track
    if (!activeSong && current) {
      setActiveTrack(current);
    }
  }, [activeSong, setActiveTrack, setPlayerPlaylist, setQueue]);

  const advance = useCallback(async () => {
    const dto = await advanceQueue();
    const current = dto.current ?? null;
    const upcoming = dto.upcoming ?? [];
    setQueue(current ?? null, upcoming);
    const list = current ? [current, ...upcoming] : [...upcoming];
    setPlayerPlaylist(list);
    if (current) setActiveTrack(current);
    return dto;
  }, [setQueue, setPlayerPlaylist, setActiveTrack]);

  return { refreshQueue, advance };
}
