import Datastore from 'nedb';
import localforage from 'localforage';

import { readFile, writeFile, copyFile, readDir, makeDir, copyDir, cleanDir } from '../tools/lib/fs';

// -----------------------------------------------------------------------------------------
// NeDB
// -----------------------------------------------------------------------------------------

const loadNeDb = (filepath = '') => {
  return new Promise((resolve, reject) => {
    const db = new Datastore({
      filename: filepath,
      //corruptAlertThreshold: 1
    });
    console.log('===========> Nedb => start load db for file: ', filepath);
    return db.loadDatabase(function (err) {
      if (err) {
        console.log('Nedb => load nedb err: ', err);
        return resolve(null);
      }
      return resolve(db);
    });
  });
}

const startNedb = async (inputFilePath, outputFilePath) => {
  return new Promise(async (resolve, reject) => {
    const db = await loadNeDb(inputFilePath);
    if (db === null) {
      console.log('Nedb => cannot load DB');
      return resolve(null);
    }
    //
    // await writeFile(outputFilePath, JSON.stringify(db.getAllData(), null, 2));
    //
    const where = { key: { $regex: /^wallet/ } }; // find wallet only
    //const where = {};
    db.find(where, async function (err, docs) {
      if (outputFilePath) {
        await writeFile(outputFilePath, JSON.stringify(docs, null, 2));
      }
      if (err) {
        console.log('Nedb => find data err: ', err);
        return resolve(null);
      }
      console.log('Nedb => found %s docs for %s', docs.length, inputFilePath);
      db = null;
      return resolve(docs);
    });
    //
  });
}

// -----------------------------------------------------------------------------------------
export default startNedb;
