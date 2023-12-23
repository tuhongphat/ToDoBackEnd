const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const User = require('../../Models/User');
const secret = process.env.SECRET;

const {generateToken, generatePassword, isPassword, sendEmail} = require('./function');
async function forgotPassword(req, res, next) {
    const {username, email, verify, newPassword} = req.body;
    try {
        //username hoặc email tồn tại hay không
        let user = User.findOne({$or: [{username}, {email}]});

        if (user) {
            //Nếu có user
            if (verify) {
                //Nếu có verify, so sánh với verify_token
                return jwt.sign(verify, secret, (err, params) => {
                    //Nếu đúng lưu password mới
                    if (user.verify_token === params.hash && params.mode === 'forgot password') {
                        generatePassword(user, newPassword);
                        return user
                            .save()
                            .then(() => res.status(200).json({msg: 'Change password successfully'}))
                            .catch((err) => res.status(401).json({err}));
                    }
                    return res.status(401).json({msg: 'verify code is incorrect'});
                });
            }
            //Nếu chưa có verify tạo và lưu thông tin verify_token vào user
            const verify = crypto.randomBytes(6).toString('hex');
            const hash = crypto.pbkdf2Sync(verify, user.salt, 1000, 512, 'sha512').toString('hex');
            let params = {hash, mode: 'forgot password'};
            user.verify_token = jwt.sign(params, secret, {expiresIn: '2m'});

            await user.save();
            return await sendEmail(user.email, 'ToDo App: Verify Code', verify);

            //verify_token = jwt (hash(verify))
            //Gửi verify code đến email
        }
        return res.status(401).json({err: 'username or email is invalid'});
    } catch (err) {
        console.log(err);
        return res.status(501).json({err});
    }
}
module.exports = forgotPassword;
