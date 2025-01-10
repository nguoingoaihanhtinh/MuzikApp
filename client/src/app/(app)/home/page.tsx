import React from "react";

import MetaData from "./_components/MetaData";
import MusicCards from "./_components/MusicCard";
import MusicLanding from "./_components/MusicLanding";
import TrendingSongs from "./_components/TrendingSongs";

const page = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen h-full w-full space-y-4">
      <MusicLanding />
      <MusicCards />
      <TrendingSongs />
      <MetaData />
    </div>
  );
};

export default page;
