const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const postRouter = require('./routers/post')
const commentRouter = require('./routers/comment')
const frRouter = require('./routers/fr')

const app = express()
const port = process.env.PORT

app.use(express.json())
app.use(userRouter)
app.use(postRouter)
app.use(commentRouter)
app.use(frRouter)

app.listen(port, () => {
    console.log(`Server is up on port ${port}`)
})