// FB but short😀😇😊😍😊😇😃😅😊🤗😅😍😊🤗😄😊😎😊🤗😄😎😊
import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js';
import {
  getFirestore, collection, addDoc, getDocs,
  doc, updateDoc, deleteDoc, increment,
  query, orderBy, limit, onSnapshot
} from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js';

let FB = { app: null, db: null, ready: false };

window.FBInit = async function(config) {
  FB.app = initializeApp(config);
  FB.db = getFirestore(FB.app);
  FB.ready = true;
  return true;
};

window.FBAdd = async function(col, data) {
  if (!FB.ready) throw new Error("FB not initialized — call FBInit first");
  const ref = await addDoc(collection(FB.db, col), data);
  return ref.id;
};

window.FBGet = async function(col, n) {
  if (!FB.ready) throw new Error("FB not initialized — call FBInit first");
  const q = n ? query(collection(FB.db, col), limit(n)) : collection(FB.db, col);
  const snap = await getDocs(q);
  const out = [];
  snap.forEach(d => out.push({ id: d.id, ...d.data() }));
  return out;
};

window.FBWatch = function(col, cb, n) {
  if (!FB.ready) throw new Error("FB not initialized — call FBInit first");
  const q = n ? query(collection(FB.db, col), limit(n)) : collection(FB.db, col);
  return onSnapshot(q, snap => {
    const out = [];
    snap.forEach(d => out.push({ id: d.id, ...d.data() }));
    cb(out);
  });
};

window.FBUpdate = async function(col, id, data) {
  if (!FB.ready) throw new Error("FB not initialized — call FBInit first");
  await updateDoc(doc(FB.db, col, id), data);
};

window.FBInc = async function(col, id, field, amt) {
  if (!FB.ready) throw new Error("FB not initialized — call FBInit first");
  await updateDoc(doc(FB.db, col, id), { [field]: increment(amt || 1) });
};

window.FBDelete = async function(col, id) {
  if (!FB.ready) throw new Error("FB not initialized — call FBInit first");
  await deleteDoc(doc(FB.db, col, id));
};