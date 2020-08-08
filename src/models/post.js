const mongoose = require('mongoose')
const Comment = require('./comment')

const postSchema = new mongoose.Schema({
    content: {
        type: String,
        // required: [true, 'Try writing something!'],
        maxlength: 250,
        trim: true
    },
    image: {
        type: Buffer,
        required: [function () {
            return this.content === ''
        }, 'Try creating some content!']
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }],
    n_comments: { // number of comments in this post
        type: Number,
        defaul: 0
    }
},{
    timestamps: true
})

postSchema.virtual('comments', {
    ref: 'Comment',
    localField: '_id',
    foreignField: '_idPost'
})

// Delete users comments when a post is removed
postSchema.pre('remove', async function (next) {
    await Comment.deleteMany({ _idPost: this._id })
    next()
})

const Post = mongoose.model('Post', postSchema)

module.exports = Post