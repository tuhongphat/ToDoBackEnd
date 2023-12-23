const register = require('./register');
const login = require('./login');
const forgotPassword = require('./forgotPassword');
const update = require('./update');
const deleteUser = require('./delete');
const info = require('./info');
const search = require('./search');

const userController = {register, login, forgotPassword, update, delete: deleteUser, info, search};
module.exports = userController;
