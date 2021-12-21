const emitterService = require("../services/emitterService");
const createError = require("http-errors");

const { createReadStream, createWriteStream } = require("fs");
const { PassThrough, Duplex, Transform } = require("stream");
const crypto = require("crypto");

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

const addHashToObject = new Transform({
  transform(chunk, encoding, callback) {
    let obj = JSON.parse(chunk);

    const hash = crypto.createHash("sha256");
    hash.update(chunk);
    let hashedValue = hash.digest("hex");
    obj.secret_key = hashedValue;

    this.push(JSON.stringify(obj));
    callback();
  },
});

const encryptObject = new Transform({
  transform(chunk, encoding, callback) {

    // console.log(JSON.parse(chunk))
    // console.log("chunk",chunk)
    const iv = crypto.randomBytes(16).toString("hex").slice(0, 16);
    // console.log("iv",iv);
    const message = chunk;
    const key = process.env.SECRET_KEY;

    const encrypter = crypto.createCipheriv("aes-256-ctr", key, iv);
    let encryptedObject = encrypter.update(message, "utf8", "hex");
    this.push(encryptedObject+"|");
    callback();
  },
});

exports.sendEncryptedMessage = async (req, res, next) => {
  try {
    const report = new PassThrough();
    const throttle = new Throttle(10000);

    let total = 0;
    report.on("data", (chunk) => {
      total += chunk.length;
      console.log("bytes", total);
    });
    createReadStream(filename)
      .pipe(pushTransformedObject)
      .pipe(throttle)
      .pipe(addHashToObject)
      .pipe(encryptObject)
      .pipe(report)
      .pipe(res)
      .on("error", console.error);
  } catch (error) {
    next(error);
  }
};
