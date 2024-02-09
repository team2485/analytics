"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function TeamView() {
  const [data, setData] = useState(null);
  const searchParams = useSearchParams();
  let team = searchParams.get("team");
    //get data
    useEffect(() => {
      //TODO: Get Data (from localstorage if cached recently)
      //fetch("/api/get-alliance-data").then(resp => resp.json()).then(data => setData(data));
      setData({
        "2485": {
          team: 2485,
          teamName: "W.A.R. Lords",
          auto: 15,
          tele: 27,
          end: 5,
          espmOverTime: [
            {matchNum: 1, score: 47},
            {matchNum: 2, score: 38},
            {matchNum: 3, score: 20},
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
              {matchNum: 1, score: 10},
              {matchNum: 2, score: 9},
              {matchNum: 3, score: 8},
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
              {matchNum: 1, score: 30},
              {matchNum: 2, score: 29},
              {matchNum: 3, score: 28},
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
          }
          },
        }
      })
    }, []);



  return (
    <div>
      <h1>Team View </h1>
    </div>
  )
}
