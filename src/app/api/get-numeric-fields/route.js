import { NextResponse } from "next/server";
import { sql } from '@vercel/postgres';

export async function GET(request) {
    //TODO: make actually fetch database
    let data = await sql`SELECT * FROM TestMatches;`;

    let values = data.rows.map(row => row.Scoutname);  
    
    //return NextResponse.json(values)
    return NextResponse.json(["ESPM", "Auto", "Tele", "End", "Maneuverability", "Aggression", "DefenseEvasion", "IntakeSpeed", "StageHazard", "OnStageSpeed", "HarmonySpeed"]);
}