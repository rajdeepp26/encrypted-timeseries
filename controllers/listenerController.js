const listenerService = require("../services/listenerService");
const createError = require("http-errors");

const { createReadStream, createWriteStream } = require("fs");
const { PassThrough, Duplex } = require("stream");

const fs = require("fs");
const form = "./public/views/form.html";
const multiparty = require("multiparty");

exports.readEncryptedMessage = async (req, res, next) => {
  try {
    res.writeHead(200, {
      "Content-Type": "text/plain",
    });
    let form = new multiparty.Form();
    form.on("part", (part) => {
      part.on("data", (chunk) => {
        console.log("A chunk of data has arrived: ", chunk.toString());
      });
      part.on("end", () => {
        try {
          res.end("saved data")
        } catch (err) {
          res.statusCode = 400;
          return res.end(`error: ${err.message}`);
        }
      });
    });
    form.parse(req);
  } catch (error) {
    next(error);
  }
};

exports.sendFormToGetEncryptedMessage = async (req, res, next) => {
  try {
    res.writeHead(200, {
      "Content-Type": "text/html",
    });
    let formContent = fs.createReadStream(form);
    formContent.pipe(res);
  } catch (error) {
    next(error);
  }
};
