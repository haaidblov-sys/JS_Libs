
// FB but short😀😇😊😍😊😇😃😅😊🤗😅😍😊🤗😄😊😎😊🤗😄😎😊
import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js';
import {
  getFirestore, collection, addDoc, getDocs,
  doc, updateDoc, deleteDoc, increment,
  query, orderBy, limit, onSnapshot
} from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js';

let FB = { app: null, db: null, ready: false };

window.FBInit = function(config) {
  FB.app = initializeApp(config);
  FB.db = getFirestore(FB.app);
  FB.ready = true;
};

window.FBAdd = async function(col, data) {
  if (!FB.ready) throw new Error("FB not initialized");
  const ref = await addDoc(collection(FB.db, col), data);
  return ref.id;
};

window.FBGet = async function(col, n) {
  const q = n ? query(collection(FB.db, col), limit(n)) : collection(FB.db, col);
  const snap = await getDocs(q);
  const out = [];
  snap.forEach(d => out.push({ id: d.id, ...d.data() }));
  return out;
};

window.FBWatch = function(col, cb, n) {
  const q = n ? query(collection(FB.db, col), limit(n)) : collection(FB.db, col);
  return onSnapshot(q, snap => {
    const out = [];
    snap.forEach(d => out.push({ id: d.id, ...d.data() }));
    cb(out);
  });
};

window.FBUpdate = async function(col, id, data) {
  await updateDoc(doc(FB.db, col, id), data);
};

window.FBInc = async function(col, id, field, amt) {
  await updateDoc(doc(FB.db, col, id), { [field]: increment(amt || 1) });
};

window.FBDelete = async function(col, id) {
  await deleteDoc(doc(FB.db, col, id));
};