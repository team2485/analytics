'use client';

import styles from "./page.module.css";
import { useEffect, useState, useRef } from "react";

export default function Picklist() {
  const [fields, setFields] = useState([]);
  const [picklist, setPicklist] = useState([]);
  const formRef = useRef();
  
  useEffect(() => {
    fetch('/api/get-numeric-fields')
      .then(resp => resp.json())
      .then(data => setFields(data));
  }, []);
  
  function recalculate(event) {
    event.preventDefault();
    const formData = new FormData(formRef.current);
    fetch('/api/compute-picklist', {
      method: "POST",
      body: JSON.stringify([...formData.entries()])
    })
      .then(resp => resp.json())
      .then(picklist => setPicklist(picklist));
  }

  function Weights() {
    if (fields.length > 0) {
      return <table className={styles.weightsTable}>
          <tr>
              <td><label htmlFor="ESPM">ESPM:</label></td>
              <td><input type="number" defaultValue={0} name="ESPM"></input></td>
              <td><label htmlFor="end">End:</label> </td>
              <td><input type="number" defaultValue={0} name="end"></input></td>
          </tr>
          <tr>
              <td><label htmlFor="auto">Auto:</label></td>
              <td><input type="number" defaultValue={0} name="auto"></input></td>
              <td><label htmlFor="speed">Speed:</label> </td>
              <td><input type="number" defaultValue={0} name="speed"></input></td>
          </tr>
          <tr>
              <td><label htmlFor="tele">Tele:</label></td>
              <td><input type="number" defaultValue={0} name="tele"></input></td>
              <td><label htmlFor="movement">Movement:</label> </td>
              <td><input type="number" defaultValue={0} name="movement"></input></td>
          </tr>
      </table>;

    } else {
      return <div>Loading Weight Fields...</div>
    }

  }

  function AllianceRow({alliance}) {
    return (
      <tr>
          <td>A{alliance}</td>
          <td><label htmlFor={"T1A" + alliance}></label><input name={"T1A" + alliance} type="number"></input></td>
          <td><label htmlFor={"T2A" + alliance}></label><input name={"T2A" + alliance} type="number"></input></td>
          <td><label htmlFor={"T3A" + alliance}></label><input name={"T3A" + alliance} type="number"></input></td>
      </tr>
    )
  };

  return (
    <div className={styles.MainDiv}>
      <form ref={formRef} onSubmit={recalculate}>
        <div className={styles.weights}>
          <span><b>Weights</b></span>
          <Weights></Weights>
        </div>
        {/* TODO: add team exclusion */}
        <button>Reload Picklist</button>
      </form>
      <div className={styles.alliances}>
        <span><b>Alliances</b></span>
        <table className={styles.allianceTable}>
          <th></th><th>T1</th><th>T2</th><th>T3</th>
          <AllianceRow alliance={"1"}></AllianceRow>
          <AllianceRow alliance={"2"}></AllianceRow>
          <AllianceRow alliance={"3"}></AllianceRow>
          <AllianceRow alliance={"4"}></AllianceRow>
          <AllianceRow alliance={"5"}></AllianceRow>
          <AllianceRow alliance={"6"}></AllianceRow>
          <AllianceRow alliance={"7"}></AllianceRow>
          <AllianceRow alliance={"8"}></AllianceRow>
        </table>
      </div>
      <table>
        <tr><th>Team</th><th>Score</th><th>ESPM</th><th>Mvt</th></tr>
        {picklist.map((teamData, index) => (
          <tr key={index}>
            <td>{teamData}</td>
            <td>{teamData.score}</td>
            <td>{teamData.espm}</td>
            <td>{teamData.movement}</td>
          </tr>
        ))}
      </table>
    </div>
  )
}