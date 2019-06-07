const Web3 = require('web3');
const express = require('express');
let knex = require('knex');

const sqlConfig = require('../../config/sqlConfig');
const pochainContractJson = require('../../build/contracts/poChain.json');
const smConfig = require('../../config/smartContract');

const web3js = new Web3(new Web3.providers.WebsocketProvider('ws://localhost:7545'));
const pochainContractAddress = smConfig.pochain;
const pochainContract = new web3js.eth.Contract(pochainContractJson.abi, pochainContractAddress);

knex = knex({
  client: 'mysql',
  connection: sqlConfig,
});

const router = express.Router();

router.get('/all_products', async (req, res) => {
  let sqlResponse = await knex('productsOnChain').select('*');
  sqlResponse = sqlResponse.filter(({ blockchainId }) => blockchainId >= 0);
  const sqlImgResponse = await knex('imagesOnChain').select('*');
  // TODO: Check all data hashes!!!!!!
  for (let i = 0; i < sqlResponse.length; i += 1) {
    pochainContract.methods.getproduct(sqlResponse[i].blockchainId).call()
      .then(ContractRes => console.log(ContractRes))
      .catch(e => console.log(e));
    sqlResponse[i].image = sqlImgResponse.find(imgObj => imgObj.product_id === sqlResponse[i].id);
  }
  res.json(sqlResponse);
});

router.get('/product/:productId', async (req, res) => {
  const sqlResponse = await knex('productsOnChain').select('*').where({ id: req.params.productId });
  const sqlImgResponse = await knex('imagesOnChain').select('*').where({ product_id: req.params.productId });
  if (sqlResponse.length > 0) {
    sqlResponse[0].images = sqlImgResponse;
    res.json(sqlResponse[0]);
  } else {
    res.status(400).send('product not found');
  }
});

router.get('/product_propose/:productId', async (req, res) => {
  const sqlResponse = await knex('products').select('*').where({ id: req.params.productId });
  const sqlChainResponse = await knex('productsOnChain').select('*').where({ id: req.params.productId });
  const sqlImgResponse = await knex('images').select('*').where({ product_id: req.params.productId });
  if (sqlResponse.length > 0) {
    sqlResponse[0].images = sqlImgResponse;
    if (sqlChainResponse.length > 0) {
      sqlResponse[0].blockchainId = sqlChainResponse[0].blockchainId;
    } else {
      sqlResponse[0].blockchainId = -1;
    }
    res.json(sqlResponse[0]);
  } else {
    res.status(400).send('product not found');
  }
});

// router.get('/order/:productId/:account', async (req, res) => {
//   if (req.params.account === undefined) {
//     res.json([]);
//   } else {
//     const sqlResponse = await knex('orders').select('*').where({ user: req.params.account, product_id: req.params.productId });
//     res.json(sqlResponse);
//   }
// });

router.get('/user/:userId', async (req, res) => {
  const sqlResponse = await knex('products').select('*').where({ producer: req.params.userId });
  const imgProductArr1 = sqlResponse.map(({ id }) => id);
  const sqlImgResponse1 = await knex('images').select('*').whereIn('product_id', imgProductArr1);

  const sqlOrderResponse = await knex('orders').select('*').where({ user: req.params.userId });
  const sqlOrderProduct = await knex('productsOnChain').select('*').whereIn('blockchainId', sqlOrderResponse.map(({ product_id: productId }) => productId));
  const imgProductArr2 = sqlOrderProduct.map(({ id }) => id);
  const sqlImgResponse2 = await knex('imagesOnChain').select('*').whereIn('product_id', imgProductArr2);
  for (let i = 0; i < sqlResponse.length; i += 1) {
    sqlResponse[i].images = sqlImgResponse1.filter(imgObj => (
      imgObj.product_id === sqlResponse[i].id
    ));
  }
  for (let i = 0; i < sqlOrderProduct.length; i += 1) {
    sqlOrderProduct[i].images = sqlImgResponse2.filter(imgObj => (
      imgObj.product_id === sqlOrderProduct[i].id
    ));
    const {
      amount, version,
    } = sqlOrderResponse.find(obj => obj.product_id === sqlOrderProduct[i].blockchainId);
    sqlOrderProduct[i].orderNum = amount;
    sqlOrderProduct[i].orderVer = version;
  }
  res.json({
    products: sqlResponse,
    orders: sqlOrderProduct,
  });
});

module.exports = router;
