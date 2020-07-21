const express = require('express')
const userCtrl = require('../controllers/user')
const auth = require('../controllers/auth')
const uploadCtrl = require('../controllers/upload')

const router = new express.Router()
router.post('/signup', userCtrl.signUp)
router.post('/login', userCtrl.logIn)
router.post('/logout', auth, userCtrl.logout)
router.post('/logoutall', auth, userCtrl.logoutAll)
router.get('/profile', auth, userCtrl.getProfile)
router.patch('/profile', auth, userCtrl.updateProfile)
router.delete('/profile', auth, userCtrl.deleteProfile)
router.post('/profile/avatar', auth, uploadCtrl.single('avatar'), userCtrl.uploadAvatar, userCtrl.uploadFailed)
router.delete('/profile/avatar', auth, userCtrl.deleteAvatar)

module.exports = router