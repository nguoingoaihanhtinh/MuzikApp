import * as z from "zod";

// ✅ Your existing Zod schema
export const formSchema = z.object({
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

// ✅ Inferred type for React Hook Form
export type FormValues = z.infer<typeof formSchema>;
