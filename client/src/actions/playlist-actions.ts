"server only";

import client from "@/services/client";
import { Playlist } from "@/types/global";

export interface PlaylistPayload {
  playlistName: string;
  description: string;
}

export async function getAllPlaylists(): Promise<Playlist[]> {
  try {
    const response = await client<Playlist[]>("/api/playlists", {
      method: "GET",
    });

    return response.data;
  } catch (error) {
    console.error("get all playlists error: ", error);
    throw error;
  }
}

export async function createPlaylist({ payload }: { payload: PlaylistPayload }): Promise<void> {
  try {
    const formData = new FormData();
    formData.append("PlaylistName", payload.playlistName);
    formData.append("Description", payload.description);

    await client("/api/playlists", {
      method: "POST",
      body: formData,
    });
  } catch (error) {
    console.error("Error creating playlist: ", error);
    throw error;
  }
}
