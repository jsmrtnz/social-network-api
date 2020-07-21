const express = require('express')
const postCtrl = require('../controllers/post')
const auth = require('../controllers/auth')
const uploadCtrl = require('../controllers/upload')

const router = new express.Router()
router.post('/posts', auth, uploadCtrl.single('post'), postCtrl.createPost, postCtrl.uploadFailed)
router.get('/posts', auth, postCtrl.getPosts)
router.get('/timeline', auth, postCtrl.viewTimeline)
router.post('/posts/like', auth, postCtrl.likePost)
router.patch('/posts', auth, uploadCtrl.single('post'), postCtrl.updatePost, postCtrl.uploadFailed)
router.delete('/posts', auth, postCtrl.deletePost)

module.exports = router