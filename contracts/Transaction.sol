pragma solidity >=0.4.21 <0.6.0;
//import "./poChain.sol";
import "./Ownable.sol";

contract Transaction is Ownable {

    constructor() public {
    }

    struct transaction {
        uint _ProductId;
        uint amount;
        //Todo Add Ispaid
    }

    transaction[] public txs;

    mapping (uint => address payable) Tx2Customer;

    event TxCreated(uint TxId, uint _ProductId, uint amount);
    function _createtx(uint _ProductId, uint amount) internal{
        uint id = txs.push(transaction(_ProductId, amount))-1;
        Tx2Customer[id] = msg.sender;
        emit TxCreated(id, _ProductId,amount);
    }

    function _GoThoughTxById(uint ProductId) internal view returns(address payable[] memory, uint[] memory, uint len) {
        address payable[] memory F = new address payable[](txs.length);
        uint[] memory A = new uint[](txs.length);
        uint j = 0;
        for (uint i = 0; i <= txs.length; i++ ) {
            if (txs[i]._ProductId == ProductId) {
                F[j] = Tx2Customer[i];
                A[j] = txs[i].amount;
                j = j+1;
            }
        }
        return(F,A,j);
    }

    function _edittx(uint Id, uint amount) internal {
        txs[Id].amount = amount;
    }

    function _gettx(uint Id) internal view returns (uint, uint) {
        transaction storage asked_tx = txs[Id];
        return  (asked_tx._ProductId, asked_tx.amount);
    }

}