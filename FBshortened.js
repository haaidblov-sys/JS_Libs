import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js';
import {
  getFirestore, collection, addDoc, getDocs, setDoc,
  doc, updateDoc, deleteDoc, increment, getDoc,
  query, orderBy, limit, where, onSnapshot
} from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js';

let FB = { app: null, db: null, ready: false };
const guard = () => { if (!FB.ready) throw new Error("FB not initialized — call FBInit first"); };

window.FBInit = async function(config) {
  FB.app = initializeApp(config);
  FB.db  = getFirestore(FB.app);
  FB.ready = true;
  return true;
};

window.FBAdd = async function(col, data) {
  guard();
  const ref = await addDoc(collection(FB.db, col), data);
  return ref.id;
};

window.FBSetOne = async function(col, id, data) {
  guard();
  await setDoc(doc(FB.db, col, id), data);
  return id;
};
window.FBSetOneMerge = async function(col, id, data) {
  guard();
  await setDoc(doc(FB.db, col, id), data, { merge: true });
  return id;
};

window.FBGet = async function(col, n) {
  guard();
  const q = n ? query(collection(FB.db, col), limit(n)) : collection(FB.db, col);
  const snap = await getDocs(q);
  const out = [];
  snap.forEach(d => out.push({ id: d.id, ...d.data() }));
  return out;
};

window.FBGetOne = async function(col, id) {
  guard();
  const snap = await getDoc(doc(FB.db, col, id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};

window.FBGetSorted = async function(col, field, direction, n) {
  guard();
  if (!field) throw new Error("FBGetSorted: missing field name");
  const dir = direction === "asc" ? "asc" : "desc";
  let q = query(collection(FB.db, col), orderBy(field, dir));
  if (n) q = query(q, limit(n));
  const snap = await getDocs(q);
  const out = [];
  snap.forEach(d => out.push({ id: d.id, ...d.data() }));
  return out;
};

window.FBFind = async function(col, field, value) {
  guard();
  const q = query(collection(FB.db, col), where(field, "==", value));
  const snap = await getDocs(q);
  const out = [];
  snap.forEach(d => out.push({ id: d.id, ...d.data() }));
  return out;
};

window.FBFindOne = async function(col, field, value) {
  const list = await FBFind(col, field, value);
  return list[0] || null;
};

window.FBExists = async function(col, id) {
  return (await FBGetOne(col, id)) !== null;
};

window.FBWatch = function(col, cb, n, onErr) {
  guard();
  const q = n ? query(collection(FB.db, col), limit(n)) : collection(FB.db, col);
  return onSnapshot(q,
    snap => {
      const out = [];
      snap.forEach(d => out.push({ id: d.id, ...d.data() }));
      cb(out);
    },
    onErr || ((e) => console.error("FBWatch:", e))
  );
};

window.FBWatchOne = function(col, id, cb, onErr) {
  guard();
  return onSnapshot(
    doc(FB.db, col, id),
    snap => cb(snap.exists() ? { id: snap.id, ...snap.data() } : null),
    onErr || ((e) => console.error("FBWatchOne:", e))
  );
};

window.FBUpdate = async function(col, id, data) {
  guard();
  await updateDoc(doc(FB.db, col, id), data);
};

window.FBInc = async function(col, id, field, amt) {
  guard();
  await updateDoc(doc(FB.db, col, id), { [field]: increment(amt || 1) });
};

window.FBDelete = async function(col, id) {
  guard();
  await deleteDoc(doc(FB.db, col, id));
};