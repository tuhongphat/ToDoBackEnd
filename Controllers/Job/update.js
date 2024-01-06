const Job = require('../../Models/Job');
const User = require('../../Models/User');
const Notification = require('../../Models/Notification');

async function update(req, res, next) {
    const {deadline, content, execute_by, status} = req.body;
    try {
        return await Job.findOneAndUpdate({_id: req.id}, {$push: {status}, deadline, content})
            .then(() => res.status(200).json({msg: 'Update job successfully'}))
            .catch((err) => res.status(401).json({err}));
    } catch (err) {
        console.log(err);
        return res.status(501).json({err});
    }
}
module.exports = update;
