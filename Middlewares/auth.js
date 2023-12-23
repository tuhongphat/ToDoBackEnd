const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const secret = process.env.JWT_SECRET;
function getTokenFromHeader(req) {
    if (
        (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Token') ||
        (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer')
    ) {
        return req.headers.authorization.split(' ')[1];
    }
    return null;
}

const auth = {
    required: async function (req, res, next) {
        jwt.verify(getTokenFromHeader(req), secret, (err, user) => {
            if (err) {
                return res.status(403).json({message: 'Failed to authentication with token.'});
            }
            req.user = user;
            next();
        });
    },
    isSinger: async function (req, res, next) {
        jwt.verify(getTokenFromHeader(req), secret, (err, user) => {
            if (err) {
                return res.status(403).json({message: 'Failed to authentication with token.'});
            }
            req.user = user;
        });
        if (req.user.type != 'singer') return res.status(403).json({message: 'You are not a singer'});
        next();
    },
    isAuthor: async function (req, res, next) {
        jwt.verify(getTokenFromHeader(req), secret, (err, user) => {
            if (err) {
                return res.status(403).json({message: 'Failed to authentication with token.'});
            }
            req.user = user;
        });
        console.log(req.user.id, req.author);
        if (req.user.id != req.author) return res.status(403).json({message: 'You are not author'});
        next();
    },
};

module.exports = auth;
