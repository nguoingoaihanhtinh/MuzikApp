"use client";

import Link from "next/link";
import Image from "next/image";
import PlayButton from "../music/PlayButton";

type PlaylistCardProps = {
  id: number;
  image: string;
  title: string;
  songCount: number;
  totalDuration: string;
};

const PlaylistCard: React.FC<PlaylistCardProps> = ({ id, image, title, songCount, totalDuration }) => {
  return (
    <Link href={`/playlist/${id}`}>
      <div className="p-4 flex gap-5 items-center bg-[#1F1F1F] rounded-lg cursor-pointer hover:bg-gray-700 transition">
        <div className="image">
          <Image src={image} alt={title} width={0} height={0} className="w-full rounded-md" />
        </div>
        <div className="content flex flex-col">
          <h3 className="text-white text-lg font-bold ">{title}</h3>
          <p className="text-gray-400 text-sm">
            {songCount} songs • {totalDuration}
          </p>
        </div>
        <div className="playbutton">{/* <PlayButton /> */}</div>
      </div>
    </Link>
  );
};

export default PlaylistCard;
