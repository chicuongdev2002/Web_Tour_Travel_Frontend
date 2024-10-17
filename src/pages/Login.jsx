import React from 'react'
import image from '../components/login_register/bg_tour.jpg'
import LoginRegister from '../components/login_register/LoginRegister'

function Login() {
  return (
      <div
          style={{
              backgroundImage: `url(${image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              height: '641px',
              width: '100%'
          }}
      >
        <LoginRegister />
      </div>
  )
}

export default Login