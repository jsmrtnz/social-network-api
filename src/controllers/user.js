const sharp = require('sharp')
const User = require('../models/user')

exports.signUp = async (req, res) => {
  const user = new User(req.body)
  try {
    await user.save()
    const token = await user.generateAuthToken()
    // Use of cookies to store jwt instead of react state.
    res.cookie('token', token, { httpOnly: true })
    res.status(201).send({ user, token })
  } catch (e) {
    res.status(400).send(e)
  }
}

exports.logIn = async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password)
    const token = await user.generateAuthToken()
    // Use of cookies to store jwt instead of react state.
    res.cookie('token', token, { httpOnly: true })
    res.send({ user, token })
  } catch (e) {
    res.status(400).send()
  }
}

exports.logout = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token
    })
    await req.user.save()
    res.send()
  } catch (e) {
    res.status(500).send()
  }
}

exports.logoutAll = async (req, res) => {
  try {
    req.user.tokens = []
    await req.user.save()
    res.send()
  } catch (e) {
    res.status(500).send()
  }
}
// Just added. New!
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById({_id: req.query.id}, {"email" : 0});
    res.send(user);
  } catch (e) {
    res.status(500).send();
  }
}
// Return users who are not user's friends and user itself.
// /users?limit=10&skip=10
exports.getUsers = async (req, res) => {
  try {
    let array = req.user.friends;
    array.push(req.user._id);
    const users = await User.find({ _id: { $nin: array }}, 
      {"firstname" : 1, "lastname": 1, "avatar": 1, "gender": 1}, {
      limit: parseInt(req.query.limit),
      skip: parseInt(req.query.skip),
    });
    res.send(users);
  } catch (e) {
    res.status(500).send();
  }
}
// Return user's friends
exports.getFriends = async (req, res) => {
  try {
    const user = await User.findById({_id: req.query.id});
    const friends = await User.find({ _id: { $in: user.friends }}, 
      {"firstname" : 1, "lastname": 1, "avatar": 1, "gender": 1});
    res.send(friends);
  } catch (e) {
    res.status(500).send();
  }
}
exports.getUserMeta = async (req, res) => {
  try {
    const user = await User.findById({_id: req.query.id}, {"firstname" : 1, "lastname": 1, "avatar": 1, "gender": 1});
    res.send(user);
  } catch (e) {
    res.status(500).send();
  }
}

// Validate cookie containing a token
exports.validateCookie = (req, res) => {
  const response = { user: req.user, token: req.token }
  res.send(response)
}

exports.getProfile = (req, res) => {
  res.send(req.user)
}

exports.updateProfile = async (req, res) => {
  const updates = Object.keys(req.body)
  const allowedUpdates = Object.keys(User.schema.obj)
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' })
  }
  try {
    updates.forEach((update) => req.user[update] = req.body[update])
    await req.user.save()
    res.send(req.user)
  } catch (e) {
    res.status(400).send(e)
  }
}

exports.deleteProfile = async (req, res) => {
  try {
    await req.user.remove()
    res.send(req.user)
  } catch (e) {
    res.status(500).send(e)
  }
}

exports.deleteFriend = async (req, res) => {
  try {
    req.user.friends = req.user.friends.filter((friend) => {
      return friend.toString() !== req.query.id
    })
    const friendDeleted = await User.findById({_id: req.query.id})
    friendDeleted.friends = friendDeleted.friends.filter((friend) => {
      return friend.toString() !== req.user._id.toString()
    })
    await req.user.save()
    await friendDeleted.save()
    res.send()
  } catch (e) {
    res.status(500).send()
  }
}

exports.uploadAvatar = async (req, res) => {
  const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
  req.user.avatar = buffer
  await req.user.save()
  res.send()
}

exports.uploadFailed = (error, req, res, next) => {
  res.status(400).send({ error: error.message })
}

exports.deleteAvatar = async (req, res) => {
  req.user.avatar = undefined
  await req.user.save()
  res.send()
}