const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
async function connect() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/ToDo', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            //useCreateIndex: true,
            //useFindAndModify: false
        });

        console.log('Connected to MongoDB');
    } catch (err) {
        console.log(err);
    }
}
module.exports = {connect};
