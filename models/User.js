const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const UserSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      minlength: [3, 'Name length should be at least 3, got [{VALUE}]'],
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      required: [true, 'Please provide email'],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide  a valid email, got [{VALUE}]',
      ],
    },
    password: {
      type: String,
      trim: true,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password length should be at least 6, got [{VALUE}]'],
    },
  },
  { timestamps: true }
)

UserSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

UserSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password)
}

UserSchema.methods.generateToken = function (payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  })
}

module.exports = mongoose.model('User', UserSchema)
