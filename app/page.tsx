import { fetchAnime } from "@/components/action";
import TestPage from "./test/page";
import LoadMore from "@/components/LoadMore";
import { useState } from "react";

export default async function Home() {
  const data = await fetchAnime(1);

  return (
    <div className="p-5 max-w-[1400px] m-auto">
      <div
        className="
        grid grid-cols-1
        sm:grid-cols-2
        md:grid-cols-4
        1260:grid-cols-4
        xl:grid-cols-4
        2xl:grid-cols-4
        gap-5
    "
      >
        {data}
      </div>
      {/* <TestPage /> */}
      {/* <LoadMore /> */}
    </div>
  );
}
