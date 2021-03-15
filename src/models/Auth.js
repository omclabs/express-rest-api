const mongoose = require("mongoose");

const authSchema = new mongoose.Schema({
	user: {
		type: String,
		required: true,
	},
	token: {
		type: String,
		required: true,
	},
	date: {
		type: Date,
		default: Date.now,
	},
});

module.exports = mongoose.model("Auth", authSchema);
