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
import { getPlaylistDetail } from "@/actions/playlist-actions";
import { Playlist, PlaylistSong } from "@/types/global";

const PlaylistDetailDemo: React.FC = () => {
  const { id } = useParams();
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: string } | null>(null);

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

  const getSortIcon = (column: string) => {
    if (!sortConfig || sortConfig.key !== column) return null;
    return sortConfig.direction === "ascending" ? (
      <FaSortAmountUpAlt className="text-white" />
    ) : (
      <FaSortAmountDown className="text-white" />
    );
  };

  const sortSongs = (key: keyof PlaylistSong) => {
    let direction = "ascending";
    if (sortConfig?.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }

    const sortedSongs = [...playlist!.songs].sort((a, b) => {
      const valueA = a[key] ?? (key === "createdAt" ? "9999-12-31" : "");
      const valueB = b[key] ?? (key === "createdAt" ? "9999-12-31" : "");

      return direction === "ascending" ? (valueA < valueB ? -1 : 1) : valueA > valueB ? -1 : 1;
    });

    setSortConfig({ key, direction });
    setPlaylist((prev) => (prev ? { ...prev, songs: sortedSongs } : null));
  };

  return (
    <div className="flex min-h-screen w-full overflow-hidden">
      <div className="flex flex-col w-full overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6">
          <div className="bg-dark-blue-gradient rounded-lg">
            <div className="p-4 flex justify-between items-center">
              <Link href="/home">
                <IoArrowBack className="text-4xl text-white" />
              </Link>
              <FiMoreHorizontal className="text-4xl text-white" />
            </div>

            <div className="p-4 grid grid-cols-12 items-start gap-12">
              <Image
                src={playlist.songPhotoUrl || "https://via.placeholder.com/268"}
                alt={playlist.playlistName}
                width={268}
                height={268}
                className="col-span-3 rounded-md object-cover shadow-2xl"
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
                  <TableHead>
                    <Button variant="ghost" onClick={() => sortSongs("songName")}>
                      Title {getSortIcon("songName")}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" onClick={() => sortSongs("createdAt")}>
                      Release {getSortIcon("createdAt")}
                    </Button>
                  </TableHead>
                  <TableHead>Artists</TableHead>
                </TableHeader>
                <TableBody>
                  {playlist.songs.map((song, index) => (
                    <TableRow key={song.id}>
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
