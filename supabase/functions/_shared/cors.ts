export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

export function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

/**
 * Errors are logged in full but returned to the client as a generic message —
 * checkout and entitlement failures should never leak schema or key details.
 */
export function fail(context: string, error: unknown, status = 500) {
  console.error(`[${context}]`, error);
  return json({ error: "Request could not be completed." }, status);
}
