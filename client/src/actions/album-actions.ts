import client from "@/services/client";
import { Album, AlbumPayload } from "@/types/global";

export async function getAllAlbums(
  pageNumber: number = 1,
  pageSize: number = 10,
  sortBy: string = "asc"
): Promise<Album[]> {
  try {
    const response = await client<Album[]>(
      `/api/albums?SortBy=${sortBy}&PageNumber=${pageNumber}&PageSize=${pageSize}`,
      {
        method: "GET",
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching all albums: ", error);
    throw error;
  }
}

export async function createAlbum({ payload }: { payload: AlbumPayload }): Promise<Album> {
  try {
    const formData = new FormData();
    formData.append("AlbumName", payload.albumName);
    formData.append("Description", payload.description);
    if (payload.photoFiles) {
      payload.photoFiles.forEach((file) => formData.append("PhotoFiles", file));
    }

    const response = await client("/api/albums", {
      method: "POST",
      body: formData,
    });
    return response.data as Album;
  } catch (error) {
    console.error("Error creating album: ", error);
    throw error;
  }
}

export async function addSongToAlbum(albumId: number, songId: number): Promise<void> {
  try {
    const payload = { SongId: songId };
    await client(`/api/albums/add-song/${albumId}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.error("Error adding song to album: ", error);
    throw error;
  }
}

export async function removeSongFromAlbum(albumId: number, songId: number): Promise<void> {
  try {
    const payload = { SongId: songId };
    await client(`/api/albums/remove-song/${albumId}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.error("Error removing song from album: ", error);
    throw error;
  }
}
