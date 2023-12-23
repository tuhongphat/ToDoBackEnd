const jwt = require('jsonwebtoken');
const User = require('../../Models/User');
const {generateToken, generatePassword, isPassword, sendEmail, sendVerify} = require('./function');
async function deleteUser(req, res, next) {
    const {username, verify, password} = req.body;
    try {
        //Chưa có verify
        //Tìm user tồn tại không
        let user = User.findOne({username});
        if (user) {
            if (verify) {
                //Có verify, kiểm tra verify, password
                jwt.verify(user.verify_token, secret, (err, params) => {
                    //Nếu password và verify đúng lưu email mới
                    if (isPassword(params, verify) && params.mode === 'delete user' && isPassword(user, password))
                        //Đúng thì xóa
                        return User.deleteOne({username})
                            .then(() => res.status(200).json({msg: 'Xóa thành công'}))
                            .catch((err) => res.status(401).json({err}));
                    else return res.status(401).json({msg: 'verify code is incorrect'});
                });
            }
            //Gửi verify đến email
            return await sendVerify(user, 'delete user', user.email);
        }
        return res.status(401).json({err: 'username or email is invalid'});
    } catch (err) {
        console.log(err);
        return res.status(501).json({err});
    }
}
module.exports = deleteUser;
