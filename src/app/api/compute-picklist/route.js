import { NextResponse } from "next/server";

export async function POST(request) {
    const requestBody = await request.json();
    console.log(requestBody); // e.g.   [ [ 'ESPM', '0' ], [ 'Maneuverability', '0' ] ]
    return NextResponse.json([{team: 2485, score: 100}, {team: 9485, score: 99}], {status: 200});
}