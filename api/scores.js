export default async function handler(req, res) {
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_KEY;

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    return res.status(500).json({ error: '환경변수가 설정되지 않았습니다.' });
  }

  // CORS (토스 미니앱 WebView·Vercel 웹 모두 허용)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  // ── GET : 리더보드 조회 ──────────────────────────────────
  if (req.method === 'GET') {
    try {
      const r = await fetch(
        `${SUPABASE_URL}/rest/v1/poop_leaderboard?select=*&order=score.desc&limit=10`,
        {
          headers: {
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${SUPABASE_KEY}`,
          },
        }
      );
      if (!r.ok) throw new Error(`Supabase error: ${r.status}`);
      const data = await r.json();
      return res.status(200).json(data);
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  // ── POST : 점수 등록 ─────────────────────────────────────
  if (req.method === 'POST') {
    const { nickname, score, stage } = req.body ?? {};

    // 서버사이드 유효성 검사
    if (
      typeof nickname !== 'string' ||
      nickname.trim().length < 1 ||
      nickname.trim().length > 10
    ) {
      return res.status(400).json({ error: '닉네임은 1~10자여야 합니다.' });
    }
    if (typeof score !== 'number' || !Number.isInteger(score) || score < 0 || score > 9999) {
      return res.status(400).json({ error: '유효하지 않은 점수입니다.' });
    }
    if (typeof stage !== 'number' || !Number.isInteger(stage) || stage < 1 || stage > 5) {
      return res.status(400).json({ error: '유효하지 않은 스테이지입니다.' });
    }

    try {
      const r = await fetch(`${SUPABASE_URL}/rest/v1/poop_leaderboard`, {
        method: 'POST',
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
          Prefer: 'return=representation',
        },
        body: JSON.stringify({
          nickname: nickname.trim(),
          score,
          stage,
        }),
      });
      if (!r.ok) throw new Error(`Supabase error: ${r.status}`);
      const data = await r.json();
      return res.status(201).json(data);
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
