const getAll = require('./getAll');
const getOne = require('./getOne');
const create = require('./create');
const update = require('./update');
const deleteJob = require('./delete');

const userController = {getAll, getOne, create, update, delete: deleteJob};
module.exports = userController;
