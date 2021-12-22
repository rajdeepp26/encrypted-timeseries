const { Transform } = require("stream");
const crypto = require("crypto");
const NUMBER_OF_OBJECTS = 10;

exports.pushTransformedObject = new Transform({
  transform(chunk, encoding, callback) {
    let obj = JSON.parse(chunk);
    let namesLength = obj.names.length;
    let citiesLength = obj.cities.length;

    for (let i = 0; i < NUMBER_OF_OBJECTS; i++) {
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

exports.addHashToObject = new Transform({
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

exports.encryptObject = new Transform({
  transform(chunk, encoding, callback) {
    // console.log(JSON.parse(chunk))
    // console.log("chunk",chunk)

    // const iv = crypto.randomBytes(16).toString("hex").slice(0, 16);
    const iv = process.env.IV

    console.log("iv",iv);
    const message = chunk;
    const key = process.env.SECRET_KEY;

    const encrypter = crypto.createCipheriv("aes-256-ctr", key, iv);
    let encryptedObject = encrypter.update(message, "utf8", "hex");
    this.push(encryptedObject + "|");
    callback();
  },
});
