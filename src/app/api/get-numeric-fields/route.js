import { NextResponse } from "next/server";

export function GET(request) {
    //TODO: make actually fetch database
    return NextResponse.json(["ESPM", "Maneuverability"]);
}