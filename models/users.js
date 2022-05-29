const mongoose = require('mongoose');

// creating Schema for Tasks
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    exercises:{
        type : Array
    }
    // phone: {
    //     type: String,
    //     required: true
    // },
    // status: {
    //     type: String,
    //     default: "pending"
    // },
});


const User = mongoose.model('Users', userSchema);

// exporting the Schema
module.exports = User;