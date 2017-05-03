import path from 'path';
import chokidar from 'chokidar';
import { readFile, writeFile, copyFile, makeDir, copyDir, cleanDir, getDir } from './lib/fs';
import { format } from './run';

/**
 * Copies static files such as robots.txt, favicon.ico to the
 * output (build) folder.
 */
export default async () => {

  const srcRoot = path.resolve(__dirname, '../src');

  const serverPath = path.join(srcRoot, 'server');

  const pkg = require(path.join(serverPath, 'package.json'));

  // copy server source
  await makeDir('build');
  await copyDir(`${serverPath}/build`, 'build/');
  await writeFile('build/package.json', JSON.stringify({
    name: pkg.name,
    version: pkg.version,
    private: true,
    engines: pkg.engines,
    dependencies: pkg.dependencies,
    scripts: {
      preinstall: 'npm install pm2',
      start: `pm2 start --attach ${pkg.main}`,
    },
  }, null, 2));
  const env = await readFile(`${serverPath}/.env.production`);
  await writeFile('build/.env', env);

  // copy other sources
  await makeDir('build/web');
  const dirs = getDir(srcRoot);
  const promises = dirs.map(async (dirName) => {
    const dirPath = path.resolve(srcRoot, dirName);
    // check to ignore server
    if (dirPath === serverPath) {
      return Promise.resolve();
    }
    // copy others
    const destPath = `build/web/${dirName}`;
    await makeDir(destPath);
    copyDir(`${dirPath}/build`, destPath);
  });
  return Promise.all(promises);
}
