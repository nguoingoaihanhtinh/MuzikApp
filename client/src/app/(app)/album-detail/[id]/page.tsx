import React from "react";

export default function AlbumDetailPage(props: unknown) {
  const p = props as { params?: { id?: string } };
  const id = p?.params?.id ?? "";
  return <div className="p-4">Album {id}</div>;
}
