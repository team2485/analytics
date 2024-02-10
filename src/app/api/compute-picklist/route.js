import { NextResponse } from "next/server";
import { sql } from '@vercel/postgres';

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
  let teamTable = {};

  for (let i = 0; i < rows.length; i++) {
    const curRow = rows[i];
    let team = curRow.team;
    let espm = calcESPM(curRow);
    let auto = calcAuto(curRow);
    let tele = calcTele(curRow);
    let end = calcEnd(curRow);
    
    if(teamTable[team] == null){
      //doesn't exist, so creating team datapoint
      //todo: we only care about the two averages for the qualitative data, so only use those, details on line 56
      teamTable[team] = { ESPM: [espm], Auto: [auto], Tele: [tele], End: [end] /* insert speed and movement here */}
    }
    else if(teamTable[team]){
      //does exist, so appending to team data
      teamTable[team].ESPM.push(curRow.ESPM);
      teamTable[team].Auto.push(curRow.Auto);
      teamTable[team].Tele.push(curRow.Tele);
      teamTable[team].End.push(curRow.End);
      //todo: we want 2 more values per match
      // (1) Speed - Average all of the speed variables (don't include it is it's -1)
      // (2) Movement - Average maneuverability, defenseevasion, aggression, and stage hazard (make sure to subtract the last two from 5 before averaging, since 0 is the best score)
    }
  }

  //todo: currently teamdata holds arrays for every value --- teamTable = {    2485: {espm: [10, 30, 50], auto: [5, 5, 5], ...}, 9485: {...}, ...    })
  //todo: but we need to convert that into single values before you use them as single values on lines 77-87 --- teamTable = {    2485: {espm: 30, auto: 5, ...}, 9485: {...}, ...    }
  //                                                                                                     🔽in fact, you could calculate the maximums as you calculate the values, but that's optional



  //finding the maximums

  let maxESPM = 0;
  let maxAUTO = 0;
  let maxTELE = 0;
  let maxEND = 0;
  let maxSPEED = 0;
  let maxMOVEMENT = 0;

  for (let teamKey in teamTable) {
    let teamData = teamTable[teamKey];

    maxESPM = Math.max(maxESPM, teamData.ESPM);
    maxAUTO = Math.max(maxAUTO, teamData.Auto);
    maxTELE = Math.max(maxTELE, teamData.Tele);
    maxEND = Math.max(maxEND, teamData.End);
    //todo: calculate for speed and movement too
  }
  
  //normalizing the values & calculating the score

  for(let teamKey in teamTable) {
    let teamData = teamTable[teamKey];
    //console.log(teamData.ESPM)
    teamData.ESPM /= maxESPM;
    teamData.Auto /= maxAUTO;
    teamData.Tele /= maxTELE;
    teamData.End /= maxEND;
    teamData.Maneuverability /= maxMANEUVERABILITY;
    teamData.Aggression /= maxAGGRESSION;
    teamData.DefenseEvasion /= maxDEFENSEEVASION;
    teamData.IntakeSpeed /= maxINTAKESPEED;
    teamData.StageHazard /= maxSTAGEHAZARD;
    teamData.OnStageSpeed /= maxONSTAGESPEED;
    teamData.HarmonySpeed /= maxHARMONYSPEED;
    teamData.score = 0;

    for (let weight of requestBody){
      //console.log(teamData[weight[0]])
      teamData.score += (teamData[weight[0]] * weight[1]);
    }

    teamTable[teamKey].score = teamData.score
    //console.log(teamTable[teamKey].score)
  }

  //NOTE: THE FOLLOWING CODE DOES NOT GENERATE A DICTIONARY/JSON OBJECT AS YOU WANT, it makes returnTable = {"k": [the, values, of, the, d, array]}
  //INSTEAD, YOU'LL SIMPLY WANT TO SORT teamTable, and return teamTable
  // let k = []
  // let d = []
  // for (const key in teamTable) {
  //   k.push(key);
  //   d.push(key[0])
  // }

  // let returnTable = {k: d}

  //multiply the normaizled values by the weight

  return NextResponse.json(returnTable);


}

