const Web3 = require('web3');
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

async function blockchain() {
  // blockchain event
  pochainContract.events.productCreated(e => console.log(e))
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

  pochainContract.events.TxCreated(e => console.log(e))
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

  pochainContract.events.productEdited(e => console.log(e))
    .on('data', async (blockHeader) => {
      const { _productId: { _hex }, _hash, _cost, _goal, deadline } = blockHeader.returnValues;
      const productId = parseInt(_hex, 16);
      console.log('product edited');
      // const productRes = await knex('products').select('*').where('hash', _hash);
      // const version = await knex('productsOnChain').select('version').where('blockchainId', productId);
      // const ImgRes = await knex('images').select('*').where('product_id', productRes[0].id);
      // if (version.length > 0) {
      //   await knex('productsOnChain').where('blockchainId', productId).update({
      //     ...productRes[0],
      //     blockchainId: productId,
      //     version: version[0].version + 1,
      //   });
      //   await knex('imagesOnChain').where('product_id', productRes[0].id).del();
      // } else {
      //   await knex('productsOnChain').insert({
      //     ...productRes[0],
      //     blockchainId: productId,
      //     version: 1,
      //   });
      // }
      // ImgRes.forEach(async (img) => {
      //   await knex('imagesOnChain').insert({
      //     ...img,
      //   });
      // });
    });
}

module.exports = blockchain;
