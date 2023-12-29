const mongoose = require('mongoose');

var Notification = new mongoose.Schema({
    to: [{type: mongoose.SchemaTypes.ObjectId, ref: 'Users', require: true}],
    content: {type: String, require: true},
});

module.exports = mongoose.model('Notifications', Notification);
