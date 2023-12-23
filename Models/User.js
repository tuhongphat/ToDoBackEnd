const mongoose = require('mongoose');

var User = new mongoose.Schema(
    {
        name: {type: String, require: true},
        password: {type: String, min: 8},
        hash: String,
        salt: String,
        verify_token: String,
        email: {type: String},
        username: {
            unique: [true, 'user_name is invalid'],
            type: String,
            lowercase: true,
            required: [true, "can't be blank"],
            match: [/^[a-zA-Z0-9]+$/, 'is invalid'],
            index: true,
            min: 8,
        },
    },
    {timestamps: true},
);

User.methods.info = () => {
    return {name: this.name, email: this.email};
};

module.exports = mongoose.Model('Users', User);
