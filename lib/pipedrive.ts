const DEAL_PAGE_LIMIT = 500;

export interface PipedriveDeal {
  id: number;
  title: string;
  value: number;
  currency: string;
  stage_id: number;
  pipeline_id: number;
  status: string;
  owner_name: string | null;
  lost_reason: string | null;
  stage_change_time: string | null;
  [key: string]: unknown;
}

interface PipedriveDealsResponse {
  success: boolean;
  data: PipedriveDeal[] | null;
  error?: string;
  additional_data?: {
    pagination?: {
      more_items_in_collection?: boolean;
      next_start?: number;
    };
  };
}

export async function fetchAllDeals(pipelineId: number): Promise<PipedriveDeal[]> {
  const domain = process.env.PIPEDRIVE_DOMAIN || "nebchile";
  const token = process.env.PIPEDRIVE_API_TOKEN;

  if (!token) {
    throw new Error("Missing PIPEDRIVE_API_TOKEN env var");
  }

  const baseUrl = `https://${domain}.pipedrive.com/v1/deals`;
  let deals: PipedriveDeal[] = [];
  let start = 0;
  let moreItems = true;

  while (moreItems) {
    const url = `${baseUrl}?api_token=${token}&start=${start}&limit=${DEAL_PAGE_LIMIT}&pipeline_id=${pipelineId}`;
    const upstream = await fetch(url, { cache: "no-store" });
    if (!upstream.ok) {
      throw new Error(`Pipedrive: ${upstream.status}`);
    }

    const json: PipedriveDealsResponse = await upstream.json();
    if (!json.success) {
      throw new Error(json.error || "Pipedrive API error");
    }

    const batch = json.data || [];
    if (batch.length === 0) break;
    deals = deals.concat(batch);

    const pagination = json.additional_data?.pagination;
    moreItems = pagination?.more_items_in_collection ?? false;
    start = pagination?.next_start ?? start + DEAL_PAGE_LIMIT;
  }

  return deals;
}
