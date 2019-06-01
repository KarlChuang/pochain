const Web3 = require('web3');
let knex = require('knex');

const sqlConfig = require('../../config/sqlConfig');

const productContractJson = require('../../build/contracts/product.json');
const txContractJson = require('../../build/contracts/tx.json');
const smConfig = require('../../config/smartContract');

const web3js = new Web3(new Web3.providers.WebsocketProvider('ws://localhost:7545'));
const productContractAddress = smConfig.product;
const productContract = new web3js.eth.Contract(productContractJson.abi, productContractAddress);
const txContractAddress = smConfig.tx;
const txContract = new web3js.eth.Contract(txContractJson.abi, txContractAddress);

knex = knex({
  client: 'mysql',
  connection: sqlConfig,
});

async function blockchain() {
  // blockchain event
  productContract.events.productCreated(e => console.log(e))
    .on('data', async (blockHeader) => {
      const { _productId: { _hex }, _hash } = blockHeader.returnValues;
      const productId = parseInt(_hex, 16);
      const productRes = await knex('products').select('*').where('hash', _hash);
      const version = await knex('productsOnChain').select('version').where('blockchainId', productId);
      const ImgRes = await knex('images').select('*').where('product_id', productRes[0].id);
      if (version.length > 0) {
        await knex('productsOnChain').where('blockchainId', productId).update({
          ...productRes[0],
          blockchainId: productId,
          version: version[0].version + 1,
        });
        await knex('imagesOnChain').where('product_id', productRes[0].id).del();
      } else {
        await knex('productsOnChain').insert({
          ...productRes[0],
          blockchainId: productId,
          version: 1,
        });
      }
      ImgRes.forEach(async (img) => {
        await knex('imagesOnChain').insert({
          ...img,
        });
      });
    });

  // TODO: wrtie an event to detect product delete
  // productContract.events.productDeleted(e => console.log(e))
  //   .on('data', async (blockHeader) => {
  //     const productId = 0; // getting from blockcHeader
  //     const pids = await knex('productsOnChain').select('id').where('blockchainId', productId);
  //     const pid = pids[0].id;
  //     await knex('products').where('id', pid).del();
  //     await knex('productsOnChain').where('id', pid).del();
  //     await knex('images').where('product_id', pid).del();
  //     await knex('imagesOnChain').where('product_id', pid).del();
  //     await knex('orders').where('product_id', pid).del();
  //   });

  txContract.events.TxCreated(e => console.log(e))
    .on('data', async (blockHeader) => {
      const {
        _ProductId: { _hex: producthex },
        TxId: { _hex: txhex },
        addr: account,
      } = blockHeader.returnValues;
      const productId = parseInt(producthex, 16);
      const txId = parseInt(txhex, 16);
      console.log(productId);
      console.log(txId);
      console.log(account);
      try {
        // const { id, amount, account } = req.body;
        // TODO: change the amount
        const amount = 1;
        const products = await knex('productsOnChain').select('*').where('blockchainId', productId);
        const sqlResponse = await knex('orders').select('*').where({ user: account, product_id: productId });
        if (products.length !== 1) {
          console.log('error: product number of the ID is not 1');
        } else if (sqlResponse.length > 0 && parseInt(amount, 10) === 0) {
          // handle delete order
          await knex('orders').where({ user: account, product_id: productId }).del();
        } else if (sqlResponse.length > 0 && sqlResponse.amount !== amount) {
          // update orders
          await knex('orders').where({ user: account, product_id: productId }).update({
            id: sqlResponse[0].id,
            product_id: productId,
            user: account,
            amount,
            version: products[0].version,
          });
        } else if (amount > 0) {
          await knex('orders').insert([{
            id: txId,
            product_id: productId,
            user: account,
            amount,
            version: products[0].version,
          }]);
        }
      } catch (e) {
        console.log(e);
      }
    });
}

module.exports = blockchain;
