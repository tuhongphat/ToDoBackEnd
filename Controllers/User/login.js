const User = require('../../Models/User');
const {generateToken, isPassword} = require('./function');

async function login(req, res, next) {
    console.log('login');
    const {username, password, email} = req.body;
    try {
        //Kiểm tra username hoặc email đã tồn tại chưa
        let user = await User.findOne({$or: [{username}, {email}]});

        //khớp thông tin thì trả về token
        if (user && isPassword(user, password)) return res.status(200).json({token: generateToken(user)});

        //Không khớp thì báo đăng nhập thất bại
        return res.status(201).json({err: 'username, email or password is incorrect'});
    } catch (err) {
        console.log(err);
        return res.status(501).json({err});
    }
}
module.exports = login;
