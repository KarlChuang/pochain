pragma solidity >=0.4.21 <0.6.0;
//import "./poChain.sol";
import "./Ownable.sol";

contract tx is Ownable {

    constructor() public {
    }

    struct Tx {
        uint _ProductId;
        uint amount;
        //Todo Add Ispaid
    }

    Tx[] public txs;

    mapping (uint => address) Tx2Customer;

    event TxCreated(uint TxId, uint _ProductId, uint amount);
    function _createtx(uint _ProductId, uint amount) internal{
        uint id = txs.push(Tx(_ProductId, amount))-1;
        Tx2Customer[id] = msg.sender;
        emit TxCreated(id, _ProductId,amount);
        
    }

    function _GoThoughTxById(uint ProductId) internal view returns(address[] memory, uint[], uint len) {
        address[] memory F = new address[](txs.length);
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
        Tx storage asked_tx = txs[Id];
        return  (asked_tx._ProductId, asked_tx.amount);
    }

}