const debug = require(`debug`)(`router: `);
const path = require(`path`);
const create = require(`./create`);

function createRepository(rootDir) {
  return async function(req, res) {
    debug(`create start`);
    const { repositoryId } = req.params;
    const { body } = req;
    if (!repositoryId || !body || !body.url) {
      res.statusCode = 400;
      return res.end(`bad request`);
    }
    const pathToDir = `${path.join(rootDir, repositoryId)}.git`;
    let resolve;
    const promise = new Promise(res => resolve = res);
    create(pathToDir, body.url, rootDir, resolve);
    const response = await promise;
    res.statusCode = response.code;
    await res.json(response);
    debug(`create end`);
  };
}

module.exports = createRepository;
