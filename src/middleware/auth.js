//
const jwt = require('jsonwebtoken');
require('dotenv').config();

//...........................authantication .............................................../

exports.auth = async (req, res, next) => {
	try {
		// destructured token from req.cookie

		const { token } = req.cookies;

		//validation

		if (!token) {
			return res.json({
				success: false,
				message: 'Please login, missing token',
			});
		}

		try {
			const decode = await jwt.decode(token, process.env.JWT_SECRET_KEY);
			console.log(decode);
			req.user = decode;
		} catch (error) {
			console.log(error);
			res.json({
				message: 'Found some error while decode token',
			});
		}

		next();
	} catch (error) {
		console.log(error);
		res.json({
			success: false,
			message: 'Found some error while  validating token',
		});
	}
};

//..................................... isUser - authorization............................................./

exports.isUser = async (req, res, next) => {
	try {
		if (req.user.role !== 'user') {
			return res.json({
				success: false,
				message: 'You can not access this resource',
			});
		}
		next();
	} catch (error) {
		console.log(error);
		res.json({
			success: false,
			message: 'Found some error while  check role of user',
		});
	}
};

//.................................isAdmin authorization ......................................../

exports.isAdmin = async (req, res, next) => {
	try {
		if (req.user.role !== 'admin') {
			return res.json({
				success: false,
				message: 'You can not access this resource',
			});
		}
		next();
	} catch (error) {
		console.log(error);
		res.json({
			success: false,
			message: 'Found some error while  check role of user',
		});
	}
};
