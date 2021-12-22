const createError = require("http-errors");
const { createReadStream } = require("fs");
const { PassThrough } = require("stream");

const emitterService = require("../services/emitterService") 
const filename = "./data.json";
const Throttle = require('../helper/throttle');

exports.sendEncryptedMessage = async (req, res, next) => {
  try {
    const simplePass = new PassThrough();
    // const TIME_INTERVAL = 10000;
    const TIME_INTERVAL = 10;
    const throttle = new Throttle(TIME_INTERVAL);

    let total = 0;
    simplePass.on("data", (chunk) => {
      total += chunk.length;
      console.log("bytes", total);
    });
    createReadStream(filename)
      .pipe(emitterService.pushTransformedObject)
      .pipe(throttle)
      .pipe(emitterService.addHashToObject)
      .pipe(emitterService.encryptObject)
      .pipe(simplePass)
      .pipe(res)
      .on("error", console.error);
  } catch (error) {
    next(error);
  }
};
