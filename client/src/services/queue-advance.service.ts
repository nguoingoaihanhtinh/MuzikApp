import client from "./client";
import { getAuthTokenFromCookies } from "@/actions/utils";
import type { Song } from "@/types/global";

export interface QueueDto {
  current?: Song | null;
  upcoming: Song[];
}

export async function advanceQueue(): Promise<QueueDto> {
  const token = await getAuthTokenFromCookies();
  const resp = await client<QueueDto>("/api/queue/advance", {
    method: "POST",
    headers: token ? { Authorization: token } : undefined,
  });
  return resp.data;
}
