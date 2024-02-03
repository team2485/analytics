import { NextResponse } from "next/server";
import _ from 'lodash';

export async function POST(req){
   let body = await req.json();

   //check pre-match
   if (!(_.isString(body.scoutname) && _.isNumber(body.scoutteam) && _.isNumber(body.team) && _.isNumber(body.match))) {
      return NextResponse.json({message: "Invalid Pre-Match Data!"}, {status: 400});
   }

   //if noshow add row
   if(body.noshow){
      console.log(body);
      return NextResponse.json({message: "Success!"}, {status: 200});
   }

   //check auto
   if(!(_.isNumber(body.autoampscored)&&_.isNumber(body.autoampfailed)&&_.isNumber(body.autospeakerscored)&&_.isNumber(body.autospeakerfailed))){
      return NextResponse.json({message: "Invalid Auto Data!"}, {status: 400});
   }
   //check tele
   if(!(_.isNumber(body.teleampscored)&&_.isNumber(body.teleampfailed)&&_.isNumber(body.telenampedspeakerscored)&&_.isNumber(body.teleampedspeakerscored)&&_.isNumber(body.telespeakerfailed))){
      return NextResponse.json({message: "Invalid Tele Data!"}, {status: 400});
   }

   //check end
   if(!(_.isNumber(body.endlocation)&&_.isNumber(body.stageplacement)&&_.isBoolean(body.harmony)&&_.isNumber(body.trapScored)&&_.isNumber(body.trapFailed0))){
      return NextResponse.json({message: "Invalid Endgame Data!"}, {status: 400});
   }
   //check qualitative
   if(!(_.isNumber(body.maneuverability)&&_.isNumber(body.aggression)&&_.isNumber(body.defenseevasion)&&_.isNumber(body.speakerspeed)&&_.isNumber(body.ampspeed)&&_.isBoolean(body.gndintake)&&_.isBoolean(body.srcintake)&&_.isNumber(body.isstagehazard)&&_.isNumber(body.trapspeed)&&_.isNumber(body.onstagespeed)&&_.isNumber(harmonyspeed))){
      return NextResponse.json({message: "Invalid Qualitative Data!"}, {status: 400});
   }
   //check comments
   if(!(_.isString(body.generalcomments)&&_.isString(body.breakdowncomments)&&_.isString(body.defensecomments))){
      return NextResponse.json({message: "Invalid Comments!"}, {status: 400});
   }

   //add row

   console.log(body);
   //let resp = await sql`INSERT INTO testmatches VALUES(${ScoutTeam}, ${Team},${Match}, ${Breakdown}, ${NoShow}, ${Leave}, ${AutoAmpScored}, ${AutoAmpFailed}, ${AutoSpeakerScored}, ${AutoSpeakerFailed},${TeleAmpScored}, ${TeleAmpFailed}, ${TeleNAmpedSpeakerScored}, ${TeleAmpedSpeakerScored}, ${TeleSpeakerFailed}, ${EndLocation}, ${StagePlacement}, ${Harmony}, ${TrapScored},${TrapFailed}, ${Maneuverablity}, ${Aggression}, ${DefenseEvasion}, ${SpeakerSpeed}, ${AmpSpeed}, ${GndIntake}, ${SrcIntake}, ${StageHazard}, ${TrapSpeed}, ${OnStageSpeed}, ${HarmonySpeed}, ${GeneralComments}, ${BreakdownComments}, ${DefenseComments})`;
   return NextResponse.json({message: "Success!"}, {status: 200});
}

