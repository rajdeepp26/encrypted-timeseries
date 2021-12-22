const { Transform } = require("stream");
const crypto = require("crypto");
const NUMBER_OF_OBJECTS = 10;

exports.decryptObject = async (encryptedData) => {
  try {
    // const iv = crypto.randomBytes(16).toString("hex").slice(0, 16);
    const iv = process.env.IV;
    const key = process.env.SECRET_KEY;
    const decrypter = crypto.createDecipheriv("aes-256-ctr", key, iv);

    let decryptedData = decrypter.update(encryptedData, "hex", "utf-8");
    // console.log("-----", decryptedData);
    return decryptedData;
  } catch (err) {
    throw Error("Error while adding decrypting object");
  }
};

exports.validateObject = async (decryptedData) => {
  try {
    let receivedObject = JSON.parse(decryptedData);

    const testData = {
      name: receivedObject.name,
      origin: receivedObject.origin,
      destination: receivedObject.destination,
    };

    const hash = crypto.createHash("sha256");
    hash.update(JSON.stringify(testData));
    let testHashedValue = hash.digest("hex");
    if (testHashedValue == receivedObject.secret_key) {
      return JSON.stringify(testData);
    } else {
      return null;
    }
  } catch (err) {
    return null;
    // throw Error("Error while validating object");
  }
};
