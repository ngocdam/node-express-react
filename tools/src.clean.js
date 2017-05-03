import path from 'path';
import { spawn } from './lib/cp';
import { getDir, cleanDir } from './lib/fs';

export default async () => {
  const options = {
    stdio: ['ignore', 'inherit', 'inherit'],
    shell: true,
  };
  const srcRoot = path.resolve(__dirname, '../src');
  const dirs = getDir(srcRoot);
  const promises = dirs.map(dirName => {
    const dirPath = path.resolve(srcRoot, dirName);
    return cleanDir(path.join(dirPath, 'build', '*'), {
      nosort: true,
      dot: true,
      ignore: ['build/.git'],
    });
  });
  return Promise.all(promises);
}
