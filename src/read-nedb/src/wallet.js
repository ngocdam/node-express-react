import path from 'path';

import { readFile, writeFile, copyFile, readDir, makeDir, copyDir, cleanDir } from '../tools/lib/fs';

import AltaWallet from './altawallet-core';

// -----------------------------------------------------------------------------------------
// Wallet
// -----------------------------------------------------------------------------------------

const getPassphrase = (objAltaWallet, password) => {
  return new Promise((resolve, reject) => {
    const mnemonic = objAltaWallet.getMnemonic();
    AltaWallet.wallet.decryptString(mnemonic, password, (passphrase) => {
      return resolve(passphrase);
    });
  });
}

const parseWallet = async (walletModels, password) => {
  const results = {};
  for (var i = 0; i < walletModels.length; i++) {
    //
    const { name, data } = walletModels[i];

    const wallet = new AltaWallet.wallet();
    wallet.deserialize(data);

    const coins = wallet.getCoinNames();
    const passphrase = await getPassphrase(wallet, password);

    results[name] = {
      coins,
      passphrase
    };
    //
  }
  return results;
}

const loadWallet = async (inputFilePath, outputFilePath) => {

  console.log('\n\n===========> Sequelize => start restore for file: ', inputFilePath);

  const password = '11';

  const jsonData = require('../' + inputFilePath);
  const results = await parseWallet(jsonData.wallet, password);
  await writeFile(outputFilePath, JSON.stringify(results, null, 2));

}

// -----------------------------------------------------------------------------------------

export default loadWallet;
