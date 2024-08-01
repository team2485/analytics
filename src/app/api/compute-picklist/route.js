import { NextResponse } from "next/server";
import { sql } from '@vercel/postgres';
import { tidy, mutate, arrange, desc, mean, select, summarizeIf, summarizeAll, max, groupBy} from '@tidyjs/tidy'
import { calcAuto, calcTele, calcEnd, calcESPM } from "@/util/calculations";

export async function POST(request) {
  const requestBody = await request.json(); // e.g.   [ [ 'ESPM', '0' ], [ 'Maneuverability', '0' ] ]

  let data = await sql`SELECT * FROM batb2024;`;
  let rows = data.rows;

  const frcAPITeamRankings = await fetch("https://frc-api.firstinspires.org/v3.0/2024/rankings/CURIE", {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + process.env.FIRST_AUTH_TOKEN,
    }
  }).then(resp => {
    if (resp.status !== 200) {
      return {Rankings: []};
    }
    return resp.json();
  }).then(data => data.Rankings);

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
    if (['maneuverability', 'aggression', 'defenseevasion', 'speakerspeed', 'ampspeed', 'stagehazard', 'trapspeed' , 'onstagespeed', 'harmonyspeed', 'defenserating'].includes(index)) {
      //qual, so exclude -1
      return (arr) => {
        let qualValues = arr.filter(row => row[index] != -1 && row[index] != null && row[index] != undefined).map(row => row[index]);
        if (qualValues.length == 0) return -1;
        let sum = 0;
        for (let val of qualValues) {
          sum+=val;
        }
        let result = sum/qualValues.length;
        return result == NaN ? 0 : result;
      }
    }
    //numbers, so average them
    return mean(index);
  }
  
  //join data from multiple scouts on same match
  let teamTable = tidy(rows,
      groupBy(['team', 'match'], [
        summarizeAll(byAveragingNumbers)
      ])
    );
  //get rid of noshows
  teamTable = teamTable.filter(dr => dr.noshow == false);
  //average values for teams
  teamTable = tidy(teamTable, groupBy(['team'], [summarizeAll(byAveragingNumbers)]));

  
  //calculate the values we care about: ESPM, Auto, Tele, End, Speed, Movement
  function calcSpeed(dr) {
    let arr = [dr.speakerspeed, dr.ampspeed, dr.trapspeed, dr.onstagespeed, dr.onstagespeed].filter(a => a != -1)
    if (arr.length == 0) return 0;
    let sum = 0;
    for (let value of arr) {
      sum+=value;
    }
    return sum/arr.length;
  }
  function calcMovement(dr) {
    let arr = [dr.maneuverability, dr.defenseevasion, 5 - dr.stagehazard, 5 - dr.aggression].filter(a => a != -1)
    if (arr.length == 0) return 0;
    let sum = 0;
    for (let value of arr) {
      sum+=value;
    }
    return sum/arr.length;
  }
  teamTable = tidy(teamTable,
    mutate({
      auto: calcAuto,
      tele: calcTele,
      end: calcEnd,
      espm: (d) => d.auto + d.tele + d.end,
      speaker: (d) => d.autospeakerscored + d.telenampedspeakerscored + d.teleampedspeakerscored,
      amp: (d) => d.autoampscored + d.teleampscored,
      speed: calcSpeed,
      movement: calcMovement,
      defense: (d) => Math.max(d.defenserating, 0)
    }),
    select(['team', 'auto', 'tele', 'end', 'espm', 'speaker', 'amp', 'speed', 'movement', 'defense'])
  );
  
  //calculate maxes
  const maxes = tidy(teamTable, summarizeIf((vector) => Number.isFinite(vector[0]), max))[0];

  //normalize, get score, & sort
  teamTable = tidy(teamTable, mutate({
      auto: d => d.auto/maxes.auto,
      tele: d => d.tele/maxes.tele,
      end: d => d.end/maxes.end,
      espm: d => d.espm/maxes.espm,
      speaker: d => d.speaker/maxes.speaker,
      amp: d => d.amp/maxes.amp,
      speed: d => d.speed/maxes.speed,
      movement: d => d.movement/maxes.movement,
      defense: d => d.defense/maxes.defense,
      score: d => {
        let sum = 0;
        requestBody.forEach(weightPair => {
          let [weightName, weightValue] = weightPair;
          sum += (d[weightName] * weightValue) || 0;
        });
        return sum;
      }
    }),
    arrange(desc('score'))
  );

  teamTable = teamTable.map(teamData => {
    let firstRanking = -1;
    let rankedData = frcAPITeamRankings.filter(rankedTeamData => rankedTeamData.teamNumber == teamData.team);
    if (rankedData.length == 1) {
      firstRanking = rankedData[0].rank;
    }
    return {
      ...teamData,
      firstRanking,
    }
  });

  return NextResponse.json(teamTable, {status: 200});
}

