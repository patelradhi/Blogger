//************** import express**********************************/

const express = require('express');
const router = express.Router();

//************************* import controlles****************************/

const { logIn, getAllBlogs, updateBlog, deleteBlog, logout } = require('../controllers/adminController');
const { auth, isAdmin } = require('../middleware/auth');

//.....................Handling HTTP request for login admin (Post API).................//

router.post('/admin/logIn', logIn);

//.....................Handling HTTP request for logout admin (get API).................//

router.get('/admin/logout', auth, isAdmin, logout);

//.....................Handling HTTP request for getting blog (get API).................//

router.get('/admin/blog', auth, isAdmin, getAllBlogs);

//.....................Handling HTTP request for updating blog by path params (put API).................//

router.put('/admin/blog/:_id', auth, isAdmin, updateBlog);

//.....................Handling HTTP request for deleting blog  by path params (delete API).................//

router.delete('/admin/blog/:_id', auth, isAdmin, deleteBlog);

//***********************Making router public********************//

module.exports = router;
