const express = require('express')
const userCtrl = require('../controllers/user')
const auth = require('../controllers/auth')
const uploadCtrl = require('../controllers/upload')

const router = new express.Router()
router.post('/signup', userCtrl.signUp)
router.post('/login', userCtrl.logIn)
router.post('/logout', auth, userCtrl.logout)
router.post('/logoutall', auth, userCtrl.logoutAll)
// validate cookie with token
router.get('/validate_cookie', auth, userCtrl.validateCookie)
router.get('/user', auth, userCtrl.getUser)
router.get('/users', auth, userCtrl.getUsers)
router.get('/user/meta', auth, userCtrl.getUserMeta)
router.get('/profile', auth, userCtrl.getProfile)
router.patch('/profile', auth, userCtrl.updateProfile)
router.delete('/profile', auth, userCtrl.deleteProfile)
router.delete('/friend', auth, userCtrl.deleteFriend)
router.post('/avatar', auth, uploadCtrl.single('avatar'), userCtrl.uploadAvatar, userCtrl.uploadFailed)
router.delete('/avatar', auth, userCtrl.deleteAvatar)

module.exports = router