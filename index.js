const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');
const app = express();
const cookieParser = require('cookie-parser');
const db = require('./Config').connect();
app.use(cors());
app.use(cookieParser());
app.use(express.json());

const userRoute = require('./Routers/user');
const jobRoute = require('./Routers/job');

app.use('/api/v1/user', userRoute);
app.use('/api/v1/job', jobRoute);

app.listen(8000, () => {
    console.log('Server is running 8000');
});
