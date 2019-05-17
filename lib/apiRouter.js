
const express = require('express');
const multer = require('multer');
let knex = require('knex');

const sqlConfig = require('../config/sqlConfig');

knex = knex({
  client: 'mysql',
  connection: sqlConfig,
});

const router = express.Router();
const multerupload = multer({ dest: 'temp/' });

router.get('/all_product', async (req, res) => {
  const sqlResponse = await knex('products').select('*');
  res.json(sqlResponse);
});

router.get('/product/:productId', async (req, res) => {
  const sqlResponse = await knex('products').select('*').where({ id: req.params.productId });
  res.json(sqlResponse);
});

router.post('/new-product', multerupload.any(), async (req, res) => {
  const reqData = req.files;
  const { productName, productDeadline, productDescription } = req.body;
  const sqlResponse = await knex('products').insert([{
    id: 2,
    name: productName,
    producer: 'Karl',
    deadline: productDeadline,
    description: productDescription,
  }]);
  console.log(sqlResponse);
  // console.log(reqData);
  // console.log(reqBody);
  res.send('success');
});

module.exports = router;
