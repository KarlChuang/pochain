
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

const getNewProductId = async () => {
  const sqlResponse = await knex('products').select('id');
  const idList = sqlResponse.map(obj => obj.id);
  if (idList.length > 0) {
    return Math.max(...idList) + 1;
  }
  return 1;
};

const getNewImageId = async () => {
  const sqlResponse = await knex('images').select('id');
  const idList = sqlResponse.map(obj => obj.id);
  if (idList.length > 0) {
    return Math.max(...idList) + 1;
  }
  return 1;
};

router.get('/all_products', async (req, res) => {
  const sqlResponse = await knex('products').select('*');
  const sqlImgResponse = await knex('images').select('*');
  for (let i = 0; i < sqlResponse.length; i += 1) {
    sqlResponse[i].image = sqlImgResponse.find(imgObj => imgObj.product_id === sqlResponse[i].id);
  }
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

router.get('/user/:userId', async (req, res) => {
  const sqlResponse = await knex('products').select('*').where({ producer: req.params.userId });
  const sqlImgResponse = await knex('images').select('*');
  for (let i = 0; i < sqlResponse.length; i += 1) {
    sqlResponse[i].images = sqlImgResponse.filter(imgObj => (
      imgObj.product_id === sqlResponse[i].id
    ));
  }
  res.json(sqlResponse);
});

router.post('/delete-product', async (req, res) => {
  const { productId } = req.body;
  await knex('products').where('id', productId).del();
  await knex('images').where('product_id', productId).del();
  res.status(200).send('success');
});

router.post('/new-product', multerupload.any(), async (req, res) => {
  const newProductId = await getNewProductId();
  const newImageId = await getNewImageId();
  const reqData = req.files;
  const {
    productName,
    productDeadline,
    productDescription,
    producer,
  } = req.body;
  const sqlResponse = await knex('products').insert([{
    id: newProductId,
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
        id: newImageId + i,
        image: fs.readFileSync(file.path),
        product_id: productId,
      }]).then(() => {
        fs.unlink(file.path, (err) => {
          if (err) throw err;
        });
      }).catch((err) => {
        console.log(err);
        res.status(400).send('Server error');
      });
    } else {
      res.status(400).send('File type error');
    }
  }
  res.status(200).send('Success');
});

router.post('/edit-product', multerupload.any(), async (req, res) => {
  const newImageId = await getNewImageId();
  const reqData = req.files;
  const {
    productName,
    productDeadline,
    productDescription,
    producer,
    productId,
  } = req.body;
  await knex('products').where('id', productId).update({
    name: productName,
    producer,
    deadline: productDeadline,
    description: productDescription,
  });
  const sqlImgResponse = await knex('images').select('id').where('product_id', productId);
  let remainImg = [];
  if (Array.isArray(req.body.image)) {
    remainImg = req.body.image.map(i => parseInt(i, 10));
  } else {
    remainImg.push(parseInt(req.body.image, 10));
  }
  const deleteImg = [];
  for (let i = 0; i < sqlImgResponse.length; i += 1) {
    const imgId = sqlImgResponse[i].id;
    if (remainImg.indexOf(imgId) === -1) {
      deleteImg.push(imgId);
    }
  }
  await knex('images').whereIn('id', deleteImg).del();
  for (let i = 0; i < reqData.length; i += 1) {
    const file = reqData[i];
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/gif') {
      knex('images').insert([{
        id: newImageId + i,
        image: fs.readFileSync(file.path),
        product_id: productId,
      }]).then(() => {
        fs.unlink(file.path, (err) => {
          if (err) throw err;
        });
      }).catch((err) => {
        fs.unlink(file.path, (err2) => {
          if (err2) throw err2;
        });
        console.log(err);
        res.status(400).send('Server error');
      });
    } else {
      fs.unlink(file.path, (err) => {
        if (err) throw err;
      });
      res.status(400).send('File type error');
    }
  }
  res.status(200).send('Success');
});

module.exports = router;
