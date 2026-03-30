require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const { connectMongo } = require('./data/mongo');
const products = require('./data/products.json');

app.use(cors());
app.use(express.static('public/'));

// Endpoint mock cho danh sách sản phẩm
app.get('/products', (req, res) => {
  res.json(products);
});

app.get('/', (req, res) => {
  res.send('Hello World! from server');
});

connectMongo().catch((err) => {
  console.error('[mongo]', err.message);
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});