
const express = require('express');
const multer = require('multer');
const fs = require('fs');
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

router.get('/product_img/:productId', async (req, res) => {
  const sqlResponse = await knex('images').select('*').where({ product_id: req.params.productId });
  // console.log(sqlResponse);
  res.json(sqlResponse);
});

router.post('/new-product', multerupload.any(), async (req, res) => {
  const reqData = req.files;
  const {
    productName,
    productDeadline,
    productDescription,
    producer,
  } = req.body;
  const sqlResponse = await knex('products').insert([{
    id: 6,
    name: productName,
    producer,
    deadline: productDeadline,
    description: productDescription,
  }]);
  const productId = sqlResponse[0];
  for (let i = 0; i < reqData.length; i += 1) {
    const file = reqData[i];
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/gif') {
      knex('images').insert([{
        id: i + 1,
        image: fs.readFileSync(file.path),
        product_id: productId,
      }]).catch((err) => {
        console.err(err);
        res.status(400).send('Server error');
      });
    } else {
      res.status(400).send('File type error');
    }
  }
  res.status(200).send('Success');
});

module.exports = router;
