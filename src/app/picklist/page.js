'use client';

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
      return <>
        {fields.map((field, index) => (
          <div key={index}>
            <label>{field} Weight: </label>
            <input type="number" defaultValue={0} name={field}></input>
          </div>
        ))}
      </>;

    } else {
      return <div>Loading Weight Fields...</div>
    }

  }

  return (
    <div>
      <h1>Picklist</h1>
      <form ref={formRef} onSubmit={recalculate}>
        <Weights></Weights>
        {/* TODO: add team exclusion */}
        <button>Reload Picklist</button>
      </form>
      <table>
        <tr><th>Team</th><th>Score</th></tr>
        {picklist.map((teamData, index) => (
          <tr key={index}>
            <td>{teamData.team}</td>
            <td>{teamData.score}</td>
          </tr>
        ))}
      </table>
    </div>
  )
}