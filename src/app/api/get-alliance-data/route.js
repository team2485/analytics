import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import { calcAuto, calcTele, calcEnd } from "@/util/calculations";

export const revalidate = 300; //caches for 300 seconds, 5 minutes

export async function GET() {
    let data = await sql`SELECT * FROM sdr2024;`;
    //turn data into... {[team]: {team: #, teamName: "", ...}}
    const rows = data.rows;

    const frcAPITeamData = await fetch("https://frc-api.firstinspires.org/v3.0/2024/teams?eventCode=CASD", {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + process.env.FIRST_AUTH_TOKEN,
      }
    }).then(resp => {
      if (resp.status !== 200) {
        return {teams: []};
      }
      return resp.json();
    }).then(data => data.teams);

    //generate arrays of each value
    let responseObject = {};
    rows.forEach((row) => {
      if (!row.noshow) {
        let auto = calcAuto(row);
        let tele = calcTele(row);
        let end = calcEnd(row);
        if (responseObject[row.team] == undefined) {
          let frcAPITeamInfo = frcAPITeamData.filter(teamData => teamData.teamNumber == row.team);
          responseObject[row.team] = {
            team: row.team, teamName: frcAPITeamInfo.length == 0 ? "🤖" : frcAPITeamInfo[0].nameShort,
            auto: [auto], tele: [tele], end: [end],
            avgNotes: {
              speaker: [row.autospeakerscored + row.telenampedspeakerscored],
              ampedSpeaker: [row.teleampedspeakerscored],
              amp: [row.autoampscored + row.teleampscored],
              trap: [row.trapscored],
            },
            passedNotes: [row.passednotes],
            endgame: {
              none: row.endlocation <= 0 || row.endlocation > 4 ? 1 : 0,
              park: row.endlocation == 1 ? 1 : 0,
              onstage: row.endlocation == 3 ? 1 : 0,
              onstageHarmony: row.endlocation == 4 ? 1 : 0,
              fail: row.endlocation == 2 ? 1 : 0,
            },
            qualitative: {
              onstagespeed: [row.onstagespeed],
              harmonyspeed: [row.harmonyspeed],
              trapspeed: [row.trapspeed],
              ampspeed: [row.ampspeed],
              speakerspeed: [row.speakerspeed],
              stagehazard: [row.stagehazard],
              defenseevasion: [row.defenseevasion],
              aggression: [row.aggression],
              maneuverability: [row.maneuverability],
            }
          };
        } else {
          let teamData = responseObject[row.team];
          teamData.auto.push(auto);
          teamData.tele.push(tele);
          teamData.end.push(end);
          teamData.passedNotes.push(row.passednotes);
          teamData.avgNotes.speaker.push(row.autospeakerscored + row.telenampedspeakerscored);
          teamData.avgNotes.ampedSpeaker.push(row.teleampedspeakerscored);
          teamData.avgNotes.amp.push(row.autoampscored + row.teleampscored);
          teamData.avgNotes.trap.push(row.trapscored);
          if (row.endlocation == 1) {
            teamData.endgame.park++;
          } else if (row.endlocation == 3) {
            teamData.endgame.onstage++; 
          } else if (row.endlocation == 4) {
            teamData.endgame.onstageHarmony++;
          } else if (row.endlocation == 2) {
            teamData.endgame.fail++;
          } else {
            teamData.endgame.none++;
          }
          teamData.qualitative.onstagespeed.push(row.onstagespeed);
          teamData.qualitative.harmonyspeed.push(row.harmonyspeed);
          teamData.qualitative.trapspeed.push(row.trapspeed);
          teamData.qualitative.ampspeed.push(row.ampspeed);
          teamData.qualitative.speakerspeed.push(row.speakerspeed);
          teamData.qualitative.stagehazard.push(5-row.stagehazard);
          teamData.qualitative.defenseevasion.push(row.defenseevasion);
          teamData.qualitative.aggression.push(5-row.aggression);
          teamData.qualitative.maneuverability.push(row.maneuverability);
        }
      }
    });


    //average the arrays
    const average = (array) => {//averages the array and rounds to 1 decimal place
      let count = array.length;
      if (count == 0) return -1;
      let sum = 0;
      for (let value of array) {
        sum+= value;
      }
      return Math.round(sum*10/count)/10;
    }

    for (let team in responseObject) {
      const teamObject = responseObject[team];
      teamObject.auto = average(teamObject.auto);
      teamObject.tele = average(teamObject.tele);
      teamObject.end = average(teamObject.end);
      teamObject.passedNotes = average(teamObject.passedNotes);
      teamObject.avgNotes.speaker = average(teamObject.avgNotes.speaker);
      teamObject.avgNotes.ampedSpeaker = average(teamObject.avgNotes.ampedSpeaker);
      teamObject.avgNotes.amp = average(teamObject.avgNotes.amp);
      teamObject.avgNotes.trap = average(teamObject.avgNotes.trap);
      let {none, park, onstage, onstageHarmony, fail} = teamObject.endgame;
      let locationSum = none + park + onstage + onstageHarmony + fail;
      if (locationSum ==  0) {
        teamObject.endgame = {none: 100, park: 0, onstage: 0, onstageHarmony: 0, fail: 0,}
      } else {
        teamObject.endgame = {none: Math.round(100*none/locationSum), park: Math.round(100*park/locationSum), onstage: Math.round(100*onstage/locationSum), onstageHarmony: Math.round(100*onstageHarmony/locationSum), fail: Math.round(100*fail/locationSum)}
      }
      teamObject.qualitative.onstagespeed = average(teamObject.qualitative.onstagespeed);
      teamObject.qualitative.harmonyspeed = average(teamObject.qualitative.harmonyspeed);
      teamObject.qualitative.trapspeed = average(teamObject.qualitative.trapspeed);
      teamObject.qualitative.ampspeed = average(teamObject.qualitative.ampspeed);
      teamObject.qualitative.speakerspeed = average(teamObject.qualitative.speakerspeed);
      teamObject.qualitative.stagehazard = average(teamObject.qualitative.stagehazard);
      teamObject.qualitative.defenseevasion = average(teamObject.qualitative.defenseevasion);
      teamObject.qualitative.aggression = average(teamObject.qualitative.aggression);
      teamObject.qualitative.maneuverability = average(teamObject.qualitative.maneuverability);
    }

    return NextResponse.json(responseObject, {status: 200});
}