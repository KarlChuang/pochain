//var Ownable = artifacts.require("Ownable");
var product = artifacts.require("product");
var tx = artifacts.require("tx");
var poChain = artifacts.require("poChain");

module.exports = function(deployer) {
    //deployer.deploy(Ownable);
    //deployer.link(Ownable,[product,tx]);
    deployer.deploy(product);
    deployer.deploy(tx);
    deployer.link(product, poChain);
    deployer.link(tx, poChain);
    //deployer.link(poChain,tx)
    deployer.deploy(poChain);

}