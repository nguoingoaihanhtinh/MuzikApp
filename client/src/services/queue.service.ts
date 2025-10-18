import client from "./client";
import { getAuthTokenFromCookies } from "@/actions/utils";
import type { Song } from "@/types/global";

export interface QueueDto {
  current?: Song | null;
  upcoming: Song[];
}

export async function getQueue(): Promise<QueueDto> {
  const token = await getAuthTokenFromCookies();
  const resp = await client<QueueDto>("/api/queue", {
    method: "GET",
    headers: token ? { Authorization: token } : undefined,
  });
  return resp.data;
}

export async function addToQueue(songId: number): Promise<QueueDto> {
  const token = await getAuthTokenFromCookies();
  const resp = await client<QueueDto>("/api/queue/add", {
    method: "POST",
    headers: token ? { Authorization: token } : undefined,
    body: JSON.stringify({ songId }),
  });
  return resp.data;
}
