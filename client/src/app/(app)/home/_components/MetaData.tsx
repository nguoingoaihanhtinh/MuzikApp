"use client";

import { AppButton } from "@/components/ui/AppButton";
import Image from "next/image";
import { Plus } from "lucide-react";
import AlbumCard from "@/components/ui/AlbumCard";
import { useRouter } from "next/navigation";

const artists = [
  { name: "Eminem", image: "https://picsum.photos/400/400?random=1" },
  { name: "The Weekend", image: "https://picsum.photos/400/400?random=2" },
  { name: "Adele", image: "https://picsum.photos/400/400?random=3" },
  { name: "Lana Del Ray", image: "https://picsum.photos/400/400?random=4" },
  { name: "Harry Styles", image: "https://picsum.photos/400/400?random=5" },
  { name: "Billie Eilish", image: "https://picsum.photos/400/400?random=6" },
  { name: "Billie Baby", image: "https://picsum.photos/400/400?random=7" },
  { name: "Dog Eilish", image: "https://picsum.photos/400/400?random=8" },
];

const albums = [
  {
    title: "Adele 21",
    artist: "Adele",
    image: "https://picsum.photos/400/400?random=7",
  },
  {
    title: "Scorpion",
    artist: "Drake",
    image: "https://picsum.photos/400/400?random=8",
  },
  {
    title: "Harry's House",
    artist: "Harry Styles",
    image: "https://picsum.photos/400/400?random=9",
  },
  {
    title: "Born To Die",
    artist: "Lana Del Rey",
    image: "https://picsum.photos/400/400?random=10",
  },
  {
    title: "Beauty Behind the...",
    artist: "The Weekend",
    image: "https://picsum.photos/400/400?random=11",
  },
  {
    title: "Beauty Behind the...",
    artist: "The Weekend",
    image: "https://picsum.photos/400/400?random=11",
  },
  {
    title: "Beauty Behind the...",
    artist: "The Weekend",
    image: "https://picsum.photos/400/400?random=11",
  },
  {
    title: "Beauty Behind the...",
    artist: "The Weekend",
    image: "https://picsum.photos/400/400?random=11",
  },
  {
    title: "Beauty Behind the...",
    artist: "The Weekend",
    image: "https://picsum.photos/400/400?random=11",
  },
  {
    title: "Beauty Behind the...",
    artist: "The Weekend",
    image: "https://picsum.photos/400/400?random=11",
  },
];

const playlist = [
  {
    title: "My Favorites",
    image: "https://picsum.photos/400/400?random=12",
  },
  {
    title: "Workout Mix",
    image: "https://picsum.photos/400/400?random=13",
  },
  {
    title: "Chill Vibes",
    image: "https://picsum.photos/400/400?random=14",
  },
  {
    title: "Party Time",
    image: "https://picsum.photos/400/400?random=15",
  },
  {
    title: "Study Focus",
    image: "https://picsum.photos/400/400?random=16",
  },
];

const ViewAllFeature = ({ link }: { link: string }) => {
  const router = useRouter();

  return (
    <AppButton
      className={`flex flex-col items-center justify-center space-y-2 group w-[10%] `}
      onClick={() => {
        router.push(link);
      }}
    >
      <div className="p-2 rounded-full bg-[#1E1E1E] group-hover:bg-[#434343] transition-colors duration-200 mt-6">
        <Plus className="text-general-white group-hover:text-general-pink-hover transition-colors duration-200" />
      </div>
      <p className="font-[16px] text-general-white group-hover:text-general-pink-hover transition-colors duration-200">
        View All
      </p>
    </AppButton>
  );
};

const ArtistCard = ({ name, image }: { name: string; image: string }) => {
  return (
    <div key={name} className="flex flex-col items-center">
      <div className="relative w-full aspect-square">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover rounded-full"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <span className="mt-2 text-sm text-gray-200">{name}</span>
    </div>
  );
};

const PlaylistCard = ({ title, image }: { title: string; image: string }) => {
  return (
    <div className="flex flex-col bg-[#1F1F1F] p-2">
      <div className="relative w-full aspect-square">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <span className="mt-2">{title}</span>
    </div>
  );
};

export default function MetaData() {
  return (
    <div className="text-white space-y-8 w-[90%] flex flex-col">
      <section className="flex flex-col w-full">
        <h2 className="text-2xl font-bold mb-4">
          Popular <span className="text-pink-500">Artists</span>
        </h2>
        <div className="flex flex-row items-center">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 w-full">
            {artists.slice(0, 6).map((artist, idx) => (
              <ArtistCard key={idx} name={artist.name} image={artist.image} />
            ))}
          </div>
          {artists.length >= 6 ? <ViewAllFeature link="/artists" /> : <div className="flex w-[10%]" />}
        </div>
      </section>
      <section className="flex flex-col w-full">
        <h2 className="text-2xl font-bold mb-4">
          Top <span className="text-pink-500">Albums</span>
        </h2>
        <div className="flex flex-row items-center">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 w-full">
            {albums.slice(0, 5).map((album, idx) => (
              <AlbumCard key={idx} title={album.title} image={album.image} artist={album.artist} />
            ))}
          </div>
          {albums.length >= 5 ? <ViewAllFeature link={"/albums"} /> : <div className="flex w-[10%]" />}
        </div>
      </section>
      <section className="flex flex-col w-full">
        <h2 className="text-2xl font-bold mb-4">
          Mood <span className="text-pink-500">Playlists</span>
        </h2>
        <div className="flex flex-row items-center">
          <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 w-full`}>
            {playlist.slice(0, 5).map((playlist, idx) => (
              <PlaylistCard key={idx} title={playlist.title} image={playlist.image} />
            ))}
          </div>
          {playlist.length >= 5 ? <ViewAllFeature link="/playlists" /> : <div className="flex w-[10%]" />}
        </div>
      </section>
    </div>
  );
}
