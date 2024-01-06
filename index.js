const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');
const app = express();
// const http = require('http').createServer(app);
const cookieParser = require('cookie-parser');
const db = require('./Config').connect();

// const {Server} = require('socket.io');
// const io = new Server(http);

// io.emit('add-job', 123);

app.use(cors());
app.use(cookieParser());
app.use(express.json());

const userRoute = require('./Routers/user');
const jobRoute = require('./Routers/job');
// app.all('/', function (req, res, next) {
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Control-Allow-Headers', 'X-Requested-With');
//     next();
// });
app.use('/api/v1/user', userRoute);
app.use('/api/v1/job', jobRoute);
app.listen(8000, () => {
    console.log('Server is running 8000');
});
