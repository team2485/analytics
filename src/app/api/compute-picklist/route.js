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

  for (var i = 0; i < rows.length; i++) {
    let espm = calcESPM(rows[i]);
    let auto = calcAuto(rows[i]);
    let tele = calcTele(rows[i]);
    let end = calcEnd(rows[i]);
    
    if(teamTable[rows[i]] == null){
      teamTable[rows[i].team] = { id: [rows[i].id], ESPM: [espm], Auto: [auto], Tele: [tele], End: [end], Maneuverability: [rows[i].maneuverability], Aggression: [rows[i].aggression], DefenseEvasion: [rows[i].defenseevasion], IntakeSpeed: [rows[i].intakespeed], StageHazard: [rows[i].stagehazard], OnStageSpeed: [rows[i].onstagespeed], HarmonySpeed: [rows[i].harmonyspeed], scoutname: [rows[i].scoutname] }
    }
    else if(teamTable[rows[i]]){
      teamTable[rows[i].team].id.push(rows[i].id);
      //to the rest replicating the one above 
      teamTable[rows[i].team].ESPM.push(rows[i].ESPM);
      teamTable[rows[i].team].Auto.push(rows[i].Auto);
      teamTable[rows[i].team].Tele.push(rows[i].Tele);
      teamTable[rows[i].team].End.push(rows[i].End);
      teamTable[rows[i].team].Maneuverability.push(rows[i].Maneuverability);
      teamTable[rows[i].team].Aggression.push(rows[i].Aggression);
      teamTable[rows[i].team].DefenseEvasion.push(rows[i].DefenseEvasion);
      teamTable[rows[i].team].IntakeSpeed.push(rows[i].IntakeSpeed);
      teamTable[rows[i].team].StageHazard.push(rows[i].StageHazard);
      teamTable[rows[i].team].OnStageSpeed.push(rows[i].OnStageSpeed);
      teamTable[rows[i].team].HarmonySpeed.push(rows[i].HarmonySpeed);
      teamTable[rows[i].team].scoutname.push(rows[i].scoutname);
    }
  }

  var maxESPM = 0;
  var maxAUTO = 0;
  var maxTELE = 0;
  var maxEND = 0;
  var maxMANEUVERABILITY = 0;
  var maxAGGRESSION = 0;
  var maxDEFENSEEVASION = 0;
  var maxINTAKESPEED = 0;
  var maxSTAGEHAZARD = 0;
  var maxONSTAGESPEED = 0;
  var maxHARMONYSPEED = 0;

  for (let teamKey in teamTable) {
    var teamData = teamTable[teamKey];

    maxESPM = Math.max(maxESPM, teamData.ESPM);
    maxAUTO = Math.max(maxAUTO, teamData.Auto);
    maxTELE = Math.max(maxTELE, teamData.Tele);
    maxEND = Math.max(maxEND, teamData.End);
    maxMANEUVERABILITY = Math.max(maxMANEUVERABILITY, teamData.Maneuverability);
    maxAGGRESSION = Math.max(maxAGGRESSION, teamData.Aggression);
    maxDEFENSEEVASION = Math.max(maxDEFENSEEVASION, teamData.DefenseEvasion);
    maxINTAKESPEED = Math.max(maxINTAKESPEED, teamData.IntakeSpeed);
    maxSTAGEHAZARD = Math.max(maxSTAGEHAZARD, teamData.StageHazard);
    maxONSTAGESPEED = Math.max(maxONSTAGESPEED, teamData.OnStageSpeed);
    maxHARMONYSPEED = Math.max(maxHARMONYSPEED, teamData.HarmonySpeed);
  }
  
  //the step to normalize the values 

  for(let teamKey in teamTable) {
    var teamData = teamTable[teamKey];
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
  let k = []
  let d = []
  for (const key in teamTable) {
    k.push(key);
    d.push(key[0])
  }

  let returnTable = {k: d}

  //multiply the normaizled values by the weight

  return NextResponse.json(returnTable);


}

