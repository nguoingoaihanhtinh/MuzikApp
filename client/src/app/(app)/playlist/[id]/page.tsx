"use client";

import { useEffect, useState } from "react";
import { GoPlay } from "react-icons/go";
import { FaSortAmountDown, FaSortAmountUpAlt } from "react-icons/fa";
import { IoArrowBack } from "react-icons/io5";
import { FiMoreHorizontal } from "react-icons/fi";
import Image from "next/image";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/TableV2";
import { Button } from "@/components/ui/Button";
// import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Link from "next/link";
import AddToPlaylistButton from "@/components/ui/AddToPlaylistButton";
import LikeButton from "@/components/music/LikeButton";
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
    if (!["songName", "releaseDate", "genre", "duration", "totalView"].includes(key)) return;

    let direction = "ascending";
    if (sortConfig?.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }

    const sortedSongs = [...playlist!.songs].sort((a, b) => {
      const valueA = a[key] as string | number;
      const valueB = b[key] as string | number;

      if (valueA < valueB) return direction === "ascending" ? -1 : 1;
      if (valueA > valueB) return direction === "ascending" ? 1 : -1;
      return 0;
    });

    setSortConfig({ key, direction });
    setPlaylist((prev) => (prev ? { ...prev, songs: sortedSongs } : null));
  };

  return (
    <div className="flex min-h-screen w-full overflow-hidden">
      <div className="flex flex-col w-full overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6">
          <div className="bg-dark-blue-gradient rounded-lg">
            <div className="w-full bg-blue-gradient rounded-lg">
              <div className="p-4">
                <div className="flex justify-between items-center">
                  <Link href="/">
                    <IoArrowBack className="text-4xl text-white" />
                  </Link>
                  <FiMoreHorizontal className="text-4xl text-white" />
                </div>
              </div>

              <div className="p-4">
                <div className="grid grid-cols-12 items-start gap-12 mb-8">
                  <Image
                    src={playlist.songPhotoUrl || "https://via.placeholder.com/268"}
                    alt={playlist.playlistName}
                    width={268}
                    height={268}
                    className="col-span-3 rounded-md object-cover shadow-2xl"
                  />
                  <div className="flex flex-col col-span-6 h-56 text-white">
                    <h1 className="text-3xl font-bold mb-8">{playlist.playlistName}</h1>
                    <p className="text-muted-foreground mt-2 text-white">{playlist.description}</p>
                    <div className="flex items-center space-x-2 mt-auto">
                      <p className="text-lg font-bold">{playlist.songs.length} songs</p>
                      <span className="leading-none text-[#EE10B0]">●</span>
                      <p className="text-lg font-bold">Total duration TBD</p>
                    </div>
                  </div>
                  <div className="flex h-60 col-span-3 justify-end items-end mr-6">
                    <button className="flex justify-center items-center space-x-2 focus:outline-none">
                      <span className="text-lg font-medium text-[#EE10B0]">Play all</span>
                      <GoPlay className="text-6xl text-[#EE10B0]" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full flex flex-col bg-transparent text-general-white items-center custom1-table p-4">
              <Table>
                <TableHeader>
                  <TableHead className=" text-white text-lg font-bold" style={{ width: "5%" }}>
                    #
                  </TableHead>
                  <TableHead style={{ width: "35%" }}>
                    <Button
                      variant="ghost"
                      onClick={() => sortSongs("songName")}
                      className="flex items-center space-x-1 text-white text-lg font-bold hover:text-white hover:bg-black hover:bg-opacity-30"
                    >
                      <span>Title</span>
                      {getSortIcon("title")}
                    </Button>
                  </TableHead>
                  <TableHead style={{ width: "15%" }}>
                    <Button
                      variant="ghost"
                      onClick={() => sortSongs("createdAt")}
                      className="flex items-center space-x-1 text-white text-lg font-bold hover:text-white hover:bg-black hover:bg-opacity-30"
                    >
                      <span>Release</span>
                      {getSortIcon("createdAt")}
                    </Button>
                  </TableHead>
                  <TableHead style={{ width: "15%" }}>
                    <Button
                      variant="ghost"
                      onClick={() => sortSongs("genres")}
                      className="flex items-center space-x-1 text-white text-lg font-bold hover:text-white hover:bg-black hover:bg-opacity-30"
                    >
                      <span>Genre</span>
                      {getSortIcon("genres")}
                    </Button>
                  </TableHead>
                  <TableHead style={{ width: "15%" }}>
                    <Button
                      variant="ghost"
                      onClick={() => sortSongs("totalView")}
                      className="flex items-center space-x-1 text-white text-lg font-bold hover:text-white hover:bg-black hover:bg-opacity-30"
                    >
                      <span>Views</span>
                      {getSortIcon("totalView")}
                    </Button>
                  </TableHead>
                </TableHeader>
                <TableBody>
                  {playlist.songs.map((song, index) => (
                    <TableRow key={song.id} className="border-none cursor-pointer hover:bg-transparent group">
                      <TableCell className="font-bold text-lg">{index + 1}</TableCell>
                      <TableCell className="bg-[#2E2E2E] group-hover:bg-[#595959] p-0">
                        <div className="flex items-center space-x-4">
                          <Image
                            src="https://via.placeholder.com/50"
                            alt={`${song.songName} Thumbnail`}
                            width={55}
                            height={55}
                            className="rounded-md"
                          />
                          <div>
                            <p className="font-bold text-white">{song.songName}</p>
                            <p className="text-muted-foreground text-sm text-white">{song.artists}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-gray-400 bg-[#2E2E2E] group-hover:bg-[#595959]">
                        {song.createdAt ? new Date(song.createdAt).toLocaleDateString() : "N/A"}
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-gray-400 bg-[#2E2E2E] group-hover:bg-[#595959]">
                        {song.genres.length > 0 ? song.genres.join(", ") : "No genre"}
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-gray-400 bg-[#2E2E2E] group-hover:bg-[#595959]">
                        {song.totalView ?? 0}
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-gray-400 bg-[#2E2E2E] group-hover:bg-[#595959]">
                        <div className="flex items-center">
                          <div className="ml-4">{/* <LikeButton songId={""} /> */}</div>
                          <div className="ml-4">
                            <AddToPlaylistButton songId={""} />
                          </div>
                        </div>
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
