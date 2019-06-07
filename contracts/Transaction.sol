pragma solidity >=0.4.21 <0.6.0;
//import "./poChain.sol";
import "./Ownable.sol";

contract Transaction is Ownable {

    constructor() public {
    }

    struct transaction {
        uint _ProductId;
        uint _amount;
        bool _isPaid;
    }

    transaction[] public txs;

    mapping (uint => address payable) Tx2Customer;

    event TxCreated(uint TxId, uint _ProductId, address customer);
    event TxEditted(uint TxId, uint _ProductId, address customer);

    function _createtx(uint _ProductId, uint amount, address payable customer) internal{
        uint id = txs.push(transaction(_ProductId, amount, false))-1;
        Tx2Customer[id] = customer;
        emit TxCreated(id, _ProductId, customer);
    }

    function _GoThoughTxById(uint ProductId) internal view returns(address payable[] memory, uint[] memory, uint len) {
        address payable[] memory addresses = new address payable[](txs.length);
        uint[] memory amounts = new uint[](txs.length);
        uint length = 0;
        for (uint i = 0; i < txs.length; i++) {
            if (txs[i]._ProductId == ProductId && txs[i]._amount > 0) {
                amounts[length] = txs[i]._amount;
                addresses[length] = Tx2Customer[i];
                length = length + 1;
            }
        }
        return(addresses, amounts, length);
    }

    function _edittx(uint Id, uint amount) internal {
        txs[Id]._amount = amount;
        emit TxEditted(Id, txs[Id]._ProductId, Tx2Customer[Id]);
    }

    function _gettx(uint Id) internal view returns (uint, uint, bool) {
        transaction storage asked_tx = txs[Id];
        return  (asked_tx._ProductId, asked_tx._amount, asked_tx._isPaid);
    }

}