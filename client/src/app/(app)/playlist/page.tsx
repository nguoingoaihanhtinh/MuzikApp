import PlaylistSideBar from "../../../components/Album/PlaylistSideBar";

export default function PlaylistsPage() {
  return (
    <div className="flex w-full min-h-screen pt-10 justify-center">
      <div className="sidebar w-[30%]">
        <PlaylistSideBar />
      </div>
    </div>
  );
}
