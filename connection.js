const mongoose = require('mongoose')

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.DB, () => {
      console.log('Mongodb connected')
    })
  } catch (err) {
    console.log('Connection failed', err)
    process.exit(0)
  }
}

module.exports = connectDb
