const emitterService = require("../services/emitterService");
const createError = require("http-errors");

const { createReadStream, createWriteStream } = require("fs");
const { PassThrough, Duplex, Transform } = require("stream");
const crypto = require('crypto');

const filename = "./data.json";

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

const pushTransformedObject = new Transform({

  transform(chunk, encoding, callback) {
    let obj = JSON.parse(chunk);
    let namesLength = obj.names.length;
    let citiesLength = obj.cities.length;

    for (let i = 0; i < 3; i++) {
      const transformedObject = {
        name: obj.names[Math.floor(Math.random() * (namesLength - 0) + 0)],
        origin: obj.cities[Math.floor(Math.random() * (citiesLength - 0) + 0)],
        destination:
          obj.cities[Math.floor(Math.random() * (citiesLength - 0) + 0)],
      };
      this.push(JSON.stringify(transformedObject));
    }
    callback();
  },
});

exports.sendEncryptedMessage = async (req, res, next) => {
  try {
    const report = new PassThrough();
    const throttle = new Throttle(10000);

    let total = 0;
    report.on("data", (chunk) => {
      console.log(chunk.toString())
      total += chunk.length;
      console.log("bytes", total);
    });
    createReadStream(filename)
      .pipe(pushTransformedObject)
      .pipe(throttle)
      .pipe(report)
      .pipe(res)
      .on("error", console.error);
  } catch (error) {
    next(error);
  }
};
