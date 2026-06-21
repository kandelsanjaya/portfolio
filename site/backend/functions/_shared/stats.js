export async function computeStats(db) {
  const today = new Date().toISOString().slice(0, 10); // "2026-06-21"

  const [totalRow, uniqueRow, todayRow] = await db.batch([
    db.prepare("SELECT COUNT(*) AS n FROM visits"),
    db.prepare("SELECT COUNT(DISTINCT visitor_key) AS n FROM visits"),
    db.prepare("SELECT COUNT(*) AS n FROM visits WHERE substr(created_at, 1, 10) = ?").bind(today)
  ]);

  return {
    ok: true,
    total: totalRow.results[0]?.n ?? 0,
    unique: uniqueRow.results[0]?.n ?? 0,
    today: todayRow.results[0]?.n ?? 0
  };
}
