import path from 'path';
import phantom from 'phantom';

import { readFile, writeFile, copyFile, readDir, makeDir, copyDir, cleanDir } from '../tools/lib/fs';

// -----------------------------------------------------------------------------------------
// Phantom
// -----------------------------------------------------------------------------------------

// -----------------------------------------------------------------------------------------
// This function MUST be in pure javascript, because it is executed in browser (phantomjs does not support ES6 in year of 2017)
function browserEnv(inputFilePath, outputFilePath) {
  // --------------------------------------------------------------
  // Javascript environment in this fuction the same as on Browser
  // --------------------------------------------------------------
  function log() {
    console.log('\n\n --------------- Browser console.log - START --------------- \n\n');
    for (var i = 0; i < arguments.length; i++) {
      try {
        console.log(arguments[i] !== null && (typeof arguments[i] === 'object' || arguments[i].constructor === Array) ? JSON.stringify(arguments[i]) : arguments[i]);
      }
      catch (ex) {
        console.log(arguments[i]);
      }
      console.log('\n');
    }
    console.log('\n --------------- Browser console.log - END --------------- \n\n');
  }
  // --------------------------------------------------------------
  function useNedb() {
    var db = new window.Nedb({
      //filename: inputFilePath,
      filename: 'test_in_browser123',
      autoload: false,
      //corruptAlertThreshold: 1
    });
    //log(Object.keys(db))
    db.loadDatabase(function (err) {
      if (err) {
        log('load DB ERR')
      }
      log('load DB OK')
      //
      db.insert({ a: 1, b: 2, timestamp: new Date().getTime() }, function () {
        db.find({}, function (err, docs) {
          log('find all err: ', err);
          log('find all docs: ', docs);
        });
      });
      //
      /*db.remove({}, function () {
        db.insert({ a: 1, b: 2, timestamp: new Date().getTime() }, function () {
          db.find({}, function (err, docs) {
            log('find all err: ', err);
            log('find all docs: ', docs);
          });
        });
      });*/
      //
    });
  }
  // --------------------------------------------------------------
  function useIndexedDB() {
    // This works on all devices/browsers, and uses IndexedDBShim as a final fallback 
    var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;

    // Open (or create) the database
    var open = indexedDB.open("MyDatabase", 1);

    // Create the schema
    open.onupgradeneeded = function () {
      var db = open.result;
      var store = db.createObjectStore("MyObjectStore", { keyPath: "id" });
      var index = store.createIndex("NameIndex", ["name.last", "name.first"]);
    };

    open.onsuccess = function () {
      // Start a new transaction
      var db = open.result;
      var tx = db.transaction("MyObjectStore", "readwrite");
      var store = tx.objectStore("MyObjectStore");
      var index = store.index("NameIndex");

      // Add some data
      store.put({ id: 12345, name: { first: "John", last: "Doe" }, age: 42 });
      store.put({ id: 67890, name: { first: "Bob", last: "Smith" }, age: 35 });

      // Query the data
      var getJohn = store.get(12345);
      var getBob = index.get(["Smith", "Bob"]);

      getJohn.onsuccess = function () {
        log(getJohn.result.name.first);  // => "John"
      };

      getBob.onsuccess = function () {
        log(getBob.result.name.first);   // => "Bob"
      };

      // Close the db when the transaction is done
      tx.oncomplete = function () {
        db.close();
      };
    }
  }
  // --------------------------------------------------------------
  function useLocalforage() {
    var localforage = window.localforage;
    localforage.config({
      driver: localforage.WEBSQL, // Force WebSQL; same as using setDriver()
      name: 'Localforage_myApp',
      version: 1.0,
      size: 4980736, // Size of database, in bytes. WebSQL-only for now.
      storeName: 'Records', // Should be alphanumeric, with underscores.
      description: 'Localforage_ some description'
    });
    //console.log('localforage.length: ', localforage.length());
    localforage.getItem('key', function (err, value) {
      // if err is non-null, we got an error. otherwise, value is the value
      log(err, value)
    });
    // localforage.setItem('Localforage_key', 'Localforage_value', function (err) {
    //   // if err is non-null, we got an error
    //   localforage.getItem('Localforage_key', function (err, value) {
    //     // if err is non-null, we got an error. otherwise, value is the value
    //   });
    // });
  }
  // --------------------------------------------------------------
  //useNedb();
  //useIndexedDB();
  useLocalforage();
  // --------------------------------------------------------------


}
// -----------------------------------------------------------------------------------------

const phantomPage = async (inputFilePath, outputFilePath) => {

  console.log('\n' + '===========> phantomPage => start for file: ', inputFilePath);

  const log = console.log;
  const nolog = () => { };

  const url = 'http://localhost/';
  // const ph = await phantom.create([], { logLevel: 'error', logger: { warn: log, debug: nolog, error: log } });
  const ph = await phantom.create();
  const page = await ph.createPage();

  // check if enable javascript
  page.setting('javascriptEnabled').then(function (value) {
    console.log('\n' + 'phantomPage => javascriptEnabled => expect(value).toEqual(true): ', (value === true));
  });

  // config to write console.log from browser to nodejs env console
  await page.on("onConsoleMessage", msg => process.stdout.write(msg));

  const status = await page.open(url);
  console.log('\n' + 'phantomPage => page status: ', status);

  const content = await page.property('content');
  // console.log('phantomPage => page content: ', content);

  // Inject JS files
  const nm = 'node_modules';
  const jsList = [
    'indexeddbshim/dist/indexeddbshim.js',
    'localforage/dist/localforage.js',
    'nedb/browser-version/out/nedb.js',
  ];
  for (let i = 0; i < jsList.length; i++) {
    const filename = jsList[i];
    const filepath = path.join(nm, filename);
    const isLoaded = await page.injectJs(filepath);
    console.log('\n' + 'phantomPage => file %s is loaded?: ', filename, isLoaded);
  }
  // Inject JS files - END

  // example of excutiion browser javascript
  const window = await page.evaluate(function (args, get, from, here) {
    // Javascript environment in this fuction the same as on Browser
    console.log('Browser => console.log test: OK');
    return window;
  }, 'arguments', 'will', 'go', 'here');

  // console.log('phantomPage => window keys: ', Object.keys(window));

  await page.evaluate(browserEnv, inputFilePath, outputFilePath);

  await page.close();
  await ph.exit();

}

// -----------------------------------------------------------------------------------------

const startPhantom = async (inputFilePath, outputFilePath) => {
  await phantomPage(inputFilePath, outputFilePath);
}

// -----------------------------------------------------------------------------------------

export default startPhantom;
