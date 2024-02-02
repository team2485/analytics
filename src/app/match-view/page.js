"use client";
import { useEffect, useState } from "react";
import styles from "./page.module.css";
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, ResponsiveContainer, Cell } from 'recharts';
import { VictoryPie } from "victory";


export default function MatchView() {
  const [allData, setAllData] = useState(null);
  const [data, setData] = useState(null);
  const [searchParams, setSearchParams] = useState(null);

  //get data
  useEffect(() => {
    //TODO: Get Data (from localstorage if cached recently)
    //fetch("/api/get-alliance-data?team1=2485&team2=3485&team3=4485").then(resp => resp.json()).then(data => setData(data));
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
    })
  }, []);

  //get search params
  useEffect(() => {
    setSearchParams(new URLSearchParams(typeof window == "undefined" ? "" : window.location?.search || ""));
  }, []);

  useEffect(() => {
    if (searchParams) {
      let [team1, team2, team3, team4, team5, team6] = [searchParams.get("team1"), searchParams.get("team2"), searchParams.get("team3"), searchParams.get("team4"), searchParams.get("team4"), searchParams.get("team6")];
      setData({team1: allData[team1], team2: allData[team2], team3: allData[team3], team4: allData[team4], team5: allData[team5], team6: allData[team6]});
    }
  }, [searchParams])

  //until url loads show loading
  if (!data || searchParams == null) {
    return <div>
      <h1>Loading...</h1>
    </div>
  }
  
  //show form if systems are not a go
  if (searchParams.get("go") != "go") {
    return <div>
      <form>
        <label htmlFor="team1">Team 1:</label>
        <input id="team1" name="team1" defaultValue={searchParams.get("team1")}></input>
        <br></br>
        <label htmlFor="team2">Team 2:</label>
        <input id="team2" name="team2" defaultValue={searchParams.get("team2")}></input>
        <br></br>
        <label htmlFor="team3">Team 3:</label>
        <input id="team3" name="team3" defaultValue={searchParams.get("team3")}></input>
        <br></br>
        <label htmlFor="team4">Team 4:</label>
        <input id="team4" name="team4" defaultValue={searchParams.get("team4")}></input>
        <br></br>
        <label htmlFor="team5">Team 5:</label>
        <input id="team5" name="team5" defaultValue={searchParams.get("team5")}></input>
        <br></br>
        <label htmlFor="team6">Team 6:</label>
        <input id="team6" name="team6" defaultValue={searchParams.get("team6")}></input>
        <br></br>
        <input type="hidden" name="go" value="go"></input>
        <button>Go!</button>
      </form>
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
      <div className={styles.matches}>
        <TeamDisplay teamData={data.team1} colors={["#B7F7F2", "#A1E7E1", "#75C6BF", "#5EB5AE"]}></TeamDisplay>
        <TeamDisplay teamData={data.team1} colors={["#8AB8FD", "#7D99FF", "#6184DD", "#306BDD"]}></TeamDisplay>
        <TeamDisplay teamData={data.team1} colors={["#E1BFFA", "#E1A6FE", "#CA91F2", "#A546DF"]}></TeamDisplay>
      </div>
      <div className={styles.matches}>
        <TeamDisplay teamData={data.team1} colors={["#FFC6F6", "#ECA6E0", "#ED75D9", "#C342AE"]}></TeamDisplay>
        <TeamDisplay teamData={data.team1} colors={["#FABFC4", "#FEA6AD", "#F29199", "#E67983"]}></TeamDisplay>
        <TeamDisplay teamData={data.team1} colors={["#FFE3D3", "#EBB291", "#E19A70", "#D7814F"]}></TeamDisplay>
      </div>
    </div>
  )
}
