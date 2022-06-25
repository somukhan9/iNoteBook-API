const mongoose = require('mongoose')

module.exports = async (MONGO_URI) => {
  return mongoose.connect(MONGO_URI, {
    autoIndex: true,
  })
}
