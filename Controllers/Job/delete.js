const Job = require('../../Models/Job');
const User = require('../../Models/User');
const Notification = require('../../Models/Notification');

async function deleteJob(req, res, next) {
    try {
        return await Job.findByIdAndDelete(req.job._id)
            .then(() => res.status(200).json({msg: 'Delete job successfully'}))
            .catch((err) => res.status(401).json({err}));
    } catch (err) {
        console.log(err);
        return res.status(501).json({err});
    }
}
module.exports = deleteJob;
