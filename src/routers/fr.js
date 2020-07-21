const express = require('express')
const frCtrl = require('../controllers/fr')
const auth = require('../controllers/auth')

const router = new express.Router()
router.post('/fr', auth, frCtrl.sendFriendReq)
router.get('/fr', auth, frCtrl.frReceived)
router.delete('/fr', auth, frCtrl.acceptDecline)

module.exports = router