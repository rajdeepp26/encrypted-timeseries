const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const createError = require("http-errors");

const emitterRouter = require("./routes/emitterRoutes");
const listenerRouter = require("./routes/listenerRoutes");

// middlewares
app.use(cors());
app.use(express.json());

/**
 * If environment is development then only use logger middleware
 */
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

/**
 * Application Routes
 */
app.use("/api/v1/emitter", emitterRouter);
app.use("/api/v1/listener", listenerRouter);


app.use(async (req, res, next) => {
  next(createError.NotFound("This route does not exist"));
});

/**
 * Below middleware is for error handling
 * it will catch any uncaught router error
 */
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});

module.exports = app;
