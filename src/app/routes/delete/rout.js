const debug = require(`debug`)(`router: `);
const path = require(`path`);
const deleteRepository = require(`./delete`);

function routWrapper(rootDir) {
  return async function(req, res) {
    debug(`delete start`);
    const { repositoryId } = req.params;
    if (!repositoryId) {
      res.statusCode = 400;
      return res.end({ code: 400 });
    }

    const code = await deleteRepository(repositoryId, rootDir);

    res.statusCode = code;
    await res.json({ code });
    debug(`delete end`);
  };
}

module.exports = routWrapper;
