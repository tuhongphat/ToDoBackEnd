const userController = require('../Controllers/User');

const router = require('express').Router;

// Register user
router.post('/register', userController.register);

// Login user
router.post('/', userController.login);

// Forgot password
router.post('/', userController.forgotPassword);

// Update user
router.patch('/', userController.update);

// Delete user
router.delete('/', userController.delete);

// Get information a user
router.get('/:id', userController.info);

// Get multi user
router.get('/search', userController.search);

module.exports = router;
