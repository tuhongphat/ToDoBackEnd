const {rejects} = require('assert');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const nodemailer = require('nodemailer');
const OAuth2Client = require('google-auth-library').OAuth2Client;

const secret = process.env.SECRET;

function generateToken(user) {
    let params = {id: user._id};
    return jwt.sign(params, secret, {expiresIn: '160d'});
}
function generatePassword(user, password) {
    user.salt = crypto.randomBytes(16).toString('hex');
    user.hash = crypto.pbkdf2Sync(password, user.salt, 1000, 512, 'sha512').toString('hex');
    user.password = password;
}
function jwtVerify(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secret, (err, params) => {
            if (err) {
                reject(err);
            } else resolve(params);
        });
    });
}
async function sendVerify(user, mode, email) {
    let verify = crypto.randomBytes(6).toString('hex');
    let hash = crypto.pbkdf2Sync(verify, user.salt, 1000, 512, 'sha512').toString('hex');
    let params = {hash, mode};
    user.verify_token = jwt.sign(params, secret, {expiresIn: '30m'});
    sendEmail(email, `ToDo App: ${mode}`, verify);
}
function isPassword(user, password, salt) {
    return user.hash === crypto.pbkdf2Sync(password, salt || user.salt, 1000, 512, 'sha512').toString('hex');
}
async function sendEmail(to, subject, message) {
    // return `sent to ${to}. content: ${subject}: ${message}`;

    const email = {
        address: process.env.EMAIL_ADDRESS,
        refreshToken: process.env.REFRESH_TOKEN,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
    };

    var myOAuth2Client = new OAuth2Client(email.clientId, email.clientSecret);
    myOAuth2Client.setCredentials({
        refresh_token: email.refreshToken,
    });

    const myAccessTokenObject = await myOAuth2Client.getAccessToken();
    const myAccessToken = myAccessTokenObject?.token;
    const transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: email.address,
            clientId: email.clientId,
            clientSecret: email.clientSecret,
            refresh_token: email.refreshToken,
            accessToken: myAccessToken,
        },
    });
    const mailOptions = {
        to: 'tuhongphathpt@gmail.com', // Gửi đến ai?
        subject, // Tiêu đề email
        html: `<h3>${to}: ${subject}: ${message}</h3>`, // Nội dung email
    };
    return await transport.sendMail(mailOptions);
    // .then(() => res.status(200).json({message: `Email sent to ${to} successfully.`}))
    // .catch((err) => res.status(401).json({err}));
}

module.exports = {generateToken, generatePassword, isPassword, sendEmail, sendVerify, secret, jwtVerify};
