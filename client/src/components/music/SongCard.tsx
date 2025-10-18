"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import PlayButton from "./PlayButton";
import usePlayerStore from "@/stores/player-store";
import { Song, Playlist } from "@/types/global";
import { FiPlus } from "react-icons/fi";
import AddToQueueButton from "./AddToQueueButton";
import { addSongToPlaylist, getMyPlaylists } from "@/actions/playlist-actions";
import { useQueueSync } from "@/hooks/useQueueSync";

const SongCard = ({ song }: { song: Song }) => {
  const { setActiveTrack, setPlaylist } = usePlayerStore();
  const { refreshQueue } = useQueueSync();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const fetchPlaylists = async () => {
    try {
      setLoading(true);
      const data = await getMyPlaylists();
      setPlaylists(data);
    } catch (error) {
      console.error("Error fetching playlists:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayMusic = async () => {
    // Try to sync queue so player can use [current, ...upcoming]
    try {
      await refreshQueue();
    } catch {}
    // Fallback immediate play single
    setActiveTrack(song);
    setPlaylist([song]);
  };

  const handleAddToPlaylist = async (playlistId: number) => {
    try {
      await addSongToPlaylist(playlistId, song.id);
      alert("Song added to playlist!");
      setShowDropdown(false);
    } catch {
      alert("Failed to add song.");
    }
  };

  const artistNames = song.artists?.map((artist) => artist.artistName).join(", ") || "Unknown Artist";

  return (
    <div className="group border border-zinc-100/10 hover:bg-zinc-100/10 rounded-md hover:cursor-pointer transition-colors duration-400 relative p-4">
      <div className="aspect-square relative mb-3 rounded-md overflow-hidden">
        <Image
          src={song.songPhotoUrl || "https://picsum.photos/400/400?random=13"}
          alt={"Song Cover"}
          fill
          className="object-cover"
        />
      </div>

      <div className="flex flex-row justify-between items-center gap-2">
        <div className="space-y-1 min-w-0 mr-2">
          <h3 className="font-semibold text-sm text-white truncate">{song.songName || "Unknown Song"}</h3>
          <p className="text-xs text-gray-400 truncate">By {artistNames}</p>
        </div>
        <div className="flex items-center gap-2">
          <AddToQueueButton song={song} />
          <PlayButton onClick={handlePlayMusic} aria-label={`Play ${song.songName || "song"}`} />
        </div>
      </div>

      {/* Add to Playlist Button */}
      <div className="absolute top-2 right-2">
        <button
          className="bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <FiPlus size={18} />
        </button>

        {showDropdown && (
          <div className="absolute right-0 mt-2 w-48 bg-zinc-800 text-white rounded-md shadow-lg max-h-60 overflow-y-auto z-10">
            {loading ? (
              <p className="p-2 text-center">Loading...</p>
            ) : playlists.length > 0 ? (
              playlists.map((playlist) => (
                <button
                  key={playlist.id}
                  className="block w-full text-left px-4 py-2 hover:bg-zinc-700"
                  onClick={() => handleAddToPlaylist(playlist.id)}
                >
                  {playlist.playlistName}
                </button>
              ))
            ) : (
              <p className="p-2 text-center">No playlists found</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SongCard;
