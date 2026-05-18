export default async function handler(req, res) {
  const fileId = '1dYNOqyewv3sm-aZh6oB3qNGusejsVCFj';
  const url = `https://drive.google.com/uc?export=download&id=${fileId}`;

  try {
    const upstream = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    if (!upstream.ok) throw new Error(`Drive: ${upstream.status}`);
    const text = await upstream.text();
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=60');
    res.status(200).send(text);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
