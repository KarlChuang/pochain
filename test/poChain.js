const poChain = artifacts.require("poChain");

contract('poChain', (accounts) => {
  it('Create new product', async () => {
    const pc = await poChain.deployed();
    const hash = 'b650e1f0a641985466116b784b9cd22df769c28634da90b4f0d9491590ff516b';
    const cost = 10;
    const goal = 100;
    const deadline = 4476643200;
    await pc.createproduct(hash, cost, goal, deadline, { from: accounts[0], value: web3.utils.toWei((goal + 2).toString(), 'finney') });
    assert.equal(1, 1, 'product create error');
  });

  it('Edit product', async () => {
    const pc = await poChain.deployed();
    const hash = 'b650e1f0a641985466116b784b9cd22df769c28634da90b4f0d9491590ff516b';
    const cost = 9;
    const goal = 100;
    const deadline = 4476643200;
    await pc.editproduct(0, hash, cost, goal, deadline, { from: accounts[0], value: web3.utils.toWei((goal + 2).toString(), 'finney') });
    const product0 = await pc.getproduct.call(0);
    assert.equal(product0[3], 0, 'product edit error');
  });

  it('Delete product', async () => {
    const pc = await poChain.deployed();
    await pc.deleteProduct(1, { from: accounts[0] });
    const product1 = await pc.getproduct.call(1);
    assert.equal(product1[3], 0, 'product edit error');
  });

  it('Deadline check', async () => {
    const pc = await poChain.deployed();
    let hash = '123451f0a641985466116b784b9cd22df769c28634da90b4f0d9491590ff516b';
    let cost = 10;
    let goal = 100;
    let deadline = Math.floor(new Date().getTime() / 1000);
    await pc.createproduct(hash, cost, goal, deadline, { from: accounts[0], value: web3.utils.toWei((goal + 2).toString(), 'finney') });
    // const product1 = await pc.getproduct.call(1);
    hash = '543211f0a641985466116b784b9cd22df769c28634da90b4f0d9491590ff516b';
    cost = 10;
    goal = 100;
    deadline = Math.floor(new Date().getTime() / 1000) + 1000;
    await pc.createproduct(hash, cost, goal, deadline, { from: accounts[0], value: web3.utils.toWei((goal + 2).toString(), 'finney') });

    let pass = await pc.deadlinePass(2);
    assert.equal(pass, true, 'Dealine is not reached');
    pass = await pc.deadlinePass(3);
    assert.equal(pass, false, 'Dealine is reached');
    await pc.CheckDeadline(2);
    const checked = await pc.isDeadlineChecked.call(2);
    assert.equal(checked, true, 'dealline check fail');
  });

  it('Create transaction', async () => {
    const pc = await poChain.deployed();
    const hash = '543211f0a641985466116b784b9cd22df769c28634da90b4f0d9491590ff516b';
    const cost = 10;
    const amount = 10;
    await pc.CreateTx(3, amount, hash, { from: accounts[1], value: web3.utils.toWei((amount * cost).toString(), 'finney') });
    assert.equal(1, 1, 'tx create error');
  });

  // it('producer view tx', async () => {
  //   const pc = await poChain.deployed();
  //   console.log(accounts[0]);
  //   console.log(accounts[1]);
  //   let tx0 = await pc.gettx.call(0);
  //   console.log(tx0);
  //   assert.equal(tx0[2], false, 'tx ispaid error 1');
  //   // await pc.CustomerRCVed(3, 0, { from: accounts[0] });
  //   // tx0 = await pc.gettx.call(0);
  //   // assert.equal(tx0[2], true, 'tx ispaid error 2');
  // });

  it('CustomerRCVed check', async () => {
    const pc = await poChain.deployed();
    let tx0 = await pc.gettx.call(0, { from: accounts[1] });
    assert.equal(tx0[2], false, 'tx ispaid error 1');
    await pc.CustomerRCVed(3, 0, { from: accounts[1] });
    tx0 = await pc.gettx.call(0, { from: accounts[1] });
    assert.equal(tx0[2], true, 'tx ispaid error 2');
  });

  it('Edit transaction', async () => {
    const pc = await poChain.deployed();
    const cost = 10;
    const newAmount = 5;
    const hash = '543211f0a641985466116b784b9cd22df769c28634da90b4f0d9491590ff516b';
    await pc.EditTx(3, 0, newAmount, hash, { from: accounts[1], value: web3.utils.toWei((newAmount * cost).toString(), 'finney') });
    const tx0 = await pc.gettx.call(0, { from: accounts[1] });
    assert.equal(tx0[1], 5, 'tx amount error');
  });

  it('Check transaction length', async () => {
    const pc = await poChain.deployed();
    const len = await pc.getTxLength.call();
    assert.equal(len, 1, 'tx amount error');
  });
});
