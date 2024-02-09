import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

export const revalidate = 300; //caches for 300 seconds, 5 minutes

export async function GET() {
    let data = await sql`SELECT * FROM testmatches;`;
    //turn data into... {[team]: {team: #, teamName: "", ...}}

    return NextResponse.json({
      "2485": {
        team: 2485,
        teamName: "W.A.R. Lords",
        auto: 15,
        tele: 27,
        end: 5,
        avgNotes: {
          speaker: 3,
          ampedSpeaker: 2,
          amp: 7,
          trap: 1,
        },
        endgame: {
          none: 5,
          park: 5,
          onstage: 30,
          onstageHarmony: 60,
        },
        qualitative: {
          onstagespeed: 5,
          harmonyspeed: 1,
          trapspeed: 1,
          ampspeed: 1,
          speakerspeed: 0,
          stagehazard: 5,
          defenseevasion: 5,
          aggression: 1,
          maneuverability: 5,
        }
      },
      "9485": {
        team: 9485,
        teamName: "W.A.R. Lords 2",
        auto: 0,
        tele: 45,
        end: 10,
        avgNotes: {
          speaker: 1,
          ampedSpeaker: 5,
          amp: 0,
          trap: 1,
        },
        endgame: {
          none: 5,
          park: 44,
          onstage: 31,
          onstageHarmony: 20,
        },
        qualitative: {
          onstagespeed: 5,
          harmonyspeed: 4,
          trapspeed: 3,
          ampspeed: 2,
          speakerspeed: 1,
          stagehazard: 0,
          defenseevasion: 1,
          aggression: 2,
          maneuverability: 3,
        }
      },
    }, {status: 200});
}