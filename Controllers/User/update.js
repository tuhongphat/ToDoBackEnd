const User = require('../../Models/User');
const {generatePassword, isPassword, sendVerify, jwtVerify} = require('./function');
async function update(req, res, next) {
    const {name, verify, password, newPassword, newEmail} = req.body;
    // let errors
    try {
        //Tìm kiếm username
        let msg;
        let user = await User.findById(req.user.id);
        if (user) {
            //Nếu tồn tại cập nhật chỉnh sửa thông tin chung
            user.name = name;

            //Sửa email
            if (newEmail && !newPassword) {
                //Kiểm tra có verify chưa.
                if (verify) {
                    let params = await jwtVerify(user.verify_token);
                    // Kiểm tra verify code, password đúng chưa.
                    if (params.err) return res.status(401).json(params);
                    if (
                        isPassword(params, verify, user.salt) &&
                        params.mode === 'change email' &&
                        isPassword(user, password)
                    ) {
                        //Đúng thì cập nhật email mới
                        user.email = newEmail;
                        user.verify_token = '';
                        msg = 'Change email successfully';
                    } else return res.status(401).json({msg: 'verify code or password is incorrect'});
                } else {
                    //Chưa có verify thì gửi verify tới email mới
                    await sendVerify(user, 'change email', newEmail);
                    msg = 'sent verify code to your email';
                }
            }
            // Sửa password
            if (newPassword && !newEmail) {
                //Kiểm tra có verify chưa.
                if (verify) {
                    let params = await jwtVerify(user.verify_token);
                    // Kiểm tra verify code đúng chưa.
                    if (params.err) return res.status(401).json(params);
                    if (
                        isPassword(params, verify, user.salt) &&
                        isPassword(user, password) &&
                        params.mode === 'change password'
                    ) {
                        //Đúng thì cập nhật email mới
                        generatePassword(user, newPassword);
                        user.verify_token = '';
                        user.password = newPassword;
                        msg = 'Change password successfully';
                    } else return res.status(401).json({msg: 'verify code or password is incorrect'});
                } else {
                    //Chưa có verify thì gửi verify tới email mới
                    await sendVerify(user, 'change password', user.email);
                    msg = 'sent verify code to your email';
                }
            }
            if (newPassword && newEmail) {
                return res.status(401).json({err: 'Can not update email and password at the same time'});
            }
            // Lưu thay đổi
            return user
                .save()
                .then(() => res.status(200).json({msg}))
                .catch((err) => res.status(401).json({err}));
        } else return res.status(401).json({err: 'username or email is invalid'});
    } catch (err) {
        console.log(err);
        return res.status(501).json({err});
    }
}
module.exports = update;
