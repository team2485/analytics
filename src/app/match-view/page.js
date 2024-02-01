"use client";
import { useEffect, useState } from "react";
import styles from "./page.module.css";
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, ResponsiveContainer, Cell } from 'recharts';
import { VictoryPie } from "victory";


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

    const COLORS = ['#aa4444', '#f9952a', '#c1c46b', '#95c46b'];

    const endgameData = [{ x: 'None', y: teamData.endgame.none },
              { x: 'Park', y: teamData.endgame.park },
              { x: 'Onstage', y: teamData.endgame.onstage },
              { x: 'Onstage Harmony', y: teamData.endgame.onstageHarmony }];



    return <div className={styles.matchTeam}>
      <h1>{teamData.team}</h1>
      <h2>{teamData.teamName}</h2>
      <div className={styles.scoreBreakdownContainer}>
        <div className={styles.espmBox}>{teamData.auto + teamData.tele + teamData.end}</div>
        <div className={styles.espmBreakdown}>
          <div>a: {teamData.auto}</div>
          <div>t: {teamData.tele}</div>
          <div>e: {teamData.end}</div>
        </div>
      </div>
      <br></br>
      <div className={styles.chartContainer}>
        <h2>Average Note Placement</h2>
        <ResponsiveContainer width="100%">
          <BarChart
            data={[{
              place: "Speaker",
              value: teamData.avgNotes.speaker
            },
            {
              place: "⬆️ Spkr",
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
              bottom: 30,
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
      <br></br>
      <div className={styles.chartContainer}>
        <h2>Endgame %</h2>
        <VictoryPie
          data={endgameData}
          colorScale={["#92BDF1", "#839CE3", "#757BD5", "#665AC7"]}
          labels={({ datum }) => `${datum.x}: ${datum.y}%`}
        />
      </div>
      <br></br>
      <br></br>
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
