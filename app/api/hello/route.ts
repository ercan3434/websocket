import { NextRequest, NextResponse } from "next/server";

// GET
export async function GET(req: NextRequest) {
  return NextResponse.json(
    { message: "Hello from Next.js API!" },
    {
      headers: corsHeaders,
    },
  );
}

// POST
export async function POST(req: NextRequest) {
  const body = await req.json(); // gelen data

  return NextResponse.json(
    {
      message: "POST başarılı",
      received: body,
    },
    {
      headers: corsHeaders,
    },
  );
}

// OPTIONS (preflight)
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
}

// Ortak CORS header
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};
