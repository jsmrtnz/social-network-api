const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
        trim: true
    },
    lastname: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid!')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        trim: true,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error('Password cannot contain "password"')
            }
        }
    },
    birthday: {
        type: Date,
        required: true
    },
    gender: {
        type: String,
        required: true,
        enum: ['female', 'male', 'other']
    },
    avatar: {
        type: Buffer
    },
    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }],
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]            
})

userSchema.virtual('posts', {
    ref: 'Post',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.virtual('comments', {
    ref: 'Comment',
    localField: '_id',
    foreignField: 'author'
})

userSchema.virtual('friendRequests', {
    ref: 'FriendRequest',
    localField: '_id',
    foreignField: 'to'
})

// userSchema.methods.toJSON = function () {
//     const userObject = this.toObject()
//     delete userObject.password
//     delete userObject.tokens
//     return userObject
// }

userSchema.methods.generateAuthToken = async function () {
    const token = jwt.sign({ _id: this._id.toString() }, process.env.JWT_SECRET) // , { expiresIn: '30 minutes' }
    this.tokens = this.tokens.concat({ token })
    await this.save()
    return token
}

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })
    if (!user) {
        throw new Error('Unable to login!')
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch){
        throw new Error('Unable to login')
    }
    return user
}

userSchema.pre('save', async function (next) {    
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 8)
    }
    this.firstname = this.firstname.trim()[0].toUpperCase() + this.firstname.slice(1).toLowerCase();
    this.lastname = this.lastname.trim()[0].toUpperCase() + this.lastname.slice(1).toLowerCase();
    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User