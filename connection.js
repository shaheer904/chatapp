const mongoose = require('mongoose')
require('dotenv').config()
const connectDb = async () => {
  try {
    await mongoose.connect(
      'mongodb+srv://admin:showpassword@cluster0.yraoabj.mongodb.net/chatt?retryWrites=true&w=majority',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      () => {
        console.log('Mongodb connected')
      }
    )
  } catch (err) {
    console.log('Connection failed', err)
    process.exit(0)
  }
}

module.exports = connectDb
