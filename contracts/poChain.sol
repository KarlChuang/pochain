pragma solidity >=0.4.21 <0.6.0;
import "./product.sol";
import "./Transaction.sol";

contract poChain is Transaction, product {

    uint randNounce = 0;
    constructor() public {

    }
    //Product here
    /*********************************************************
    *********************************************************/
    event deadlineChecked(uint id, bool success); 

    function createproduct(string memory _hash, uint _cost, uint _goal, uint _deadline) public payable {
        require(msg.value == ((_goal + 2) * (1 finney)), "poChain Error: must reserve exactly _goal+2 finney");
        _createproduct(_hash, _cost, _goal, _deadline, msg.sender);
    }

    function editproduct(uint _oldId, string memory _hash, uint _cost, uint _goal, uint _deadline) public payable {
        require(msg.sender == Id2Owner[_oldId], "poChain Error: cannot access");
        require(msg.value == (_goal+2)*(1 finney), "poChain Error: value must equal with _goal+2 finney");
        require(_oldId < products.length, "poChain Error: product old Id not found");
        require(products[_oldId]._goal > 0, "poChain Error: product deleted");
        _editproduct(_oldId, _hash, _cost, _goal, _deadline, msg.sender);
        (address payable[] memory Found, uint[] memory Amount, uint len) = _GoThoughTxById(_oldId);
        for(uint i = 0; i < len; i++) {
            Found[i].transfer(Amount[i]*1 finney);
        }
    }

    function deleteProduct(uint Id) public {
        require(Id < products.length, "poChain Error: product Id not found");
        require(msg.sender == Id2Owner[Id], "poChain Error: cannot access");
        require(products[Id]._goal > 0, "poChain Error: product deleted");
        _deleteproduct(Id);
        (address payable[] memory Found, uint[] memory Amount, uint len) = _GoThoughTxById(Id);
        for(uint i = 0; i < len; i++) {
            Found[i].transfer(Amount[i]*1 finney);
        }
    }

    function deadlinePass(uint Id) public view returns(bool) {
        require(Id <= products.length, "poChain Error: product Id not found");
        require(products[Id]._goal > 0, "poChain Error: product deleted");
        if(products[Id]._deadline <= now)
            return true;
        return false;
    }

    function isDeadlineChecked(uint Id) public view returns(bool) {
        require(Id <= products.length, "poChain Error: product Id not found");
        require(products[Id]._goal > 0, "poChain Error: product deleted");
        return products[Id]._deadlinecheck;
    }

    function CheckDeadline(uint Id) public {
        require(Id <= products.length, "poChain Error: product Id not found");
        require(products[Id]._goal > 0, "poChain Error: product deleted");
        require(products[Id]._deadlinecheck == false, "poChain Error: deadline checked");
        require(now >= products[Id]._deadline, "poChain Error: deadline is not reached");
        msg.sender.transfer(2 finney);
        products[Id]._deadlinecheck = true;
        if(products[Id]._state < products[Id]._goal) {
            _targetfailed(Id);
            emit deadlineChecked(Id, false);
        } else {
            emit deadlineChecked(Id, true);
        }
    }

    function _targetfailed(uint Id) private {
        (address payable[] memory Found, uint[] memory Amount, uint len) = _GoThoughTxById(Id);
        for(uint i = 0; i < len; i++) {
            Found[i].transfer((Amount[i]*products[Id]._cost+1)*1 finney);
        }
    }

    //Tx here
    /*********************************************************
    *********************************************************/
    function CreateTx(uint _ProductId,uint amount, string memory hash) public payable {
        require(_ProductId < products.length, "poChain Error: Product DNE");
        require(products[_ProductId]._goal > 0, "poChain Error: Deleted Product");
        require(keccak256(abi.encodePacked(products[_ProductId]._hash)) == keccak256(abi.encodePacked(hash)), "poChain Error: corrupted data");
        require(now < products[_ProductId]._deadline, "poChain Error: pre-order ended");
        require(msg.value == products[_ProductId]._cost * amount * 1 finney, "poChain Error: Not enough balance!!");
        _createtx(_ProductId, amount, msg.sender);
        products[_ProductId]._state += amount;

    }

    function CustomerRCVed(uint Id, uint TxId) public {
        require(msg.sender == Tx2Customer[TxId], "poChain Error: permission denied");
        require(txs[TxId]._isPaid == false, "poChain Error: tx is paid");
        txs[TxId]._isPaid = true;
        Id2Owner[Id].transfer((txs[TxId]._amount*products[Id]._cost)*1 finney);
    }

    function EditTx(uint _ProductId, uint TxId ,uint amount, string memory hash) public payable {
        require(_ProductId < products.length, "poChain Error: product does not exist");
        require(txs[TxId]._ProductId == _ProductId, "poChain Error: product id mismatch");
        require(Tx2Customer[TxId] == msg.sender, "poChain Error: connot access");
        require(products[_ProductId]._goal > 0, "poChain Error: deleted product");
        require(keccak256(abi.encodePacked(products[_ProductId]._hash)) == keccak256(abi.encodePacked(hash)), "poChain Error: corrupted data");
        require(now < products[_ProductId]._deadline, "poChain Error: pre-order ended");
        require(msg.value == products[_ProductId]._cost * amount * 1 finney, "poChain Error: Not enough balance!!");
        (,uint oldamount,) = _gettx(TxId);
        _edittx(TxId, amount);
        msg.sender.transfer(oldamount*products[_ProductId]._cost*1 finney);
        products[_ProductId]._state -= oldamount;
        products[_ProductId]._state += amount;
    }

    function getproduct(uint Id) public view returns(string memory, uint, uint, uint, uint) {
        require(Id  < products.length, "poChain Error: product does not exist");
        return(_getproduct(Id));
        // return hash, cost, state, goal, deadline
    }

    function getProductLength() public view returns(uint) {
        return products.length;
    }

    function gettx(uint Id) public view returns(uint, uint, bool) {
        require(Id < txs.length, "poChain Error: tx does not exist");
        require(msg.sender == Tx2Customer[Id], "poChain Error: Cannot access tx");
        return _gettx(Id);
        // return productid, amount, ispaid
    }

    function getTxLength() public view returns(uint) {
        return txs.length;
    }

    function txalive(uint TxId) public view returns(bool) {
        require(TxId < txs.length, "poChain Error: tx does not exist");
        require(msg.sender == Tx2Customer[TxId], "poChain Error: Cannot access tx");
        (uint productId,,) = _gettx(TxId);
        (,,, uint goal,) = _getproduct(productId);
        return (goal > 0);
    }
}
