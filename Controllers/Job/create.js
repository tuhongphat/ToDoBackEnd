const Job = require('../../Models/Job');
const Notification = require('../../Models/Notification');

async function create(req, res, next) {
    const {deadline, content, execute_by} = req.body;

    var job = new Job();
    job.deadline = new Date(deadline);
    job.content = content;
    job.create_by = req.user._id;
    job.execute_by = execute_by || [req.user._id];
    job.status = ['status'];
    try {
        return await job
            .save()
            .then(() => res.status(200).json({msg: 'Create job successfully'}))
            .catch((err) => res.status(401).json({err}));
    } catch (err) {
        console.log(err);
        return res.status(501).json({err});
    }
}
module.exports = create;
