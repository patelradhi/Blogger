const express = require('express');
const app = express();
require('dotenv').config();
const adminRoute = require('./routes/adminRoutes');
const userRoute = require('./routes/userRoutes');
const connectWithDb = require('./config/dataBase');
const cookieParser = require('cookie-parser');

//.................midelwares to read req.body...................../

app.use(express.json());

//.....................midelwares to read req.cookie................/
app.use(cookieParser());

//.....................port number................................./

const PORT = process.env.PORT || 6900;

//.................mounting......................................../

app.use('/api/v1', adminRoute);
app.use('/api/v1', userRoute);

//............function call......................................../

connectWithDb();

//................server activated................................./

app.listen(PORT, () => {
	console.log(`server started at port number ${PORT}`);
});
