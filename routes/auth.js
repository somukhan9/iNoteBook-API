const router = require('express').Router()
const authenticateUser = require('../middlewares/auth')
const { register, login, getUser } = require('../controllers/auth')

router.post('/register', register)
router.post('/login', login)
router.get('/get-user', authenticateUser, getUser)

module.exports = router
