export default class extends Error {
  _code: string;

  constructor(msg: string) {
    super(msg);
    this._code = 'ENOENT';
  }

  get code() {
    return this._code;
  }
  set code(code: string) {
    this.code = code;
  }
}
