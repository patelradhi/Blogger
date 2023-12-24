/***************************** importing model ************************************** */

const User = require('../model/user');
const Blog = require('../model/blog');
const jwt = require('jsonwebtoken');
const { hashPassword } = require('../utils');
const bcrypt = require('bcrypt');
require('dotenv').config();

/**************************************  signUp *******************************************/

exports.signUp = async (req, res) => {
	try {
		//destructured field from req.body

		const { userName, email, password, role } = req.body;

		//validation

		if (!userName || !email || !password) {
			res.status(400).json({
				success: false,
				message: 'Full fill all the  details',
			});
		}

		//check user exist or not

		const existUser = await User.findOne({ email });

		if (existUser) {
			res.status(400).json({
				success: false,
				message: 'User allready exist',
			});
		}

		//encrypt password

		const encryptedPassword = await hashPassword(password, 10);

		//entry in db

		const user = await User.create({
			userName,
			email,
			password: encryptedPassword,
			role: role,
		});

		//response

		res.status(200).json({
			success: true,
			message: 'User created successfully',
			data: user,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			success: false,
			message: 'Found some error while creating user',
		});
	}
};

/********************************* login ***********************************************/

exports.logIn = async (req, res) => {
	try {
		//destructured feild from req.body

		const { email, password } = req.body;

		//validation

		if (!email || !password) {
			res.status(400).json({
				success: false,
				message: 'Full fill all details',
			});
		}

		//check user exist or not

		const existUser = await User.findOne({ email, role: 'user' });

		if (!existUser) {
			res.status(400).json({
				success: false,
				message: 'User not exist',
			});
		}

		//compare password

		const ans = await bcrypt.compare(password, existUser.password);

		if (ans) {
			//generate token and sent into cookie

			const payload = {
				email: existUser.email,
				role: existUser.role,
				id: existUser._id,
			};

			const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
				expiresIn: '2h',
			});

			//response

			let Options = {
				expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
				httpOnly: true,
			};

			res.status(200)
				.cookie('token', token, Options)
				.json({
					success: true,
					data: {
						...existUser._doc,
						token,
					},
					message: ' User login successfully',
				});
		} else {
			res.status(400).json({
				success: false,
				message: ' User not login successfully',
			});
		}
	} catch (error) {
		console.log(error);
		res.status(500).json({
			success: false,
			message: 'Found some error while login',
		});
	}
};

/***********************************  creatb log *************************************/

exports.blogCreate = async (req, res) => {
	try {
		//destructured feild from req.body
		const { title, content, category } = req.body;

		//take user objectId from req.user(we added decode token into req.user)

		const userid = req.user.id;

		//validation

		if (!title || !content) {
			res.status(400).json({
				success: false,
				message: 'Full fill all details',
			});
		}

		//entry in db

		const blogcreat = await Blog.create({
			title,
			content,
			category,
			author: userid,
		});

		//response

		res.status(200).json({
			success: true,
			message: 'Blog created succefully',
			data: blogcreat,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			success: false,
			message: 'Found some error while creating blog',
		});
	}
};

/************************************** get all blog *************************************/

exports.getAllBlogs = async (req, res) => {
	try {
		//check blogs are exist or not
		const allBlogs = await Blog.find().sort({ createdAt: -1 });

		//if not found any blogs then return with error message
		if (allBlogs.length < 0) {
			res.status(400).json({
				success: false,
				message: 'There  are no any blogs yet',
			});
		}

		//response

		res.status(200).json({
			success: true,
			blogs: allBlogs,
			message: 'Blog fetched successfully',
		});
	} catch (error) {
		console.log('Error', error);
		res.status(500).json({
			success: false,
			message: 'Found some error while get all blogs',
		});
	}
};

//*************************************  user update his own blog only ******************************************/

exports.updateBlog = async (req, res) => {
	try {
		//destructured feild from req.body

		const { title, content, category } = req.body;

		//destructured feild from req.params

		const { _id } = req.params;

		//take user objectId from req.user(we added decode token into req.user)

		const userId = req.user.id;

		//check blog exist or not

		const blogFind = await Blog.findOne({
			_id: _id,
			author: userId,
		});

		//if blog not found then return with error message

		if (!blogFind) {
			res.status(400).json({
				success: false,
				message: 'you have not any blog',
			});
		}

		//update blogs

		const ans = await Blog.updateOne(
			{ _id, author: userId },
			{
				$set: {
					title: title,
					content: content,
					category: category,
				},
			}
		);

		// If there is no updatation found then this error occured.

		if (ans.modifiedCount == 0) {
			res.status(400).json({
				success: false,
				message: "You can not update other's blog",
			});
		}

		//response

		res.status(200).json({
			success: true,
			message: ' Blog updated successfully',
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			success: false,
			message: 'Found some error in updating blog by admin ',
		});
	}
};

/********************************* user delete his own blog only  *********************************/

exports.deleteBlog = async (req, res) => {
	try {
		//destructured feild from req.params

		const { _id } = req.params;

		//take user objectId from req.user(we added decode token into req.user)

		const userId = req.user.id;

		//check blog exist or not

		const blogFind = await Blog.findOne({
			_id: _id,
			author: userId,
		});

		//if blog not found then return with error message

		if (!blogFind) {
			res.status(400).json({
				success: false,
				message: 'you have not any blog',
			});
		}

		//delete blogs

		const ans = await Blog.deleteOne({ _id, author: userId });

		// If there is no deletion found then this error occured.

		if (ans.deletedCount == 0) {
			res.status(400).json({
				success: false,
				message: "You can not delete other's blog",
			});
		}

		//response

		res.status(200).json({
			success: true,
			message: ' Blog deleted successfully',
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			success: false,
			message: 'Found some error in deleting blog by user ',
		});
	}
};

/********************************** logOut ************************************* */

exports.logout = async (req, res) => {
	try {
		res.status(200).clearCookie('token').json({
			success: true,
			message: 'Logout successfully',
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			success: false,
			message: 'Found some error in logout',
		});
	}
};
