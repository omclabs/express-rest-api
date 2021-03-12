const nodeEnv = process.env.NODE_ENV;

if (nodeEnv == "testing") {
  require("dotenv").config({ path: `./.env.${process.env.NODE_ENV}` });
} else {
  require("dotenv/config");
}

const PORT = process.env.APP_PORT || 3000;
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const app = express();
const v1Route = require("./src/routes/v1");
const logger = require("./config/logger");
const helpers = require("./src/utils/helpers");
const db = require("./config/mongodb");

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200);
  res.json(helpers.formatReturn("success", 201, {}, "Welcome"));
});

app.use("/api/v1", v1Route);

app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  let helpers = require("./src/utils/helpers");
  let errCode = error.status || 500;

  logger.error({
    message: `[${errCode}] ${req.method} ${req.originalUrl} ${error.message}`,
  });
  res.status(errCode);
  res.json(helpers.formatReturn("error", errCode, {}, error.message));
});

app.listen(PORT, () => {
  logger.info({ message: `Server running on port ${PORT}` });
});

module.exports = app;
