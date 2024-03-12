'use client';

import styles from "./page.module.css";
import { useEffect, useState, useRef, Suspense } from "react";

export default function Picklist() {
  const [fields, setFields] = useState([]);
  const [picklist, setPicklist] = useState([]);
  const [maxScore, setMaxScore] = useState(1);
  const [teamsToExclude, setTeamsToExclude] = useState(new Array(24));
  const [allianceData, setAllianceData] = useState({})

  const weightsFormRef = useRef();
  const alliancesFormRef = useRef();

  const greenToRedColors = ["#9ADC83", "#BECC72", "#E1BB61", "#F0A56C", "#FF8E76"];
  
  function recalculate(event) {
    const formData = new FormData(weightsFormRef.current);
    fetch('/api/compute-picklist', {
      method: "POST",
      body: JSON.stringify([...formData.entries()])
    })
      .then(resp => resp.json())
      .then(picklist => {
        setPicklist(picklist);
        setMaxScore(picklist[0].score);
      });
  }

  function updateAlliancesData() {
    let formData = new FormData(alliancesFormRef.current);
    let teams = [...formData.entries()].map(entry => +entry[1]);
    setTeamsToExclude(teams);
  }

  function Weights() {
    return <table className={styles.weightsTable}>
      <tbody>
        <tr>
            <td><label htmlFor="espm">ESPM:</label></td>
            <td><input id="espm" type="number" defaultValue={0} name="espm"></input></td>
            <td><label htmlFor="end">End:</label> </td>
            <td><input id="end" type="number" defaultValue={0} name="end"></input></td>
        </tr>
        <tr>
            <td><label htmlFor="auto">Auto:</label></td>
            <td><input id="auto" type="number" defaultValue={0} name="auto"></input></td>
            <td><label htmlFor="speed">Speed:</label> </td>
            <td><input id="speed" type="number" defaultValue={0} name="speed"></input></td>
        </tr>
        <tr>
            <td><label htmlFor="tele">Tele:</label></td>
            <td><input id="tele" type="number" defaultValue={0} name="tele"></input></td>
            <td><label htmlFor="movement">Movement:</label> </td>
            <td><input id="movement" type="number" defaultValue={0} name="movement"></input></td>
        </tr>
      </tbody>
    </table>;
  }

  function AllianceRow({allianceNumber, allianceData, handleAllianceChange}) {
    const firstValue = allianceData ? allianceData[0] : '';
    const secondValue = allianceData ? allianceData[1] : '';
    const thirdValue = allianceData ? allianceData[2] : '';
    return (
      <tr>
          <td>A{allianceNumber}</td>
          <td><label htmlFor={"T1A" + allianceNumber}></label><input name={"T1A" + allianceNumber} type="number" defaultValue={firstValue}
          onBlur={e => {
            handleAllianceChange(allianceNumber, [e.target.value, secondValue, thirdValue]);
          }}></input></td>
          <td><label htmlFor={"T2A" + allianceNumber}></label><input name={"T2A" + allianceNumber} type="number" defaultValue={secondValue}
          onBlur={e => {
            handleAllianceChange(allianceNumber, [firstValue, e.target.value, thirdValue])
          }}></input></td>
          <td><label htmlFor={"T3A" + allianceNumber}></label><input name={"T3A" + allianceNumber} type="number" defaultValue={thirdValue}
          onBlur={e => {
            handleAllianceChange(allianceNumber, [firstValue, secondValue, e.target.value])
          }}></input></td>
      </tr>
    )
  };

  function PicklistTable() {
    const valueToColor = (value) => {
      if (value > 0.8) return greenToRedColors[0];
      if (value > 0.6) return greenToRedColors[1];
      if (value > 0.4) return greenToRedColors[2];
      if (value > 0.2) return greenToRedColors[3];
      return greenToRedColors[4];
    }

    if (!picklist || picklist.length == 0) {
      return <div className={styles.picklistContainer}>
        <h1>Picklist</h1>
        <span>Hit recalculate to view the picklist according to the weights you entered...</span>
      </div>
    }

    function roundToThree(x) {
      return Math.round(x*1000)/1000;
    }

    return <div className={styles.picklistContainer}>
        <h1>Picklist</h1>
        <table className={styles.picklistTable} id="teamTable">
        <thead>
          <tr><th>Rank</th><th>Team</th><th>Score</th><th>ESPM</th><th>Speed</th><th>Mvt</th></tr>
        </thead>
        {picklist.map((teamData, index) => {
          if (teamsToExclude.includes(teamData.team)) {
            return <tr key={teamData.team} style={{display: "none"}}></tr>
          } else {
            return (
            <tr key={teamData.team}>
              <td>#{index + 1}{teamData.firstRanking !== -1 ? ` (${teamData.firstRanking - index - 1 > 0 ? "+" : ""}${teamData.firstRanking - index - 1})` : ""}</td>
              <td>{teamData.team}</td>
              <td style={{backgroundColor: valueToColor(teamData.score/maxScore)}}>{roundToThree(teamData.score)}</td>
              <td style={{backgroundColor: valueToColor(teamData.espm)}}>{roundToThree(teamData.espm)}</td>
              <td style={{backgroundColor: valueToColor(teamData.speed)}}>{roundToThree(teamData.speed)}</td>
              <td style={{backgroundColor: valueToColor(teamData.movement)}}>{roundToThree(teamData.movement)}</td>
            </tr>
            );
          }
        })}
      </table>
    </div>
  }

  function handleAllianceChange(allianceNumber, allianceTeams) {
    setAllianceData({
      ...allianceData,
      [allianceNumber]: allianceTeams
    });
    updateAlliancesData();
  }

  return (
    <div className={styles.MainDiv}>
      <div>
        <form ref={weightsFormRef} className={styles.weightsForm}>
          <div className={styles.weights}>
            <h1>Weights</h1>
            <Weights></Weights>
          </div>
          <button type="button" onClick={recalculate} style={{marginBottom: '30px', fontSize: "20px"}}>Recalculate Picklist</button>
        </form>
        <div className={styles.alliances}>
          <h1>Alliances</h1>
          <form ref={alliancesFormRef}>
            <table className={styles.allianceTable}>
              <thead>
                <tr key="head">
                  <th></th>
                  <th>T1</th>
                  <th>T2</th>
                  <th>T3</th>
                </tr>
              </thead>
              <tbody>
                <AllianceRow allianceNumber={"1"} allianceData={allianceData["1"]} handleAllianceChange={handleAllianceChange}></AllianceRow>
                <AllianceRow allianceNumber={"2"} allianceData={allianceData["2"]} handleAllianceChange={handleAllianceChange}></AllianceRow>
                <AllianceRow allianceNumber={"3"} allianceData={allianceData["3"]} handleAllianceChange={handleAllianceChange}></AllianceRow>
                <AllianceRow allianceNumber={"4"} allianceData={allianceData["4"]} handleAllianceChange={handleAllianceChange}></AllianceRow>
                <AllianceRow allianceNumber={"5"} allianceData={allianceData["5"]} handleAllianceChange={handleAllianceChange}></AllianceRow>
                <AllianceRow allianceNumber={"6"} allianceData={allianceData["6"]} handleAllianceChange={handleAllianceChange}></AllianceRow>
                <AllianceRow allianceNumber={"7"} allianceData={allianceData["7"]} handleAllianceChange={handleAllianceChange}></AllianceRow>
                <AllianceRow allianceNumber={"8"} allianceData={allianceData["8"]} handleAllianceChange={handleAllianceChange}></AllianceRow>
              </tbody>
            </table>
          </form>
        </div>
      </div>
      <PicklistTable></PicklistTable>
    </div>
  )
}