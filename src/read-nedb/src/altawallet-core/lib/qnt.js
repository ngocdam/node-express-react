var ABI = require('ethereumjs-abi');
var BigNumber = require('./bignumber.js');
var ethFuncs = require('./ethFuncs.js');
var Ethereum = require('./ethereum');

/**
 * Constructor
 */
var QNT = function () {
    Ethereum.call(this);
};

QNT.prototype = Object.create(Ethereum.prototype);
QNT.prototype.constructor = QNT;

QNT.prototype.createStatusOfData = function (address) {
    var func = '0x' + ABI.methodID('statusOf', ['address']).toString('hex');;
    var param1 = ethFuncs.padLeft(ethFuncs.getNakedAddress(address), 64);
    return func + param1;
}

QNT.prototype.createAddUserData = function (address) {
    var func = '0x' + ABI.methodID('addUser', ['address']).toString('hex');;
    var param1 = ethFuncs.padLeft(ethFuncs.getNakedAddress(address), 64);
    return func + param1;
}

QNT.prototype.createRawTransaction = function (txParams) {
    // check to create contract data if needed
    if (typeof txParams.data === 'undefined') {
        var transferHex = '0x' + ABI.methodID('transfer', ['address', 'uint64']).toString('hex');;
        var value = ethFuncs.padLeft(new BigNumber(txParams.value).toString(16), 64);
        var toAdd = ethFuncs.padLeft(ethFuncs.getNakedAddress(txParams.to), 64); // send address
        var data = transferHex + toAdd + value;

        txParams.to = ethFuncs.sanitizeHex(ethFuncs.getNakedAddress(txParams.contractAddress)); // smart contact address 
        txParams.value = ethFuncs.sanitizeHex('0'); // default is 0
        txParams.data = ethFuncs.sanitizeHex(data);
    }
    else {
        // if data is passed along with txParams, it means before call this function:
        // - the txParams.to field must be a contract address
        // - the txParams.value field may include some ETH need to be sent along with this transaction
        // - the txParams.data included all information about smart contract function and it's params as well as the params' values

        // So, Nothing need to do here
    }

    return this._createRawTransaction(txParams);
};

module.exports = QNT;
