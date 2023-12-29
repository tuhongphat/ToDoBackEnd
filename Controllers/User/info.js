const User = require('../../Models/User');
async function info(req, res, next) {
    try {
        //username hoặc email tồn tại hay không
        let user = await User.findById(req.id);

        if (user) {
            return res.status(200).json({user});
        }
        return res.status(200).json({msg: 'Không tồn tại'});
    } catch (err) {
        console.log(err);
        return res.status(501).json({err});
    }
}
module.exports = info;
