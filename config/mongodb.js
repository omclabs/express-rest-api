const mongoose = require("mongoose");
const logger = require("./logger");

let connString = `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}`;
mongoose.connect(
	connString,
	{ useUnifiedTopology: true, useNewUrlParser: true },
	() => {
		logger.info({
			message: `Connected to MongoDB at ${process.env.MONGO_HOST}:${process.env.MONGO_PORT}`,
		});
	}
);

module.export = mongoose;
