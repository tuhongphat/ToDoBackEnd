const router = require('express').Router();

const jobController = require('../Controllers/Job');
const Job = require('../Models/Job');
const auth = require('../Middlewares/auth');

router.param('id', async (req, res, next, id) => {
    req.id = id;
    next();
});
//get all my Jobs
router.get('/', auth.required, jobController.getAll); // OK

//get a Job
router.get('/:id', auth.required, jobController.getOne); // OK

//create
router.post('/', auth.required, jobController.create); //OK

//update
router.patch('/:id', auth.required, jobController.update);

//delete
router.delete('/:id', auth.required, jobController.delete);

module.exports = router;
