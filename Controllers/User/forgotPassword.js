const User = require('../../Models/User');

const {generatePassword, isPassword, sendVerify, jwtVerify} = require('./function');
async function forgotPassword(req, res, next) {
    const {username, email, verify, newPassword} = req.body;
    try {
        //username hoặc email tồn tại hay không
        let msg;
        let user = await User.findOne({$or: [{username}, {email}]});
        console.log('forgot-password');
        if (user) {
            //Nếu có user
            if (verify) {
                if (newPassword) {
                    let params = await jwtVerify(user.verify_token);

                    // Kiểm tra verify code, password đúng chưa.
                    if (params.err) return res.status(401).json(params);
                    if (isPassword(params, verify, user.salt) && params.mode === 'forgot password') {
                        //Đúng thì cập nhật password mới
                        generatePassword(user, newPassword);
                        user.verify_token = '';
                        msg = 'Change password successfully';
                    } else return res.status(401).json({err: 'verify code is incorrect'});
                } else return res.status(401).json({err: 'need new password'});
            } else {
                //Chưa có verify thì gửi verify tới email mới
                await sendVerify(user, 'forgot password', user.email);
                msg = 'sent verify code to your email';
            }
            // Lưu thay đổi
            return user
                .save()
                .then(() => res.status(200).json({msg}))
                .catch((err) => res.status(401).json({err}));
        }
        return res.status(401).json({err: 'username or email is invalid'});
    } catch (err) {
        console.log(err);
        return res.status(501).json({err});
    }
}
module.exports = forgotPassword;
