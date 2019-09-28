const debug = require(`debug`)(`router: `);
const path = require(`path`);
const getBlob = require(`./getBlob`);

const util = require(`util`);
const childProcess = require(`child_process`);

const Readable = require("stream").Readable;
// const fork = util.promisify(childProcess.fork);
// const

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
    // const stream = new Readable();
    // const newProcess = childProcess.fork(path.join(__dirname, "getBlob.js"), []);
    // newProcess.pipe(res);
    // stream.pipe(res)
    // newProcess.on(`message`, msg => {
    //   console.log(`-------------------------`);
    //   console.log(`msg`, msg);
    //   console.log(`-------------------------`);
    //   res.send(`proc`);
    //   // stream.push(msg);
    //   // console.log(`-------------------------`);
    //   // console.log(`msg`, msg);
    //   // console.log(`-------------------------`);
    // });
    // newProcess.on(`exit`, msg => {
    //   console.log(`-------------------------`);
    //   console.log(`on exit from parent`, msg);
    //   console.log(`-------------------------`);
    //   res.end(`end`);
    // });
    // newProcess.send({ dir, hash, innerPath });
    // const result = await getBlob(dir, hash, innerPath);
    // await res.json({ msg: result });
    // res.end(`test`);

    if (result) {
      await res.json(result);
    }
    debug(`get blob end`);
  };
}

module.exports = routWrapper;
