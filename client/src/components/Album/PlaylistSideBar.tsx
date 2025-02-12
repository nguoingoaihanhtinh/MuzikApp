"use client";
import { getMyPlaylists } from "@/actions/playlist-actions";
import PlaylistCard from "@/components/ui/PlaylistCard";
import { useLoading } from "@/contexts/LoadingContext";
import { Playlist } from "@/types/global";
import React, { useEffect, useState } from "react";

const PlaylistSideBar = () => {
  const { setLoadingState } = useLoading();
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
    <div>
      <h1>Hello</h1>
      {playlists.map((playlist) => {
        const lastSongWithImage = [...playlist.songs]
          .reverse()
          .find((song) => song.songPhotoUrl !== null && song.songPhotoUrl !== undefined);

        return (
          <PlaylistCard
            key={playlist.id}
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
