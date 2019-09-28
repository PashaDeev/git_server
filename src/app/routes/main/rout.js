const debug = require(`debug`)(`router: `);

const mainFunc = require(`./main`);

function mainRout(rootDir) {
  return async (req, res) => {
    debug(`main start`);
    // await new Promise(res => setTimeout(() => res(), 10000));
    const result = await mainFunc(rootDir);
    res.send({ msg: result });
    debug(`main end`);
  };
}

module.exports = mainRout;
