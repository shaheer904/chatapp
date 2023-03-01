import React, { useState } from 'react'
import { Button, Col, Container, Form, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import './signup.css'
import logo from '../assets/bot.jpeg'
import { useSignupUserMutation } from '../services/appApi'
const Signup = () => {
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  //image upload states
  const [image, setImage] = useState(null)
  const [uploadingImg, setUploadingImg] = useState(false)
  const [previewImg, setPreviewImg] = useState(null)

  const [signupUser, { isLoading, error }] = useSignupUserMutation()

  function validateImg(e) {
    const file = e.target.files[0]
    if (file.size > 1048576) {
      return alert('Max file zie is 1mb')
    } else {
      setImage(file)
      setPreviewImg(URL.createObjectURL(file))
    }
  }
  const uploadImg = async () => {
    const data = new FormData()
    data.append('file', image)
    data.append('upload_preset', 'alvhcmww')
    try {
      setUploadingImg(true)
      let res = await fetch(
        'https://api.cloudinary.com/v1_1/doiavqduq/image/upload',
        { method: 'post', body: data }
      )
      const urlData = await res.json()
      console.log(urlData)
      setUploadingImg(false)
      return urlData.url
    } catch (err) {
      setUploadingImg(false)
      console.log(err)
    }
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    if (!image) {
      return alert('Please upload profile pic')
    }
    const url = await uploadImg(image)
    console.log(url)
    signupUser({ name, email, password, picture: url }).then((data) => {
      if (data) {
        console.log(data)
      }
    })
  }
  return (
    <Container>
      <Row>
        <Col
          md={7}
          className='d-flex align-items-center justify-content-center flex-direction-column'
        >
          <Form style={{ width: '80%', maxWidth: 500 }} onSubmit={handleSignup}>
            {error && <p className='alert alert-danger'>{error.data}</p>}

            <h1 className='text-center'>Create Account</h1>
            <div className='signup_profile_pic_container'>
              <img
                src={previewImg || logo}
                className='signup_profile_pic'
                alt='img'
              />
              <label htmlFor='image-upload' className='image_upload_label'>
                <i className='fas fa-plus-circle add_picture_icon' />
              </label>
              <input
                type='file'
                hidden
                id='image-upload'
                accept='image/png, image/jpeg'
                onChange={validateImg}
              />
            </div>
            <Form.Group className='mb-3' controlId='formBasicName'>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type='text'
                onChange={(e) => setName(e.target.value)}
                placeholder='Enter name'
                value={name}
              />
            </Form.Group>
            <Form.Group className='mb-3' controlId='formBasicEmail'>
              <Form.Label>Email address</Form.Label>
              <Form.Control
                onChange={(e) => setEmail(e.target.value)}
                type='email'
                placeholder='Enter email'
                value={email}
              />
              <Form.Text className='text-muted'>
                We'll never share your email with anyone else.
              </Form.Text>
            </Form.Group>

            <Form.Group className='mb-3' controlId='formBasicPassword'>
              <Form.Label>Password</Form.Label>
              <Form.Control
                type='password'
                placeholder='Password'
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
            </Form.Group>
            <Form.Group className='mb-3' controlId='formBasicCheckbox'>
              <Form.Check type='checkbox' label='Check me out' />
            </Form.Group>
            <Button variant='primary' type='submit'>
              {uploadingImg || isLoading
                ? 'Signing you up....'
                : 'Creat account'}
            </Button>
            <div className='py-4'>
              <p className='text-center'>
                Already have an account ? <Link to='/login'>Login</Link>
              </p>
            </div>
          </Form>
        </Col>
        <Col md={5} className='signup_bg'></Col>
      </Row>
    </Container>
  )
}

export default Signup
