// ============================================
// RTDBshortened.js
// Firebase Realtime Database, shortened.
// One function per job.
// ============================================

import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js';
import {
  getDatabase,
  ref,
  push,
  set,
  get,
  update,
  remove,
  onValue,
  query,
  orderByChild,
  limitToLast,
  serverTimestamp
} from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-database.js';

let RTDB = { app: null, db: null, ready: false };

// ──────── INIT ────────
// await RTDB_Init({ databaseURL: "...", ... })
window.RTDB_Init = async function(config) {
  RTDB.app = initializeApp(config);
  RTDB.db = getDatabase(RTDB.app);
  RTDB.ready = true;
  return true;
};

// ──────── WRITE (push with auto-ID) ────────
// await RTDB_Add("messages", { name: "Alex", text: "Hi" })
// → returns the new key (like "-Nabc123")
window.RTDB_Add = async function(path, data) {
  if (!RTDB.ready) throw new Error("RTDB not initialized — call RTDB_Init first");
  const newRef = push(ref(RTDB.db, path));
  await set(newRef, data);
  return newRef.key;
};

// ──────── WRITE (fixed key, overwrites) ────────
// await RTDB_Set("users/alex", { name: "Alex", score: 0 })
window.RTDB_Set = async function(path, data) {
  if (!RTDB.ready) throw new Error("RTDB not initialized — call RTDB_Init first");
  await set(ref(RTDB.db, path), data);
};

// ──────── READ ONCE ────────
// await RTDB_Get("messages")
// → returns { key1: {...}, key2: {...} } or null
window.RTDB_Get = async function(path) {
  if (!RTDB.ready) throw new Error("RTDB not initialized — call RTDB_Init first");
  const snap = await get(ref(RTDB.db, path));
  return snap.exists() ? snap.val() : null;
};

// ──────── READ LIVE ────────
// RTDB_Watch("messages", data => { ... })
// → fires on load, then on every change. NO await.
window.RTDB_Watch = function(path, cb, limitN) {
  if (!RTDB.ready) throw new Error("RTDB not initialized — call RTDB_Init first");
  const base = ref(RTDB.db, path);
  const target = limitN
    ? query(base, limitToLast(limitN))
    : base;
  return onValue(target, snap => {
    cb(snap.exists() ? snap.val() : null);
  });
};

// ──────── UPDATE ────────
// await RTDB_Update("messages/-Nabc123", { text: "edited" })
// → only changes the given fields, keeps the rest
window.RTDB_Update = async function(path, data) {
  if (!RTDB.ready) throw new Error("RTDB not initialized — call RTDB_Init first");
  await update(ref(RTDB.db, path), data);
};

// ──────── INCREMENT ────────
// await RTDB_Inc("counters/likes", 1)
// → atomic +1. Uses transaction-free increment via update.
window.RTDB_Inc = async function(path, amount) {
  if (!RTDB.ready) throw new Error("RTDB not initialized — call RTDB_Init first");
  const amt = Number(amount) || 1;
  const snap = await get(ref(RTDB.db, path));
  const current = snap.exists() ? Number(snap.val()) || 0 : 0;
  await set(ref(RTDB.db, path), current + amt);
  return current + amt;
};

// ──────── DELETE ────────
// await RTDB_Delete("messages/-Nabc123")
window.RTDB_Delete = async function(path) {
  if (!RTDB.ready) throw new Error("RTDB not initialized — call RTDB_Init first");
  await remove(ref(RTDB.db, path));
};

// ──────── SERVER TIMESTAMP ────────
// Use this instead of Date.now() to avoid clock drift between devices
window.RTDB_Now = function() {
  return serverTimestamp();
};