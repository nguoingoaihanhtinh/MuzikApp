import React, { useEffect, useState } from "react";
import { MdClose, MdExpandLess, MdExpandMore, MdFavorite } from "react-icons/md";
import usePlayerStore from "@/stores/player-store";
import { getSongById } from "@/actions/song-actions";
import Image from "next/image";
import Lyric from "./Lyric";

const SongDetailPanel = () => {
  const { activeSong } = usePlayerStore();
  const [songDetails, setSongDetails] = useState<any>(null);
  const [showLyrics, setShowLyrics] = useState(true);
  const [showDescription, setShowDescription] = useState(true);
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
          <div
            className="bg"
            style={{
              backgroundImage: `url("${songDetails.songPhotoUrl}")`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              height: "200px",
              width: "100%",
              borderRadius: "8px",
            }}
          ></div>

          <div className="low-container flex flex-col w-full">
            <div className="artists flex items-center justify-between">
              <div className="infor">
                <h4 className="text-2xl text-white font-bold">{songDetails.songName}</h4>
                <div className="text-xl text-gray-500 font-semibold">
                  {songDetails.artists.map((artist: any, index: number) => (
                    <div key={artist.artistId || index}>{artist.artistName}</div>
                  ))}
                </div>
              </div>
              <div className="icons">
                <MdFavorite />
              </div>
            </div>

            {/* Lyrics Section */}
            <div className="lyric-section mt-4">
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => setShowLyrics(!showLyrics)}
              >
                <h5 className="text-white text-lg font-bold">Lyrics</h5>
                {showLyrics ? <MdExpandLess className="text-white" /> : <MdExpandMore className="text-white" />}
              </div>
              {showLyrics && (
                <div className="bg-blue-950 p-4 mt-2 rounded-xl" style={{ maxHeight: "300px", overflowY: "auto" }}>
                  <div className="text-lg " style={{ maxHeight: "240px", overflowY: "auto" }}>
                    <Lyric isBig={false} />
                  </div>
                </div>
              )}
            </div>

            {/* Description Section */}
            <div className="description-section mt-4">
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => setShowDescription(!showDescription)}
              >
                <h5 className="text-white text-lg font-bold">Description</h5>
                {showDescription ? <MdExpandLess className="text-white" /> : <MdExpandMore className="text-white" />}
              </div>
              {showDescription && (
                <div className="p-4 mt-2 rounded-xl bg-gray-800">
                  <p className="text-gray-300 text-sm mt-2">{songDetails.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SongDetailPanel;
