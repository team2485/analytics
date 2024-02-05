import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

export const revalidate = 300; //caches for 300 seconds, 5 minutes

export async function GET() {
    let data = await sql`SELECT * FROM testmatches;`;
    console.log(data);
    return NextResponse.json({rows: data.rows}, {status: 200});
}