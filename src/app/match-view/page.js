"use client";
import { useEffect, useState } from "react";
import styles from "./page.module.css";
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, ResponsiveContainer, Cell } from 'recharts';
import { VictoryPie } from "victory";
import Link from "next/link";
import { useSearchParams } from "next/navigation";


export default function MatchView() {
  const [allData, setAllData] = useState(null);
  const [data, setData] = useState(false);
  const searchParams = useSearchParams();
  const COLORS = [
    ["#B7F7F2", "#A1E7E1", "#75C6BF", "#5EB5AE"],
    ["#8AB8FD", "#7D99FF", "#6184DD", "#306BDD"],
    ["#E1BFFA", "#E1A6FE", "#CA91F2", "#A546DF"],
    ["#FFC6F6", "#ECA6E0", "#ED75D9", "#C342AE"],
    ["#FABFC4", "#FEA6AD", "#F29199", "#E67983"],
    ["#FFE3D3", "#EBB291", "#E19A70", "#D7814F"],
  ];

  //get data
  useEffect(() => {
    //TODO: Get Data (from localstorage if cached recently)
    //fetch("/api/get-alliance-data").then(resp => resp.json()).then(data => setData(data));
    setAllData({
      "2485": {
        team: 2485,
        teamName: "W.A.R. Lords",
        auto: 30,
        tele: 27,
        end: 5,
        avgNotes: {
          speaker: 3,
          ampedSpeaker: 2,
          amp: 7,
          trap: 1,
        },
        endgame: {
          none: 5,
          park: 5,
          onstage: 30,
          onstageHarmony: 60,
        },
      },
      "9485": {
        team: 9485,
        teamName: "W.A.R. Lords 2",
        auto: 10,
        tele: 17,
        end: 10,
        avgNotes: {
          speaker: 1,
          ampedSpeaker: 5,
          amp: 0,
          trap: 1,
        },
        endgame: {
          none: 5,
          park: 45,
          onstage: 30,
          onstageHarmony: 20,
        },
      },
    })
  }, []);

    //setData based on teams selected
  useEffect(() => {
    if (searchParams && allData) {
      let [team1, team2, team3, team4, team5, team6] = [searchParams.get("team1"), searchParams.get("team2"), searchParams.get("team3"), searchParams.get("team4"), searchParams.get("team5"), searchParams.get("team6")];
      console.log(searchParams.get("team1"));
      setData({team1: allData[team1], team2: allData[team2], team3: allData[team3], team4: allData[team4], team5: allData[team5], team6: allData[team6]});
    }
  }, [searchParams, allData]);

  //until url loads show loading
  if (!data || searchParams == null) {
    return <div>
      <h1>Loading...</h1>
    </div>
  }
  
  //show form if systems are not a go
  if (searchParams.get("go") != "go") {
    return <div>
      <form className={styles.teamForm}>
        <label htmlFor="team1">Blue 1:</label>
        <input id="team1" name="team1" defaultValue={searchParams.get("team1")}></input>
        <br></br>
        <label htmlFor="team2">Blue 2:</label>
        <input id="team2" name="team2" defaultValue={searchParams.get("team2")}></input>
        <br></br>
        <label htmlFor="team3">Blue 3:</label>
        <input id="team3" name="team3" defaultValue={searchParams.get("team3")}></input>
        <br></br>
        <label htmlFor="team4">Red 1:</label>
        <input id="team4" name="team4" defaultValue={searchParams.get("team4")}></input>
        <br></br>
        <label htmlFor="team5">Red 2:</label>
        <input id="team5" name="team5" defaultValue={searchParams.get("team5")}></input>
        <br></br>
        <label htmlFor="team6">Red 3:</label>
        <input id="team6" name="team6" defaultValue={searchParams.get("team6")}></input>
        <br></br>
        <input type="hidden" name="go" value="go"></input>
        <button>Go!</button>
      </form>
    </div>
  }

  function AllianceButtons({t1, t2, t3, colors}) {
    return <div className={styles.allianceBoard}>
      <Link href={"/team-view?team=" + t1.team}>
        <button style={{background: colors[0][1]}}>{t1.team}</button>
      </Link>
      <Link href={"/team-view?team=" + t2.team}>
      <button style={{background: colors[1][1]}}>{t2.team}</button>
      </Link>
      <Link href={"/team-view?team=" + t3.team}>
      <button style={{background: colors[2][1]}}>{t3.team}</button>
      </Link>
    </div>
  }

  function TeamDisplay({teamData, colors}) {
    const endgameData = [{ x: 'None', y: teamData.endgame.none },
              { x: 'Park', y: teamData.endgame.park },
              { x: 'Onstage', y: teamData.endgame.onstage },
              { x: 'Onstage Harmony', y: teamData.endgame.onstageHarmony }];



    return <div className={styles.matchTeam}>
      <h1 style={{color: colors[3]}}>{teamData.team}</h1>
      <h2 style={{color: colors[3]}}>{teamData.teamName}</h2>
      <div className={styles.scoreBreakdownContainer}>
        <div style={{background: colors[0]}} className={styles.espmBox}>{teamData.auto + teamData.tele + teamData.end}</div>
        <div className={styles.espmBreakdown}>
          <div style={{background: colors[1]}}>A: {teamData.auto}</div>
          <div style={{background: colors[1]}}>T: {teamData.tele}</div>
          <div style={{background: colors[1]}}>E: {teamData.end}</div>
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
            <Bar dataKey="value" fill={colors[3]} activeBar={<Rectangle fill="gold" stroke={colors[3]} />} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <br></br>
      <div className={styles.chartContainer}>
        <h2>Endgame %</h2>
        <VictoryPie
          data={endgameData}
          colorScale={colors}
          labels={({ datum }) => `${datum.x}: ${datum.y}%`}
        />
      </div>
      <br></br>
      <br></br>
    </div>
  }

  //if data is in, show interface
  return (
    <div>
      <div className={styles.matchOverview}>
        <AllianceButtons t1={data.team1} t2={data.team2} t3={data.team3} colors={[COLORS[0], COLORS[1], COLORS[2]]}></AllianceButtons>
        <Link href="/match-view?team1=2485"><button style={{background: "#ffff88", color: "black"}}>Back</button></Link>
        <AllianceButtons t1={data.team4} t2={data.team5} t3={data.team6} colors={[COLORS[3], COLORS[4], COLORS[5]]}></AllianceButtons>
      </div>
      <div className={styles.matches}>
        <TeamDisplay teamData={data.team1} colors={COLORS[0]}></TeamDisplay>
        <TeamDisplay teamData={data.team2} colors={COLORS[1]}></TeamDisplay>
        <TeamDisplay teamData={data.team3} colors={COLORS[2]}></TeamDisplay>
      </div>
      <div className={styles.matches}>
        <TeamDisplay teamData={data.team4} colors={COLORS[3]}></TeamDisplay>
        <TeamDisplay teamData={data.team5} colors={COLORS[4]}></TeamDisplay>
        <TeamDisplay teamData={data.team6} colors={COLORS[5]}></TeamDisplay>
      </div>
    </div>
  )
}
