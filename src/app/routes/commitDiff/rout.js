const debug = require(`debug`)(`router: `);
const path = require(`path`);
const getCommitDiff = require(`./getDiff`);

function routWrapper(rootDir) {
  return async function(req, res) {
    debug(`commit diff start`);
    const { repositoryId, commitHash } = req.params;
    let promiseResolve;
    await res.setHeader("Content-Type", "application/json");
    await res.setHeader("Transfer-Encoding", "chunked");
    const result = await new Promise(async response => {
      getCommitDiff(
        path.join(rootDir, repositoryId),
        commitHash,
        res,
        response
      );
    });
    // await res.json(result);
    // if (result) {
    //   await res.json(result);
    // }
    // debug(`commit end`);
  };
}

module.exports = routWrapper;
