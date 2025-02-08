"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FaHome,
  FaSearch,
  FaMusic,
  FaUserAlt,
  FaClock,
  FaHeart,
  FaPlus,
  FaCog,
  FaPersonBooth,
  FaSignOutAlt,
} from "react-icons/fa";
import { useUser } from "@/contexts/UserContext";
import { useLoading } from "@/contexts/LoadingContext";
import { IconType } from "react-icons/lib";
import AddPlaylistModal from "./AddPlaylistModal";
import { Playlist } from "@/types/global";
import { getMyPlaylists } from "@/actions/playlist-actions";

export type SidebarItem = {
  name: string;
  icon: IconType;
  href: string;
};

export type SidebarSection = {
  title: string;
  items: SidebarItem[];
};

const sidebarSections: SidebarSection[] = [
  {
    title: "Menu",
    items: [
      { name: "Home", icon: FaHome, href: "/home" },
      { name: "Discover", icon: FaSearch, href: "/discover" },
      { name: "Albums", icon: FaMusic, href: "/albums" },
      { name: "Artists", icon: FaUserAlt, href: "/artists" },
    ],
  },
  {
    title: "Library",
    items: [
      { name: "Recently Added", icon: FaClock, href: "/recently-added" },
      { name: "Most Played", icon: FaMusic, href: "/most-played" },
    ],
  },

  {
    title: "General",
    items: [
      { name: "Profile", icon: FaPersonBooth, href: "/profile" },
      { name: "Settings", icon: FaCog, href: "/settings" },
      { name: "Logout", icon: FaSignOutAlt, href: "#" },
    ],
  },
];

const Sidebar = ({ paddingBottom = "0" }) => {
  const { logout, isAuthenticated } = useUser();
  const { setLoadingState } = useLoading();
  const [isAddPlaylistModalOpen, setIsAddPlaylistModalOpen] = useState(false);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [favorites, setFavorites] = useState<Playlist[]>([]);
  const pathname = usePathname();
  const router = useRouter();
  useEffect(() => {
    console.log("hellop");
    async function fetchPlaylists() {
      try {
        const playlistData = await getMyPlaylists();
        const favoriteData = await getMyPlaylists();
        console.log("playl9ost", playlistData);
        setPlaylists(playlistData.slice(0, 3)); // Limit to 3 items
        setFavorites(favoriteData.slice(0, 1));
      } catch (error) {
        console.error("Failed to fetch playlists:", error);
      }
    }
    fetchPlaylists();
  }, []);
  const handleLogout = () => {
    setLoadingState(true);
    logout();
    router.push("/login");
    setLoadingState(false);
  };

  return (
    <div
      className={`h-screen sticky top-0 animated-border z-2 flex-col min-h-screen text-white max-w-fit p-6 border-r border-r-general-pink shadow-[8px_0px_24.2px_0px_rgba(238,16,176,0.15)] animate-[border-pulse_2s_ease-in-out_infinite] ${isAuthenticated ? `flex` : `hidden`}`}
    >
      <div
        className="overflow-y-scroll"
        style={{
          paddingBottom,
        }}
      >
        {/* Logo */}
        <h1
          onClick={() => {
            router.push("/home");
          }}
          className="title-text-gradient mb-8 cursor-pointer"
        >
          Lora
        </h1>

        {sidebarSections.map((section, index) => (
          <div key={section.title} className={index !== sidebarSections.length - 1 ? "mb-4" : ""}>
            <h3 className="sidebar-second-header tracking-wide mb-3 whitespace-nowrap">{section.title}</h3>
            <ul>
              {section.items.map((item) => (
                <li key={item.name} className="flex flex-col">
                  {item.name === "Logout" ? (
                    <button onClick={handleLogout} className={`group flex items-center space-x-3 p-2`}>
                      <item.icon
                        className={`text-xs group-hover:text-pink-500 ${pathname === item.href ? "text-general-pink" : ""}`}
                      />
                      <span
                        className={`sub-header whitespace-nowrap group-hover:text-pink-500 ${pathname === item.href ? "text-general-pink" : ""}`}
                      >
                        {item.name}
                      </span>
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      className={`group flex items-center space-x-3 hover:bg-slate-400/20 p-2 rounded-md`}
                    >
                      <item.icon
                        className={`text-xs group-hover:text-pink-500 ${pathname === item.href ? "text-general-pink" : ""}`}
                      />
                      <span
                        className={`sub-header whitespace-nowrap group-hover:text-pink-500 ${pathname === item.href ? "text-general-pink" : ""}`}
                      >
                        {item.name}
                      </span>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Playlist and Favorites Section */}
        <div className="mb-4">
          <h3 className="sidebar-second-header tracking-wide mb-3 whitespace-nowrap">Playlist and Favorite</h3>
          <ul>
            {/* Favorites Section */}
            {favorites.map((fav) => (
              <li key={fav.id} className="flex flex-col">
                <Link
                  href={`/favorite/${fav.id}`}
                  className="group flex items-center space-x-3 hover:bg-slate-400/20 p-2 rounded-md"
                >
                  <FaHeart className="text-xs group-hover:text-pink-500" />
                  <span className="sub-header whitespace-nowrap group-hover:text-pink-500">{fav.playlistName}</span>
                </Link>
              </li>
            ))}

            {/* Playlists Section */}
            {playlists.map((playlist) => (
              <li key={playlist.id} className="flex flex-col">
                <Link
                  href={`/playlist/${playlist.id}`}
                  className="group flex items-center space-x-3 hover:bg-slate-400/20 p-2 rounded-md"
                >
                  <FaMusic className="text-xs group-hover:text-pink-500" />
                  <span className="sub-header whitespace-nowrap group-hover:text-pink-500">
                    {playlist.playlistName}
                  </span>
                </Link>
              </li>
            ))}

            {/* Add Playlist Button */}
            <li className="flex flex-col">
              <div
                onClick={() => setIsAddPlaylistModalOpen(true)}
                className="group flex items-center space-x-3 hover:bg-slate-400/20 p-2 rounded-md cursor-pointer"
              >
                <FaPlus className="text-xs group-hover:text-pink-500" />
                <span className="sub-header whitespace-nowrap group-hover:text-pink-500">Add Playlist</span>
              </div>
            </li>
          </ul>
        </div>

        {/* Add Playlist Modal */}
        <AddPlaylistModal isOpen={isAddPlaylistModalOpen} onClose={() => setIsAddPlaylistModalOpen(false)} />
      </div>
    </div>
  );
};

export default Sidebar;
