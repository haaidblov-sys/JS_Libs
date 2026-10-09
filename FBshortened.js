// ============================================
// FBshortened.js
// Firebase, shortened — one function per job.
// Load after Firebase modules.
// ============================================

import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js';
import {
  getFirestore, collection, addDoc, getDocs,
  doc, updateDoc, deleteDoc, increment,
  query, orderBy, limit, onSnapshot
} from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js';

let FB = { app: null, db: null, ready: false };

// ──────── INIT ────────
// await FBInit({ apiKey, projectId, ... })
window.FBInit = async function(config) {
  FB.app = initializeApp(config);
  FB.db = getFirestore(FB.app);
  FB.ready = true;
  return true;
};

// ──────── WRITE ────────
// await FBAdd("collection", { key: value })
// → returns the new doc's ID
window.FBAdd = async function(col, data) {
  if (!FB.ready) throw new Error("FB not initialized — call FBInit first");
  const ref = await addDoc(collection(FB.db, col), data);
  return ref.id;
};

// ──────── READ ONCE ────────
// await FBGet("collection", 50)
// → returns [{ id, ...fields }, ...]
window.FBGet = async function(col, n) {
  if (!FB.ready) throw new Error("FB not initialized — call FBInit first");
  const q = n ? query(collection(FB.db, col), limit(n)) : collection(FB.db, col);
  const snap = await getDocs(q);
  const out = [];
  snap.forEach(d => out.push({ id: d.id, ...d.data() }));
  return out;
};

// ──────── READ LIVE ────────
// FBWatch("collection", posts => { ... }, 50)
// → fires every time data changes. NO await.
window.FBWatch = function(col, cb, n) {
  if (!FB.ready) throw new Error("FB not initialized — call FBInit first");
  const q = n ? query(collection(FB.db, col), limit(n)) : collection(FB.db, col);
  return onSnapshot(q, snap => {
    const out = [];
    snap.forEach(d => out.push({ id: d.id, ...d.data() }));
    cb(out);
  });
};

// ──────── UPDATE ────────
// await FBUpdate("collection", "docId", { field: newValue })
window.FBUpdate = async function(col, id, data) {
  if (!FB.ready) throw new Error("FB not initialized — call FBInit first");
  await updateDoc(doc(FB.db, col, id), data);
};

// ──────── INCREMENT ────────
// await FBInc("collection", "docId", "votes", 1)
// → safe +1 (or any amount) even with 1000 users at once
window.FBInc = async function(col, id, field, amt) {
  if (!FB.ready) throw new Error("FB not initialized — call FBInit first");
  await updateDoc(doc(FB.db, col, id), { [field]: increment(amt || 1) });
};

// ──────── DELETE ────────
// await FBDelete("collection", "docId")
window.FBDelete = async function(col, id) {
  if (!FB.ready) throw new Error("FB not initialized — call FBInit first");
  await deleteDoc(doc(FB.db, col, id));
};