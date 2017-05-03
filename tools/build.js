import path from 'path';
import { spawn } from './lib/cp';
import { getDir } from './lib/fs';
import run from './run';
import clean from './clean';
import cleanSrc from './src.clean';
import copy from './copy';

export default async () => {

  await run(cleanSrc);
  await run(clean);

  const options = {
    stdio: ['ignore', 'inherit', 'inherit'],
    shell: true,
  };
  const srcRoot = path.resolve(__dirname, '../src');
  const dirs = getDir(srcRoot);
  const promises = dirs.map(async (dirName) => {
    const dirPath = path.resolve(srcRoot, dirName);
    const opts = {
      cwd: dirPath,
    };
    return spawn('yarn', ['build'], Object.assign({}, options, opts));
  });

  await Promise.all(promises);

  await run(copy);

}
