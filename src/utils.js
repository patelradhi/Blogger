const bcrypt = require('bcrypt');

//...............function for hashing password..................../

exports.hashPassword = async (password, num) => {
	try {
		let hashPassword = await bcrypt.hash(password, num);
		return hashPassword;
	} catch (error) {
		console.log(error);
		console.log('found some error in hashing password');
	}
};
