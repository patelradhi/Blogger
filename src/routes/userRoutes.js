//***{*******import express*****************/

const express = require('express');
const router = express.Router();

//************** importing controllers ***************/

const {
	signUp,
	logIn,
	blogCreate,
	getAllBlogs,
	updateBlog,
	logout,
	deleteBlog,
} = require('../controllers/userController');
const { isUser, auth } = require('../middleware/auth');

//.....................Handling HTTP request for creating user (Post API).................//

router.post('/user/signUp', signUp);

//.....................Handling HTTP request for login user (Post API).................//

router.post('/user/logIn', logIn);

//.....................Handling HTTP request for logout user(get API).................//

router.get('/user/logout', auth, isUser, logout);

//.....................Handling HTTP request for creating blog(Post API).................//

router.post('/user/blog', auth, isUser, blogCreate);

//.....................Handling HTTP request for getting blog (get API).................//

router.get('/user/blog', auth, isUser, getAllBlogs);

//.....................Handling HTTP request for updating  blog by path params(put API).................//

router.put('/user/blog/:_id', auth, isUser, updateBlog);

//.....................Handling HTTP request for deleting blog by path params(delete API).................//

router.delete('/user/blog/:_id', auth, isUser, deleteBlog);

//***********************Making router public*********************//

module.exports = router;
