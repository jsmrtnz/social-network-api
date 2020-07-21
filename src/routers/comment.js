const express = require('express')
const commentCtrl = require('../controllers/comment')
const auth = require('../controllers/auth')

const router = new express.Router()
router.post('/comments', auth, commentCtrl.createComment)
router.get('/comments', auth, commentCtrl.getComments)
router.patch('/comments', auth, commentCtrl.updateComment)
router.delete('/comments', auth, commentCtrl.deleteComment)

module.exports = router
