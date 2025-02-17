"use client";

import { useEffect, useState } from "react";
import { FaSortAmountDown, FaSortAmountUpAlt } from "react-icons/fa";
import { IoArrowBack } from "react-icons/io5";
import { FiMoreHorizontal } from "react-icons/fi";
import Image from "next/image";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/TableV2";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getPlaylistDetail, removeSongFromPlaylist } from "@/actions/playlist-actions";
import { Playlist, PlaylistSong, Song } from "@/types/global";

import usePlayerStore from "@/stores/player-store";
import PlayButton from "@/components/music/PlayButton";
import { GoKebabHorizontal, GoPlay, GoTrash } from "react-icons/go";

const PlaylistDetailDemo: React.FC = () => {
  const { id } = useParams();
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: string } | null>(null);
  const { setActiveTrack, setPlaylist: setPlayerPlaylist } = usePlayerStore();
  const [currentSongId, setCurrentSongId] = useState<number | null>(null);

  useEffect(() => {
    if (id) {
      fetchPlaylistDetail(Number(id));
    }
  }, [id]);

  const fetchPlaylistDetail = async (playlistId: number) => {
    try {
      const data = await getPlaylistDetail(playlistId);
      setPlaylist(data);
    } catch (error) {
      console.error("Error fetching playlist:", error);
    }
  };

  if (!playlist) {
    return <div>Loading...</div>;
  }

  const handlePlayMusic = (song: PlaylistSong) => {
    setActiveTrack(song as Song);
    setPlayerPlaylist([song as Song]);
    setCurrentSongId(song.id);
  };

  const handleRemoveSong = async (songId: number) => {
    try {
      await removeSongFromPlaylist(Number(id), songId);
      setPlaylist((prev) => (prev ? { ...prev, songs: prev.songs.filter((song) => song.id !== songId) } : null));
    } catch (error) {
      console.error("Error removing song from playlist:", error);
    }
  };

  return (
    <div className="flex min-h-screen w-full overflow-hidden">
      <div className="flex flex-col w-full overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6">
          <div
            className="rounded-lg bg-cover bg-center"
            style={{
              backgroundImage: `url(${encodeURI(playlist.backgroundImageUrl)})`,
            }}
          >
            <div className="p-4 flex justify-between items-center">
              <Link href="/home">
                <IoArrowBack className="text-4xl text-white" />
              </Link>
              <FiMoreHorizontal className="text-4xl text-white" />
            </div>

            <div className="p-4 grid grid-cols-12 items-start gap-12">
              <img
                src={playlist.playlistImageUrl || "https://via.placeholder.com/268"}
                alt={playlist.playlistName}
                className="col-span-3 rounded-md object-cover shadow-2xl w-[268px] h-[268px]"
              />
              <div className="flex flex-col col-span-6 text-white">
                <h1 className="text-3xl font-bold mb-2">{playlist.playlistName}</h1>
                <p className="text-muted-foreground">{playlist.description || "No description"}</p>
                <p className="mt-2">{playlist.songs.length} songs</p>
              </div>
            </div>

            <div className="p-4">
              <Table>
                <TableHeader>
                  <TableHead>#</TableHead>
                  <TableHead></TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Release</TableHead>
                  <TableHead>Artists</TableHead>
                  <TableHead>Play</TableHead>
                  <TableHead>Remove</TableHead>
                </TableHeader>
                <TableBody>
                  {playlist.songs.map((song, index) => (
                    <TableRow key={song.id} className={currentSongId === song.id ? "bg-gray-200" : ""}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <Image
                          src={song.songPhotoUrl || "https://via.placeholder.com/50"}
                          alt={song.songName}
                          width={50}
                          height={50}
                          className="rounded-md w-[75px] bg-contain h-[50px]"
                        />
                      </TableCell>
                      <TableCell>{song.songName}</TableCell>
                      <TableCell>
                        {song.createdAt ? new Date(song.createdAt).toLocaleDateString() : "Unknown"}
                      </TableCell>
                      <TableCell>
                        {Array.isArray(song.artists)
                          ? song.artists.map((artist) => artist.artistName).join(", ")
                          : "Unknown Artist"}
                      </TableCell>
                      <TableCell>
                        <button onClick={() => handlePlayMusic(song)}>
                          {currentSongId === song.id ? (
                            <GoKebabHorizontal className="text-[#EE10B0] text-2xl" />
                          ) : (
                            <GoPlay className="text-[#EE10B0] text-2xl" />
                          )}
                        </button>
                      </TableCell>
                      <TableCell>
                        <button onClick={() => handleRemoveSong(song.id)}>
                          <GoTrash className="text-red-500 text-2xl" />
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaylistDetailDemo;
