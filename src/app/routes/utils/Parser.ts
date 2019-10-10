import {Transform} from "stream";

export default class Parser extends Transform {
  private firstChunk: boolean;
  isData: boolean;

  constructor() {
    super();
    this.firstChunk = true;
    this.isData = false;
  }
  _transform(data: Buffer, encoding: string, done: Function) {
    const res = data
      .toString()
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
      .replace(/\t/g, '\\t')
      .replace(/\f/g, '\\f');

    const chunk = {
      raw: res,
    };
    if (this.firstChunk) {
      this.push(`{ "msg": [ ${JSON.stringify(chunk)},`);
      this.firstChunk = false;
    } else {
      this.push(`${JSON.stringify(chunk)},`);
    }
    this.isData = true;
    done();
  }

  _flush(done: Function) {
    if (!this.isData) done();
    this.push('{"raw": ""}]}');
    done();
  }
}
