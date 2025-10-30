"use client";

import { useState, useEffect } from "react";
import { FiPlus } from "react-icons/fi";
import { addSongToPlaylist, getMyPlaylists } from "@/actions/playlist-actions";
import { Playlist } from "@/types/global";

const AddToPlaylist = ({ songId }: { songId: number }) => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const fetchPlaylists = async () => {
    try {
      setLoading(true);
      const data = await getMyPlaylists();
      console.log("mypl", data);
      setPlaylists(data);
    } catch (error) {
      console.error("Error fetching playlists:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToPlaylist = async (playlistId: number) => {
    try {
      await addSongToPlaylist(playlistId, songId);
      alert("Song added to playlist!");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      alert("Failed to add song.");
    }
  };

  return (
    <div className="relative group">
      {/* Add Button (Visible Always) */}
      <button className="absolute top-2 right-2 bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition">
        <FiPlus size={18} />
      </button>

      {/* Playlist Dropdown (Appears on Hover) */}
      <div className="absolute right-0 mt-2 w-48 bg-zinc-800 text-white rounded-md shadow-lg max-h-60 overflow-y-auto opacity-0 group-hover:opacity-100 transition duration-300">
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
    </div>
  );
};

export default AddToPlaylist;
