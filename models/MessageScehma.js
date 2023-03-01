const mongoose = require('mongoose')

const MessageSchema = new mongoose.Schema({
  content: String,
  from: Object,
  socketId: String,
  time: String,
  date: String,
  to: String,
})

module.exports = Message = mongoose.model('Message', MessageSchema)
