const User = require('../../Models/User');
const {generateToken, generatePassword, isPassword} = require('./function');
async function register(req, res, next) {
    const {username, password, email, name} = req.body;
    try {
        //Xem username hoặc email đã tồn tại chưa
        const userInvalid = await User.findOne({$or: [{username}, {email}]});
        if (userInvalid) return res.status(401).json({err: 'username hoặc email đã tồn tại'});

        //Tạo user mới
        let user = new User();

        //Tạo hash, salt lưu thông tin password
        generatePassword(user, password);
        user.name = name;
        user.email = email;

        //Lưu vào DB, Trả về token đăng nhập cho client
        return user
            .save()
            .then(() => res.status(200).json({token: generateToken(user)}))
            .catch(() => res.status(401).json({err: 'Error when save'}));
    } catch (err) {
        console.log(err);
        return res.status(501).json({err});
    }
}
module.exports = register;
