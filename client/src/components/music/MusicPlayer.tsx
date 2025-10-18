"use client";

import React, { useEffect } from "react";

import usePlayerStore from "@/stores/player-store";

import MusicPlayerContent from "@/components/music/MusicPlayerContent";
import { useQueueSync } from "@/hooks/useQueueSync";

const MusicPlayer = () => {
  const { activeSong } = usePlayerStore();
  const { refreshQueue } = useQueueSync();

  useEffect(() => {
    // On mount, try to align local state with server queue
    refreshQueue().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!activeSong?.id) {
    return null;
  }

  return <MusicPlayerContent />;
};

export default MusicPlayer;
