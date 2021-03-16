const nodeEnv = process.env.NODE_ENV;

if (nodeEnv == "testing") {
	require("dotenv").config({ path: `./.env.${process.env.NODE_ENV}` });
} else {
	require("dotenv/config");
}

const express = require("express");
const helmet = require("helmet");
const cors = require("cors");

const app = express();
const PORT = process.env.APP_PORT || 3000;

const mongodb = require("./src/configs/mongodb");
const apiRoute = require("./src/routes/api");
const logger = require("./src/configs/logger");
const errorHandler = require("./src/middlewares/errorHandler");
const Errors = require("./src/utils/errors");

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use("/api", apiRoute);

app.use((req, res, next) => {
	next(Errors.notFound("Not Found"));
});

app.use(errorHandler);

app.listen(PORT, () => {
	logger.info({ message: `Server running on port ${PORT}` });
});

module.exports = app;
