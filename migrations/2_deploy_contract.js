//var Ownable = artifacts.require("Ownable");
var product = artifacts.require("product");
var Transaction = artifacts.require("Transaction");
var poChain = artifacts.require("poChain");

module.exports = function(deployer) {
    //deployer.deploy(Ownable);
    //deployer.link(Ownable,[product,tx]);
    deployer.deploy(product);
    deployer.deploy(Transaction);
    deployer.link(product, poChain);
    deployer.link(Transaction, poChain);
    //deployer.link(poChain,tx)
    deployer.deploy(poChain);
}
