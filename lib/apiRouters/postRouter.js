
const express = require('express');
const multer = require('multer');
const fs = require('fs');
let knex = require('knex');

const sqlConfig = require('../../config/sqlConfig');

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

router.post('/new-product', multerupload.any(), async (req, res) => {
  const reqData = req.files;
  const {
    productId: pid,
    productName,
    productDeadline,
    productDescription,
    productPrice,
    producer,
    productBaseline,
    hash,
  } = req.body;
  try {
    const newImageId = await getNewImageId();
    let productId = await knex('products').select('id').where('id', pid);
    let imgArr = [];
    if (productId.length > 0 && pid >= 0) {
      productId = productId[0].id;
      await knex('products').where('id', productId).update({
        name: productName,
        producer,
        price: parseInt(productPrice, 10),
        deadline: productDeadline,
        description: productDescription,
        baseline: parseInt(productBaseline, 10),
        hash,
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
      imgArr = remainImg;
    } else {
      const newProductId = await getNewProductId();
      const sqlResponse = await knex('products').insert([{
        id: newProductId,
        name: productName,
        producer,
        deadline: productDeadline,
        price: parseInt(productPrice, 10),
        description: productDescription,
        baseline: parseInt(productBaseline, 10),
        hash,
      }]);
      [productId] = sqlResponse;
    }
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
        });
        imgArr.push(newImageId + i);
      } else {
        fs.unlink(file.path, (err) => {
          if (err) throw err;
        });
        res.status(400).json({
          message: 'File type error',
          id: -1,
          imgIds: [],
        });
      }
    }
    res.status(200).json({
      message: 'success',
      id: productId,
      imgIds: imgArr,
    });
  } catch (e) {
    console.log(e);
    res.status(400).json({
      message: 'Server error',
      id: -1,
      imgIds: [],
    });
    for (let i = 0; i < reqData.length; i += 1) {
      fs.unlink(reqData[i].path, (err) => {
        if (err) throw err;
      });
      res.status(400).json({
        message: 'File type error',
        id: -1,
        imgIds: [],
      });
    }
  }
});

router.post('/delete-product', multerupload.any(), async (req, res) => {
  const {
    productId: pid,
  } = req.body;
  try {
    await knex('products').where('id', pid).del();
    await knex('images').where('product_id', pid).del();
    res.status(200).send('success');
  } catch (e) {
    console.log(e);
    res.status(400).send('Server error');
  }
});

module.exports = router;
