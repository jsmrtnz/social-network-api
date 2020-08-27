const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
        maxlength: 250,
        trim: true
    },
    _idPost: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Post'
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
},{
    timestamps: true
})

commentSchema.methods.toJSON = function() {
    const commentObject = this.toObject()
    delete commentObject._idPost
    delete commentObject.__v
    return commentObject
}

const Comment = mongoose.model('Comment', commentSchema)

module.exports = Comment