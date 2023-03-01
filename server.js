const express = require('express')
const app = express()
const rooms = ['general', 'tech', 'finance', 'crypto']
const userRoutes = require('./routes/userRoutes')
const cors = require('cors')
const connectDb = require('./connection')
const Message = require('./models/MessageScehma')
const User = require('./models/userSchema')

require('dotenv').config()
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(cors())
app.use('/users', userRoutes)

connectDb()
const PORT = process.env.PORT || 5000

const server = require('http').createServer(app)

const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
})

app.get('/rooms', (req, res) => {
  res.json(rooms)
})

//get last messages from room
async function getLastMessagesFromRoom(room) {
  let roomMessages = await Message.aggregate([
    { $match: { to: room } },
    { $group: { _id: '$date', messageByDate: { $push: '$$ROOT' } } },
  ])
  return roomMessages
}

function sortRoomMessagesByDate(messages) {
  return messages.sort(function (a, b) {
    let date1 = a._id.split('/')
    let date2 = b._id.split('/')
    data1 = date1[2] + date1[0] + date1[1]
    date2 = date2[2] + date1[0] + date1[1]

    return date1 < date2 ? -1 : 1
  })
}

//socket.io connection
io.on('connection', (socket) => {
  socket.on('new-user', async () => {
    const members = await User.find()
    io.emit('new-user', members)
  })

  socket.on('join-room', async (newRoom, previousRoom) => {
    socket.join(newRoom)
    socket.leave(previousRoom)

    let roomMessages = await getLastMessagesFromRoom(newRoom)
    roomMessages = sortRoomMessagesByDate(roomMessages)
    socket.emit('room-messages', roomMessages)
  })

  socket.on('message-room', async (room, content, sender, time, date) => {
    console.log('new-message', content)
    const newMessage = await Message.create({
      content,
      from: sender,
      time,
      date,
      to: room,
    })
    let roomMessages = await getLastMessagesFromRoom(room)
    roomMessages = sortRoomMessagesByDate(roomMessages)
    //sending messages to room
    io.to(room).emit('room-messages', roomMessages)
    socket.broadcast.emit('notifications', room)
  })
  app.delete('/logout', async (req, res) => {
    try {
      const { _id, newMessages } = req.body
      let user = await User.findById(_id)
      user.status = 'offline'
      user.newMessages = newMessages
      await user.save()
      const members = await User.find()
      socket.broadcast.emit('new-user', members)
      res.status(200).send()
    } catch (e) {
      console.log(e)
      res.status(400).send()
    }
  })
})

server.listen(PORT, () => {
  console.log(`Server is runing on ${PORT}`)
})
