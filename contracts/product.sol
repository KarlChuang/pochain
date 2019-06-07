pragma solidity >=0.4.21 <0.6.0;
//import "./poChain.sol";
import "./Ownable.sol";
contract product is Ownable {

    constructor() public {
    }
    struct Product {
        string _hash;
        uint _cost;
        // initial state = 1
        // _state++ if sb pre-order
        // _state == 0, delete
        uint _state;
        uint _goal;
        uint deadline;
    }
    Product[] public products;

    mapping (uint => address payable) Id2Owner;

    event productCreated(uint _productId, string _hash, uint _cost, uint _goal, uint deadline);
    event productEdited(uint _productId, string _hash, uint _cost, uint _goal, uint deadline);
    function _createproduct(string memory _hash, uint _cost, uint _goal, uint deadline) internal {
        uint id = products.push(Product(_hash, _cost,1,_goal, deadline))-1;
        Id2Owner[id] = msg.sender;
        emit productCreated(id, _hash, _cost, _goal, deadline);
    }

    function _editproduct(uint Id, string memory _hash, uint _cost, uint _goal, uint deadline) internal {
        // Product storage product_to_be_edit = products[Id];
        products[Id]._hash = _hash;
        products[Id]._cost = _cost;
        products[Id]._state = 1;
        products[Id]._goal = _goal;
        products[Id].deadline = deadline;
        emit productEdited(Id, _hash, _cost, _goal, deadline);
    }

    function _getproduct(uint Id) internal view returns (string memory, uint, uint, uint, uint) {
        Product storage asked_product = products[Id];
        return  (asked_product._hash, asked_product._cost, asked_product._state, asked_product._goal, asked_product.deadline);
    }




}
