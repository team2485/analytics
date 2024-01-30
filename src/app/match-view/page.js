"use client";
import { useEffect, useState } from "react"
import styles from "./page.module.css";

export default function MatchView() {
  //TODO: import match data from blue alliance
  const [data, setData] = useState();
  useEffect(() => {
    //fetch("/api/get-alliance-data?team1=2485&team2=3485&team3=4485").then(resp => resp.json()).then(data => setData(data));
    setData({
      team1: {
        team: 2485,
        teamName: "W.A.R. Lords",
        auto: 10,
        tele: 27,
        end: 5,
        avgNotes: {
          speaker: 10,
          ampedSpeaker: 6,
          amp: 4,
          trap: 1
        },
        endgame: {
          onstageHarmony: 28,
          onstage: 30,
          park: 34,
          none: 8
        }
      },
    })
  }, []);
  
  if (!data) {
    return <div>
      <h1>Loading...</h1>
    </div>
  }

  function TeamDisplay({teamData}) {
    return <div className={styles.matchTeam}>
      <h1>{teamData.team}</h1>
      <h2>{teamData.teamName}</h2>
    </div>
  }

  return (
    <div className={styles.matches}>
      <TeamDisplay teamData={data.team1}></TeamDisplay>
      <TeamDisplay teamData={data.team1}></TeamDisplay>
      <TeamDisplay teamData={data.team1}></TeamDisplay>
    </div>
  )
}
