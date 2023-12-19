//.....................import mongoose................................/

const mongoose = require('mongoose');

//.........................create Schema............................../

const userSchema = new mongoose.Schema(
	{
		userName: {
			type: String,
			required: true,
			unique: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		role: {
			type: String,
			enum: ['user', 'admin'],
			default: 'user',
		},
		isActivated: {
			type: Boolean,
			default: true,
		},
	},
	{
		versionKey: false,
		timestamps: true,
	}
);

//.........................export Schema............................../

module.exports = mongoose.model('User', userSchema);
