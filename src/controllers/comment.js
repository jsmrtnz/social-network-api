const Comment = require('../models/comment')
const Post = require('../models/post')

exports.createComment = async (req, res) => {
    try {
        const post = await Post.findByIdAndUpdate({ _id: req.body.idPost }, { $inc: { n_comments: 1 } })
        if (!post){
            res.status(404).send()
        }
        const comment = new Comment({ 
            content: req.body.content,
            _idPost: req.body.idPost,
            author: req.user._id
        })
        await comment.save()
        res.send(comment)
    } catch (e) {
        res.status(500).send(e)
    }    
}

exports.getComments = async (req, res) => {
    try {
        const post = await Post.findById({ _id: req.body.idPost })
        if (!post){
            res.status(404).send()
        }
        await post.populate({
            path: 'comments',
            options: {
                createdAt: 1
            }
        }).execPopulate()
        res.send(post.comments)
    } catch (e) {
        res.status(500).send(e)
    }    
}

exports.updateComment = async (req, res) => {
    try {
        const comment = await Comment.findOne({ _id: req.body._id, author: req.user._id })
        if (!comment){
            res.status(404).send()
        }
        if (!req.body.content) {
            res.status(400).send('Try deleting the comment instead!')
        }
        comment.content = req.body.content
        await comment.save()
        res.send(comment)
    } catch (e) {
        res.status(500).send(e)
    }
}

exports.deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findOneAndDelete({ _id: req.body._id, author: req.user._id })
        if (!comment) {
            return res.status(404).send()
        }
        res.send(comment)
    } catch (e) {
        res.status(500).send(e)
    }
}