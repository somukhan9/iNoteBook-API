const { StatusCodes } = require('http-status-codes')
const User = require('../models/User')

const register = async (req, res) => {
  try {
    const user = await User.create(req.body)
    const payload = {
      userID: user._id,
      name: user.name,
    }
    const token = user.generateToken(payload)
    res
      .status(StatusCodes.CREATED)
      .json({ msg: 'User created successfully', token })
  } catch (error) {
    console.error(error)
    if (error.name === 'ValidationError') {
      const errorMsg = Object.values(error.errors)
        .map((item) => item.message)
        .join(', ')
      return res.status(StatusCodes.BAD_REQUEST).json({ msg: errorMsg })
    }

    if (error.code && error.code === 11000) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: 'This email has already taken' })
    }

    // res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error })
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: 'Internal Server Error' })
  }
}

const login = async (req, res) => {
  const { email, password } = req.body
  try {
    const user = await User.findOne({ email })

    if (!user) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: 'Invalid credentials' })
    }

    const comparePassword = await user.comparePassword(password)
    if (!comparePassword) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: 'Invalid credentials' })
    }

    const payload = {
      userID: user._id,
      name: user.name,
    }

    const token = user.generateToken(payload)
    res
      .status(StatusCodes.OK)
      .json({ msg: 'User logged in successfully', token })
  } catch (error) {
    console.error(error)
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: 'Internal Server Error' })
  }
}

const getUser = async (req, res) => {
  const { userID } = req
  try {
    const user = await User.findOne({ _id: userID }).select('-password -__v')
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({ msg: 'User not found' })
    }

    res.status(StatusCodes.OK).json({ user })
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: 'Internal Server Error' })
  }
}

module.exports = {
  register,
  login,
  getUser,
}
