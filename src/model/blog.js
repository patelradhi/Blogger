//....................import mongoose................/

const mongoose = require('mongoose');

//......................create Schema............................../

const blogSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
		},
		content: {
			type: String,
			required: true,
		},
		author: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'user',
			required: true,
		},
		category: {
			type: String,
		},
	},
	{
		versionKey: false,
		timestamps: true,
	}
);

//..................export schema......................................./

module.exports = mongoose.model('Blog', blogSchema);
