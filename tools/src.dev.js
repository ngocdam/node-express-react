import path from 'path';
import { spawn } from './lib/cp';
import { getDir } from './lib/fs';

export default async () => {
  const options = {
    stdio: ['ignore', 'inherit', 'inherit'],
    shell: true,
  };
  const srcRoot = path.resolve(__dirname, '../src');
  const dirs = getDir(srcRoot);
  return dirs.map(dirName => {
    const dirPath = path.resolve(srcRoot, dirName);
    const opts = {
      cwd: dirPath,
    };
    return spawn('yarn', ['dev'], Object.assign({}, options, opts));
  });
}
