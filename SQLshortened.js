
// ============================================
// SQL_shortened.js — MySQL wrapper for the browser
// Requires a backend at SERVER_URL that accepts:
//   POST { query: "...", params: [...] }
// and returns either an array of rows or { error: "..." }
//
// Usage:
//   SQLInit("http://localhost:3000/sql");
//   await SQLAdd("Rooms", { id: "abc", text: "hi" });
//   const room = await SQLGetOne("Rooms", "id = ?", ["abc"]);
// ============================================

let SQL = { url: null, ready: false };

// ───────────── INIT ─────────────
window.SQLInit = function(serverUrl) {
  SQL.url = serverUrl;
  SQL.ready = true;
};

// ───────────── INTERNAL ─────────────
async function _run(query, params) {
  if (!SQL.ready) throw new Error("SQL not initialized");
  const r = await fetch(SQL.url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, params: params || [] })
  });
  const data = await r.json();
  if (data && data.error) throw new Error(data.error);
  return data;
}

function _escape(v) {
  return String(v).replace(/'/g, "''");
}

// ───────────── RAW ─────────────
window.SQLRaw = _run;

// ───────────── READ ─────────────
window.SQLGet = async function(table, where, params) {
  const q = where
    ? `SELECT * FROM ${table} WHERE ${where}`
    : `SELECT * FROM ${table}`;
  return _run(q, params);
};

window.SQLGetOne = async function(table, where, params) {
  const rows = await _run(
    `SELECT * FROM ${table} WHERE ${where} LIMIT 1`,
    params
  );
  return rows[0] || null;
};

// ───────────── CREATE ─────────────
window.SQLAdd = async function(table, data) {
  const keys = Object.keys(data);
  const cols = keys.join(", ");
  const placeholders = keys.map(() => "?").join(", ");
  const vals = keys.map(k => data[k]);
  return _run(
    `INSERT INTO ${table} (${cols}) VALUES (${placeholders})`,
    vals
  );
};

// ───────────── UPDATE (requires WHERE) ─────────────
window.SQLUpdate = async function(table, data, where, params) {
  if (!where) throw new Error("SQLUpdate requires a WHERE clause");
  const keys = Object.keys(data);
  const sets = keys.map(k => `${k} = ?`).join(", ");
  const vals = keys.map(k => data[k]);
  const allParams = vals.concat(params || []);
  return _run(
    `UPDATE ${table} SET ${sets} WHERE ${where}`,
    allParams
  );
};

// ───────────── UPDATE ALL (dangerous, no WHERE) ─────────────
window.SQLUpdateAll = async function(table, data) {
  const keys = Object.keys(data);
  const sets = keys.map(k => `${k} = ?`).join(", ");
  const vals = keys.map(k => data[k]);
  return _run(`UPDATE ${table} SET ${sets}`, vals);
};

// ───────────── UPSERT (insert or update) ─────────────
window.SQLSet = async function(table, data) {
  const keys = Object.keys(data);
  const cols = keys.join(", ");
  const placeholders = keys.map(() => "?").join(", ");
  const updates = keys.map(k => `${k} = VALUES(${k})`).join(", ");
  const vals = keys.map(k => data[k]);
  return _run(
    `INSERT INTO ${table} (${cols}) VALUES (${placeholders}) ` +
    `ON DUPLICATE KEY UPDATE ${updates}`,
    vals
  );
};

// ───────────── DELETE ─────────────
window.SQLDelete = async function(table, where, params) {
  if (!where) throw new Error("SQLDelete requires a WHERE clause");
  return _run(`DELETE FROM ${table} WHERE ${where}`, params);
};

// ───────────── COUNT ─────────────
window.SQLCount = async function(table, where, params) {
  const q = where
    ? `SELECT COUNT(*) AS n FROM ${table} WHERE ${where}`
    : `SELECT COUNT(*) AS n FROM ${table}`;
  const rows = await _run(q, params);
  return rows[0] ? rows[0].n : 0;
};

// ───────────── EXIST ─────────────
window.SQLExists = async function(table, where, params) {
  const n = await SQLCount(table, where, params);
  return n > 0;
};

// ───────────── OTHER HELPERS ─────────────
window.sayHi = function() {
  console.log("Hi from SQL_shortened!");
};

window.sqlPrint = function(input) {
  console.log(input);
};

window.formatTime = function(ms) {
  const s = Math.floor((Date.now() - ms) / 1000);
  if (s < 60) return s + "s ago";
  const m = Math.floor(s / 60);
  if (m < 60) return m + "m ago";
  const h = Math.floor(m / 60);
  if (h < 24) return h + "h ago";
  return Math.floor(h / 24) + "d ago";
};