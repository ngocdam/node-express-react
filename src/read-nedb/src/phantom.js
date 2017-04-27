// yarn add phantom
import phantom from 'phantom';

import { readFile, writeFile, copyFile, readDir, makeDir, copyDir, cleanDir } from '../tools/lib/fs';

// -----------------------------------------------------------------------------------------
// Phantom
// -----------------------------------------------------------------------------------------

const phantomTest = () => {
  phantom.create().then(function (ph) {
    ph.createPage().then(function (page) {
      page.open('https://stackoverflow.com/').then(function (status) {
        console.log(status);
        page.property('content').then(function (content) {
          console.log(content);
          page.close();
          ph.exit();
        });
      });
    });
  });
}

// -----------------------------------------------------------------------------------------

const startPhantom = () => {

}

// -----------------------------------------------------------------------------------------

export default startPhantom;
