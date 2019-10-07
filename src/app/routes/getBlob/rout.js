const debug = require(`debug`)(`router: `);
const path = require(`path`);
const getBlob = require(`./getBlob`);

function routWrapper(rootDir) {
  return async function(req, res) {
    debug(`get blob start`);

    const { repositoryId, commitHash, pathToFile } = req.params;
    const dir = path.join(rootDir, `${repositoryId}.git`);
    const innerPath = pathToFile ? `${pathToFile}${req.params[0]}` : `.`;
    const hash = commitHash || `master`;

    await res.setHeader("Content-Type", "application/json");
    await res.setHeader("Transfer-Encoding", "chunked");
    let promiseResolve;
    new Promise(res => (promiseResolve = res));
    const result = await getBlob(dir, hash, innerPath, res, promiseResolve);

    if (result) {
      await res.json(result);
    }
    debug(`get blob end`);
  };
}

module.exports = routWrapper;
