const Job = require('../../Models/Job');
const User = require('../../Models/User');
const Notification = require('../../Models/Notification');

async function getOne(req, res, next) {
    function toCLient(job) {
        return {
            id: job._id,
            author: job.author?.name,
            content: job.content,
            deadline: job.deadline,
            status: job.status[job.status.length - 1],
        };
    }
    var yourJob = await Job.find({execute_by: {$elemMatch: {$eq: req.user.id}}}).populate('author');
    let tocl = [];
    yourJob.forEach((job) => {
        tocl.unshift(toCLient(job));
    });
    // let youCreate,
    //     youWork = [];
    // yourJob.forEach((job) => {
    //     if (job.author === req.user.id) youCreate.push(job);
    //     else youWork.push(job);
    // });
    return res.status(200).json({yourJob: tocl});
}
module.exports = getOne;
