import { NextResponse } from "next/server";
import { sql } from '@vercel/postgres';
import _ from 'lodash';
import { calcAuto, calcTele, calcEnd, calcESPM } from "@/util/calculations";
import { tidy, mutate, arrange, desc, mean, select, summarizeIf, summarizeAll, max, groupBy, summarize} from '@tidyjs/tidy'

export async function get(request) {
  //get team to analyze
  const { searchParams } = new URL(request.url)
  const team = searchParams.get('team')
  if (_.isNumber(team) == false) {
    return NextResponse.json({message: "Invalid team number"}, {status: 400});
  }

  let data = await sql`SELECT * FROM testmatches WHERE team = ${team};`;
  let rows = data.rows;

  if (rows.length == 0) {
    return NextResponse.json({message: "No data for team"}, {status: 404});
  }

  //function returns a function based on column index: the returned function will summarize each column
  function byAveragingNumbers(index) {
    if (['breakdown', 'leave', 'noshow', 'harmony', 'gndintake', 'srcintake'].includes(index)) {
      //booleans, so OR them
      return (arr) => {
        return arr.some(row => row[index] == true);
      }
    }
    if (['scoutname', 'generalcomments', 'breakdowncomments', 'defensecomments'].includes(index)) {
      //strings, so join them
      return (arr) => {
        return arr.map(row => row[index]).join();
      }
    }
    if (['maneuverability', 'aggression', 'defenseevasion', 'speakerspeed', 'ampspeed', 'stagehazard', 'trapspeed' , 'onstagespeed', 'harmonyspeed'].includes(index)) {
      //qual, so exclude -1
      return (arr) => {
        let qualValues = arr.filter(row => row[index] != -1 && row[index] != null).map(row => row[index]);
        if (qualValues.length == 0) return -1;
        let sum = 0;
        for (let val of qualValues) {
          sum+=val;
        }
        return sum/qualValues.length;
      }
    }
    //numbers, so average them (unless -1)
    return mean(index);
  }
  
  //join data from same match
  let teamTable = tidy(rows,
    groupBy(['match'], [
      summarizeAll(byAveragingNumbers)
    ])
  );
  
  //calculate auto, tele, end, espm
  teamTable = tidy(teamTable,
    mutate({
      auto: calcAuto,
      tele: calcTele,
      end: calcEnd,
      espm: (rec) => rec.auto + rec.tele + rec.end
    })
  );

  function rowsToArray(rows, index) {
    return rows.map(row => row[index]).filter(rowAtIndex => rowAtIndex != null);
  }

  function percentValue(arr, index, value) {
    return arr.filter(e => e[index] == value)/arr.length;
  }

  //get return table
  const matchesScouted = teamTable.length;
  teamTable = tidy(teamTable,
    summarize({
      team: first('team'),
      teamName: '',
      autoScore: median('auto'),
      teleScore: median('tele'),
      endScore: median('end'),
      espmOverTime: (arr) => {
        return tidy(arr, select(['espm', 'match']));
      },
      noShow: arr => percentValue(arr, 'noshow', true),
      breakdown: arr => 1 - percentValue(arr, 'breakdown', null),
      lastBreakdown: arr => arr.filter(e => e.breakdown != null).reduce((a, b) => b.match),
      scouts: arr => rowsToArray(arr, 'scoutname'),
      generalComments: arr => rowsToArray(arr, 'generalcomments'),
      breakdownComments: arr => rowsToArray(arr, 'breakdowncomments'),
      defenseComments: arr => rowsToArray(arr, 'defensecomments'),
      auto: arr => {
        return {
          leave: percentValue(arr, 'leave', true),
          autoOverTime: tidy(arr, select(['auto', 'match'])),
          autoNotes: tidy(arr, summarize({
            ampAvg: median('autoampscored'),
            spkrAvg: median('autospeakerscored'),
            total: median('autoampscored')(arr) + median('autospeakerscored')(arr),
            ampSuccess: total('autoampscored')(arr) / (median('autoampscored')(arr) + median('autoampfailed')(arr)),
            speakerSuccess: total('autospeakerscored')(arr) / (median('autospeakerscored')(arr) + median('autospeakerfailed')(arr)),
          }))
        }
      },
      tele: arr => {
        return {
          teleOverTime: tidy(arr, select(['tele', 'match'])),
          teleNotes: {
            spkrAvg: median('telenampedspeakerscored'),
            ampAvg: median('teleampscored'),
            amplified: median('teleampedspeakerscored'),
            total: median('telenampedspeakerscored')(arr) + median('teleampedspeakerscored')(arr) + median('teleampscored')(arr),
            spkrSuccess: (median('telenampedspeakerscored')(arr) + median('teleampedspeakerscored')(arr)) / (median('telenampedspeakerscored')(arr) + median('teleampedspeakerscored')(arr) + median('telespeakerfailed')(arr)),
            ampSuccess: median('teleampscored')(arr) / (median('teleampscored')(arr) + median('teleampfailed')(arr)),
          }
        }
      },
      endgame: arr => {
        let stage = {none: 0, park: 0, onstage: 0, onstageHarmony: 0};
        return {
          stage,
          onstageAttempt: ,
          onstageSuccess: ,
          harmonySuccess: ,
          onstagePlacement: {
            center: ,
            side: ,
          },
          trapSuccess: ,
          trapAvg: ,
        }
      }
    })
  );


  let returnObject = {
                        endgame: {
                            stage: {
                                none: 0,
                                park: 0,
                                onstage: 0,
                                onstageHarmony: 0,
                            },
                            onstageAttempt: 0,
                            onstageSuccess: 0,
                            harmonySuccess: 0,
                            onstagePlacement: {
                                center: 0,
                                side: 0,
                            },
                            trapSuccess: 0,
                            trapAvg: 0,
                        },
                        intake: {
                            ground: false,
                            source: false,
                        },
                        qualitative: [
                            {name: "Onstage Speed", rating: 0},
                            {name: "Harmony Speed", rating: 0},
                            {name: "Trap Speed", rating: 0},
                            {name: "Amp Speed", rating: 0},
                            {name: "Apeaker Speed", rating: 0},
                            {name: "Stage Hazard", rating: 0},
                            {name: "Defense Evasion", rating: 0},
                            {name: "Aggression", rating: 0},
                            {name: "Maneuverability", rating: 0},
                        ],
                    };
  if (returnObject.matchesScouted == 0) {
    return NextResponse.json(returnObject, {status: 200});
  }
  let calculations = {auto: [], tele: [], end: []};
  

  for (let scoutData of rows) {
    
  }
  
  return NextResponse.json(returnTable, {status: 200});
}