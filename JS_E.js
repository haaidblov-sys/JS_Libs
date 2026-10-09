// ──────── multiSplit ────────
window.multiSplit = function(string, by) {
  const OUTARR = [];
  let BuiltText = "";
  for (let i = 0; i < string.length; i++) {
    const ch = string.charAt(i);
    let isDelim = false;
    for (let d = 0; d < by.length; d++) {
      if (ch === by.charAt(d)) {
        isDelim = true;
        break;
      }
    }
    if (isDelim) {
      OUTARR.push(BuiltText);
      BuiltText = "";
    } else {
      BuiltText += ch;
    }
  }
  OUTARR.push(BuiltText);
  return OUTARR;
};

// ──────── backwards ────────
window.backwards = function(text) {
  let OUTTEXT = "";
  for (let i = text.length - 1; i >= 0; i--) {
    OUTTEXT += text.charAt(i);
  }
  return OUTTEXT;
};

// ──────── forwards ────────
window.forwards = function(text) {
  let OUTTEXT = "";
  for (let i = 0; i < text.length; i++) {
    OUTTEXT += text.charAt(i);
  }
  return OUTTEXT;
};
// Random integer in [min, max]
window.randInt = function(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Random item from an array
window.randPick = function(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
};

// Round to N decimals — 3.14159, 2 → 3.14
window.roundTo = function(n, decimals) {
  const f = Math.pow(10, decimals);
  return Math.round(n * f) / f;
};

// Check if number is even
window.isEven = function(n) { return n % 2 === 0; };

// Clamp — clamp(15, 0, 10) → 10
window.clamp = function(n, min, max) {
  return Math.max(min, Math.min(max, n));
};

// Convert to hex — 255 → "ff"
window.toHex = function(n) { return n.toString(16); };
// Remove duplicates — [1,2,2,3] → [1,2,3]
window.uniq = function(arr) { return [...new Set(arr)]; };

// Shuffle array (Fisher-Yates)
window.shuffle = function(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

// Sum numbers — [1,2,3] → 6
window.sum = function(arr) { return arr.reduce((a, b) => a + b, 0); };

// Chunk array — [1,2,3,4,5], 2 → [[1,2],[3,4],[5]]
window.chunk = function(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) {
    out.push(arr.slice(i, i + size));
  }
  return out;
};

// Find intersection — [1,2,3] + [2,3,4] → [2,3]
window.intersect = function(a, b) {
  return a.filter(x => b.includes(x));
};

// Repeat a string N times — "ab", 3 → "ababab"
window.repeatStr = function(str, n) {
  return str.repeat(Math.max(0, n));
};

// Reverse the words in a sentence — "hello world" → "world hello"
window.reverseWords = function(text) {
  return text.split(" ").reverse().join(" ");
};

// Capitalize first letter of each word
window.titleCase = function(text) {
  return text.replace(/\w\S*/g, w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
};

// Pad a number with zeros — 5, 3 → "005"
window.padNum = function(n, width) {
  return String(n).padStart(width, "0");
};

// Truncate with ellipsis — "hello world", 7 → "hello w…"
window.truncate = function(text, max) {
  return text.length > max ? text.slice(0, max - 1) + "…" : text;
};
// Promise-based delay
// await wait(1000);
window.wait = function(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Format timestamp as "2m ago"
window.timeAgo = function(ms) {
  const s = Math.floor((Date.now() - ms) / 1000);
  if (s < 60) return s + "s ago";
  const m = Math.floor(s / 60);
  if (m < 60) return m + "m ago";
  const h = Math.floor(m / 60);
  if (h < 24) return h + "h ago";
  return Math.floor(h / 24) + "d ago";
};

// Human-readable duration — 3661000 → "1h 1m 1s"
window.formatDuration = function(ms) {
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const parts = [];
  if (h) parts.push(h + "h");
  if (m) parts.push(m + "m");
  if (sec || !parts.length) parts.push(sec + "s");
  return parts.join(" ");
};

// Get current time as "HH:MM:SS"
window.clockNow = function() {
  const d = new Date();
  const p = n => String(n).padStart(2, "0");
  return p(d.getHours()) + ":" + p(d.getMinutes()) + ":" + p(d.getSeconds());
};
// Get element by ID (shorter)
window.$ = function(id) { return document.getElementById(id); };

// Query one element
window.$q = function(sel) { return document.querySelector(sel); };

// Query all elements (returns array, not NodeList)
window.$qa = function(sel) { return [...document.querySelectorAll(sel)]; };

// Create an element with props
window.make = function(tag, props, text) {
  const el = document.createElement(tag);
  if (props) Object.assign(el, props);
  if (text !== undefined) el.textContent = text;
  return el;
};

// Set text on element by ID
window.setText = function(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
};

// Set HTML on element by ID
window.setHTML = function(id, html) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = html;
};

// Add one event listener
window.on = function(sel, event, handler) {
  document.querySelectorAll(sel).forEach(el => el.addEventListener(event, handler));
};
// Save any value to localStorage (as JSON)
window.saveLocal = function(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); return true; }
  catch (e) { return false; }
};

// Load any value from localStorage
window.loadLocal = function(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    return v === null ? fallback : JSON.parse(v);
  } catch (e) { return fallback; }
};

// Delete one key
window.clearLocal = function(key) {
  localStorage.removeItem(key);
};

// Wipe all keys that start with a prefix
window.clearLocalPrefix = function(prefix) {
  Object.keys(localStorage)
    .filter(k => k.startsWith(prefix))
    .forEach(k => localStorage.removeItem(k));
};
// Escape HTML to prevent XSS
window.esc = function(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
};

// Only allow http/https URLs
window.safeURL = function(u) {
  try {
    const p = new URL(u);
    return (p.protocol === "http:" || p.protocol === "https:") ? u : null;
  } catch (e) { return null; }
};

// ──────── normalizeText ────────
window.normalizeText = function(text) {
  let out = text.toLowerCase();
  out = out.replace(/\s+/g, "");
  out = out.replace(/[0@]/g, "o");
  out = out.replace(/[1!|]/g, "i");
  out = out.replace(/3/g, "e");
  out = out.replace(/4/g, "a");
  out = out.replace(/5/g, "s");
  out = out.replace(/7/g, "t");
  out = out.replace(/\$/g, "s");
  out = out.replace(/[^a-z]/g, "");
  out = out.replace(/(.)\1+/g, "$1");
  return out;
};