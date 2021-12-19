const emitterService = require("../services/emitterService");
const createError = require("http-errors");

const { createReadStream, createWriteStream } = require("fs");
const { PassThrough, Duplex } = require("stream");
// const filename = "./data.json";
const filename = "./long.txt";

class Throttle extends Duplex {
  constructor(ms) {
    super();
    this.delay = ms;
  }
  _read() {}
  _write(chunk, encoding, callback) {
    this.push(chunk);
    setTimeout(callback, this.delay);
  }
  _final() {
    this.push(null);
  }
}

exports.sendEncryptedMessage = async (req, res, next) => {
  try {
    const report = new PassThrough();
    const throttle = new Throttle(10000);
    let total = 0;
    report.on("data", (chunk) => {
      total += chunk.length;
      console.log("bytes", total);
    });
    res.writeHead(200, {
      "Content-Type": "text/plain",
    });
    createReadStream(filename)
      .pipe(throttle)
      .pipe(report)
      .pipe(res)
      .on("error", console.error);
  } catch (error) {
    next(error);
  }
};
