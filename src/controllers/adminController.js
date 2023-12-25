//................... importing model ............................/

const User = require('../model/user');
const Blog = require('../model/blog');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

//................................... login ..................................../

exports.logIn = async (req, res) => {
	try {
		//destructured feild from req.body

		const { email, password } = req.body;

		//validation

		if (!email || !password) {
			return res.status(400).json({
				success: false,
				message: 'Full fill all details',
			});
		}

		//check user exist or not

		const existUser = await User.findOne({ email, role: 'admin' });

		if (!existUser) {
			return res.status(400).json({
				success: false,
				message: 'Admin not exist',
			});
		}

		//compare password

		const ans = bcrypt.compare(password, existUser.password);

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
					message: ' Admin login successfully',
				});
		} else {
			return res.status(400).json({
				success: false,
				message: ' Admin not login successfully',
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

//...................................... getting all blog ............................../

exports.getAllBlogs = async (req, res) => {
	try {
		const allBlogs = await Blog.find().sort({ createdAt: -1 });

		if (allBlogs.length < 0) {
			return res.status(400).json({
				success: false,
				message: 'There  are no any blogs yet',
			});
		}

		//response

		res.status(200).json({
			success: true,
			blogs: allBlogs,
		});
	} catch (error) {
		console.log('Error', error);
		res.status(500).json({
			success: false,
			message: 'Found some error while get all blogs',
		});
	}
};

//........................... updatting blog ................................./

exports.updateBlog = async (req, res) => {
	try {
		//destructured feild from req.body

		const { title, content, category } = req.body;

		//destructured feild from req.params

		const { _id } = req.params;

		//check blog exist or not

		const blogFind = await Blog.findOne({
			_id: _id,
		});

		//if blog not found then return with error message

		if (!blogFind) {
			return res.status(400).json({
				success: false,
				message: 'blog is not exist',
			});
		}

		//update blogs

		await Blog.findByIdAndUpdate(_id, {
			$set: {
				title: title,
				content: content,
				category: category,
			},
		});

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

//................................. deletting blog ................................./

exports.deleteBlog = async (req, res) => {
	try {
		//destructured feild from req.params

		const { _id } = req.params;

		//check blog exist or not

		const blogFind = await Blog.findOne({
			_id: _id,
		});

		//if blog not found then return with error message

		if (!blogFind) {
			return res.status(400).json({
				success: false,
				message: 'blog is not exist',
			});
		}

		//delete blogs

		const ans = await Blog.findByIdAndDelete(_id);

		//response

		res.status(200).json({
			success: true,
			message: ' Blog deleted successfully',
			data: ans,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			success: false,
			message: 'Found some error in deleting blog by admin ',
		});
	}
};

//....................................  logout .................................../

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
