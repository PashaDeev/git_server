const path = require(`path`);
const fs = require(`fs-extra`);
const { err: errorDebug } = require(`../../debug`);

async function deleteRepository(id, rootDir) {
  try {
    await fs.remove(path.join(rootDir, `${id}.git`));
  } catch (err) {
    errorDebug(`error in delete ${err}`);
    return `400`;
  }
  return `200`
}

module.exports = deleteRepository;
