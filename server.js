const app = require("./app");
const mongoose = require("mongoose");
const PORT = process.env.PORT || 5000;

const DB = process.env.DATABASE;
// mongoose
//   .connect(DB, {
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useFindAndModify: false,
//   })
//   .then((con) => {
//     console.log("Connection has been established successfully.");
//   })
//   .catch((err) => {
//     console.log("Connect failed to establish", err);
//   });

app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});

module.exports = app;