"use client";

import { useSearchParams } from "next/navigation"

export default function TeamView() {
  const searchParams = useSearchParams();
  let team = searchParams.get("team");
  return (
    <div>
      <h1>Team View for {team}</h1>
    </div>
  )
}
