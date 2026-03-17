// app/api/hello/route.ts  (Next 13+ app router)
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  return NextResponse.json({ message: "Hello from Next.js API!" });
}