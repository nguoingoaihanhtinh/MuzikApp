"server only";

import client from "@/services/client";
import { Playlist } from "@/types/global";
import { getAuthTokenFromCookies } from "./utils";

export interface PlaylistPayload {
  playlistName: string;
  description: string;
  playlistImageUrl: string;
  backgroundImageUrl: string;
}
/* token retrieval moved into functions to avoid top-level await */
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
    const token = await getAuthTokenFromCookies();
    if (!token) {
      console.error("No auth token found!");
      return [];
    }

    const response = await client<Playlist[]>("/api/playlists/my", {
      headers: {
        Authorization: token,
      },
    });

    return response.data ?? [];
  } catch (error) {
    console.error("Error fetching playlists:", error);
    return [];
  }
}

export async function createPlaylist(payload: PlaylistPayload): Promise<Playlist> {
  const token = await getAuthTokenFromCookies();
  if (!token) {
    throw new Error("User is not authenticated");
  }

  try {
    const formData = new FormData();
    formData.append("PlaylistName", payload.playlistName);
    formData.append("Description", payload.description);
    formData.append("BackgroundImageUrl", payload.backgroundImageUrl);
    formData.append("PlaylistImageUrl", payload.playlistImageUrl);

    const response = await client<Playlist>("/api/playlists", {
      method: "POST",
      headers: token ? { Authorization: token } : undefined,
      body: formData,
    });

    return response.data;
  } catch (error) {
    console.error("Error creating playlist:", error);
    throw error;
  }
}

export async function addSongToPlaylist(playlistId: number, songId: number): Promise<void> {
  try {
    const token = await getAuthTokenFromCookies();
    await client(`/api/playlists/add-song/${playlistId}`, {
      method: "PUT",
      headers: token ? { Authorization: token } : undefined,
      body: JSON.stringify({ songId }),
    });
  } catch (error) {
    console.error("Error adding song to playlist:", error);
    throw error;
  }
}
export async function removeSongFromPlaylist(playlistId: number, songId: number): Promise<void> {
  try {
    const token = await getAuthTokenFromCookies();
    await client(`/api/playlists/remove-song/${playlistId}`, {
      method: "PUT",
      headers: token ? { Authorization: token } : undefined,
      body: JSON.stringify({ songId }),
    });
  } catch (error) {
    console.error("Error removing song from playlist:", error);
    throw error;
  }
}
