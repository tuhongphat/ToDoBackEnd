const Job = require('../../Models/Job');
const User = require('../../Models/User');
const Notification = require('../../Models/Notification');

async function update(req, res, next) {
    const {deadline, content, execute_by} = req.body;
    req.job.deadline = deadline;
    req.job.content = content;
    req.job.execute_by = execute_by;
    try {
        return await req.job
            .save()
            .then(() => res.status(200).json({msg: 'Update job successfully'}))
            .catch((err) => res.status(401).json({err}));
    } catch (err) {
        console.log(err);
        return res.status(501).json({err});
    }
}
module.exports = update;
