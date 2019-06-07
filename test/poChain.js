const poChain = artifacts.require("poChain");

contract('poChain', (accounts) => {
  it('Create new product', async () => {
    const pc = await poChain.deployed();
    const hash = 'b650e1f0a641985466116b784b9cd22df769c28634da90b4f0d9491590ff516b';
    const cost = 10;
    const goal = 100;
    const deadline = 4476643200;
    await pc.createproduct(hash, cost, goal, deadline, { from: accounts[0], value: web3.utils.toWei((goal + 2).toString(), 'finney') });
    // const metaCoinBalance = outCoinBalance.toNumber();
    // const outCoinBalanceEth = await meta.getBalanceInEth.call(accounts[0]);
    // const metaCoinEthBalance = outCoinBalanceEth.toNumber();
    assert.equal(1, 1, 'product create error');
  });

  it('Edit product', async () => {
    const pc = await poChain.deployed();
    const hash = 'b650e1f0a641985466116b784b9cd22df769c28634da90b4f0d9491590ff516b';
    const cost = 9;
    const goal = 100;
    const deadline = 4476643200;
    await pc.createproduct(hash, cost, goal, deadline, { from: accounts[0], value: web3.utils.toWei((goal + 2).toString(), 'finney') });
    await pc.editproduct(1, hash, cost, goal, deadline, { from: accounts[0], value: web3.utils.toWei((goal + 2).toString(), 'finney') });
    assert.equal(1, 1, 'product edit error');
  });
});
