import { NextResponse } from "next/server";
import { sql } from '@vercel/postgres';
import _ from 'lodash';

export async function POST(req){
   let body = await req.json();
   console.log(body);
   //check pre-match
   if (!(_.isString(body.scoutname) && _.isNumber(body.scoutteam) && _.isNumber(body.team) && _.isNumber(body.match))) {
      return NextResponse.json({message: "Invalid Pre-Match Data!"}, {status: 400});
   }
   
   //check team and match
   let valid = await fetch("/api/check-team-and-match")
      .then((resp) => resp.json())
      .then((data) => data.valid)
      if (data.valid == false) {
         return NextResponse.json({message: "Check Match and Team Number!"}, {status: 400});
      }

   //if noshow add row
   if(body.noshow){
      console.log('no show!');
      let resp = await sql`INSERT INTO champs2024 (ScoutName, ScoutTeam, Team, Match, NoShow) VALUES(${body.scoutname}, ${body.scoutteam}, ${body.team}, ${body.match}, ${body.noshow})`;
      return NextResponse.json({message: "Success!"}, {status: 201});
   }

   //check auto
   if(!(_.isNumber(body.autoampscored)&&_.isNumber(body.autoampfailed)&&_.isNumber(body.autospeakerscored)&&_.isNumber(body.autospeakerfailed))){
      return NextResponse.json({message: "Invalid Auto Data!"}, {status: 400});
   }
   //check tele
   if(!(_.isNumber(body.passednotes)&&_.isNumber(body.teleampscored)&&_.isNumber(body.teleampfailed)&&_.isNumber(body.telenampedspeakerscored)&&_.isNumber(body.teleampedspeakerscored)&&_.isNumber(body.telespeakerfailed))){
      return NextResponse.json({message: "Invalid Tele Data!"}, {status: 400});
   }

   //check end
   if(!(_.isNumber(body.endlocation)&&_.isNumber(body.stageplacement)&&_.isBoolean(body.harmony)&&_.isNumber(body.trapscored)&&_.isNumber(body.trapfailed))){
      return NextResponse.json({message: "Invalid Endgame Data!"}, {status: 400});
   }
   //check qualitative
   if(!(_.isNumber(body.maneuverability)&&_.isNumber(body.aggression)&&_.isNumber(body.defenseevasion)&&_.isNumber(body.speakerspeed)&&_.isNumber(body.ampspeed)&&_.isBoolean(body.gndintake)&&_.isBoolean(body.srcintake)&&_.isNumber(body.stagehazard)&&_.isNumber(body.trapspeed)&&_.isNumber(body.onstagespeed)&&_.isNumber(body.harmonyspeed)&&_.isNumber(body.defenserating))){
      return NextResponse.json({message: "Invalid Qualitative Data!"}, {status: 400});
   }
   //check comments
   if((_.isString(body.generalcomments) == false) || ((_.isString(body.breakdowncomments) || _.isNull(body.breakdowncomments)) == false) || ((_.isString(body.defensecomments) || _.isNull(body.defensecomments)) == false)) {
      return NextResponse.json({message: "Invalid Comments!"}, {status: 400});
   }

   //add row
   let resp = await sql`INSERT INTO champs2024 (ScoutName, ScoutTeam, Team, Match, Breakdown, NoShow, Leave, AutoAmpScored, AutoAmpFailed, AutoSpeakerScored, AutoSpeakerFailed, PassedNotes, TeleAmpScored, TeleAmpFailed, TeleNAmpedSpeakerScored, TeleAmpedSpeakerScored, TeleSpeakerFailed, EndLocation, StagePlacement, Harmony, TrapScored, TrapFailed, Maneuverability, Aggression, DefenseRating, DefenseEvasion, SpeakerSpeed, AmpSpeed, GndIntake, SrcIntake, StageHazard, TrapSpeed, OnStageSpeed, HarmonySpeed, GeneralComments, BreakdownComments, DefenseComments)
   VALUES (${body.scoutname}, ${body.scoutteam}, ${body.team}, ${body.match}, ${body.breakdown}, ${body.noshow}, ${body.leave}, ${body.autoampscored}, ${body.autoampfailed}, ${body.autospeakerscored}, ${body.autospeakerfailed}, ${body.passednotes}, ${body.teleampscored}, ${body.teleampfailed}, ${body.telenampedspeakerscored}, ${body.teleampedspeakerscored}, ${body.telespeakerfailed}, ${body.endlocation}, ${body.stageplacement}, ${body.harmony}, ${body.trapscored}, ${body.trapfailed}, ${body.maneuverability}, ${body.aggression}, ${body.defenserating}, ${body.defenseevasion}, ${body.speakerspeed}, ${body.ampspeed}, ${body.gndintake}, ${body.srcintake}, ${body.stagehazard}, ${body.trapspeed}, ${body.onstagespeed}, ${body.harmonyspeed}, ${body.generalcomments}, ${body.breakdowncomments}, ${body.defensecomments})`;
   return NextResponse.json({message: "Success!"}, {status: 201});
}
