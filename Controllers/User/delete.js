const User = require('../../Models/User');
const {isPassword, jwtVerify, sendVerify} = require('./function');
async function deleteUser(req, res, next) {
    const {verify, password} = req.body;
    try {
        //username hoặc email tồn tại hay không
        let user = await User.findById(req.user.id);

        if (user) {
            if (verify) {
                if (password) {
                    let params = await jwtVerify(user.verify_token);

                    // Kiểm tra verify code, password đúng chưa.
                    if (params.err) return res.status(401).json(params);
                    if (
                        isPassword(params, verify, user.salt) &&
                        params.mode === 'delete user' &&
                        isPassword(user, password)
                    ) {
                        //Đúng thì cập nhật password mới
                        return User.deleteOne({_id: req.user.id})
                            .then(() => res.status(200).json({msg: 'Delete user successfully'}))
                            .catch((err) => res.status(401).json({err}));
                    } else return res.status(401).json({err: 'verify code or password is incorrect'});
                } else return res.status(401).json({err: 'enter your password'});
            } else {
                //Chưa có verify thì gửi verify tới email mới
                await sendVerify(user, 'delete user', user.email);
                // Lưu thay đổi
                return user
                    .save()
                    .then(() => res.status(200).json({msg: 'sent verify code to your email'}))
                    .catch((err) => res.status(401).json({err}));
            }
        }
        return res.status(401).json({err: 'username is invalid'});
    } catch (err) {
        console.log(err);
        return res.status(501).json({err});
    }
}
module.exports = deleteUser;
