// ============================================
// JS_E.js
// JavaScript Extensions
// Helpers that should have been built-in.
// Usage: JSE.functionName(...)
// ============================================

window.JSE = {

  // ════════════════════════════════════════════
  //  TEXT
  // ════════════════════════════════════════════

  // Reverse a string: "hello" → "olleh"
  backwards: function(text) {
    let out = "";
    for (let i = text.length - 1; i >= 0; i--) {
      out += text.charAt(i);
    }
    return out;
  },

  // Read a string in order (template — same as input)
  forwards: function(text) {
    let out = "";
    for (let i = 0; i < text.length; i++) {
      out += text.charAt(i);
    }
    return out;
  },

  // Split on ANY of the delimiter characters: "a,b;c" + ",;" → ["a","b","c"]
  multiSplit: function(str, by) {
    const out = [];
    let buf = "";
    for (let i = 0; i < str.length; i++) {
      const ch = str.charAt(i);
      if (by.indexOf(ch) !== -1) {
        out.push(buf);
        buf = "";
      } else {
        buf += ch;
      }
    }
    out.push(buf);
    return out;
  },

  // "hello world" → "Hello World"
  titleCase: function(text) {
    return String(text).replace(/\w\S*/g, function(w) {
      return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
    });
  },

  // "hello world" → "world hello"
  reverseWords: function(text) {
    return String(text).split(" ").reverse().join(" ");
  },

  // "hello world", 7 → "hello w…"
  truncate: function(text, max) {
    return String(text).length > max
      ? text.slice(0, max - 1) + "…"
      : text;
  },

  // 5, 3 → "005"
  padNum: function(n, width) {
    return String(n).padStart(width, "0");
  },

  // Repeat a string: "ab", 3 → "ababab"
  repeatStr: function(str, n) {
    return String(str).repeat(Math.max(0, n));
  },

  // ════════════════════════════════════════════
  //  NUMBERS
  // ════════════════════════════════════════════

  // Random integer in [min, max]
  randInt: function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  // Random item from an array
  randPick: function(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  },

  // Round to N decimals: 3.14159, 2 → 3.14
  roundTo: function(n, decimals) {
    const f = Math.pow(10, decimals);
    return Math.round(n * f) / f;
  },

  // Clamp: clamp(15, 0, 10) → 10
  clamp: function(n, min, max) {
    return Math.max(min, Math.min(max, n));
  },

  // Is even?
  isEven: function(n) {
    return n % 2 === 0;
  },

  // Is odd?
  isOdd: function(n) {
    return n % 2 !== 0;
  },

  // 255 → "ff"
  toHex: function(n) {
    return Number(n).toString(16);
  },

  // "ff" → 255
  fromHex: function(h) {
    return parseInt(h, 16);
  },

  // ════════════════════════════════════════════
  //  ARRAYS
  // ════════════════════════════════════════════

  // Remove duplicates: [1,2,2,3] → [1,2,3]
  uniq: function(arr) {
    return [...new Set(arr)];
  },

  // Shuffle array (returns new array)
  shuffle: function(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  },

  // Sum numbers: [1,2,3] → 6
  sum: function(arr) {
    return arr.reduce((a, b) => a + b, 0);
  },

  // Average: [1,2,3] → 2
  avg: function(arr) {
    return arr.length ? JSE.sum(arr) / arr.length : 0;
  },

  // Chunk: [1,2,3,4,5], 2 → [[1,2],[3,4],[5]]
  chunk: function(arr, size) {
    const out = [];
    for (let i = 0; i < arr.length; i += size) {
      out.push(arr.slice(i, i + size));
    }
    return out;
  },

  // Intersection: [1,2,3] + [2,3,4] → [2,3]
  intersect: function(a, b) {
    return a.filter(x => b.includes(x));
  },

  // Difference: [1,2,3] − [2,3] → [1]
  difference: function(a, b) {
    return a.filter(x => !b.includes(x));
  },

  // Max of array
  max: function(arr) {
    return arr.length ? Math.max(...arr) : null;
  },

  // Min of array
  min: function(arr) {
    return arr.length ? Math.min(...arr) : null;
  },

  // ════════════════════════════════════════════
  //  DOM
  // ════════════════════════════════════════════

  // Get element by ID: JSE.$("btn")
  $: function(id) {
    return document.getElementById(id);
  },

  // Query one element: JSE.$$("button")
  $$: function(sel) {
    return document.querySelector(sel);
  },

  // Query all — returns ARRAY: JSE.$all(".btn")
  $all: function(sel) {
    return [...document.querySelectorAll(sel)];
  },

  // Create element with props:
  // JSE.make("button", { id: "x", className: "btn" }, "Click")
  make: function(tag, props, text) {
    const el = document.createElement(tag);
    if (props) Object.assign(el, props);
    if (text !== undefined) el.textContent = text;
    return el;
  },

  // Set text on element by ID: JSE.setText("title", "Hi")
  setText: function(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  },

  // Set HTML on element by ID
  setHTML: function(id, html) {
    const el = document.getElementById(id);
    if (el) el.innerHTML = html;
  },

  // Add listener to ALL matching: JSE.on(".btn", "click", () => {})
  on: function(sel, event, handler) {
    document.querySelectorAll(sel).forEach(el => {
      el.addEventListener(event, handler);
    });
  },

  // Show element by ID
  show: function(id, display) {
    const el = document.getElementById(id);
    if (el) el.style.display = display || "block";
  },

  // Hide element by ID
  hide: function(id) {
    const el = document.getElementById(id);
    if (el) el.style.display = "none";
  },

  // ════════════════════════════════════════════
  //  STORAGE
  // ════════════════════════════════════════════

  // Save any value (JSON-serialized)
  saveLocal: function(key, val) {
    try {
      localStorage.setItem(key, JSON.stringify(val));
      return true;
    } catch (e) {
      return false;
    }
  },

  // Load any value
  loadLocal: function(key, fallback) {
    try {
      const v = localStorage.getItem(key);
      return v === null ? fallback : JSON.parse(v);
    } catch (e) {
      return fallback;
    }
  },

  // Delete one key
  clearLocal: function(key) {
    localStorage.removeItem(key);
  },

  // Delete every key starting with a prefix
  clearLocalPrefix: function(prefix) {
    Object.keys(localStorage)
      .filter(k => k.startsWith(prefix))
      .forEach(k => localStorage.removeItem(k));
  },

  // ════════════════════════════════════════════
  //  TIME
  // ════════════════════════════════════════════

  // await JSE.wait(1000)
  wait: function(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  // "2m ago"
  timeAgo: function(ms) {
    const s = Math.floor((Date.now() - ms) / 1000);
    if (s < 60) return s + "s ago";
    const m = Math.floor(s / 60);
    if (m < 60) return m + "m ago";
    const h = Math.floor(m / 60);
    if (h < 24) return h + "h ago";
    return Math.floor(h / 24) + "d ago";
  },

  // "1h 1m 1s"
  formatDuration: function(ms) {
    const s = Math.floor(ms / 1000);
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    const parts = [];
    if (h) parts.push(h + "h");
    if (m) parts.push(m + "m");
    if (sec || !parts.length) parts.push(sec + "s");
    return parts.join(" ");
  },

  // "14:32:07"
  clockNow: function() {
    const d = new Date();
    const p = n => String(n).padStart(2, "0");
    return p(d.getHours()) + ":" + p(d.getMinutes()) + ":" + p(d.getSeconds());
  },

  // ════════════════════════════════════════════
  //  SAFETY
  // ════════════════════════════════════════════

  // Escape HTML to prevent XSS
  esc: function(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  },

  // Only allow http/https URLs
  safeURL: function(u) {
    try {
      const p = new URL(u);
      return (p.protocol === "http:" || p.protocol === "https:") ? u : null;
    } catch (e) {
      return null;
    }
  },

  // Normalize text for filtering (leet-speak → letters)
  normalizeText: function(text) {
    let out = String(text).toLowerCase();
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
  },

  // ════════════════════════════════════════════
  //  CLIPBOARD & URL
  // ════════════════════════════════════════════

  // await JSE.copy("hello") → true/false
  copy: async function(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (e) {
      return false;
    }
  },

  // Get ?name=alex from URL
  getParam: function(name) {
    return new URLSearchParams(window.location.search).get(name);
  },

  // Set a query parameter without reloading
  setParam: function(name, value) {
    const url = new URL(window.location);
    url.searchParams.set(name, value);
    history.replaceState(null, "", url);
  }

};