const { StatusCodes } = require('http-status-codes')
const jwt = require('jsonwebtoken')

const authecticateUser = (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      msg: 'Unauthorized User',
    })
  }

  const token = authHeader.split(' ')[1]
  if (!token) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ msg: 'Token missing' })
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    req.userID = payload.userID
    req.name = payload.name
    next()
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ msg: 'Token expired, login again' })
    }
    if (error.name === 'JsonWebTokenError') {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ msg: 'Invalid token, please try again' })
    }
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: 'Internal Server Error' })
  }
}
module.exports = authecticateUser
