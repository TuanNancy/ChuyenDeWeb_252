// Product DB helpers — dùng mongodb driver thuần (không Mongoose)
const { getCollection } = require("./connection");

const COLLECTION = "gears";

async function getAll() {
  const col = getCollection(COLLECTION);
  return col.find({}).toArray();
}

async function getById(id) {
  const col = getCollection(COLLECTION);
  return col.findOne({ id });
}

async function create(product) {
  const col = getCollection(COLLECTION);
  const result = await col.insertOne(product);
  return result;
}

async function updateById(id, updates) {
  const col = getCollection(COLLECTION);
  const result = await col.updateOne({ id }, { $set: updates });
  return result;
}

async function deleteById(id) {
  const col = getCollection(COLLECTION);
  const result = await col.deleteOne({ id });
  return result;
}

async function search(keyword) {
  const col = getCollection(COLLECTION);
  const regex = { $regex: keyword, $options: "i" };
  const query = {
    $or: [
      { name: regex },
      { id: regex },
      { description: regex },
      { tags: regex },
      { "specifications.heightRange": regex },
      { "specifications.chieucao": regex },
      { chieucao: regex },
    ],
  };
  return col.find(query).toArray();
}

async function adminSearch(keyword) {
  const col = getCollection(COLLECTION);
  const regex = new RegExp(`^${keyword}`, 'i');
  return col.find({ id: regex }).toArray();
}

module.exports = {
  getAll,
  getById,
  create,
  updateById,
  deleteById,
  search,
  adminSearch,
};
