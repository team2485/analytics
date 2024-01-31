"use client";
import { useEffect, useState } from "react";
import styles from "./page.module.css";
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


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
      <div className={styles.scoreBreakdownContainer}>
        <div className={styles.espmBox}>{teamData.auto + teamData.tele + teamData.end}</div>
        <div className={styles.espmBreakdown}>
          <div>{teamData.auto}</div>
          <div>{teamData.tele}</div>
          <div>{teamData.end}</div>
        </div>
      </div>
      <br></br>
      <div className={styles.chartContainer}>
        <h2>Average Note Placement</h2>
        <ResponsiveContainer width="100%">
        <BarChart
          height={100}
          data={[{
            place: "Speaker",
            value: teamData.avgNotes.speaker
          },
          {
            place: "Amp'd Speaker",
            value: teamData.avgNotes.ampedSpeaker
          },
          {
            place: "Amp",
            value: teamData.avgNotes.amp
          },
          {
            place: "Trap",
            value: teamData.avgNotes.trap
          }]}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="place" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#66c" activeBar={<Rectangle fill="gold" stroke="purple" />} />
        </BarChart>
      </ResponsiveContainer>
      </div>

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
