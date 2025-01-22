import React, { useEffect, useState } from "react";
import { MdClose, MdFavorite } from "react-icons/md";
import usePlayerStore from "@/stores/player-store";
import { getSongById } from "@/actions/song-actions";
import Image from "next/image";
import Lyric from "./Lyric";

const SongDetailPanel = () => {
  const { activeSong } = usePlayerStore();
  const [songDetails, setSongDetails] = useState<any>(null);

  useEffect(() => {
    if (activeSong) {
      const fetchSongDetails = async () => {
        try {
          const song = await getSongById(activeSong.id);
          setSongDetails(song);
        } catch (error) {
          console.error("Error fetching song details:", error);
        }
      };

      fetchSongDetails();
    }
  }, [activeSong]);

  if (!songDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div
      className="h-screen hidden sticky top-0 md:flex bg-[#181818] text-white flex-col min-h-screen border-l border-l-general-pink shadow-[8px_0px_24.2px_0px_rgba(238,16,176,0.15)] animate-[border-pulse_2s_ease-in-out_infinite]"
      style={{ width: "400px" }}
    >
      <div className="overflow-y-scroll">
        <div className="w-full flex flex-col bg-transparent text-general-white items-center p-4">
          <div className="top-container flex justify-between w-full p-4">
            <h4 className="text-lg text-white font-bold">{songDetails.songName}</h4>
            <div className="interact flex">
              <p>
                <MdClose />
              </p>
            </div>
          </div>
          <div className="bg"></div>
          <div className="low-container flex flex-col w-full">
            <div className="artists flex items-center justify-between">
              <div className="infor">
                <h4 className="text-2xl text-white font-bold">{songDetails.songName}</h4>
                <p className="text-xl text-gray-500 font-semibold">
                  {songDetails.artists.map((artist: any) => artist.artistName).join(", ")}
                </p>
              </div>
              <div className="icons">
                <MdFavorite />
              </div>
            </div>

            {/* Lyrics Section */}
            <div className="lyric bg-blue-800 p-4 mt-4 rounded-xl" style={{ maxHeight: "300px", overflowY: "auto" }}>
              <h5 className="text-white text-lg font-bold sticky top-0 bg-blue-800 p-1 z-10">Lyrics</h5>
              <div className="text-lg py-5" style={{ maxHeight: "240px", overflowY: "auto" }}>
                <Lyric isBig={false} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SongDetailPanel;
