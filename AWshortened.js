// ============================================
// AWshortened.js
// Appwrite, shortened. One function per job.
// Load the Appwrite SDK first.
// ============================================

let AW = { client: null, db: null, ready: false };

// ──────── INIT ────────
// await AW_Init("https://cloud.appwrite.io/v1", "your-project-id", "your-database-id")
window.AW_Init = async function(endpoint, projectId, databaseId) {
  AW.client = new Appwrite.Client()
    .setEndpoint(endpoint)
    .setProject(projectId);
  
  AW.db = new Appwrite.Databases(AW.client);
  AW.databaseId = databaseId;
  AW.ready = true;
  return true;
};

// ──────── ADD ────────
// await AW_Add("messages", { text: "Hi", name: "Alex" })
// → returns the new document (with $id, $createdAt)
window.AW_Add = async function(collectionId, data) {
  if (!AW.ready) throw new Error("AW not initialized — call AW_Init first");
  
  const result = await AW.db.createDocument(
    AW.databaseId,
    collectionId,
    Appwrite.ID.unique(),
    data
  );
  return result;
};

// ──────── GET ────────
// await AW_Get("messages", 50)
// → returns array of documents
window.AW_Get = async function(collectionId, limit) {
  if (!AW.ready) throw new Error("AW not initialized — call AW_Init first");
  
  const queries = [];
  if (limit) queries.push(Appwrite.Query.limit(limit));
  
  const result = await AW.db.listDocuments(
    AW.databaseId,
    collectionId,
    queries
  );
  return result.documents || [];
};

// ──────── GET SORTED ────────
// await AW_GetSorted("messages", "$createdAt", false, 50)
window.AW_GetSorted = async function(collectionId, attribute, ascending, limit) {
  if (!AW.ready) throw new Error("AW not initialized — call AW_Init first");
  
  const queries = [];
  if (ascending) {
    queries.push(Appwrite.Query.orderAsc(attribute));
  } else {
    queries.push(Appwrite.Query.orderDesc(attribute));
  }
  if (limit) queries.push(Appwrite.Query.limit(limit));
  
  const result = await AW.db.listDocuments(
    AW.databaseId,
    collectionId,
    queries
  );
  return result.documents || [];
};

// ──────── WATCH ────────
// AW_Watch("messages", docs => { ... })
// → fires on load, then on every change. NO await.
window.AW_Watch = function(collectionId, callback) {
  if (!AW.ready) throw new Error("AW not initialized — call AW_Init first");
  
  const channel = `databases.${AW.databaseId}.collections.${collectionId}.documents`;
  
  // Initial load
  AW_Get(collectionId).then(callback).catch(e => console.error(e));
  
  // Live updates
  return AW.client.subscribe(channel, response => {
    // Re-fetch the full list on any change
    AW_Get(collectionId).then(callback).catch(e => console.error(e));
  });
};

// ──────── UPDATE ────────
// await AW_Update("messages", "doc-id", { text: "edited" })
window.AW_Update = async function(collectionId, documentId, data) {
  if (!AW.ready) throw new Error("AW not initialized — call AW_Init first");
  
  const result = await AW.db.updateDocument(
    AW.databaseId,
    collectionId,
    documentId,
    data
  );
  return result;
};

// ──────── DELETE ────────
// await AW_Delete("messages", "doc-id")
window.AW_Delete = async function(collectionId, documentId) {
  if (!AW.ready) throw new Error("AW not initialized — call AW_Init first");
  
  await AW.db.deleteDocument(
    AW.databaseId,
    collectionId,
    documentId
  );
};