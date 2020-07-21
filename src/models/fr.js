const mongoose = require('mongoose')
const User = require('./user')

const frSchema = new mongoose.Schema({
    from: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    to: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
})

const FR = mongoose.model('FriendRequest', frSchema)

module.exports = FR