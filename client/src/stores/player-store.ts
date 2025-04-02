import { create } from "zustand";
import { Song } from "@/types/global";

interface PlayerState {
  playlist: Song[];
  activeSong?: Song;
  isVisible: boolean;
  isLyricVisibility: boolean;
  isPlaylistVisibility: boolean;
  isPlaying: boolean;
  volume: number;
  currentDuration: number;
  setPlaylist: (songs: Song[]) => void;
  setActiveTrack: (song: Song) => void;
  onPlay: () => void;
  onPause: () => void;
  toggleLyricMode: () => void;
  togglePlaylistMode: () => void;
  onNext: () => void;
  onPrevious: () => void;
  setVolume: (volume: number) => void;
  toggleVisibility: () => void;
  setCurrentDuration: (duration: number) => void;
  reset: () => void;
}

const usePlayerStore = create<PlayerState>((set, get) => ({
  playlist: [],
  activeSong: undefined,
  isVisible: false,
  isLyricVisibility: false,
  isPlaylistVisibility: false,
  isPlaying: false,
  volume: 0.8,
  currentDuration: 0,

  setPlaylist: (songs) => set({ playlist: songs }),

  setActiveTrack: (song) => {
    if (song && song.id !== get().activeSong?.id) {
      set({ activeSong: song });
    }
  },

  onPlay: () => {
    if (!get().activeSong) return;
    set({ isPlaying: true });
  },

  onPause: () => {
    set({ isPlaying: false });
  },

  toggleLyricMode: () => set((state) => ({ isLyricVisibility: !state.isLyricVisibility })),

  togglePlaylistMode: () => set((state) => ({ isPlaylistVisibility: !state.isPlaylistVisibility })),

  onNext: () => {
    const { playlist, activeSong, isPlaying } = get();
    if (!activeSong || playlist.length === 0) return;
    const currentIndex = playlist.findIndex((s) => s.id === activeSong.id);
    const nextSong = playlist[(currentIndex + 1) % playlist.length];
    // Maintain the playing state when changing songs
    set({ activeSong: nextSong, isPlaying });
  },

  onPrevious: () => {
    const { playlist, activeSong, isPlaying } = get();
    if (!activeSong || playlist.length === 0) return;
    const currentIndex = playlist.findIndex((s) => s.id === activeSong.id);
    const prevSong = playlist[(currentIndex - 1 + playlist.length) % playlist.length];
    // Maintain the playing state when changing songs
    set({ activeSong: prevSong, isPlaying });
  },

  setVolume: (volume) => set({ volume }),

  toggleVisibility: () => set((state) => ({ isVisible: !state.isVisible })),

  setCurrentDuration: (duration) => set({ currentDuration: duration }),

  reset: () =>
    set({
      playlist: [],
      activeSong: undefined,
      isVisible: false,
      isPlaying: false,
      isLyricVisibility: false,
      isPlaylistVisibility: false,
      volume: 0.8,
      currentDuration: 0,
    }),
}));

export default usePlayerStore;
