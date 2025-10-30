"use client";

import { useEffect, useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import { FiMoreHorizontal } from "react-icons/fi";
import Image from "next/image";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/TableV2";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getPlaylistDetail, removeSongFromPlaylist } from "@/actions/playlist-actions";
import { Playlist, PlaylistSong, Song } from "@/types/global";
import usePlayerStore from "@/stores/player-store";
import { GoKebabHorizontal, GoPlay, GoTrash } from "react-icons/go";

const PlaylistDetailDemo: React.FC = () => {
  const { id } = useParams();
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
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

  // Convert PlaylistSong to Song format
  const convertToSong = (playlistSong: PlaylistSong): Song => {
    return {
      id: playlistSong.id,
      songName: playlistSong.songName,
      description: playlistSong.description || null,
      publisherName: playlistSong.publisherName || "",
      publisherImageUrl: playlistSong.publisherImageUrl || "",
      artists: [
        {
          id: 0,
          artistName: Array.isArray(playlistSong.artists) ? playlistSong.artists.join(", ") : "Unknown Artist",
        },
      ],
      genres: playlistSong.genres,
      totalView: playlistSong.totalView,
      musicUrl: playlistSong.musicUrl,
      musicPublicId: playlistSong.musicPublicId || null,
      lyricUrl: playlistSong.lyricUrl || null,
      lyricPublicId: playlistSong.lyricPublicId || null,
      songPhotoUrl: playlistSong.songPhotoUrl || "",
      songPhotoPublicId: playlistSong.songPhotoPublicId || null,
      createdAt: playlistSong.createdAt,
    };
  };

  const handlePlayMusic = (song: PlaylistSong) => {
    // Set the full playlist but starting from the selected song
    const songIndex = playlist.songs.findIndex((s) => s.id === song.id);
    const reorderedSongs = [...playlist.songs.slice(songIndex), ...playlist.songs.slice(0, songIndex)];

    // Convert all songs to proper Song format
    const convertedSongs = reorderedSongs.map(convertToSong);

    setActiveTrack(convertToSong(song));
    setPlayerPlaylist(convertedSongs);
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
              <Image
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
                      <TableCell>{Array.isArray(song.artists) ? song.artists.join(", ") : "Unknown Artist"}</TableCell>
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
