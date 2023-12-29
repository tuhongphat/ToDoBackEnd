const router = require('express').Router();

const jobController = require('../Controllers/Job');
const Job = require('../Models/Job');
const auth = require('../Middlewares/auth');

router.param('id', (req, res, next, id) => {
    Job.findById(id)
        .populate(['create_by', 'execute_by'])
        .then((job) => {
            if (job) {
                req.job = job;
                next();
            }
            return res.status(404).json({err: 'Job not found'});
        });
});
//get all my Jobs
router.get('/', auth.required, jobController.getAll);

//get a Job
router.get('/:id', auth.required, jobController.getOne);

//create
router.post('/', auth.required, jobController.create);

//update
router.patch('/:id', auth.required, jobController.update);

//delete
router.delete('/:id', auth.required, jobController.delete);

module.exports = router;
