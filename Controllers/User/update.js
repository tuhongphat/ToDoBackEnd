const jwt = require('jsonwebtoken');
const User = require('../../Models/User');
const {generateToken, generatePassword, isPassword, sendEmail, sendVerify} = require('./function');
async function update(req, res, next) {
    const {username, email, name, verify, password, newPassword, newEmail} = req.body;
    // let errors
    try {
        //Tìm kiếm username
        let user = User.findOne({$or: [{username}, {email}]});

        if (user) {
            //Nếu tồn tại cập nhật chỉnh sửa thông tin chung
            user.name = name;

            //Sửa email
            if (newEmail) {
                //Nếu sửa password, email kiểm tra password cũ và verify đúng chưa
                if (verify) {
                    //kiểm tra xem có verify chưa
                    jwt.verify(user.verify_token, secret, (err, params) => {
                        //Nếu password và verify đúng lưu email mới
                        if (isPassword(params, verify) && params.mode === 'change email' && isPassword(user, password))
                            user.email = newEmail;
                        else return res.status(401).json({msg: 'verify code is incorrect'});
                    });
                }
                return await sendVerify(user, 'change email', newEmail);
            }

            // Sửa password
            if (newPassword) {
                //Nếu sửa password, email kiểm tra password cũ và verify đúng chưa
                if (verify) {
                    //kiểm tra xem có verify chưa
                    jwt.verify(user.verify_token, secret, (err, params) => {
                        //Nếu verify đúng lưu password mới
                        if (isPassword(params, verify) && params.mode === 'change password') {
                            generatePassword(user, newPassword);
                        }
                        return res.status(401).json({msg: 'verify code is incorrect'});
                    });
                }
                return await sendVerify(user, 'change password', user.email);
            }

            //Lưu thay đổi
            return user
                .save()
                .then(() => res.status(200).json({msg: 'Change information successfully'}))
                .catch((err) => res.status(401).json({err}));
        }
        return res.status(401).json({err: 'username or email is invalid'});
    } catch (err) {
        console.log(err);
        return res.status(501).json({err});
    }
}
module.exports = update;
