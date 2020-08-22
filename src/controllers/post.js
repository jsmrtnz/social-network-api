const Post = require('../models/post')
const User = require('../models/user')
const sharp = require('sharp')

exports.createPost = async (req, res) => {
  if (req.file !== undefined) {
    req.body.image = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
  }
  const post = new Post({
    ...req.body,
    owner: req.user._id
  })
  try {
    await post.save()
    res.status(201).send(post)
  } catch (e) {
    res.status(400).send(e)
  }
}

exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.query.id, owner: req.user._id })
    if (!post) {
      return res.status(404).send()
    }
    if (req.file !== undefined) {
      post.image = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
    }
    if (req.body.content) {
      post.content = req.body.content
    }
    await post.save()
    res.send(post)
  } catch (e) {
    res.status(400).send(e)
  }
}

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.query.id, owner: req.user._id })
    if (!post) {
      return res.status(404).send()
    }
    await post.remove()
    res.send(post)
  } catch (e) {
    res.status(500).send(e)
  }
}
// /posts?id=1&sortBy=createdAt:desc
exports.getPosts = async (req, res) => {
  try {
    const user = await User.findById({_id: req.query.id});
    await user.populate({
      path: 'posts',
      options: {
        sort: {
          createdAt: -1
        }
      }
    }).execPopulate()
    res.send(user.posts)
  } catch (e) {
    res.status(500).send()
  }
}

exports.likePost = async (req, res) => {
  try {
    const post = await Post.findById({ _id: req.body._id })
    let likes = post.likes.length
    if (!post) {
      return res.status(404).send()
    }
    // find if the user has already liked this post
    if (post.likes.filter(e => e.equals(req.user._id)).length > 0) {
      return res.status(202).send({ likes })
    }
    likes = post.likes.push(req.user._id)
    await post.save()
    res.status(200).send(post)
  } catch (e) {
    res.status(500).send(e)
  }
}

exports.uploadFailed = (error, req, res, next) => {
  res.status(400).send({ error: error.message })
}

exports.viewTimeline = async (req, res) => {
  try {
    let timeline = []
    // Fill the array with friends posts
    for (let index = 0; index < req.user.friends.length; index++) {
      const user = await User.findById({ _id: req.user.friends[index] })
      timeline = timeline.concat(await getPosts(user))
    }
    // Add user posts to the array
    timeline = timeline.concat(await getPosts(req.user))
    // Sort posts by created at descendently
    timeline = sortPosts(timeline)
    res.send(timeline)
  } catch (e) {
    res.status(500).send(e)
  }
}

const getPosts = async (user) => {
  // let match = {}
  // let lastDay = new Date()
  // lastDay = lastDay.setDate(lastDay.getDate() - 1)
  // match.createdAt = { $gte: new Date(lastDay), $lte: new Date() }
  await user.populate({
    path: 'posts',
    // match,
    options: {
      sort: {
        createdAt: -1
      }
    }
  }).execPopulate()
  return user.posts
}

const sortPosts = (postsArray) => {
  postsArray.sort(function (a, b) {
    let dateA = new Date(a.createdAt),
      dateB = new Date(b.createdAt)
    if (dateA < dateB) return 1
    if (dateA > dateB) return -1
    return 0
  })
  return postsArray
}