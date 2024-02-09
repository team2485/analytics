"use client";
import { useEffect } from "react";

export default function TeamView() {

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
        }
      })
    }, []);
  return (
    <div>
      <h1>Team View {team}</h1>
    </div>
  )
}
