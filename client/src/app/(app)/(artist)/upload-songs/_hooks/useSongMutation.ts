"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteSong, addSong, AddSongPayload, UpdateSongPayload, updateSong } from "@/actions/song-actions";
import { useUser } from "@/contexts/UserContext";

export function useAddSongMutation() {
  const queryClient = useQueryClient();
  const { userDetails } = useUser();

  const mutation = useMutation({
    mutationFn: async (data: AddSongPayload) => {
      if (!userDetails?.id || userDetails.roles[0] !== "Artist") {
        throw new Error("You must be an artist to upload a song.");
      }

      const formData = new FormData();
      formData.append("songName", data.songName);
      formData.append("description", data.description);
      formData.append("lyricFile", data.lyricFile || "");
      formData.append("musicFile", data.musicFile);

      if (data.photoFiles) {
        data.photoFiles.forEach((file, index) => {
          formData.append(`photoFiles[${index}]`, file);
        });
      }

      data.genreIds.forEach((id) => {
        formData.append("genreIds", id.toString());
      });

      // Ensure userDetails.id is already included in artistIds
      data.artistIds.forEach((id) => {
        formData.append("artistIds", id.toString());
      });

      const response = await addSong(formData);
      return response;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["songs"] });
    },
  });

  return mutation;
}

export function useUpdateSongMutation() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateSongPayload }) => {
      const formData = new FormData();
      if (data.songName) formData.append("songName", data.songName);
      if (data.description) formData.append("description", data.description);
      if (data.lyricFile) formData.append("lyricFile", data.lyricFile);
      if (data.musicFile) formData.append("musicFile", data.musicFile);
      if (data.photoFiles) {
        data.photoFiles.forEach((file, index) => {
          formData.append(`photoFiles[${index}]`, file);
        });
      }
      if (data.genreIds) {
        data.genreIds.forEach((id: number) => {
          formData.append("genreIds", id.toString());
        });
      }

      await updateSong(id, formData);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["songs"],
      });
    },
  });

  return mutation;
}

export function useDeleteSongMutation() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await deleteSong(id);
      return response;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["songs"],
      });
    },
  });

  return mutation;
}
