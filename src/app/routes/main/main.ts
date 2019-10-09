import path from 'path';
import fs from 'fs-extra';

export default async function main(rootDir: string) {
  let directoryList: string[] = await fs.readdir(rootDir);
  return directoryList.filter(item => {
    const arr = item.split('');
    if (arr[0] === `.`) return false;
    return fs.lstatSync(path.join(rootDir, item)).isDirectory();
  });
}
