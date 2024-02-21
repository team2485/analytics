import { NextResponse } from "next/server";
import { sql } from '@vercel/postgres';
import _ from 'lodash';

const calcAuto = (record) => {
    return (
        record.autoampscored * 2 +
        record.autospeakerscored * 5 +
        (record.leave ? 2 : 0)
    );
};
const calcTele = (record) => {
    return (
        record.teleampscored * 1 +
        record.teleampedspeakerscored * 5 +
        record.telenampedspeakerscored * 2
    );
};
const calcEnd = (record) => {
    return (
        (record.endlocation == 0 ? 2 : 3) +
        (record.harmony ? 2 : 0) +
        record.trapscored * 5
    );
};

export async function get(request) {
  //get team to analyze
  const { searchParams } = new URL(request.url)
  const team = searchParams.get('team')
  if (_.isNumber(team) == false) {
    return NextResponse.json({message: "Invalid team number"}, {status: 400});
  }

  let data = await sql`SELECT * FROM testmatches WHERE team = team;`;
  let rows = data.rows;

  //get data to be like:
  /* {
          team: 2485,
          teamName: "W.A.R. Lords",
          autoScore: 15,
          teleScore: 27,
          endScore: 5,
          espmOverTime: [
            {matchNum: 5, score: 47},
            {matchNum: 10, score: 38},
            {matchNum: 50, score: 55},
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
            harmonySuccess: .75,
            onstagePlacement: {
              center: .82,
              side: .18,
            },
            trapSuccess: .6,
            trapAvg: .5,
          },
          intake: {
            ground: true,
            source: false,
          },
          qualitative: [
            {name: "Onstage Speed", rating: 5},
            {name: "Harmony Speed", rating: 1},
            {name: "Trap Speed", rating: 2},
            {name: "Amp Speed", rating: 4},
            {name: "Apeaker Speed", rating: 1},
            {name: "Stage Hazard", rating: 3},
            {name: "Defense Evasion", rating: 0},
            {name: "Aggression", rating: 5},
            {name: "Maneuverability", rating: 2},
          ],
      }
    */

  function rowsToArray(rows, index) {
    return rows.map(row => row[index]).filter(rowAtIndex => rowAtIndex != null);
  }
  let returnObject = {team: team, teamName: '', autoScore: 0, teleScore: 0, endScore: 0, espmOverTime: [],
                        noShow: 0, breakdown: 0, lastBreakdown: 0, matchesScouted: rows.length(), scouts: rowsToArray(rows, "scoutName"),
                        generalComments: rowsToArray(rows, "generalComments"), breakdownComments: rowsToArray(rows, "breakdownComments"), defenseComments: rowsToArray(rows, "defenseComments")};
  if (returnObject.matchesScouted == 0) {
    return NextResponse.json(returnObject, {status: 200});
  }
  let calculations = {auto: [], tele: [], end: []};
  

  for (let scoutData of rows) {
    
  }
  
  return NextResponse.json(returnTable, {status: 200});
}