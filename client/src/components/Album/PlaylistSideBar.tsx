"use client";
import { getMyPlaylists } from "@/actions/playlist-actions";
import PlaylistCard from "@/components/ui/PlaylistCard";
import { Playlist } from "@/types/global";
import React, { useEffect, useState } from "react";

const PlaylistSideBar = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  useEffect(() => {
    async function fetchPlaylists() {
      try {
        const playlistData = await getMyPlaylists();
        setPlaylists(playlistData);
      } catch (error) {
        console.error("Failed to fetch playlists:", error);
      }
    }
    fetchPlaylists();
  }, []);
  return (
    <div className="w-[20%] p-6">
      {playlists.map((playlist) => {
        const lastSongWithImage = [...playlist.songs]
          .reverse()
          .find((song) => song.songPhotoUrl !== null && song.songPhotoUrl !== undefined);

        return (
          <PlaylistCard
            key={playlist.id}
            id={playlist.id}
            image={lastSongWithImage?.songPhotoUrl ?? "/default-placeholder.jpg"}
            title={playlist.playlistName}
            songCount={playlist.totalSongs}
            totalDuration={`${playlist.totalListeningHours} hours`}
          />
        );
      })}
    </div>
  );
};

export default PlaylistSideBar;
