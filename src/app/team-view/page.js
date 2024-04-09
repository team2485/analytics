"use client";
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, ResponsiveContainer, Cell, LineChart, Line, RadarChart, PolarRadiusAxis, PolarAngleAxis, PolarGrid, Radar, Legend, ReferenceLine } from 'recharts';
import { VictoryPie } from "victory";
import { Suspense } from "react";
import Link from "next/link";


export default function TeamViewPage() {
  return <Suspense>
    <TeamView/>
  </Suspense>
}

function TeamView() {
  const [data, setData] = useState(null);
  const searchParams = useSearchParams();
  const team = searchParams.get("team");
  const hasTopBar = searchParams.get('team1') !== null;
  


  function AllianceButtons({t1, t2, t3, colors}) {
    console.log(searchParams.get('team6'))
    return <div className={styles.allianceBoard}>
      <Link href={`/team-view?team=${t1 || ""}&${searchParams.toString()}`}>
        <button style={team == t1 ? {background: 'black', color: 'yellow'} : {background: colors[0][1]}}>{t1 || 404}</button>
      </Link>
      <Link href={`/team-view?team=${t2 || ""}&${searchParams.toString()}`}>
        <button style={team == t2 ? {background: 'black', color: 'yellow'} : {background: colors[1][1]}}>{t2 || 404}</button>
      </Link>
      <Link href={`/team-view?team=${t3 || ""}&${searchParams.toString()}`}>
        <button style={team == t3 ? {background: 'black', color: 'yellow'} : {background: colors[2][1]}}>{t3 || 404}</button>
      </Link>
    </div>
  }
  function TopBar() {
    const COLORS = [
      ["#B7F7F2", "#A1E7E1", "#75C6BF", "#5EB5AE"],
      ["#8AB8FD", "#7D99FF", "#6184DD", "#306BDD"],
      ["#E1BFFA", "#E1A6FE", "#CA91F2", "#A546DF"],
      ["#FFC6F6", "#ECA6E0", "#ED75D9", "#C342AE"],
      ["#FABFC4", "#FEA6AD", "#F29199", "#E67983"],
      ["#FFE3D3", "#EBB291", "#E19A70", "#D7814F"],
    ];
    if (!hasTopBar) {
      return <></>
    }
    return <div className={styles.matchNav}>
      <AllianceButtons t1={searchParams.get('team1')} t2={searchParams.get('team2')} t3={searchParams.get('team3')} colors={[COLORS[0], COLORS[1], COLORS[2]]}></AllianceButtons>
      <Link href={`/match-view?team1=${searchParams.get('team1') || ""}&team2=${searchParams.get('team2') || ""}&team3=${searchParams.get('team3') || ""}&team4=${searchParams.get('team4') || ""}&team5=${searchParams.get('team5') || ""}&team6=${searchParams.get('team6') || ""}&go=go`}><button style={{background: "#ffff88", color: "black"}}>Match</button></Link>
      <AllianceButtons t1={searchParams.get('team4')} t2={searchParams.get('team5')} t3={searchParams.get('team6')} colors={[COLORS[3], COLORS[4], COLORS[5]]}></AllianceButtons>
    </div>
  }

  const Colors = [
    ["#116677", "#84C9D7", "#8CCCD9", "#C4EEF6"],
    ["#003F7E", "#84AED7", "#A2C8ED", "#D8EAFB"],
    ["#15007E", "#9D8CF3", "#BFB2FF", "#DDD6FF"],
    ["#9F5EB5", "#C284D7", "#DBA2ED", "#F3D8FB"],
  ]
    //get data
    function fetchTeamData(team) {
      fetch("/api/get-team-data?team=" + team)
        .then(response => {
          // if (!response.ok) {
          //   throw new Error("Network response was not ok");
          // }
          return response.json();
        })
        .then(data => {
          if (data.message) {
            setData({ message: data.message });
          } else {
            setData(data);
          }
        })
        .catch(error => {
          console.error("Fetch error:", error);
        });
    }
    useEffect(() => {//run when team changes
      if (team) {
        fetchTeamData(team);
      }
    }, [team]);
    // useEffect(() => {
    //   //TODO: Get Data (from localstorage if cached recently)
    //   if (team) {
    //     fetch("/api/get-team-data?team=" + team).then(resp => resp.json()).then(data => {                                      
    //        if (data.message) {
    //           setData({message: data.message});
    //           } else {
    //         setData(data);
    //       }
    //     });
    //   }
    // }, [team]);


  if (team == null || team == '' || (data && data.message)) {
    return (
      <div>
        <form className={styles.teamInputForm}>
          <span>{data?.message}</span>
          <label for="team">Team: </label>
          <input id="team" name="team" placeholder="Team #" type="number"></input>
          <br></br>
          <button>Go!</button>
        </form>
      </div>
    )
  }

  if (data == null) {
    return (
      <div>
        <h1>Loading...</h1>
      </div>
    )
  }

  const EndgameData = [{ x: 'None', y: data.endgame.stage.none },
    { x: 'Park', y: data.endgame.stage.park },
    { x: 'Onstage', y: data.endgame.stage.onstage },
    { x: 'Harmony', y: data.endgame.stage.onstageHarmony }];

  function CBox({title, value, color1, color2}) {
    return (
      <div style={{backgroundColor: color2}} className={styles.CBox}>
        <div className={styles.CBoxTitle} style={{backgroundColor: color1}}>{title}</div>
        <div className={styles.CBoxValue}>{value}</div>
      </div>
    )
  }

  function HBox({title, value, color1, color2}) {
    return (
      <table>
        <tr>
          <td style={{backgroundColor: color1}}>{title}</td>
          <td style={{backgroundColor: color2, fontSize: "13px"}}>{value}</td>
        </tr>
      </table>
    )
  }

  function Comments({title, value, color1, color2}) {
    return (
      <div className={styles.commentsBox}>
        <table style={{width: "350px"}}>
          <tr style={{backgroundColor: color1}}>{title}</tr>
          <tr style={{backgroundColor: color2}}><td>{value}</td></tr>
        </table>
      </div>
    )
  }

  function BigBox({HC1, HC2, HR1, R1C1, R1C2, HR2, R2C1, R2C2, color1, color2, color3}) {
    return (
      <table className={styles.BigBox}>
        <colgroup>
          <col span="1" style={{backgroundColor: color1}}></col>
          <col span="2" style={{backgroundColor: color3}}></col>
        </colgroup>
        <th style={{height: "20px", backgroundColor: "white", borderLeftColor: "white", borderTopColor: "white"}}></th><th style={{backgroundColor: color2}}>{HC1}</th><th style={{backgroundColor: color2}}>{HC2}</th>
        <tr style={{height: "20px"}}>
          <td >{HR1}</td>
          <td>{R1C1}</td>
          <td>{R1C2}</td>
        </tr>
        <tr style={{height: "20px"}}>
          <td>{HR2}</td>
          <td>{R2C1}</td>
          <td>{R2C2}</td>
        </tr>
      </table>
    )
  }


  return <div>
    <TopBar></TopBar>
    <div className={styles.MainDiv}>
      <div className={styles.leftColumn}>
      <h1 style={{color: Colors[0][0]}}>Team {data.team} View</h1>
      <h3>{data.teamName}</h3>
      <div className={styles.lightBorderBox}>
        <div className={styles.scoreBreakdownContainer}>
          <div style={{background: Colors[0][1]}} className={styles.espmBox}>{Math.round(10*(data.autoScore + data.teleScore + data.endScore))/10}</div>
          <div className={styles.espmBreakdown}>
            <div style={{background: Colors[0][3]}}>A: {Math.round(10*data.autoScore)/10}</div>
            <div style={{background: Colors[0][3]}}>T: {Math.round(10*data.teleScore)/10}</div>
            <div style={{background: Colors[0][3]}}>E: {Math.round(10*data.endScore)/10}</div>
          </div>
        </div>
      </div>
        <div className={styles.graphContainer}>
          <h4 className={styles.graphTitle}>ESPM Over Time</h4>
          <LineChart className={styles.lineChart} width={350} height={175} data={data.espmOverTime}>
            <XAxis type="number" dataKey="match"/>
            <YAxis dataKey="espm"/>
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Line type="monotone" dataKey="espm" stroke={Colors[0][0]} strokeWidth="3"/>
            <Tooltip></Tooltip>
          </LineChart>
        </div>
      <div className={styles.valueBoxes}>
        <CBox color1={Colors[0][2]} color2={Colors[0][3]} title={"No Show"} value={Math.round(1000*data.noShow)/10+"%"}></CBox>
        <CBox color1={Colors[0][2]} color2={Colors[0][3]} title={"Breakdown"} value={Math.round(1000*data.breakdown)/10+"%"}></CBox>
        <CBox color1={Colors[0][2]} color2={Colors[0][3]} title={"Last Breakdown"} value={"Match " + data.lastBreakdown}></CBox>
        <CBox color1={Colors[0][2]} color2={Colors[0][3]} title={"Matches Scouted"} value={data.matchesScouted}></CBox>
        <HBox color1={Colors[0][2]} color2={Colors[0][3]} title={"Scouts"} value={(data.scouts).join(" - ")}></HBox>
      </div>
      <br></br>
      <br></br>
      <div className={styles.allComments}>
        <Comments color1={Colors[0][2]} color2={Colors[0][3]} title={"General Comments"} value={(data.generalComments).join(" - ")}></Comments>
        <Comments color1={Colors[0][2]} color2={Colors[0][3]} title={"Breakdown Comments"} value={(data.breakdownComments).join(" - ")}></Comments>
        <Comments color1={Colors[0][2]} color2={Colors[0][3]} title={"Defense Comments"} value={(data.defenseComments).join(" - ")}></Comments>
      </div>
      </div>
      <div className={styles.middleColumn}>
        <div className={styles.auto}>
          <h1 style={{color: Colors[1][0]}}>Auto</h1>
          <div className={styles.graphContainer}>
            <h4 className={styles.graphTitle}>Auto Over Time</h4>
            <LineChart className={styles.lineChart} width={350} height={175} data={data.auto.autoOverTime}>
              <XAxis type="number" dataKey="match"/>
              <YAxis dataKey="auto"/>
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Line type="monotone" dataKey="auto" stroke={Colors[1][0]} strokeWidth="3" />
              <Tooltip></Tooltip>
            </LineChart>
          </div>
          <div className={styles.valueBoxes}>
            <div className={styles.CFlex}>
              <CBox color1={Colors[1][2]} color2={Colors[1][3]} title={"Leave"} value={Math.round(1000*data.auto.leave)/10+"%"}></CBox>
              <CBox color1={Colors[1][2]} color2={Colors[1][3]} title={"Total Notes"} value={Math.round(10*data.auto.autoNotes.total)/10}></CBox>
            </div>
            <BigBox HC1={"Success"} 
              HC2={"Avg Notes"} 
              HR1={"Amp"} 
              HR2={"Speaker"} 
              R1C1={Math.round(1000*data.auto.autoNotes.ampSuccess)/10 + "%"} 
              R1C2={Math.round(10*data.auto.autoNotes.ampAvg)/10}
              R2C1={Math.round(1000*data.auto.autoNotes.spkrSuccess)/10 + "%"}
              R2C2={Math.round(10*data.auto.autoNotes.spkrAvg)/10}
              color1={Colors[1][1]} color2={Colors[1][2]} color3={Colors[1][3]}>
            </BigBox>
          </div>
        </div>
        <div className={styles.tele}>
          <h1 style={{color: Colors[2][0]}}>Tele</h1>
          <div className={styles.graphContainer}>
            <h4 className={styles.graphTitle}>Tele Over Time</h4>
            <LineChart className={styles.lineChart} width={350} height={175} data={data.tele.teleOverTime}>
              <XAxis type="number" dataKey="match"/>
              <YAxis dataKey="tele"/>
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Line type="monotone" dataKey="tele" stroke={Colors[2][0]} strokeWidth="3" />
              <Tooltip></Tooltip>
            </LineChart>
          </div>
          <div className={styles.valueBoxes}>
            <div className={styles.CFlex} >
              <CBox color1={Colors[2][2]} color2={Colors[2][3]} title={"⬆️Notes"} value={Math.round(1000*data.tele.teleNotes.amplified)/10+"%"}></CBox>
              <CBox color1={Colors[2][2]} color2={Colors[2][3]} title={"Total Notes"} value={Math.round(10*data.tele.teleNotes.total)/10}></CBox>
              <CBox color1={Colors[2][2]} color2={Colors[2][3]} title={"Passed Notes"} value={Math.round(10*data.passedNotes)/10}></CBox>
            </div>
            <BigBox HC1={"Success"} 
              HC2={"Avg Notes"} 
              HR1={"Amp"} 
              HR2={"Speaker"} 
              R1C1={Math.round(1000*data.tele.teleNotes.ampSuccess)/10 + "%"} 
              R1C2={Math.round(10*data.tele.teleNotes.ampAvg)/10}
              R2C1={Math.round(1000*data.tele.teleNotes.spkrSuccess)/10 + "%"}
              R2C2={Math.round(10*data.tele.teleNotes.spkrAvg)/10}
              color1={Colors[2][1]} color2={Colors[2][2]} color3={Colors[2][3]}>
            </BigBox>
          </div>
        </div>
      </div>
      <div className={styles.rightColumn}>
        <h1 style={{color: Colors[3][0]}}>Endgame</h1>
        <br></br>
        <div className={styles.chartContainer}>
          <h4 className={styles.graphTitle}>Endgame Placement</h4>
          <VictoryPie
            className={styles.pie}
            width={180}
            height={180}
            data={EndgameData}
            colorScale={Colors[3]}
            labels={({ datum }) => `${datum.x}: ${Math.round(datum.y)}%`}
            labelIndicator
            labelIndicatorInnerOffset={20}
            labelIndicatorOuterOffset={10}
            style={{labels: {fontSize: 6.5, fontFamily: "Belleza"}}}/>
        </div>
        <div className={styles.valueBoxes}>
          <table>
            <tr>
              <td style={{backgroundColor: Colors[3][1]}} rowSpan="2">Onstage</td>
              <td style={{backgroundColor: Colors[3][2]}}>Attempt</td>
              <td style={{backgroundColor: Colors[3][2]}}>Success</td>
            </tr>
            <tr>
              <td style={{backgroundColor: Colors[3][3]}}>{Math.round(1000*data.endgame.onstageAttempt)/10+"%"}</td>
              <td style={{backgroundColor: Colors[3][3]}}>{Math.round(1000*data.endgame.onstageSuccess)/10+"%"}</td>
            </tr>
            <tr>
              <td style={{backgroundColor: Colors[3][1]}} rowSpan="2">Location</td>
              <td style={{backgroundColor: Colors[3][2]}}>Center</td>
              <td style={{backgroundColor: Colors[3][2]}}>Side</td>
            </tr>
            <tr>
              <td style={{backgroundColor: Colors[3][3]}}>{Math.round(10*data.endgame.onstagePlacement.center)/10+"%"}</td>
              <td style={{backgroundColor: Colors[3][3]}}>{Math.round(10*data.endgame.onstagePlacement.side)/10+"%"}</td>
            </tr>
          </table>
          <table className={styles.differentTable}>
            <tr>
              <td style={{backgroundColor: Colors[3][1], width:"30px"}} rowSpan="4">Trap</td>
              <td style={{backgroundColor: Colors[3][2], width:"75px"}}>Success</td>
            </tr>
            <tr>
              <td style={{backgroundColor: Colors[3][3], width:"75px"}}>{Math.round(1000*data.endgame.trapSuccess)/10+"%"}</td>
            </tr>
            <tr>
              <td style={{backgroundColor: Colors[3][2], width:"75px"}} >Avg Notes</td>
            </tr>
            <tr>
              <td style={{backgroundColor: Colors[3][3], width:"75px"}}>{Math.round(10*data.endgame.trapAvg)/10}</td>
            </tr>
          </table>
          <table className={styles.differentTable} style={{borderRadius: "5px"}}>
            <tr>
              <td style={{backgroundColor: Colors[3][1], width: "40px"}} rowSpan="2">Intake</td>
              <td style={{backgroundColor: Colors[3][2], width: "50px", height: "10px"}}>Ground</td>
              <td style={{backgroundColor: Colors[3][2], width: "50px"}}>Source</td>
            </tr>
            <tr>
              <td className={styles.intakeCheck} style={{backgroundColor: Colors[3][3], width: "50px", height: "30px"}}><input id="groundcheck" type="checkbox" readOnly checked={data.intake.ground}></input></td>
              <td className={styles.intakeCheck} style={{backgroundColor: Colors[3][3], width: "50px", height: "30px"}}><input id="sourcecheck" type="checkbox" readOnly checked={data.intake.source}></input></td>
            </tr>
          </table>
        </div>
          <div className={styles.radarContainer}>
            <h4 className={styles.graphTitle} >Qualitative Ratings</h4>
            <RadarChart outerRadius={80} width={335} height={230} data={data.qualitative}>
              <PolarGrid />
              <PolarAngleAxis dataKey="name" fontSize={14}/>
              <PolarRadiusAxis angle={10} domain={[0, 5]} />
              <Radar name={data.team} dataKey="rating" stroke={Colors[3][1]} fill={Colors[3][1]} fillOpacity={0.3} strokeWidth="3" />
            </RadarChart>
            <p>*Inverted so outside is good</p>
          </div>
      </div>
    </div>
  </div>
}
