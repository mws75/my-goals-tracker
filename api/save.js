import { put } from "@vercel/blob";

/**
 * POST /api/save
 * body: { id: string, items: string[] }
 */
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  // Handle both parsed and raw body
  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body || "{}");
    } catch {
      body = {};
    }
  }
  const { id, items } = body || {};
  if (!id || !Array.isArray(items)) {
    return res.status(400).json({ error: "id and items[] required" });
  }

  const key = `goals/${encodeURIComponent(id)}.json`;
  const { url } = await put(
    key,
    JSON.stringify({ items, updatedAt: Date.now() }),
    { access: "public", contentType: "application/json" }
  );

  return res.status(200).json({ ok: true, url });
}
