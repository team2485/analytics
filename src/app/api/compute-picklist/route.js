import { NextResponse } from "next/server";
import { sql } from '@vercel/postgres';
import { tidy, mutate, arrange, desc, mean, select, summarizeIf, summarizeAll, max, groupBy} from '@tidyjs/tidy'

export async function POST(request) {
  const requestBody = await request.json();

  //console.log(requestBody); // e.g.   [ [ 'ESPM', '0' ], [ 'Maneuverability', '0' ] ]

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
    //TODO: FIX TO UTIL CALCULATIONS FILE
    return (
      (record.endlocation == 0 ? 2 : 3) +
      (record.harmony ? 2 : 0) +
      record.trapscored * 5
    );
  };
  const calcESPM = (record) => {
    return calcAuto(record) + calcTele(record) + calcEnd(record);
  };
  let data = await sql`SELECT * FROM testmatches;`;
  let rows = data.rows;

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
    //numbers, so average them
    return mean(index)
  }
  
  //join data from multiple scouts on same match
  let teamTable = tidy(rows,
      groupBy(['team', 'match'], [
        summarizeAll(byAveragingNumbers)
      ])
    );
  
  teamTable = teamTable.filter(dr => dr.noshow == false);
  
  //calculate the values we care about: ESPM, Auto, Tele, End, Speed, Movement
  //TODO: define functions for calcSpeed & calcMovement
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
    let arr = [dr.maneuverability, dr.defenseEvasion, 5 - dr.stagehazard, 5 - dr.aggression].filter(a => a != -1)
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
      speed: calcSpeed,
      movement: calcMovement,
    }),
    select(['team', 'auto', 'tele', 'end', 'espm', 'speed', 'movement'])
  );
  
  //calculate maxes
  console.log(teamTable);
  let maxes = tidy(teamTable, summarizeIf((vector) => Number.isFinite(vector[0]), max));
  console.log(maxes);

  //normalize & get score
  teamTable = tidy(teamTable, mutate({
    auto: d => d.auto/maxes.auto,
    tele: d => d.tele/maxes.tele,
    end: d => d.end/maxes.end,
    espm: d => d.espm/maxes.espm,
    speed: d => d.speed/maxes.speed,
    movement: d => d.movement/maxes.movement,
    score: d => {
      let sum = 0;
      requestBody.forEach(weightPair => {
        let [weightName, weightValue] = weightPair;
        sum += (d[weightName] * weightValue) || 0;
      });
      return sum;
    }
  }))

  return NextResponse.json(teamTable);


}

