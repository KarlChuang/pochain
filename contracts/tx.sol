pragma solidity >=0.4.21 <0.6.0;
import "./poChain.sol";

contract tx is poChain {
    constructor() public {
    }
    event TxCreated(uint TxId, uint _ProductId);
    function _createtx(uint _ProductId) private{
        uint id = txs.push(Tx(_ProductId))-1;
        Tx2Customer[id] = msg.sender;
        emit TxCreated(id, _ProductId);
        
    }

    function CreateTx(uint _ProductId) public payable {

        //require(msg.value == products[_ProductId]._cost, "Not enough balance!!");
        _createtx(_ProductId);
        products[_ProductId]._state -= 1;

    }
}