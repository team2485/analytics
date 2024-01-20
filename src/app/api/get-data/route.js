import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

export async function GET() {
    let {rows} = sql`SELECT * FROM TestMatches;`;
    return NextResponse.json({rows}, {status: 200});
}