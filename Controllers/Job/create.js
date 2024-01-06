const Job = require('../../Models/Job');
const User = require('../../Models/User');
const Notification = require('../../Models/Notification');

async function create(req, res, next) {
    const {deadline, content, execute_by} = req.body;

    var job = new Job();
    job.deadline = new Date(deadline);
    job.content = content;
    job.author = req.user.id;
    job.execute_by = execute_by || [req.user.id];
    job.status = ['create'];
    try {
        let saveJob = await job.save().catch((err) => {
            return {err};
        });
        if (execute_by) {
            const user = User.findById(req.user.id);
            var notification = new Notification();
            notification.to = execute_by;
            notification.content = `${user.name} đã giao việc cho bạn`;
            var saveNotification = await notification.save().catch((err) => {
                return {err};
            });
        }
        if (saveJob.err || saveNotification?.err) return res.status(401).json({err: 'Can not create job'});
        // console.log({emit: 'emit'});
        // io.emit('add-job', 123);
        return res.status(200).json({msg: 'Create job successfully'});
    } catch (err) {
        console.log(err);
        return res.status(501).json({err});
    }
}
module.exports = create;
