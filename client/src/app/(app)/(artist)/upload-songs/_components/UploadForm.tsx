"use client";

import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/Button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Badge } from "@/components/ui/Badge";
import { Music, FileText, X } from "lucide-react";
import { AppButton } from "@/components/ui/AppButton";
import { useQuery } from "@tanstack/react-query";
import { getAllGenres } from "@/actions/genre-actions";
import GenreSelect from "./GenreSelect";
import ArtistSelect from "./ArtistSelect";
import DynamicImage from "@/components/custom/DynamicImage";
import { getAllAritst } from "@/actions/user-actions";
import { useAddSongMutation } from "../_hooks/useSongMutation";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import { AddSongPayload } from "@/actions/song-actions";

const formSchema = z.object({
  songName: z.string().min(1, "Song name is required"),
  description: z.string().optional(),
  lyricFile: z
    .instanceof(File, { message: "Lyric file is required" })
    .refine(
      (file) => file.type === "text/plain" || file.name.toLowerCase().endsWith(".lrc"),
      "Only .lrc lyric files are allowed"
    )
    .refine((file) => file.size <= 5 * 1024 * 1024, "File size must be less than 5MB"),
  musicFile: z
    .instanceof(File, { message: "Music file is required" })
    .refine(
      (file) => ["audio/mpeg", "audio/mp4", "video/mp4"].includes(file.type),
      "Only MP3 and MP4 audio files are allowed"
    )
    .refine((file) => file.size <= 20 * 1024 * 1024, "File size must be less than 20MB"),
  photoFiles: z
    .array(z.instanceof(File))
    .min(1, "At least one photo is required")
    .refine(
      (files) => files.every((file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type)),
      "Only JPEG, PNG, and WEBP image files are allowed"
    )
    .refine((files) => files.every((file) => file.size <= 5 * 1024 * 1024), "Each photo file must be less than 5MB"),
  genreIds: z.array(z.number()).min(1, "At least one genre is required"),
  coAritstIds: z.array(z.number()).optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function UploadForm() {
  const router = useRouter();
  const { userDetails } = useUser();
  const { data: genresData } = useQuery({
    queryKey: ["genres", "upload_song"],
    queryFn: async () => {
      return await getAllGenres({ pageSize: 30 });
    },
  });

  const { data: artistsData } = useQuery({
    queryKey: ["user_artist", "upload_song"],
    queryFn: async () => {
      return (await getAllAritst()).artist.filter((artist) => artist.artistName !== null && artist.artistName !== "");
    },
  });
  const addSongMutation = useAddSongMutation();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      songName: "",
      genreIds: [],
      coAritstIds: [],
    },
  });

  const CreateDropzone = (fieldName: keyof FormValues) => {
    const onDrop = (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        form.setValue(fieldName, acceptedFiles[0], {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true,
        });
      }
    };

    const acceptMap = {
      musicFile: {
        "audio/mpeg": [".mp3"],
        "audio/mp4": [".mp4", ".m4a"],
      },
      lyricFile: {
        "text/plain": [".lrc"],
      },
      photoFiles: {
        "image/*": [".png", ".jpg", ".jpeg", ".webp"],
      },
    };

    return useDropzone({
      onDrop,
      accept: acceptMap[fieldName as keyof typeof acceptMap],
      maxFiles: fieldName === "photoFiles" ? 5 : 1,
    });
  };
  const musicDropzone = CreateDropzone("musicFile");
  const lyricDropzone = CreateDropzone("lyricFile");
  const photoDropzone = CreateDropzone("photoFiles");

  const onSubmit = (data: FormValues) => {
    console.log("data upload form data: ", data);
    if (!userDetails?.id || userDetails.roles[0] !== "Artist") {
      toast.error("You must be an artist to upload a song.");
      return;
    }
    const payload: AddSongPayload = {
      songName: data.songName,
      description: data.description || "",
      lyricFile: data.lyricFile,
      musicFile: data.musicFile,
      photoFiles: data.photoFiles,
      genreIds: data.genreIds,
      artistIds: [userDetails.id, ...(data.coAritstIds || [])], // Ensure artist ID is included
    };
    addSongMutation.mutate(payload, {
      onSuccess: () => {
        toast.success("Song uploaded successfully!");
        router.push("/home");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col w-full">
      <div className="flex flex-col w-full mx-auto p-4 space-y-4">
        {/* Header */}
        <div className="rounded-lg overflow-hidden">
          <div className="flex from-purple-600 via-pink-500 to-yellow-500 p-4 justify-center items-center bg-[url('/music-landing-bg.webp')] bg-cover bg-center">
            <h1 className="text-2xl font-bold">
              UPLOAD A <span className="text-pink-500">SONG</span>
            </h1>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col space-y-4">
            {/* Audio Upload */}
            <FormField
              control={form.control}
              name="musicFile"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div
                      {...musicDropzone.getRootProps()}
                      className={`border-2 border-dashed border-gray-600 rounded-lg p-6 flex items-center justify-between cursor-pointer ${
                        musicDropzone.isDragActive ? "border-general-pink" : ""
                      }`}
                    >
                      <input {...musicDropzone.getInputProps()} />
                      <div className="flex items-center gap-4">
                        <Music className="w-8 h-8" />
                        <span>
                          {field.value
                            ? `Selected: ${field.value.name}`
                            : 'Drag and drop audio file in ".mp3" or ".mp4" extension to get started.'}
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="secondary"
                        className="bg-general-pink hover:bg-general-pink-hover text-white"
                      >
                        Choose file
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Lyrics file Upload */}
            <FormField
              control={form.control}
              name="lyricFile"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div
                      {...lyricDropzone.getRootProps()}
                      className={`border-2 border-dashed border-gray-600 rounded-lg p-6 flex items-center justify-between cursor-pointer ${
                        lyricDropzone.isDragActive ? "border-general-pink" : ""
                      }`}
                    >
                      <input {...lyricDropzone.getInputProps()} />
                      <div className="flex items-center gap-4">
                        <FileText className="w-8 h-8" />
                        <span>
                          {field.value
                            ? `Selected: ${field.value.name}`
                            : 'Drag and drop lyric file in ".lrc" extension.'}
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="secondary"
                        className="bg-general-pink hover:bg-general-pink-hover text-white"
                      >
                        Choose file
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Song's Artwork and Side datas */}
            <div className="flex flex-row w-[100%]">
              <FormField
                control={form.control}
                name="photoFiles"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div
                        {...photoDropzone.getRootProps()}
                        className={`h-full w-full aspect-square border-2 border-dashed border-gray-600 rounded-lg p-6 flex items-center justify-center cursor-pointer ${
                          photoDropzone.isDragActive ? "border-general-pink" : ""
                        }`}
                      >
                        <input
                          {...photoDropzone.getInputProps()}
                          onChange={(e) => {
                            const files = Array.from(e.target.files || []);
                            if (files.length > 0) {
                              // Ensure only one image is stored in the array
                              field.onChange([files[0]]);
                            }
                          }}
                        />

                        {field.value && field.value.length > 0 ? (
                          <DynamicImage alt={field.value[0].name} src={URL.createObjectURL(field.value[0])} />
                        ) : (
                          <div className="flex flex-col items-center gap-4">
                            <FileText className="w-8 h-8" />
                            <span className="text-nowrap">Add New Artwork</span>
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-col space-y-6 p-4 text-foreground w-[100%]">
                <FormField
                  control={form.control}
                  name="songName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">
                        Song title <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Enter song title" {...field} className="bg-background border-input" />
                      </FormControl>
                    </FormItem>
                  )}
                />
                {/* Specify Added Genres */}
                <FormField
                  control={form.control}
                  name="genreIds"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">
                        Genre <span className="text-destructive">*</span>
                      </FormLabel>
                      {/* Display selected genres */}
                      <div className="flex flex-wrap gap-2 mb-2">
                        {field.value.map((genreId) => {
                          const genreName = genresData?.find((genre) => genre.id === genreId)?.genreName;
                          return (
                            <Badge key={genreId} variant="secondary" className="gap-1">
                              {genreName}
                              <X
                                className="h-3 w-3 cursor-pointer"
                                onClick={() => {
                                  field.onChange(field.value.filter((id) => id !== genreId));
                                }}
                              />
                            </Badge>
                          );
                        })}
                      </div>
                      <GenreSelect genresData={genresData || []} field={field} />
                    </FormItem>
                  )}
                />
                {/*Specify Added Artists*/}
                <FormField
                  control={form.control}
                  name="coAritstIds"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Co-artists (Optional)</FormLabel>
                      {/* Display selected artists */}
                      <div className="flex flex-wrap gap-2 mb-2">
                        {field.value?.map((artistId) => {
                          const artistName = artistsData?.find((artist) => artist.id === artistId)?.artistName;
                          return (
                            <Badge key={artistId} variant="secondary" className="gap-1">
                              {artistName}
                              <X
                                className="h-3 w-3 cursor-pointer"
                                onClick={() => {
                                  field.onChange(field.value?.filter((id) => id !== artistId) || []);
                                }}
                              />
                            </Badge>
                          );
                        })}
                      </div>
                      <ArtistSelect artistsData={artistsData || []} field={field} />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            {/*Song's Description*/}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your song Why - When - How - Where - What - Who should be fine."
                      className="flex flex-col w-full min-h-[25vh] border-general-pink/30 rounded-lg text-general-white"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Upload Button */}
            <div className="flex justify-center">
              <AppButton
                type="submit"
                className="bg-blue-500 hover:bg-general-pink-hover transition-colors duration-200 px-8"
              >
                Upload
              </AppButton>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
