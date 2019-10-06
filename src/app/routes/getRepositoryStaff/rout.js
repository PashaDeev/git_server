const debug = require(`debug`)(`router: `);
const path = require(`path`);
const getStaff = require(`./getStaff`);

function routWrapper(rootDir) {
  return async function(req, res) {
    debug(`repository staff start`);
    const { repositoryId, commitHash, pathFromUrl } = req.params;
    const dir = path.join(rootDir, `${repositoryId}.git`);
    const innerPath = pathFromUrl ? `./${pathFromUrl}${req.params[0] + '/' || `.`}` : `.`;
    const hash = commitHash || `master`;
    const result = await getStaff(dir, hash, innerPath);
    await res.json(result);
    debug(`repository staff end`);
  };
}

module.exports = routWrapper;
