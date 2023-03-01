import React, { useContext, useEffect } from 'react'
import { Col, ListGroup, Row } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { AppContext } from '../context/appContext'
import { addNotifications, resetNotifications } from '../features/userSlice'
import './sidebar.css'
const Sidebar = () => {
  // const rooms = ['First Room', 'Second Room', 'Third Room']
  const {
    socket,
    setMembers,
    members,
    setCurrentRoom,
    setRooms,
    privateMemberMsg,
    rooms,
    currentRoom,
    setPrivateMemberMsg,
  } = useContext(AppContext)
  const user = useSelector((state) => state.user)
  socket.off('new-user').on('new-user', (payload) => {
    setMembers(payload)
  })

  const dispatch = useDispatch()
  useEffect(() => {
    if (user) {
      setCurrentRoom('general')
      getRooms()
      socket.emit('join-room', 'general')
      socket.emit('new-user')
    }
  }, [])

  function getRooms() {
    fetch('http://localhost:5000/rooms')
      .then((res) => res.json())
      .then((data) => setRooms(data))
  }

  function orderIds(id1, id2) {
    if (id1 > id2) {
      return id1 + '_' + id2
    } else {
      return id2 + '_' + id1
    }
  }

  const joinRoom = (room, isPublic = true) => {
    if (!user) {
      return alert('Please login')
    }
    socket.emit('join-room', room, currentRoom)
    setCurrentRoom(room)
    if (isPublic) {
      setPrivateMemberMsg(null)
    }
    //dispatch for notifications
    dispatch(resetNotifications(room))
  }

  socket.off('notifications').on('notifications', (room) => {
    if (currentRoom != room) {
      dispatch(addNotifications(room))
    }
  })

  const handlePrivateMemberMsg = (member) => {
    setPrivateMemberMsg(member)
    const roomId = orderIds(user._id, member._id)
    joinRoom(roomId, false)
  }

  if (!user) {
    return <></>
  }
  return (
    <>
      <h1>Available Room</h1>
      <ListGroup>
        {rooms?.map((room, id) => {
          return (
            <ListGroup.Item
              key={id}
              onClick={() => joinRoom(room)}
              style={{
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
              }}
              active={room == currentRoom}
            >
              {room}
              {currentRoom !== room && (
                <span className='badge rounded-pill bg-primary'>
                  {user?.newMessages[room]}
                </span>
              )}
            </ListGroup.Item>
          )
        })}
      </ListGroup>
      <h1>Members</h1>
      <ListGroup>
        {members?.map((el, ind) => {
          return (
            <ListGroup.Item
              key={ind}
              style={{
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
              }}
              active={privateMemberMsg?._id == el?._id}
              onClick={() => handlePrivateMemberMsg(el)}
              disabled={el._id === user._id}
            >
              <Row>
                <Col xs={2} className='member-status'>
                  <img src={el.picture} alt='' className='member-status-img' />
                  {el.status === 'online' ? (
                    <i className='fas fa-circle sidebar-online-status' />
                  ) : (
                    <i className='fas fa-circle sidebar-offline-status' />
                  )}
                </Col>
                <Col xs={9}>
                  {'                  ' + el.name}
                  {el._id === user._id && '     (you)'}
                  {el.status === 'offline' && '  (offline)'}
                </Col>
                <Col xs={1} className='badge rounded-pill bg-primary'>
                  {user?.newMessages[orderIds(el.id, user.id)]}
                </Col>
              </Row>
            </ListGroup.Item>
          )
        })}
      </ListGroup>
    </>
  )
}

export default Sidebar
