const path = require(`path`);
const fs = require(`fs-extra`);
const { err: errorDebug } = require(`../../debug`);

async function main(rootDir) {
  let res;
  try {
    res = await fs.readdir(rootDir);
    res = res.filter((item) => {
      const arr = item.split(``);
      if (arr[0] === `.`) return false;
      return fs.lstatSync(path.join(rootDir, item)).isDirectory();
    });
  } catch (err) {
    errorDebug(`error for get ${err}`);
  }
  return res.map((dir) => {
    return dir.split(`.`)[0];
  });
}

module.exports = main;
