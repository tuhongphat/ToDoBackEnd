const Job = require('../../Models/Job');
const User = require('../../Models/User');
const Notification = require('../../Models/Notification');

async function getAll(req, res, next) {
    try {
        return await Job.find({$or: [{create_by: req.user._id}, {execute_by: {$all: [req.user._id]}}]})
            .then((job) => res.status(200).json({job}))
            .catch((err) => res.status(401).json({err}));
    } catch (err) {
        console.log(err);
        return res.status(501).json({err});
    }
}
module.exports = getAll;
