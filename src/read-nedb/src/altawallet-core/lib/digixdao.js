var bitcore = require("bitcore-lib");
var Mnemonic = require("bitcore-mnemonic");
var EC = require("elliptic").ec;
var ec = new EC("secp256k1");
var CryptoJS = require("crypto-js");
var Transaction = require("ethereumjs-tx");
var Encrypt = require('./encrypt.js');
var ethFuncs = require('./ethFuncs.js');
var BigNumber = require('./bignumber.js');
/**
 * Constructor
 */
var DigixDAO = function () {
    this.hdIndex = 0;
    this.PrivKeys = {};
    this.Addresses = [];
};

/**
 * The hd path string
 * (See BIP44 specification for more info: https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki)
 */
DigixDAO.HDPathString = "m/44'/60'/0'/0";

DigixDAO.Gas = 150000;
DigixDAO.GasPrice = 20000000000;
DigixDAO.convertToWei = function (ether) {
    var wei = Math.floor(ether * 1000000000000000000);
    return wei;
}
/**
 * Generate private key
 */
DigixDAO.prototype._generatePrivKeys = function (mnemonic, n) {
    var hdRoot = new bitcore.HDPrivateKey(new Mnemonic(mnemonic).toHDPrivateKey().xprivkey);
    var hdPath = hdRoot.derive(DigixDAO.HDPathString).xprivkey;
    var keys = [];

    for (var i = 0; i < n; i++) {
        var key = new bitcore.HDPrivateKey(hdPath).derive(this.hdIndex++);
        keys[i] = key.privateKey.toString();
    }

    return keys;
};

/**
 * Compute address from private key
 */
DigixDAO._computeAddressFromPrivKey = function (privKey) {
    var keyPair = ec.genKeyPair();
    keyPair._importPrivate(privKey, "hex");
    var compact = false;
    var pubKey = keyPair.getPublic(compact, "hex").slice(2);
    var pubKeyWordArray = CryptoJS.enc.Hex.parse(pubKey);
    var hash = CryptoJS.SHA3(pubKeyWordArray, {
        outputLength: 256
    });
    return hash.toString(CryptoJS.enc.Hex).slice(24);
};

/**
 * Generate addresses
 */
DigixDAO.prototype.generateAddresses = function (mnemonic, deriveKey, n) {
    n = n || 1;
    var keys = this._generatePrivKeys(mnemonic, n, DigixDAO.HDPathString);

    for (var i = 0; i < n; i++) {
        var address = "0x" + DigixDAO._computeAddressFromPrivKey(keys[i]);
        this.PrivKeys[address] = Encrypt.encryptString(keys[i], deriveKey);
        this.Addresses.push(address);
    }
};

/**
 * Get an address
 */
DigixDAO.prototype.getAddresses = function (n) {
    return this.Addresses[n];
};

/**
 * Get addresses
 */
DigixDAO.prototype.getAddresses = function () {
    return this.Addresses;
};

/**
 * Get private keys
 * @returns {Array}
 */
DigixDAO.prototype.getPrivKeys = function () {
    return this.PrivKeys;
};

/**
 * Set addresses
 */
DigixDAO.prototype.setAddresses = function (address) {
    return this.Addresses = address;
};

/**
 * Set private key
 * @returns {Array}
 */
DigixDAO.prototype.setPrivKeys = function (privKeys) {
    return this.PrivKeys = privKeys;
};

/**
 * Export private key
 */
DigixDAO.prototype.exportPrivateKey = function (address) {
    if (this.PrivKeys[address] === undefined) {
        throw new Error("DigixDAO.exportPrivateKey: Address not found.");
    }
    return this.PrivKeys[address];
};

/**
 * Create transaction
 *
 * @example
 *	var txParams = {
 *		from: "0x9c729ef4cec1b1bdffaa281c2ff76b48fdcb874c",
 *		to: "0xfd2921b8b8f0dccf65d4b0793c3a2e5c127f3e86",
 *		value: 12,
 *		nonce: 1
 *	};
 */
DigixDAO.prototype.createRawTransaction = function (txParams) {
    // Calculate transaction fee
    var transaction_fee = DigixDAO.Gas * DigixDAO.GasPrice;
    //if (transaction_fee >= txParams.value) {
    //	return {
    //		tx_hex : '',
    //		fee : 0,
    //       error: 'balance_not_enough'
    //	};
    //}

    var transaction = new Transaction();
    // Convert value from ether to wei
    // txParams.value = DigixDAO.convertToWei(txParams.value);
    // sending value
    var value = ethFuncs.padLeft(new BigNumber(txParams.value).times(new BigNumber(10).pow(9)).toString(16), 64);
    var toAdd = ethFuncs.padLeft(ethFuncs.getNakedAddress(txParams.to), 64); // send address
    var transferHex = '0xa9059cbb';
    var data = transferHex + toAdd + value;

    transaction.to = ethFuncs.sanitizeHex('e0b7927c4af23765cb51314a0e0521a9645f0e2a'); // smart contact address 
    transaction.gasLimit = ethFuncs.sanitizeHex(DigixDAO.Gas.toString(16));
    transaction.gasPrice = ethFuncs.sanitizeHex(('0x4a817c800'));
    transaction.nonce = ethFuncs.sanitizeHex(txParams.nonce.toString(16));
    transaction.value = ethFuncs.sanitizeHex('0'); // default is 0
    transaction.data = ethFuncs.sanitizeHex(data);

    var privateKey = this.exportPrivateKey(txParams.from);
    privateKey = Encrypt.decryptString(privateKey, txParams.derivedKey);
    privateKey = new Buffer(privateKey, 'hex')

    transaction.sign(new Buffer(privateKey), "hex");
    return {
        tx_hex: transaction.serialize().toString("hex"),
        fee: transaction_fee
    };
};

/**
 * Create transaction without sign
 *
 * @example
 *	var txParams = {
 *		from: "0x9c729ef4cec1b1bdffaa281c2ff76b48fdcb874c",
 *		to: "0xfd2921b8b8f0dccf65d4b0793c3a2e5c127f3e86",
 *		value: 0,
 *		nonce: 1
 *	};
 */
DigixDAO.prototype.createTransactionWithoutSign = function (txParams) {
    if (typeof txParams.gas != "undefined") {
        DigixDAO.Gas = txParams.gas;
    }
    var transaction_fee = DigixDAO.Gas * DigixDAO.GasPrice;
    if (transaction_fee >= txParams.value) {
        return {
            tx_hex: "",
            fee: 0
        };
    }

    var transaction = new Transaction();

    transaction.from = txParams.from;
    transaction.to = txParams.to;
    transaction.gasLimit = DigixDAO.Gas;
    transaction.gasPrice = DigixDAO.GasPrice;
    transaction.nonce = txParams.nonce;
    transaction.value = txParams.value - transaction_fee;

    return {
        tx_hex: transaction.serialize().toString("hex"),
        fee: transaction_fee
    };
};

/**
 * Sign transaction
 */
DigixDAO.prototype.signTransaction = function (privkey, tx_hex) {
    var transaction = new Transaction(new Buffer(tx_hex, "hex"));
    transaction.sign(new Buffer(privkey, "hex"));
    return transaction.serialize().toString("hex");
};

module.exports = DigixDAO;
