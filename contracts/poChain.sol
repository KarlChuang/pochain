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
    function createproduct(string memory _hash, uint _cost, uint _goal, uint _deadline) public payable {
        require(msg.value == ((_goal + 2) * (1 finney)), "must reserve exactly _goal+2 finney");
        _createproduct(_hash, _cost, _goal, _deadline);
    }

    function editproduct(uint Id, string memory _hash, uint _cost, uint _goal, uint _deadline) public payable {
        //(,,oldstate) = _getproduct(Id);
        require(msg.sender == Id2Owner[Id], "CANT ACCESS");
        require(msg.value == (_goal+2)*(1 finney), "value must equal with _goal+2 finney");
        require(Id <= products.length, "product Id not found");
        require(products[Id]._state > 0, "product deleted");
        _editproduct(Id, _hash, _cost, _goal, _deadline);
        (address payable[] memory Found, uint[] memory Amount, uint len) = _GoThoughTxById(Id);
        // for(uint i = 0; i < len; i++) {
        //     Found[i].transfer(Amount[i]*1 finney);
        // }
    }

    function DLC(uint Id, uint deadline) public view returns(bool) {
        require(Id <= products.length, "product Id not found");
        require(products[Id]._state > 0, "product deleted");
        if(products[Id].deadline == deadline)
            return true;
        else
            return false;
    }

    function CheckDeadline(uint Id) public {
        require(Id <= products.length, "product Id not found");
        require(products[Id]._state > 0, "product deleted");
        //Todo if DL Checked
        //require(products[Id]._state > 0, "deadline checked");
        if(now >= products[Id].deadline) {
            msg.sender.transfer(2 finney);
            // emit sth
            if(products[Id]._state < products[Id]._goal)
                _targetfailed(Id);
        }
    }

    function CustomerRCVed(uint Id, uint TxId) public {
        // Todo require ispaid ==false 

        Id2Owner[Id].transfer((txs[TxId].amount*products[Id]._cost)*1 finney);
    }

    // function _deadlinereached(uint Id) private {
    //     if(products[Id]._state >= products[Id]._state)
    //         _targetreached(Id);
    //     else
    //         _targetfailed(Id);
    // }

    // function _targetreached(uint Id) private {
    //     Id2Owner[Id].transfer(products[Id]._state*products[Id]._cost*1 finney);
    // }

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
        require(_ProductId >= (products.length-1), "Product DNE");
        require(products[_ProductId]._state >= 1, "Deleted Product");
        require(keccak256(abi.encodePacked(products[_ProductId]._hash)) == keccak256(abi.encodePacked(hash)), "corrupted data");
        require(now <= products[_ProductId].deadline, "pre-order ended");
        require(msg.value == products[_ProductId]._cost*amount, "Not enough balance!!");
        _createtx(_ProductId, amount);
        products[_ProductId]._state += amount;

    }

    function EditTx(uint TxId, uint _ProductId,uint amount, string memory hash) public payable {
        require(_ProductId >= (products.length-1), "Product DNE");
        require(txs[TxId]._ProductId == _ProductId, "NOT THAT PRODUCT");
        require(Tx2Customer[TxId] == msg.sender, "CANT ACCESS");
        //require(_ProductId >= (products.length-1), "Product DNE");
        require(products[_ProductId]._state >= 1, "Deleted Product");
        require(keccak256(abi.encodePacked(products[_ProductId]._hash)) == keccak256(abi.encodePacked(hash)), "corrupted data");
        require(now <= products[_ProductId].deadline, "pre-order ended");
        require(msg.value == products[_ProductId]._cost*amount, "Not enough balance!!");
        (,uint oldamount) = _gettx(TxId);
        _edittx(TxId, amount);
        msg.sender.transfer(oldamount*products[_ProductId]._cost*1 finney);
        products[_ProductId]._state -= oldamount;
        products[_ProductId]._state += amount;
    }

    function getproduct(uint Id) public view returns(string memory, uint, uint, uint, uint) {
        require(Id >= (products.length-1), "Product DNE");
        //require(products[Id]._state >= 1, "Deleted Product");
        return(_getproduct(Id));
        // return hash, cost, state, goal, deadline
    }

    function gettx(uint Id) public view returns(uint, uint) {
        require(Id >= (txs.length-1), "Product DNE");
        //require(txs[Id]._s >= 1, "Deleted Product");
        return(_gettx(Id));
        // return hash, cost, state, goal, deadline
    }
}
