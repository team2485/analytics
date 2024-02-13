"use client";
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, ResponsiveContainer, Cell, LineChart, Line, RadarChart, PolarRadiusAxis, PolarAngleAxis, PolarGrid, Radar, Legend } from 'recharts';

export default function TeamView() {
  const [data, setData] = useState(null);
  const searchParams = useSearchParams();
  let team = searchParams.get("team");
    //get data
    useEffect(() => {
      //TODO: Get Data (from localstorage if cached recently)
      //fetch("/api/get-alliance-data").then(resp => resp.json()).then(data => setData(data));
      setData({
          team: 2485,
          teamName: "W.A.R. Lords",
          autoScore: 15,
          teleScore: 27,
          endScore: 5,
          espmOverTime: [
            {matchNum: 5, score: 47},
            {matchNum: 10, score: 38},
            {matchNum: 50, score: 20},
          ],
          noShow: .00,
          breakdown: .08,
          lastBreakdown: 3,
          matchesScouted: 3,
          scouts: ["yael", "ella", "preston",],
          generalComments: ["very good", "incredible", "amazing",],
          breakdownComments: ["the shooter broke",],
          defenseComments: ["very good at defense", "defended well",],
          auto: {
            leave: .95,
            autoOverTime: [
              {matchNum: 5, score: 10},
              {matchNum: 24, score: 9},
              {matchNum: 50, score: 8},
            ],
            autoNotes: {
              total: 3.2,
              ampSuccess: .92,
              ampAvg: 1.2,
              spkrSuccess: .89,
              spkrAvg: 2
            },
          tele: {
            teleOverTime: [
              {matchNum: 5, score: 30},
              {matchNum: 24, score: 29},
              {matchNum: 50, score: 28},
            ],
            teleNotes: {
              amplified: .43,
              total: 20,
              ampSuccess: .96,
              ampAvg: 9.2,
              spkrSuccess: .94,
              spkrAvg: 10.8
            },
          },
          endgame: {
            none: 5,
            park: 5,
            onstage: 30,
            onstageHarmony: 60,
            onstageAttempt: .78,
            onstageSuccess: .95,
            harmonyAttempt: .34,
            harmonySuccess: .75,
            onstagePlacement: {
              center: .82,
              side: .18,
            },
            trapSuccess: .6,
            trapAvg: .5,
            intake: {
              ground: .8,
              station: .2,
            },
          },
          qualitative: {
            onstagespeed: 5,
            harmonyspeed: 1,
            trapspeed: 1,
            ampspeed: 1,
            speakerspeed: 0,
            stagehazard: 5,
            defenseevasion: 5,
            aggression: 1,
            maneuverability: 5,
          },
        }
      })
    }, []);

  if (data == null) {
    return(
      <div>
        <h1>Loading...</h1>
      </div>
    )
  }


  return (
    <div>
      <h1>Team {data.team} View</h1>
      <div className={styles.lightBorderBox}>
      <div className={styles.scoreBreakdownContainer}>
        <div style={{background: "#8CBFD9"}} className={styles.espmBox}>{data.autoScore + data.teleScore + data.endScore}</div>
        <div className={styles.espmBreakdown}>
          <div style={{background: "blue"}}>A: {data.autoScore}</div>
          <div style={{background: "blue"}}>T: {data.teleScore}</div>
          <div style={{background: "blue"}}>E: {data.endScore}</div>
        </div>
      </div>
    </div>
    <div className={styles.graphContainer}>
          <h2>ESPM / time</h2>
          <LineChart width={450} height={300} data={data.espmOverTime}>
            <XAxis dataKey="matchNum"/>
            <YAxis dataKey="score"/>
            <CartesianGrid stroke="#eee" strokeDasharray="5 5"/>
            <Line type="monotone" dataKey="score" stroke="#99ADEF" />
            <Tooltip></Tooltip>
          </LineChart>
        </div>
    </div>
  )
}
