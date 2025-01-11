import React from "react";
import Link from "next/link";
import DynamicImage from "../custom/DynamicImage";

interface ArtistCardProps {
  imageUrl: string;
  name: string;
}

const ArtistCard: React.FC<ArtistCardProps> = ({ imageUrl, name }) => {
  return (
    <Link href="/artist-detail">
      <div className="artist-card flex flex-col items-center text-center">
        {/* Artist Image */}
        <div className="rounded-full overflow-hidden w-36 h-36 mb-4 shadow-lg">
          <DynamicImage src={imageUrl} alt={name} className="w-full h-full object-cover" />
        </div>
        <span className="text-white text-md font-medium">{name}</span>
      </div>
    </Link>
  );
};

export default ArtistCard;
