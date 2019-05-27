pragma solidity >=0.4.21 <0.6.0;
import "./poChain.sol";

contract product is poChain {

    constructor() public {
    }
    event productCreated(uint _productId, uint _hash, uint _cost, uint _state);
    function _createproduct(uint _hash, uint _cost, uint _state) private{
        uint id = products.push(Product(_hash, _cost,_state))-1;
        Id2Owner[id] = msg.sender;
        emit productCreated(id, _hash, _cost, _state);
    }


}
