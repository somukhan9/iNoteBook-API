require('dotenv').config()
const express = require('express')
const cors = require('cors')
const connectDB = require('./config/database')
const authenticateUser = require('./middlewares/auth')

const app = express()
const PORT = process.env.PORT || 5000

// MiddleWares
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())

// Home Route
app.get('/', (req, res) => {
  res.send('iNoteBook')
})

// AUTH Route
app.use('/api/v1/auth', require('./routes/auth'))
// NOTE Route
app.use('/api/v1/notes', authenticateUser, require('./routes/note'))

// Create App
const startApp = async () => {
  await connectDB(process.env.MONGO_URI)
  app.listen(PORT, console.log(`Server running on port ${PORT}`))
}

// Start App
startApp()
