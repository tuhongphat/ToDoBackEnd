const express = require('express');
const cors = require('cors');
const app = express();
const cookieParser = require('cookie-parser');

app.use(cors());
app.use(cookieParser());
app.use(express.json());

const userRoute = require('./Routers/user');

app.use('/api/v1/user', userRoute);

app.listen(8000, () => {
    console.log('Server is running 8000');
});
