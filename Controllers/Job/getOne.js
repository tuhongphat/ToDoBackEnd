const Job = require('../../Models/Job');
const User = require('../../Models/User');
const Notification = require('../../Models/Notification');

async function getOne(req, res, next) {
    var job = await Job.find({
        $and: [
            {_id: req.job.id},
            {
                $or: [
                    {author: req.user.id},
                    {
                        execute_by: {
                            $elemMatch: {$eq: req.user.id},
                        },
                    },
                ],
            },
        ],
    });
    if (job) return res.status(200).json({job});
    return res.status(404).json({err: 'You can not get this job'});
}
module.exports = getOne;
