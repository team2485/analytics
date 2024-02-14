"use client";
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, ResponsiveContainer, Cell, LineChart, Line, RadarChart, PolarRadiusAxis, PolarAngleAxis, PolarGrid, Radar, Legend } from 'recharts';
import { VictoryPie } from "victory";

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
          noShow: .01,
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
              {matchNum: 10, score: 9},
              {matchNum: 50, score: 8},
            ],
            autoNotes: {
              total: 3.2,
              ampSuccess: .92,
              ampAvg: 1.2,
              spkrSuccess: .89,
              spkrAvg: 2
            }},
          tele: {
            teleOverTime: [
              {matchNum: 5, score: 30},
              {matchNum: 10, score: 29},
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
            stage: {
              none: 5,
              park: 5,
              onstage: 30,
              onstageHarmony: 60,
            },
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
      })
    }, []);

  if (data == null) {
    return(
      <div>
        <h1>Loading...</h1>
      </div>
    )
  }

  const EndgameData = [{ x: 'None', y: data.endgame.stage.none },
    { x: 'Park', y: data.endgame.stage.park },
    { x: 'Onstage', y: data.endgame.stage.onstage },
    { x: 'Onstage Harmony', y: data.endgame.stage.onstageHarmony }];

  function CBox({title, value}) {
    return (
      <div className={styles.CBox}>
        <p>{title}</p>
        <div className={styles.CBoxValue}>{value}</div>
      </div>
    )
  }

  function HBox({title, value}) {
    return (
      <div className={styles.HBox}>
        <p>{title}</p>
        <div className={styles.HBoxValue}>{value}</div>
      </div>
    )
  }

  function Comments({title, value}) {
    return (
      <div className={styles.commentsBox}>
        <p className={styles.comments}>{title}</p>
        <div className={styles.commentValue}>{value}</div>
      </div>
    )
  }

  function BigBox({HC1, HC2, HR1, R1C1, R1C2, HR2, R2C1, R2C2}) {
    return (
      <table className={styles.BigBox}>
        <th></th><th>{HC1}</th><th>{HC2}</th>
        <tr>
          <td>{HR1}</td>
          <td>{R1C1}</td>
          <td>{R1C2}</td>
        </tr>
        <tr>
          <td>{HR2}</td>
          <td>{R2C1}</td>
          <td>{R2C2}</td>
        </tr>
      </table>
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
          <h2>ESPM Over Time</h2>
          <LineChart width={450} height={300} data={data.espmOverTime}>
            <XAxis type="number" dataKey="matchNum"/>
            <YAxis dataKey="score"/>
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Line type="monotone" dataKey="score" stroke="#99ADEF" />
            <Tooltip></Tooltip>
          </LineChart>
        </div>
      <CBox title={"No Show"} value={(data.noShow)*100+"%"}></CBox>
      <br></br>
      <CBox title={"Breakdown"} value={(data.breakdown)*100+"%"}></CBox>
      <br></br>
      <CBox title={"Last Breakdown"} value={"Match " + data.lastBreakdown}></CBox>
      <br></br>
      <CBox title={"Matches Scouted"} value={data.matchesScouted}></CBox>
      <br></br>
      <HBox title={"Scouts"} value={(data.scouts).join(", ")}></HBox>
      <br></br>
      <Comments title={"General Comments"} value={(data.generalComments).join(", ")}></Comments>
      <br></br>
      <Comments title={"Breakdown Comments"} value={(data.breakdownComments).join(", ")}></Comments>
      <br></br>
      <Comments title={"Defense Comments"} value={(data.defenseComments).join(", ")}></Comments>
      <h1>Auto</h1>
      <div className={styles.graphContainer}>
          <h2>Auto Over Time</h2>
          <LineChart width={450} height={300} data={data.auto.autoOverTime}>
            <XAxis type="number" dataKey="matchNum"/>
            <YAxis dataKey="score"/>
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Line type="monotone" dataKey="score" stroke="#99ADEF" />
            <Tooltip></Tooltip>
          </LineChart>
      </div>
      <CBox title={"Leave"} value={(data.auto.leave)*100+"%"}></CBox>
      <CBox title={"Total Notes"} value={(data.auto.autoNotes.total)}></CBox>
      <BigBox HC1={"Success"} 
        HC2={"Avg Notes"} 
        HR1={"Amp"} 
        HR2={"Speaker"} 
        R1C1={data.auto.autoNotes.ampSuccess} 
        R1C2={data.auto.autoNotes.ampAvg}
        R2C1={data.auto.autoNotes.spkrSuccess}
        R2C2={data.auto.autoNotes.spkrAvg}>
      </BigBox>
      <h1>Tele</h1>
      <div className={styles.graphContainer}>
          <h2>Tele Over Time</h2>
          <LineChart width={450} height={300} data={data.tele.teleOverTime}>
            <XAxis type="number" dataKey="matchNum"/>
            <YAxis dataKey="score"/>
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Line type="monotone" dataKey="score" stroke="#99ADEF" />
            <Tooltip></Tooltip>
          </LineChart>
      </div>
      <CBox title={"⬆️Notes"} value={(data.tele.teleNotes.amplified)*100+"%"}></CBox>
      <CBox title={"Total Notes"} value={data.tele.teleNotes.total}></CBox>
      <BigBox HC1={"Success"} 
        HC2={"Avg Notes"} 
        HR1={"Amp"} 
        HR2={"Speaker"} 
        R1C1={data.tele.teleNotes.ampSuccess} 
        R1C2={data.tele.teleNotes.ampAvg}
        R2C1={data.tele.teleNotes.spkrSuccess}
        R2C2={data.tele.teleNotes.spkrAvg}>
      </BigBox>
      <h1>Endgame</h1>
      <div className={styles.chartContainer}>
        <h2>Endgame %</h2>
        <VictoryPie
          data={EndgameData}
          colorScale="blue"
          labels={({ datum }) => `${datum.x}: ${datum.y}%`}/>
      </div>
      <BigBox HC1={"Attempt"} 
        HC2={"Success"} 
        HR1={"Onstage"} 
        HR2={"Harmony"} 
        R1C1={(data.endgame.onstageAttempt)*100+"%"} 
        R1C2={(data.endgame.onstageSuccess)*100+"%"}
        R2C1={(data.endgame.harmonyAttempt)*100+"%"}
        R2C2={(data.endgame.harmonySuccess)*100+"%"}>
      </BigBox>
    </div>
  )
}
