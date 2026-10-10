// ============================================
// SBshortened.js
// Supabase, shortened. One function per job.
// Load the Supabase CDN first.
// ============================================

let SB = { client: null, ready: false };

// ──────── INIT ────────
// await SB_Init("https://xxx.supabase.co", "anon-key")
window.SB_Init = async function(url, key) {
  SB.client = supabase.createClient(url, key);
  SB.ready = true;
  return true;
};

// ──────── ADD ────────
// await SB_Add("messages", { text: "Hi", name: "Alex" })
// → returns the new row (with id, created_at)
window.SB_Add = async function(table, data) {
  if (!SB.ready) throw new Error("SB not initialized — call SB_Init first");
  const { data: result, error } = await SB.client
    .from(table)
    .insert(data)
    .select();
  if (error) throw new Error(error.message);
  return result ? result[0] : null;
};

// ──────── GET ────────
// await SB_Get("messages", 50)
// → returns array of rows
window.SB_Get = async function(table, n) {
  if (!SB.ready) throw new Error("SB not initialized — call SB_Init first");
  let q = SB.client.from(table).select("*");
  if (n) q = q.limit(n);
  const { data, error } = await q;
  if (error) throw new Error(error.message);
  return data || [];
};

// ──────── GET SORTED ────────
// await SB_GetSorted("messages", "created_at", false, 50)
window.SB_GetSorted = async function(table, column, ascending, n) {
  if (!SB.ready) throw new Error("SB not initialized — call SB_Init first");
  let q = SB.client.from(table).select("*").order(column, { ascending: !!ascending });
  if (n) q = q.limit(n);
  const { data, error } = await q;
  if (error) throw new Error(error.message);
  return data || [];
};

// ──────── WATCH ────────
// SB_Watch("messages", rows => { ... })
// → fires on load, then on every change. NO await.
window.SB_Watch = function(table, cb) {
  if (!SB.ready) throw new Error("SB not initialized — call SB_Init first");
  SB.client
    .channel("watch-" + table)
    .on("postgres_changes", { event: "*", schema: "public", table: table }, () => {
      SB_Get(table).then(cb).catch(e => console.error(e));
    })
    .subscribe();
  // Initial load
  SB_Get(table).then(cb).catch(e => console.error(e));
};

// ──────── UPDATE ────────
// await SB_Update("messages", 5, { text: "edited" })
window.SB_Update = async function(table, id, data) {
  if (!SB.ready) throw new Error("SB not initialized — call SB_Init first");
  const { error } = await SB.client.from(table).update(data).eq("id", id);
  if (error) throw new Error(error.message);
};

// ──────── DELETE ────────
// await SB_Delete("messages", 5)
window.SB_Delete = async function(table, id) {
  if (!SB.ready) throw new Error("SB not initialized — call SB_Init first");
  const { error } = await SB.client.from(table).delete().eq("id", id);
  if (error) throw new Error(error.message);
};