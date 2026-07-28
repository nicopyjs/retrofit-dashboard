import { NextResponse } from "next/server";
import { fetchAllDeals } from "@/lib/pipedrive";
import { PIPELINE_ID } from "@/lib/constants";

export async function GET() {
  try {
    const deals = await fetchAllDeals(PIPELINE_ID);
    return NextResponse.json(deals, {
      headers: {
        "Cache-Control": "s-maxage=300, stale-while-revalidate=60",
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
