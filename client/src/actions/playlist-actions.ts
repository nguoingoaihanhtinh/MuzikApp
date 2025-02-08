"use server";

import client from "@/services/client";
import { Playlist } from "@/types/global";

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
