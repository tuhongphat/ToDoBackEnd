const User = require('../../Models/User');
const {generateToken, generatePassword, isPassword, sendEmail} = require('./function');
async function search(req, res, next) {
    const {name} = req.body;
    try {
        //username hoặc email tồn tại hay không
        let user = User.find({$or: [{username}, {email}]});

        if (user) {
            return res.status(200).json(user);
        }
        return res.status(200).json({msg: 'Không tồn tại'});
    } catch (err) {
        console.log(err);
        return res.status(501).json({err});
    }
}
module.exports = search;
