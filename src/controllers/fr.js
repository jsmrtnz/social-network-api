const Fr = require('../models/fr')
const User = require('../models/user')

exports.sendFriendReq = async (req, res) => {
  try {
    let request = {}
    const user = await User.findById(req.query.id)
    if (!user) {
      throw new Error()
    }
    request = await Fr.findOne({ from: req.user._id, to: user._id })
    if(request) {
      request.remove()
      res.status(202).send()
    } else {
      request = new Fr({
        from: req.user._id,
        to: user._id
      })
      await request.save()
      res.status(201).send(request)
    }
  } catch (e) {
    res.status(500).send(e)
  }
}

exports.acceptDecline = async (req, res) => {
  try {
    const request = await Fr.findById(req.query.id)
    if (!request || !req.query.v) {
      throw new Error()
    }
    if (req.query.v === 'accepted') {
      const from = await User.findById(request.from)
      const to = await User.findById(request.to)
      // User sending a request, can not accept the same request.
      if (from.equals(req.user)) {
        return res.status(400).send()
      }
      from.friends.push(to)
      to.friends.push(from)
      await from.save()
      await to.save()
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