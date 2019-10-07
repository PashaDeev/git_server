const { describe, it } = require("mocha");
const { expect } = require("chai");
const { join } = require("path");

const ROOT_DIR = join(__dirname, "..", "git_repo_tester");

const mainRoutHandler = require("../src/app/routes/main/main");
const getRepositoryStaff = require("../src/app/routes/getRepositoryStaff/getStaff");
const getCommits = require("../src/app/routes/commits/commits");

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

    const res = await getCommits(INNER_PATH, 'master');

    expect(res.msg).to.have.length(7);
  });
});
