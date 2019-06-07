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
        uint _deadline;
        bool _deadlinecheck;
    }
    Product[] public products;

    mapping (uint => address payable) Id2Owner;

    event productCreated(uint _productId, string _hash, uint _cost, uint _goal, uint deadline, address producer);
    event productEdited(uint _oldId, uint _productId, string _hash, uint _cost, uint _goal, uint deadline, address producer);
    event productDeleted(uint _productId);

    function _createproduct(string memory _hash, uint _cost, uint _goal, uint _deadline, address payable producer) internal {
        uint id = products.push(Product(_hash, _cost, 0, _goal, _deadline, false)) - 1;
        Id2Owner[id] = producer;
        emit productCreated(id, _hash, _cost, _goal, _deadline, producer);
    }

    function _deleteproduct(uint Id) internal {
        products[Id]._goal = 0;
        emit productDeleted(Id);
    }

    function _editproduct(uint _oldId, string memory _hash, uint _cost, uint _goal, uint _deadline, address payable producer) internal {
        products[_oldId]._goal = 0;
        uint newId = products.push(Product(_hash, _cost, 0, _goal, _deadline, false)) - 1;
        Id2Owner[newId] = producer;
        emit productEdited(_oldId, newId, _hash, _cost, _goal, _deadline, producer);
    }

    function _getproduct(uint Id) internal view returns (string memory, uint, uint, uint, uint) {
        Product storage asked_product = products[Id];
        return  (asked_product._hash, asked_product._cost, asked_product._state, asked_product._goal, asked_product._deadline);
    }




}
