const FR = require('../models/fr')
const User = require('../models/user')

exports.sendFriendReq = async (req, res) => {
    try {
        const recipient = await User.findById(req.body.recipient)
        if (!recipient) {
            throw new Error()
        }
        const fr = new FR({
            from: req.user._id,
            to: recipient._id
        })
        await fr.save()
        res.send(fr)
    } catch (e) {
        res.status(500).send(e)
    }   
}

exports.acceptDecline = async (req, res) => {
    try {
        const request = await FR.findById(req.query.id)
        if (!request || !req.query.v) {
            throw new Error()
        }
        if (req.query.v === 'accepted') {
            const sender = await User.findById(request.from)
            const recipient = await User.findById(request.to)
            // User sending a request, can not accept the same request.
            if (sender.equals(req.user)) {
                return res.status(400).send()
            }
            sender.friends.push(recipient)
            recipient.friends.push(sender)
            await sender.save()
            await recipient.save()
            await request.remove()
        } else if (req.query.v === 'declined') {
            await request.remove()
        } else {
            return res.status(400).send()
        }
        res.send()
    } catch (e) {
        res.status(500).send(e)
    }
}

exports.frReceived = async (req, res) => {
    try {
        await req.user.populate({
            path: 'friendRequests',
        }).execPopulate()
        res.send(req.user.friendRequests)
    } catch (e) {
        res.status(500).send()
    }
}