pragma solidity >=0.4.21 <0.6.0;
//import "./ownable.sol";

contract poChain {
    mapping (uint => address) Id2Owner;
    mapping (uint => address) Tx2Customer;
    struct Product {
        uint _hash;
        uint _cost;
        // initial state = target pre-order
        // _state-- if sb pre-order
        // _state == 0, goal make
        uint _state;
    }


    struct Tx {
        uint _ProductId;
    }

    Product[] public products;
    Tx[] public txs;


    uint randNounce = 0;
    constructor() public {

    }
 

}
