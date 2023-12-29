const userController = require('../Controllers/User');
const auth = require('../Middlewares/auth');

const router = require('express').Router();

router.param('id', (req, res, next, id) => {
    req.id = id;
    next();
});

// Register user
router.post('/register', userController.register); //OK

// Login user
router.post('/', userController.login); // OK

// Forgot password
router.post('/forgot-password', auth.required, userController.forgotPassword); //OK

// Update user
router.patch('/', auth.required, userController.update); //OK

// Delete user
router.delete('/', auth.required, userController.delete); //OK

// Get information a user
router.get('/:id', auth.required, userController.info); //OK

// Get multi user
router.get('/search', auth.required, userController.search); // OK

module.exports = router;
