var poChain = artifacts.require("poChain");
var product = artifacts.require("product");
var tx = artifacts.require("tx");

module.exports = function(deployer) {
    deployer.deploy(poChain);
    deployer.link(poChain, [product,tx]);
    //deployer.link(poChain,tx)
    deployer.deploy(product);
    deployer.deploy(tx);
}