import React from 'react'
import { Button, Row, Col } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import './home.css'
const Home = () => {
  return (
    <Row>
      <Col
        md={6}
        className='d-flex flex-dreaction-column  align-items-center justify-content-center'
      >
        <div>
          <h1>Share the world your friends</h1>
          <p>Chat app connects you with the world</p>
          <LinkContainer to='/chat'>
            <Button variant='success '>
              Get Stated
              <i className='fas fa-comments home_message_icon' />
            </Button>
          </LinkContainer>
        </div>
      </Col>
      <Col md={6} className='home_bg'></Col>
    </Row>
  )
}

export default Home
