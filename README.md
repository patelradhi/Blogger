# Project Overview

Welcome to BLOGGING-SITE, a Node.js application designed to offer a seamless blogging platform for users and administrators alike. It leverages a robust schema catering to both administrative and user roles, coupled with comprehensive functionalities to ensure a rich blogging experience.

# Key Features

## Users Features

-   User Login
-   User Signup
-   User Logout
-   Create Blogs
-   Read All Blogs
-   Update Only His/Her Blog
-   Delete Only His/Her Blog

## Admin Features

-   Admin Login
-   Admin Logout
-   Read All Blogs
-   Update All Blogs by ID
-   Delete All Blogs by ID

# Schema

### Blog-Schema

```js
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
```

### User / Admin-Schema

```js
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
	},
	{
		versionKey: false,
		timestamps: true,
	}
);
```

# Folder Structure

```
project-directory/
│
├── controllers/
│   ├── adminController.js
│   │   - Admin functionalities:
│   │     - Admin login
│   │     - Admin logout
│   │     - View all blogs
│   │     - Delete blogs
│   │     - Update blogs
│   │
│   └── userController.js
│       - User functionalities:
│         - User login
│         - User logout
│         - View all blogs
│         - Delete blogs
│         - Update blogs
│
├── models/
│   ├── User.js
│   │   - Schema for User model
│   │
│   └── Blog.js
│       - Schema for Blog model
│
└── routes/
    ├── adminRoutes.js
    │   - Admin Routes:
    │     - POST /admin/login - Admin login
    │     - GET /admin/logout - Admin logout
    │     - GET /admin/blog - Get all blogs
    │     - PUT /admin/blog/:id - Update a blog
    │     - DELETE /admin/blog/:id - Delete a blog
    │
    └── userRoutes.js
        - User Routes:
          - POST /user/signUp - User signUp
          - POST /user/login - User login
          - GET /user/logout - User logout
          - POST /user/blog - Create a blog
          - GET /user/blog - Get all blogs
          - PUT /user/blog/:id - Update a blog
          - DELETE /user/blog/:id - Delete a blog
```
