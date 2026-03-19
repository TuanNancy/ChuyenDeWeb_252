const express = require('express');
const app = express();
const cors = require('cors');
const products = require('./data/products');

app.use(cors());
app.use(express.static('public/'));

// Endpoint mock cho danh sách sản phẩm
app.get('/products', (req, res) => {
  res.json(products);
});

app.get('/', (req, res) => {
  res.send('Hello World! from server');
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});