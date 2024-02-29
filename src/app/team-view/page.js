"use client";

import { useSearchParams } from "next/navigation"
import { Suspense } from "react";

export default function TeamViewPage() {
  return <Suspense>
    <TeamView/>
  </Suspense>
}

function TeamView() {
  const searchParams = useSearchParams();
  let team = searchParams.get("team");

  return (
    <div>
      <h1>Team View for {team}</h1>
    </div>
  )
}
