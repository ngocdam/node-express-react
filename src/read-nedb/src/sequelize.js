import Sequelize from 'sequelize';
import SequelizeAuto from 'sequelize-auto';

import { readFile, writeFile, copyFile, readDir, makeDir, copyDir, cleanDir } from '../tools/lib/fs';

// -----------------------------------------------------------------------------------------
// Sequelize
// -----------------------------------------------------------------------------------------

const createSeq = (filepath) => {
  console.log('===========> Sequelize => start load db for file: ', filepath);
  const databaseUrl = 'sqlite:database.sqlite';
  const seq = new Sequelize(databaseUrl, {
    dialect: 'sqlite',
    storage: filepath,  // path to file name to store data
    logging: console.log,
    define: {
      freezeTableName: true,
    },
  });
  if (!seq) {
    console.log('Sequelize => create error => seq: ', seq);
    return null;
  }
  return seq;
}

const restoreSeqModels = (seq) => {
  return new Promise((resolve, reject) => {
    const auto = new SequelizeAuto(seq, '', '');
    auto.run(function (err) {
      if (err) {
        console.log('************** Sequelize => restore models err: ', err);
        return resolve(null);
      }
      // console.log('Sequelize => restore models => auto.tables: ', auto.tables); // table list
      // console.log('Sequelize => restore models => auto.foreignKeys: ', auto.foreignKeys); // foreign key list
      const { tables, foreignKeys } = auto;
      return resolve({ tables, foreignKeys });
    });
  });
}

const queryAll = async (seq, outputFilePath) => {
  const queries = [
    "SELECT * FROM BlobFiles",
    "SELECT * FROM BlobRecords",
    "SELECT * FROM IDBDatabaseInfo",
    "SELECT * FROM IndexInfo",
    "SELECT * FROM IndexRecords",
    "SELECT * FROM KeyGenerators",
    "SELECT * FROM ObjectStoreInfo",
    "SELECT * FROM Records",
  ];
  const promises = queries.map((sql) => {
    return seq.query(sql);
  });
  Promise.all(promises).then(async (results) => {
    const retVals = results.map((rs, index) => {
      const sql = queries[index];
      console.log('===============> Sequelize => docs for %s: ', sql, rs[0].length);
      const obj = {};
      obj[rs[1].sql] = rs[0];
      return obj;
    });
    if (outputFilePath) {
      await writeFile(outputFilePath, JSON.stringify(retVals, null, 2));
    }
  }).catch(errors => {
    console.log('===============> Sequelize => errors', errors);
  });
}

const getKey = (str, getLast = false) => {
  const pattern = new RegExp(/^[a-zA-Z]+$/);
  let strArr = str.split('\u0000');
  if (getLast) {
    const lastStr = strArr[strArr.length - 1];
    strArr = lastStr.split('�');
    const lineArr = strArr[strArr.length - 1].split('\n');
    const finalArr = [];
    const tmpObjRs = {};
    for (var i = 0; i < lineArr.length; i++) {
      if (lineArr[i]) {
        const tmpObj = JSON.parse(lineArr[i]);
        if (tmpObj.key && typeof tmpObjRs[tmpObj.key] === 'undefined') {
          finalArr.push(tmpObj);
          tmpObjRs[tmpObj.key] = tmpObj;
        }
      }
    }
    return finalArr;
  }
  const arr = [];
  for (var i = 0; i < strArr.length; i++) {
    const _char = strArr[i];
    if (pattern.test(_char)) {
      arr.push(_char)
    }
  }
  if (arr.length > 0) {
    return arr.join('');
  }
  const wpattern = new RegExp(/wallet/g);
  if (wpattern.test(str)) {
    return 'wallet';
  }
  const wtpattern = new RegExp(/walletTestnet/g);
  if (wtpattern.test(str)) {
    return 'walletTestnet';
  }
}

const parseRow = (row) => {

  const keyBuf = new Buffer(row.key, 'binary');
  const key = getKey(keyBuf.toString('utf8'));

  if (key !== 'wallet' && key !== 'walletTestnet') {
    return null;
  }

  console.log('my key: ', key === 'wallet');

  const valBuf = new Buffer(row.value, 'binary');
  const value = getKey(valBuf.toString('utf8'), true);
  //console.log('value: ', value);

  const obj = {};
  obj[key] = value;

  return obj;

}

const readRecords = async (seq, outputFilePath) => {
  return new Promise((resolve, reject) => {

    seq.query("SELECT * FROM Records").then(async (rs) => {
      const records = rs[0];
      console.log('===============> Sequelize => Records.findAll => num docs: ', records.length);

      //

      //await writeFile(outputFilePath, JSON.stringify(parseRow(records[4]), null, 2));

      const finalRs = {};
      for (var i = 0; i < records.length; i++) {
        const rowRs = parseRow(records[i]);
        if (rowRs !== null) {
          for (var key in rowRs) {
            if (rowRs.hasOwnProperty(key)) {
              finalRs[key] = rowRs[key];
            }
          }
        }
      }
      await writeFile(outputFilePath, JSON.stringify(finalRs, null, 2));

      return resolve(finalRs);

    }).catch(err => {
      console.log('===============> Sequelize => Records.findAll => err', err);
      return resolve(null);
    });
  });
}

const startSeq = async (inputFilePath, outputFilePath) => {
  const seq = createSeq(inputFilePath);

  await seq.sync();

  await readRecords(seq, outputFilePath);


  // --------------------------------

  // queryAll(seq, outputFilePath);

  // await restoreSeqModels(seq);

  // const schemas = await seq.showAllSchemas({ logging: console.log });
  // console.log('Sequelize => showAllSchemas: ', schemas);

  // --------------------------------

  seq.close();
}

// -----------------------------------------------------------------------------------------

export default startSeq;
