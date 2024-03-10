import { NextResponse } from "next/server";
import { sql } from '@vercel/postgres';
import _ from 'lodash';
import { calcAuto, calcTele, calcEnd, calcESPM } from "@/util/calculations";
import { tidy, mutate, mean, select, summarizeAll, groupBy, summarize, first, n, median, total} from '@tidyjs/tidy'

export async function GET(request) {
  //get team to analyze
  const { searchParams } = new URL(request.url)
  const team = searchParams.get('team')
  if (_.isNumber(+team) == false) {
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

  const teamName = await fetch("https://frc-api.firstinspires.org/v3.0/2024/teams?teamNumber=" + team, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + process.env.FIRST_AUTH_TOKEN,
    },
  }).then(resp => {
    if (resp.status !== 200) {
      return {teams: [{nameShort: ""}]};
    }
    return resp.json();
  }).then(data => data.teams[0].nameShort );

  //get return table
  const matchesScouted = teamTable.length;
  let returnObject = tidy(teamTable,
    summarize({
      team: first('team'),
      teamName: () => teamName,
      autoScore: median('auto'),
      teleScore: median('tele'),
      endScore: median('end'),
      matchesScouted: (a) => matchesScouted,
      espmOverTime: (arr) => {
        return tidy(arr, select(['espm', 'match']));
      },
      noShow: arr => percentValue(arr, 'noshow', true),
      breakdown: arr => percentValue(arr, 'breakdown', true),
      lastBreakdown: arr => arr.filter(e => e.breakdown == true).reduce((a, b) => b.match, "N/A"),
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
            ampSuccess: a => (median('autoampscored')(arr) / (median('autoampscored')(arr) + median('autoampfailed')(arr))),
            speakerSuccess: a => (median('autospeakerscored')(arr) / (median('autospeakerscored')(arr) + median('autospeakerfailed')(arr))),
          }))
        }
      },
      tele: arr => {
        return {
          teleOverTime: tidy(arr, select(['tele', 'match'])),
          teleNotes: {
            spkrAvg: median('telenampedspeakerscored')(arr) + median('teleampedspeakerscored')(arr),
            ampAvg: median('teleampscored')(arr),
            amplified: median('teleampedspeakerscored')(arr) / (median('teleampedspeakerscored')(arr) + median('telenampedspeakerscored')),
            total: median('telenampedspeakerscored')(arr) + median('teleampedspeakerscored')(arr) + median('teleampscored')(arr),
            spkrSuccess: (median('telenampedspeakerscored')(arr) + median('teleampedspeakerscored')(arr)) / (median('telenampedspeakerscored')(arr) + median('teleampedspeakerscored')(arr) + median('telespeakerfailed')(arr)),
            ampSuccess: median('teleampscored')(arr) / (median('teleampscored')(arr) + median('teleampfailed')(arr)),
          }
        }
      },
      endgame: arr => {
        let stage = {none: 0, park: 0, onstage: 0, onstageHarmony: 0};
        let onstagePlacement = {center: 0, side: 0};
        arr.forEach(row => {
          //stage
          if (row.endlocation == 0) stage.none++;
          else if (row.endlocation <= 2) stage.park++;
          else if (row.endlocation == 3) stage.onstage++;
          else if (row.endlocation == 4) stage.onstageHarmony++;

          //placement
          if (row.stageplacement && row.stageplacement == 1) {
            onstagePlacement.center++;
          }
          else if (row.stageplacement && row.stageplacement == 0) {
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
          harmonySuccess: n({ predicate: d => d.endlocation > 3 })(arr) / n({ predicate: d => d.endlocation > 2 })(arr),
          onstagePlacement,
          trapSuccess: median('trapscored')(arr) / (median('trapscored')(arr) + median('trapfailed')(arr)),
          trapAvg: median('trapscored')(arr),
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
          {name: "Stage Hazard", rating: averageQualitative('stagehazard', arr)},
          {name: "Defense Evasion", rating: averageQualitative('defenseevasion', arr)},
          {name: "Aggression", rating: averageQualitative('aggression', arr)},
          {name: "Maneuverability", rating: averageQualitative('maneuverability', arr)},
        ]
      }
    })
  );

  console.log(returnObject[0]);

  return NextResponse.json(returnObject[0], {status: 200});
}