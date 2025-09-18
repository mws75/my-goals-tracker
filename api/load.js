import { list } from "@vercel/blob";

/**
 * GET /api/load?id=<string>
 */
export default async function handler(req, res) {
  const id = (req.query.id || "").toString();
  if (!id) return res.status(400).json({ error: "id required" });

  const key = `goals/${encodeURIComponent(id)}.json`;

  // Check if a blob exists for this key
  const files = await list({ prefix: `goals/${encodeURIComponent(id)}` });
  const found = files.blobs.find((b) => b.pathname === key);
  if (!found) return res.status(200).json({ items: [] });

  // Fetch public blob contents
  const r = await fetch(found.url);
  const json = await r.json();
  return res.status(200).json(json);
}
