const Web3 = require('web3');
let knex = require('knex');

const sqlConfig = require('../config/sqlConfig');

const productContractJson = require('../build/contracts/product.json');
const txContractJson = require('../build/contracts/tx.json');
const smConfig = require('../config/smartContract');

const web3js = new Web3(new Web3.providers.WebsocketProvider('ws://localhost:7545'));
const productContractAddress = smConfig.product;
const productContract = new web3js.eth.Contract(productContractJson.abi, productContractAddress);
const txContractAddress = smConfig.tx;
const txContract = new web3js.eth.Contract(txContractJson.abi, txContractAddress);

knex = knex({
  client: 'mysql',
  connection: sqlConfig,
});

const getNewOrderId = async () => {
  const sqlResponse = await knex('orders').select('id');
  const idList = sqlResponse.map(obj => obj.id);
  if (idList.length > 0) {
    return Math.max(...idList) + 1;
  }
  return 1;
};

async function blockchain() {
  // blockchain event
  productContract.events.productCreated(e => console.log(e))
    .on('data', async (blockHeader) => {
      const { _productId: { _hex }, _hash } = blockHeader.returnValues;
      const productId = parseInt(_hex, 16);
      await knex('products').where('hash', _hash).update({
        blockchainId: productId,
      });
    });

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
        const products = await knex('products').select('*').where('blockchainId', productId);
        const sqlResponse = await knex('orders').select('*').where({ user: account, product_id: productId });
        if (products.length !== 1) {
          console.log('error: product number of a ID is not 1')
        } else if (sqlResponse.length > 0 && parseInt(amount, 10) === 0) {
          // handle delete order
          await knex('orders').where({ user: account, product_id: id }).del();
        } else if (sqlResponse.length > 0 && sqlResponse.amount !== amount) {
          // update orders
          await knex('orders').where({ user: account, product_id: productId }).update({
            id: sqlResponse[0].id,
            product_id: productId,
            user: account,
            amount,
          });
        } else if (amount > 0) {
          const newOrderId = await getNewOrderId();
          await knex('orders').insert([{
            id: newOrderId,
            product_id: productId,
            user: account,
            amount,
          }]);
        }
      } catch (e) {
        console.log(e);
      }
    });
}

module.exports = blockchain;
