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
      const { _productId: { _hex }, _hash, producer } = blockHeader.returnValues;
      const productId = parseInt(_hex, 16);
      const productRes = await knex('products').select('*').where('hash', _hash);
      const ImgRes = await knex('images').select('*').where('product_id', productRes[0].id);
      await knex('productsOnChain').insert({
        ...productRes[0],
        blockchainId: productId,
      });
      ImgRes.forEach(async (img) => {
        await knex('imagesOnChain').insert({
          ...img,
        });
      });
    });

  // TODO: wrtie an event to detect product delete
  pochainContract.events.productDeleted(e => console.log(e))
    .on('data', async (blockHeader) => {
      const {
        _productId: { _hex: producthex },
      } = blockHeader.returnValues;
      const productId = parseInt(producthex, 16); // getting from blockcHeader
      const pids = await knex('productsOnChain').select('id').where('blockchainId', productId);
      const pid = pids[0].id;
      await knex('products').where('id', pid).del();
      await knex('productsOnChain').where('id', pid).del();
      await knex('images').where('product_id', pid).del();
      await knex('imagesOnChain').where('product_id', pid).del();
      await knex('orders').where('product_id', productId).del();
    });

  pochainContract.events.TxCreated(e => console.log(e))
    .on('data', async (blockHeader) => {
      const {
        TxId: { _hex: txhex },
        _ProductId: { _hex: producthex },
        customer,
      } = blockHeader.returnValues;
      const productId = parseInt(producthex, 16);
      const txId = parseInt(txhex, 16);

      try {
        const products = await knex('productsOnChain').select('*').where('blockchainId', productId);
        if (products.length !== 1) {
          console.log('error: product number of the ID is not 1');
        } else {
          await knex('orders').where('user', customer).where('product_id', productId).del();
          await knex('orders').insert([{
            id: txId,
            product_id: productId,
            user: customer,
          }]);
        }
      } catch (e) {
        console.log(e);
      }
    });

  // pochainContract.events.TxEditted(e => console.log(e))
  //   .on('data', async (blockHeader) => {
  //     const {
  //       TxId: { _hex: txhex },
  //       _ProductId: { _hex: producthex },
  //       customer,
  //     } = blockHeader.returnValues;
  //     const productId = parseInt(producthex, 16);
  //     const txId = parseInt(txhex, 16);
  //     try {
  //       const products = await knex('productsOnChain').select('*').where('blockchainId', productId);
  //       const sqlResponse = await knex('orders').select('*').where({ user: customer, product_id: productId });
  //       if (products.length !== 1) {
  //         console.log('error: product number of the ID is not 1');
  //       } else if (sqlResponse.length > 0) {
  //         // update orders
  //         await knex('orders').where({ user: customer, product_id: productId }).update({
  //           id: txId,
  //           product_id: productId,
  //           user: customer,
  //         });
  //       }
  //     } catch (e) {
  //       console.log(e);
  //     }
  //   });

  pochainContract.events.productEdited(e => console.log(e))
    .on('data', async (blockHeader) => {
      const {
        _oldId: { _hex: oid },
        _productId: { _hex: pid },
        _hash, _cost, _goal, deadline, producer,
      } = blockHeader.returnValues;
      const productId = parseInt(pid, 16);
      const oldId = parseInt(oid, 16);
      const productRes = await knex('products').select('*').where('hash', _hash);
      if (productRes.length === 0) {
        console.log('Cannot find that product');
      } else {
        const ImgRes = await knex('images').select('*').where('product_id', productRes[0].id);
        await knex('productsOnChain').where('blockchainId', oldId).update({
          ...productRes[0],
          blockchainId: productId,
        });
        await knex('imagesOnChain').where('product_id', productRes[0].id).del();
        ImgRes.forEach(async (img) => {
          await knex('imagesOnChain').insert({
            ...img,
          });
        });

        await knex('orders').where('product_id', oldId).update({
          product_id: productId,
        });
      }
    });
}

module.exports = blockchain;
