const mongoose = require('mongoose');

var Job = new mongoose.Schema({
    deadline: {type: Date, require: true},
    content: {type: String, require: true},
    author: {type: mongoose.SchemaTypes.ObjectId, ref: 'Users'},
    execute_by: [{type: mongoose.SchemaTypes.ObjectId, ref: 'Users'}],
    complete_at: Date,
    status: [{type: String, enum: ['create', 'late', 'completed', 'delay']}],
});
module.exports = mongoose.model('Jobs', Job);
