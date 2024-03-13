import _ from 'lodash';
import { sql } from "@vercel/postgres";
import { NextResponse } from 'next/server';

export async function POST(request) {
  const res = await request.json();
  const { id, password } = res;

  if (password !== "delete") {
    return NextResponse.json({error: "Invalid password"}, {status: 401});
  }
  if (!_.isInteger(id)) {
    return NextResponse.json({error: "Invalid id"}, {status: 400});
  }

  await sql`DELETE FROM ${process.env.DATABASE_TABLE_NAME} WHERE id = ${id};`;

  return NextResponse.json({ message: "Row deleted successfully" }, {status: 200});
}
