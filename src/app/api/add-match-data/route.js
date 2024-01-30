import { NextResponse } from "next/server";
import _ from 'lodash';

export async function POST(req){
   let body = await req.json();
   console.log(body);

   //check pre-match
   if (!(_.isString(body.scoutname) && _.isNumber(body.scoutteam) && _.isNumber(body.team) && _.isNumber(body.match))) {
      return NextResponse.json({message: "Invalid Pre-Match Data!"}, {status: 400});
   }

   //if noshow add row

   //check auto
   //check tele
   //check end
   //check qualitative
   //check comments

   //add row


   // let resp = await sql`INSERT INTO testmatches VALUES(${ScoutTeam}, ${teamStatus},${matchStatus})`;
   return NextResponse.json({message: "Success!"}, {status: 200});
}

