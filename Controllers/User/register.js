const User = require('../../Models/User');
const {generateToken, generatePassword} = require('./function');
async function register(req, res, next) {
    const {username, password, email, name} = req.body;
    try {
        console.log({username, password});
        //Xem username hoặc email đã tồn tại chưa
        // let userInvalid = await User.find({$or: [{username}, {email}]});
        let userInvalid = await User.find({username});
        if (userInvalid.length) {
            console.log(userInvalid);
            return res.status(401).json({err: 'username hoặc email đã tồn tại'});
        }

        //Tạo user mới
        let user = new User();

        //Tạo hash, salt lưu thông tin password
        generatePassword(user, password);
        user.username = username;
        user.name = name;
        user.email = email;

        //Lưu vào DB, Trả về token đăng nhập cho client
        return await user
            .save()
            .then(() => res.status(200).json({token: generateToken(user)}))
            .catch((err) => {
                console.log(err);
                return res.status(401).json({err: 'Error when save'});
            });
    } catch (err) {
        console.log(err);
        return res.status(501).json({err});
    }
}
module.exports = register;
