import { NextRequest, NextResponse } from "next/server";

let messages: string[] = [];

export async function GET() {
  return NextResponse.json(messages, {
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  messages.push(body.message);

  return NextResponse.json({ success: true }, {
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}