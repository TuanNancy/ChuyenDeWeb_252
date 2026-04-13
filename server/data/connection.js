const { MongoClient } = require("mongodb");

const MONGODB_URI = "mongodb+srv://vutuan2004vn_db_user:KwxWXFxWM6lLsFTh@web252.yg2l99k.mongodb.net/";
const DB_NAME = "chuyendeweb";

let client = null;
let db = null;

async function getDb() {
  if (db) return db;

  if (!MONGODB_URI.trim()) {
    console.warn("[mongo] MONGODB_URI chưa được cấu hình — bỏ qua kết nối.");
    return null;
  }

  client = new MongoClient(MONGODB_URI);
  await client.connect();
  db = client.db(DB_NAME);
  console.log("[mongo] Đã kết nối MongoDB Atlas.");
  return db;
}

function getCollection(name) {
  if (!db) throw new Error("Database chưa được kết nối. Gọi getDb() trước.");
  return db.collection(name);
}

async function closeDb() {
  if (client) {
    await client.close();
    client = null;
    db = null;
    console.log("[mongo] Đã đóng kết nối MongoDB.");
  }
}

module.exports = { getDb, getCollection, closeDb };
