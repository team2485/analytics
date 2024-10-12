import { NextResponse } from "next/server";
import { sql } from '@vercel/postgres';
import _ from 'lodash';
import { calcAuto, calcTele, calcEnd, calcESPM } from "@/util/calculations";
import { tidy, mutate, mean, select, summarizeAll, groupBy, summarize, first, n, median, total, arrange, asc} from '@tidyjs/tidy'

export const revalidate = 300; //caches for 300 seconds, 5 minutes


export async function GET(request) {
  //get team to analyze
  const { searchParams } = new URL(request.url)
  const team = searchParams.get('team')
  if (_.isNumber(+team) == false) {
    return NextResponse.json({message: "ERROR: Invalid team number"}, {status: 400});
  }

  let data = await sql`SELECT * FROM batb2024 WHERE team = ${team};`;
  const rows = data.rows;

  if (rows.length == 0) {
    return NextResponse.json({message: "ERROR: No data for team " + team}, {status: 404});
  }

  //function returns a function based on column index: the returned function will summarize each column
  function byAveragingNumbers(index) {
    if (['breakdown', 'leave', 'noshow', 'defense', 'harmony', 'gndintake', 'srcintake'].includes(index)) {
      //booleans, so OR them
      return (arr) => {
        return arr.some(row => row[index] == true);
      }
    }
    if (['scoutname', 'generalcomments', 'breakdowncomments', 'defensecomments'].includes(index)) {
      //strings, so join them
      return (arr) => {
        let joined = arr.map(row => row[index]).filter(a => a != null).join(" - ");
        if (arr.map(row => row[index]).filter(a => a != null).length == 0) {
          return null;
        }
        return joined;
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
    if (index == "endlocation") {
      return (arr) => {
        let endlocations = arr.map(row => row[index]);
        endlocations.sort();
        return endlocations[Math.floor(endlocations.length/2)];
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
      auto: rec => calcAuto(rec) || 0,
      tele: rec => calcTele(rec) || 0,
      end: rec => calcEnd(rec) || 0,
      espm: (rec) => rec.auto + rec.tele + rec.end || 0
    }), 
    arrange([asc('match')])
  );

  function rowsToArray(rows, index) {
    return rows.map(row => row[index]).filter(rowAtIndex => rowAtIndex != null);
  }

  function percentValue(arr, index, value) {
    console.log({index, arr});
    return (arr.filter(e => e[index] === value).length) / arr.length;
  }

  // const teamName = await fetch("https://frc-api.firstinspires.org/v3.0/2024/teams?teamNumber=" + team, {
//   headers: {
//     'Content-Type': 'application/json',
//     'Authorization': 'Basic ' + process.env.FIRST_AUTH_TOKEN,
//   },
// }).then(resp => {
//   if (resp.status !== 200) {
//     return {teams: [{nameShort: ""}]};
//   }
//   return resp.json();
// }).then(data => data.teams[0].nameShort );

//get return table
const matchesScouted = teamTable.length;
let returnObject = tidy(teamTable,
  summarize({
    team: first('team'),
    // teamName: () => teamName,
    teamName: () => "", // Placeholder for team name while API fetch is commented out
      autoScore: mean('auto'),
      teleScore: mean('tele'),
      endScore: mean('end'),
      matchesScouted: (a) => matchesScouted,
      espmOverTime: (arr) => {
        return tidy(arr, select(['espm', 'match']));
      },
      noShow: arr => percentValue(arr, 'noshow', true),
      defensePercent: arr => 1-percentValue(arr, 'defensecomments', null),
      breakdown: arr => 1-percentValue(arr, 'breakdowncomments', null),
      lastBreakdown: arr => arr.filter(e => e.breakdowncomments !== null).reduce((a, b) => b.match, "N/A"),
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
            total: a => (median('autoampscored')(arr) + median('autospeakerscored')(arr)),
            ampSuccess: a => (median('autoampscored')(arr) / (median('autoampscored')(arr) + mean('autoampfailed')(arr))),
            spkrSuccess: a => (median('autospeakerscored')(arr) / (median('autospeakerscored')(arr) + mean('autospeakerfailed')(arr))),
          }))[0] 
        }
      },
      passedNotes: median('passednotes'),
      tele: arr => {
        return {
          teleOverTime: tidy(arr, select(['tele', 'match'])),
          teleNotes: {
            spkrAvg: median('telenampedspeakerscored')(arr) + median('teleampedspeakerscored')(arr),
            ampAvg: median('teleampscored')(arr),
            amplified: mean('teleampedspeakerscored')(arr)/(mean('teleampedspeakerscored')(arr) + mean('telenampedspeakerscored')(arr)),
            total: median('telenampedspeakerscored')(arr) + median('teleampedspeakerscored')(arr) + median('teleampscored')(arr),
            spkrSuccess: (mean('telenampedspeakerscored')(arr) + mean('teleampedspeakerscored')(arr)) / (mean('telenampedspeakerscored')(arr) + mean('teleampedspeakerscored')(arr) + mean('telespeakerfailed')(arr)),
            ampSuccess: mean('teleampscored')(arr) / (mean('teleampscored')(arr) + mean('teleampfailed')(arr)),
          }
        }
      },
      endgame: arr => {
        let stage = {none: 0, park: 0, onstage: 0, onstageHarmony: 0};
        let onstagePlacement = {center: 0, side: 0};
        arr.forEach(row => {
          //stage
          if (row.endlocation == null || row.endlocation == 0) stage.none++;
          else if (row.endlocation <= 2) stage.park++;
          else if (row.endlocation == 3 && row.harmony == true) stage.onstageHarmony++;
          else if (row.endlocation == 3 && row.harmony == false) stage.onstage++;

          //placement
          if (row.stageplacement != undefined && row.stageplacement == 1) {
            onstagePlacement.center++;
          }
          else if (row.stageplacement != undefined && row.stageplacement == 0) {
            onstagePlacement.side++;
          }
        });
        const divisor = arr.length;
        stage.none*=100/divisor;
        stage.park*=100/divisor;
        stage.onstage*=100/divisor;
        stage.onstageHarmony*=100/divisor;

        onstagePlacement.center = 100 * onstagePlacement.center / (onstagePlacement.center + onstagePlacement.side)
        onstagePlacement.side = 100 - onstagePlacement.center;
        return {
          stage,
          onstageAttempt: n({ predicate: d => d.endlocation > 1 })(arr) / divisor,
          onstageSuccess: n({ predicate: d => d.endlocation > 2 })(arr) / n({ predicate: d => d.endlocation > 1 })(arr),
          onstagePlacement,
          trapSuccess: mean('trapscored')(arr) / ((mean('trapscored')(arr)) + (mean('trapfailed')(arr))),
          trapAvg: mean('trapscored')(arr),
        }
      },
      intake: arr => {
        return {
          ground: (n((row) => row.gndintake == true)(arr) / n()(arr)) > 0.5,
          source: (n((row) => row.srcintake == true)(arr) / n()(arr)) > 0.5,
        }
      },
      qualitative: arr => {
        function averageQualitative(index, arr) {
          let qualarray = arr.filter(row => row[index] != -1 && row[index] != null && row[index] != undefined);
          if (qualarray.length == 0) return -1;
          let sum = 0;
          for (let row of qualarray) {
            sum += row[index];
          }
          return sum/arr.length;
        }
        return [
          {name: "Onstage Speed", rating: averageQualitative('onstagespeed', arr)},
          {name: "Harmony Speed", rating: averageQualitative('harmonyspeed', arr)},
          {name: "Trap Speed", rating: averageQualitative('trapspeed', arr)},
          {name: "Amp Speed", rating: averageQualitative('ampspeed', arr)},
          {name: "Speaker Speed", rating: averageQualitative('speakerspeed', arr)},
          {name: "Stage Hazard*", rating: 5-(averageQualitative('stagehazard', arr))},
          {name: "Defense Played", rating: averageQualitative('defenserating', arr)},
          {name: "Defense Evasion", rating: averageQualitative('defenseevasion', arr)},
          {name: "Aggression*", rating: 5-(averageQualitative('aggression', arr))},
          {name: "Maneuverability", rating: averageQualitative('maneuverability', arr)},
        ]
      }
    })
  );

  return NextResponse.json(returnObject[0], {status: 200});
}

console.log('defensecomments');