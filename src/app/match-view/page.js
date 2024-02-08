"use client";
import { useEffect, useState } from "react";
import styles from "./page.module.css";
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, ResponsiveContainer, Cell, LineChart, Line, RadarChart, PolarRadiusAxis, PolarAngleAxis, PolarGrid, Radar, Legend } from 'recharts';
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

  const defaultTeam = {
    team: -1,
    teamName: "Invisibotics 👻",
    auto: 0,
    tele: 0,
    end: 0,
    avgNotes: {
      speaker: 0,
      ampedSpeaker: 0,
      amp: 0,
      trap: 0,
    },
    endgame: { none: 100, park: 0, onstage: 0, onstageHarmony: 0},
    qualitative: { onstagespeed: 0, harmonyspeed: 0, trapspeed: 0, ampspeed: 0, speakerspeed: 0, stagehazard: 0, defenseevasion: 0, aggression: 0, maneuverability: 0}
  }

  //get data
  useEffect(() => {
    //TODO: Get Data (from localstorage if cached recently)
    //fetch("/api/get-alliance-data").then(resp => resp.json()).then(data => setData(data));
    setAllData({
      "2485": {
        team: 2485,
        teamName: "W.A.R. Lords",
        auto: 15,
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
        }
      },
      "9485": {
        team: 9485,
        teamName: "W.A.R. Lords 2",
        auto: 0,
        tele: 45,
        end: 10,
        avgNotes: {
          speaker: 1,
          ampedSpeaker: 5,
          amp: 0,
          trap: 1,
        },
        endgame: {
          none: 5,
          park: 44,
          onstage: 31,
          onstageHarmony: 20,
        },
        qualitative: {
          onstagespeed: 5,
          harmonyspeed: 4,
          trapspeed: 3,
          ampspeed: 2,
          speakerspeed: 1,
          stagehazard: 0,
          defenseevasion: 1,
          aggression: 2,
          maneuverability: 3,
        }
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

  function AllianceDisplay({teams, opponents, colors}) {
    //calc alliance espm breakdown
    const auto = (teams[0]?.auto || 0) + (teams[1]?.auto || 0) + (teams[2]?.auto || 0);
    const tele = (teams[0]?.tele || 0) + (teams[1]?.tele || 0) + (teams[2]?.tele || 0);
    const end = (teams[0]?.end || 0) + (teams[1]?.end || 0) + (teams[2]?.end || 0);

    //calc ranking points
    const RGBColors = {
      red: "#FF9393",
      green: "#BFFEC1",
      yellow: "#FFDD9A"
    }
    //win = higher espm than opponents
    const teamESPM = (team) => team ? team.auto + team.tele + team.end : 0;
    const opponentsESPM = teamESPM(opponents[0]) + teamESPM(opponents[1]) + teamESPM(opponents[2]);
    const currentAllianceESPM = auto + tele + end;
    let RP_WIN = RGBColors.red;
    if (currentAllianceESPM > opponentsESPM) RP_WIN = RGBColors.green;
    else if (currentAllianceESPM == opponentsESPM) RP_WIN = RGBColors.yellow;

    //melody = can get 18 notes in speaker & amp (15 is yellow)
    const teamMelodyNotes = (team) => Math.floor(team.avgNotes.speaker + team.avgNotes.ampedSpeaker + team.avgNotes.amp);
    const allianceNotes = teamMelodyNotes(teams[0]) + teamMelodyNotes(teams[1]) + teamMelodyNotes(teams[2]);
    let RP_MELODY = RGBColors.red;
    if (allianceNotes >= 18) RP_MELODY = RGBColors.green;
    else if (allianceNotes >= 15) RP_MELODY = RGBColors.yellow;

    //ensemble = 2 teams will probably go onstage & alliance is estimated to get more than 10 points
    const goesOnstage = (team) => (team.endgame.onstage + team.endgame.onstageHarmony) > 50;
    const onstageTeamCount = goesOnstage(teams[0]) + goesOnstage(teams[1]) + goesOnstage(teams[2]);
    const endgamePoints = Math.floor(teams[0].end) + Math.floor(teams[1].end) + Math.floor(teams[2].end);
    let RP_ENSEMBLE = RGBColors.red;
    if (onstageTeamCount >= 2 && endgamePoints >= 10) RP_ENSEMBLE = RGBColors.green;


    return <div className={styles.lightBorderBox}>
      <div className={styles.scoreBreakdownContainer}>
        <div style={{background: colors[0]}} className={styles.espmBox}>{auto + tele + end}</div>
        <div className={styles.espmBreakdown}>
          <div style={{background: colors[1]}}>A: {auto}</div>
          <div style={{background: colors[1]}}>T: {tele}</div>
          <div style={{background: colors[1]}}>E: {end}</div>
        </div>
      </div>
      <div className={styles.RPs}>
        <div style={{background: colors[1]}}>RPs:</div>
        <div style={{background: RP_MELODY}}>Melody</div>
        <div style={{background: RP_ENSEMBLE}}>Ensemble</div>
        <div style={{background: RP_WIN}}>Victory</div>
      </div>
    </div>
  }

  function TeamDisplay({teamData, colors}) {
    const endgameData = [{ x: 'None', y: teamData.endgame.none },
              { x: 'Park', y: teamData.endgame.park },
              { x: 'Onstage', y: teamData.endgame.onstage },
              { x: 'Onstage Harmony', y: teamData.endgame.onstageHarmony }];



    return <div className={styles.lightBorderBox}>
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

  //if data is in, show interface...

  //getting espm/time data
  let get = (alliance, thing) => {
    let sum = 0;
    if (alliance[0] && alliance[0][thing]) sum += alliance[0][thing];
    if (alliance[1] && alliance[1][thing]) sum += alliance[1][thing];
    if (alliance[2] && alliance[2][thing]) sum += alliance[2][thing];
    return sum;
  }
  const blueAlliance = [data.team1 || defaultTeam, data.team2 || defaultTeam, data.team3 || defaultTeam];
  const redAlliance = [data.team4 || defaultTeam, data.team5 || defaultTeam, data.team6 || defaultTeam];
  let blueScores = [0, get(blueAlliance, "auto")]
  blueScores.push(blueScores[1] + get(blueAlliance, "tele"))
  blueScores.push(blueScores[2] + get(blueAlliance, "end"))
  let redScores = [0, get(redAlliance, "auto")]
  redScores.push(redScores[1] + get(redAlliance, "tele"))
  redScores.push(redScores[2] + get(redAlliance, "end"))
  let espmData = [
    {name: "Start", blue: 0, red: 0},
    {name: "Auto", blue: blueScores[1], red: redScores[1]},
    {name: "Tele", blue: blueScores[2], red: redScores[2]},
    {name: "End", blue: blueScores[3], red: redScores[3]},
  ];
  //getting radar data
  let radarData = [];
  for (let qual of ['onstagespeed', 'harmonyspeed', 'trapspeed', 'ampspeed', 'speakerspeed', 'stagehazard', 'defenseevasion', 'aggression', 'maneuverability']) {
    radarData.push({qual, 
      team1: data?.team1?.qualitative[qual] || 0,
      team2: data?.team2?.qualitative[qual] || 0,
      team3: data?.team3?.qualitative[qual] || 0,
      team4: data?.team4?.qualitative[qual] || 0,
      team5: data?.team5?.qualitative[qual] || 0,
      team6: data?.team6?.qualitative[qual] || 0,
      fullMark: 5});
  }
  console.log(radarData);
  return (
    <div>
      <div className={styles.matchNav}>
        <AllianceButtons t1={data.team1 || defaultTeam} t2={data.team2 || defaultTeam} t3={data.team3 || defaultTeam} colors={[COLORS[0], COLORS[1], COLORS[2]]}></AllianceButtons>
        <Link href={`/match-view?team1=${data.team1?.team || ""}&team2=${data.team2?.team || ""}&team3=${data.team3?.team || ""}&team4=${data.team4?.team || ""}&team5=${data.team5?.team || ""}&team6=${data.team6?.team || ""}`}><button style={{background: "#ffff88", color: "black"}}>Edit</button></Link>
        <AllianceButtons t1={data.team4 || defaultTeam} t2={data.team5 || defaultTeam} t3={data.team6 || defaultTeam} colors={[COLORS[3], COLORS[4], COLORS[5]]}></AllianceButtons>
      </div>
      <div className={styles.allianceESPMs}>
        <AllianceDisplay teams={blueAlliance} opponents={redAlliance} colors={["#D3DFFF", "#A9BDFF"]}></AllianceDisplay>
        <AllianceDisplay teams={redAlliance} opponents={blueAlliance} colors={["#FFE4E9", "#FDC3CA"]}></AllianceDisplay>
      </div>
      <div className={styles.allianceGraphs}>
        <div className={styles.graphContainer}>
          <h2>Q Ratings</h2>
          <RadarChart outerRadius={90} width={420} height={300} data={radarData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="qual" />
            <PolarRadiusAxis angle={10} domain={[0, 5]} />
            <Radar name={data.team1?.team || "-1"} dataKey="team1" stroke={COLORS[0][0]} fill={COLORS[0][3]} fillOpacity={0.3} />
            <Radar name={data.team2?.team || "-1"} dataKey="team2" stroke={COLORS[1][0]} fill={COLORS[1][3]} fillOpacity={0.3} />
            <Radar name={data.team3?.team || "-1"} dataKey="team3" stroke={COLORS[2][0]} fill={COLORS[2][3]} fillOpacity={0.3} />
            <Legend />
          </RadarChart>
        </div>
        <div className={styles.graphContainer}>
          <h2>ESPM / time</h2>
          <LineChart width={450} height={300} data={espmData}>
            <XAxis dataKey="name"/>
            <YAxis/>
            <CartesianGrid stroke="#eee" strokeDasharray="5 5"/>
            <Line type="monotone" dataKey="blue" stroke="#99ADEF" />
            <Line type="monotone" dataKey="red" stroke="#EDB3BA" />
            <Tooltip></Tooltip>
          </LineChart>
        </div>
        <div className={styles.graphContainer}>
          <h2>Q Ratings</h2>
          <RadarChart outerRadius={90} width={420} height={300} data={radarData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="qual" />
            <PolarRadiusAxis angle={10} domain={[0, 5]} />
            <Radar name={data.team4?.team || "-1"} dataKey="team4" stroke={COLORS[3][0]} fill={COLORS[3][3]} fillOpacity={0.3} />
            <Radar name={data.team5?.team || "-1"} dataKey="team5" stroke={COLORS[4][0]} fill={COLORS[4][3]} fillOpacity={0.3} />
            <Radar name={data.team6?.team || "-1"} dataKey="team6" stroke={COLORS[5][0]} fill={COLORS[5][3]} fillOpacity={0.3} />
            <Legend />
          </RadarChart>
        </div>
      </div>
      <div className={styles.matches}>
        <TeamDisplay teamData={data.team1 || defaultTeam} colors={COLORS[0]}></TeamDisplay>
        <TeamDisplay teamData={data.team2 || defaultTeam} colors={COLORS[1]}></TeamDisplay>
        <TeamDisplay teamData={data.team3 || defaultTeam} colors={COLORS[2]}></TeamDisplay>
      </div>
      <div className={styles.matches}>
        <TeamDisplay teamData={data.team4 || defaultTeam} colors={COLORS[3]}></TeamDisplay>
        <TeamDisplay teamData={data.team5 || defaultTeam} colors={COLORS[4]}></TeamDisplay>
        <TeamDisplay teamData={data.team6 || defaultTeam} colors={COLORS[5]}></TeamDisplay>
      </div>
    </div>
  )
}
