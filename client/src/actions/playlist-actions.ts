"use server";

import client from "@/services/client";
import { Playlist } from "@/types/global";
import { getAuthTokenFromCookies } from "./utils";

export interface PlaylistPayload {
  playlistName: string;
  description: string;
}

export async function getAllPlaylists(): Promise<Playlist[]> {
  try {
    const response = await client<Playlist[]>("/api/playlists");
    return response.data ?? [];
  } catch (error) {
    console.error("Error fetching playlists:", error);
    throw error;
  }
}
export async function getPlaylistDetail(playlistId: number): Promise<Playlist | null> {
  try {
    const response = await client<Playlist>(`/api/playlists/${playlistId}`);
    return response.data ?? null;
  } catch (error) {
    console.error(`Error fetching playlist with ID ${playlistId}:`, error);
    return null;
  }
}

export async function getMyPlaylists(): Promise<Playlist[]> {
  try {
    const token = await getAuthTokenFromCookies(); // Đảm bảo lấy token trước khi tiếp tục
    console.log("Fetched token:", token);
    if (!token) {
      console.error("No auth token found!");
      return [];
    }

    const response = await client<Playlist[]>("/api/playlists/my", {
      headers: {
        Authorization: token, // Không dùng Bearer, vì Postman không yêu cầu
      },
    });

    return response.data ?? [];
  } catch (error) {
    console.error("Error fetching playlists:", error);
    return [];
  }
}

export async function createPlaylist(payload: PlaylistPayload): Promise<void> {
  try {
    await client("/api/playlists", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.error("Error creating playlist:", error);
    throw error;
  }
}
export async function addSongToPlaylist(playlistId: number, songId: number): Promise<void> {
  try {
    await client(`/api/playlists/add-song/${playlistId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ songId }),
    });
  } catch (error) {
    console.error("Error adding song to playlist:", error);
    throw error;
  }
}
export async function removeSongFromPlaylist(playlistId: number, songId: number): Promise<void> {
  try {
    await client(`/api/playlists/remove-song/${playlistId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ songId }),
    });
  } catch (error) {
    console.error("Error removing song from playlist:", error);
    throw error;
  }
}
