const User = require('../../Models/User');
const {generateToken, generatePassword, isPassword} = require('./function');

async function login(req, res, next) {
    const {username, password, email} = req.body;
    try {
        //Kiểm tra username hoặc email đã tồn tại chưa
        let user = User.findOne({$or: [{username}, {email}]});

        //Kiểm tra đúng password chưa
        if (user && isPassword(user, password)) {
            //Trả về token đăng nhập cho client
            return res.status(200).json({token: generateToken(user)});
        }
        return res.status(401).json({err: 'username, email or password is incorrect'});
    } catch (err) {
        console.log(err);
        return res.status(501).json({err});
    }
}
module.exports = login;
