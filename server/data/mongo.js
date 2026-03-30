const mongoose = require('mongoose');

/** Điền URL MongoDB Atlas trong biến môi trường MONGODB_URI (file .env ở thư mục server). */
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://vutuan2004vn_db_user:KwxWXFxWM6lLsFTh@web252.yg2l99k.mongodb.net/';

/**
 * Kết nối tới MongoDB Atlas.
 * @returns {Promise<typeof mongoose>|void>}
 */
async function connectMongo() {
  if (!MONGODB_URI.trim()) {
    console.warn('[mongo] MONGODB_URI chưa được cấu hình — bỏ qua kết nối.');
    return;
  }

  mongoose.set('strictQuery', true);

  try {
    await mongoose.connect(MONGODB_URI);
    console.log('[mongo] Đã kết nối MongoDB Atlas.');
  } catch (err) {
    console.error('[mongo] Lỗi kết nối:', err.message);
    throw err;
  }
}

module.exports = {
  connectMongo,
  mongoose,
  MONGODB_URI,
};
