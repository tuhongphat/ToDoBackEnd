const Job = require('../../Models/Job');
const User = require('../../Models/User');
const Notification = require('../../Models/Notification');

async function getOne(req, res, next) {
    if (req.job.create_by === req.user._id || req.job.execute_by.includes(req.user._id))
        return res.status(200).json({job: req.job});
    return res.status(200).json({err: 'You can not get this job'});
}
module.exports = getOne;
