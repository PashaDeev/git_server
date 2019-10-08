const { describe, it } = require("mocha");
const { expect } = require("chai");
const { join } = require("path");
const pump = require("pump");
const { Transform } = require("stream");

const ROOT_DIR = join(__dirname, "..", "git_repo_tester");

const mainRoutHandler = require("../src/app/routes/main/main");
const getRepositoryStaff = require("../src/app/routes/getRepositoryStaff/getStaff");
const getCommits = require("../src/app/routes/commits/commits");
const getBlob = require("../src/app/routes/getBlob/getBlob");

describe("Rout handlers", () => {
  it("Получение списка репозиториев", async () => {
    const expectedResult = ["test"];

    const res = await mainRoutHandler(ROOT_DIR);

    expect(res).to.deep.equal(expectedResult);
  });

  it("Получение содержимого папки", async () => {
    const PATH_TO_TEST_REPO = `${ROOT_DIR}/test.git/.`;

    const res = await getRepositoryStaff(ROOT_DIR, "master", PATH_TO_TEST_REPO);

    expect(res.msg).to.have.length(7);
  });

  it("Получение списка коммитов", async () => {
    const INNER_PATH = `${ROOT_DIR}/test`;

    const res = await getCommits(INNER_PATH, "master");

    expect(res.msg).to.have.length(7);
  });

  it("Получение содержимого файла", async () => {
    const validResult = [
      '{ "code": 200, "msg": [ ',
      '{"raw":"smt\\\\nsmt 2"},',
      '{"raw": ""}]}'
    ];

    const readStream = new Transform();
    const INNER_PATH = `first.txt`;
    const [stdout, parser] = await getBlob(
      `${ROOT_DIR}/test.git`,
      "master",
      INNER_PATH
    );

    const dataArr = [];

    let resolve;
    const promise = new Promise(res => (resolve = res));
    readStream._transform = function(data, enc, done) {
      dataArr.push(data.toString());
      this.push(data);
      done();
    };

    readStream._flush = function(done) {
      resolve();
      done();
    };

    pump(stdout, parser, readStream);

    await promise;
    expect(dataArr).to.deep.equal(validResult)
  });
});
