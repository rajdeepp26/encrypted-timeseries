const createError = require("http-errors");
const { PassThrough, Duplex } = require("stream");
const fs = require("fs");
const multiparty = require("multiparty");

const listenerService = require("../services/listenerService");
const form = "./public/views/form.html";

exports.readEncryptedMessage = async (req, res, next) => {
  try {
    res.writeHead(200, {
      "Content-Type": "text/plain",
    });
    let encryptedData = "";
    let form = new multiparty.Form();
    form.on("part", (part) => {
      part.on("data", (chunk) => {
        encryptedData += chunk.toString();
      });
      part.on("end", async () => {
        try {
          if (encryptedData.length == 0)
            res.end("error: No data found in stream");
          const encryptedDataArray = encryptedData.split("|");
          let completeDecryptedData = "";

          completeDecryptedData +=
            await listenerService.getcompleteDecryptedData(
              encryptedDataArray,
              completeDecryptedData
            );
          res.end(completeDecryptedData);
        } catch (err) {
          res.statusCode = 400;
          return res.end(`error-: ${err.message}`);
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
