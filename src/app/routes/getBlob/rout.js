const debug = require(`debug`)(`router: `);
const path = require(`path`);
const getBlob = require(`./getBlob`);
const pump = require('pump');
const Transform = require(`stream`).Transform;

function routWrapper(rootDir) {
  return async function(req, res) {
    debug(`get blob start`);

    const { repositoryId, commitHash, pathToFile } = req.params;
    const dir = path.join(rootDir, `${repositoryId}.git`);
    const innerPath = pathToFile ? `${pathToFile}${req.params[0]}` : `.`;
    const hash = commitHash || `master`;

    await res.setHeader("Content-Type", "application/json");
    await res.setHeader("Transfer-Encoding", "chunked");
    const [stdout, parser] = await getBlob(dir, hash, innerPath);

    pump(stdout, parser, res);

    debug(`get blob end`);
  };
}

module.exports = routWrapper;
