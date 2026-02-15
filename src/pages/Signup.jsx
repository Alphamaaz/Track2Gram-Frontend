import { Form, Input, Button, Divider, Typography, Row, Col, message } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import loginImage from '../assets/login.png'
import logo from '../assets/tyy 1.svg'
import authService from '../services/auth'
import { useState } from 'react'

const { Title, Text } = Typography

export const Signup = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const onFinish = async (values) => {
    setLoading(true)
    try {
      // Mapping 'fullname' to 'name' as expected by the API
      const registrationData = {
        name: values.fullname,
        email: values.email,
        password: values.password
      }

      const response = await authService.register(registrationData)
      message.success(response.message || 'Registration successful! Please check your email to verify your account.')

      // Delay navigation to let the user read the success message
      setTimeout(() => {
        navigate('/login')
      }, 2000)
    } catch (error) {
      console.error('Signup error details:', error)
      const errorMsg = error.message || error.error || (typeof error === 'string' ? error : JSON.stringify(error))
      message.error(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="signup-container">
      <Row
        className="signup-card"
        align="middle"
      >
        {/* Left Side - Form */}
        <Col xs={24} md={12} className="signup-form-col">
          <div style={{ marginBottom: '32px' }}>
            <img src={logo} alt="Track Bridge" style={{ height: '64px', marginBottom: '24px', filter: 'drop-shadow(0px 0px 0px #084b8a) grayscale(100%) brightness(50%) sepia(100%) hue-rotate(175deg) saturate(300%)' }} />
            <Title level={2} style={{ margin: 0, fontWeight: 800, background: 'linear-gradient(45deg, #084b8a, #0a5a9e)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Get started</Title>
            <Text style={{ color: '#000000', opacity: 0.85, fontSize: '16px' }}>Create your account to start tracking</Text>
          </div>

          <Form
            name="signup"
            onFinish={onFinish}
            layout="vertical"
            size="large"
            autoComplete="off"
            disabled={loading}
          >
            <Form.Item
              name="fullname"
              rules={[{ required: true, message: 'Please input your full name!' }]}
            >
              <Input placeholder="Full Name" style={{ borderRadius: '12px', padding: '12px 16px', background: '#F8FAFC', border: '1px solid #E2E8F0' }} />
            </Form.Item>

            <Form.Item
              name="email"
              rules={[{ required: true, message: 'Please input your email!' }, { type: 'email', message: 'Please enter a valid email!' }]}
            >
              <Input placeholder="Email" style={{ borderRadius: '12px', padding: '12px 16px', background: '#F8FAFC', border: '1px solid #E2E8F0' }} />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Please input your password!' }, { min: 6, message: 'Password must be at least 6 characters!' }]}
            >
              <Input.Password placeholder="Password" style={{ borderRadius: '12px', padding: '12px 16px', background: '#F8FAFC', border: '1px solid #E2E8F0' }} />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={loading}
                style={{ height: '54px', borderRadius: '12px', fontWeight: 'bold', fontSize: '16px', marginTop: '12px', background: 'linear-gradient(to right, #084b8a, #0a5a9e)', border: 'none', boxShadow: '0 4px 12px rgba(8, 75, 138, 0.2)' }}
              >
                Create Account
              </Button>
            </Form.Item>

            <div style={{ textAlign: 'center', marginTop: '32px' }}>
              <Text style={{ color: '#000000', opacity: 0.85 }}>Already have an account? </Text>
              <Link to="/login" style={{ color: '#084b8a', fontWeight: 'bold' }}>
                Log in
              </Link>
            </div>
          </Form>
        </Col>

        {/* Right Side - Image */}
        <Col xs={0} md={12} style={{ background: '#F8FAFC', height: '100%', padding: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-50%', right: '-50%', width: '100%', height: '100%', background: 'radial-gradient(circle, rgba(8, 75, 138, 0.1) 0%, rgba(255,255,255,0) 70%)', transform: 'scale(1.5)' }}></div>
          <img
            src={loginImage}
            alt="Track Bridge illustration"
            style={{ maxWidth: '100%', maxHeight: '500px', objectFit: 'contain', position: 'relative', zIndex: 1 }}
          />
        </Col>
      </Row>

      <style>
        {`
          .signup-container {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #F0F4F8;
            padding: 24px;
            background-image: 
              radial-gradient(at 0% 0%, rgba(8, 75, 138, 0.1) 0px, transparent 50%),
              radial-gradient(at 100% 100%, rgba(10, 90, 158, 0.1) 0px, transparent 50%);
          }
          .signup-card {
            max-width: 1200px;
            width: 100%;
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(20px);
            border-radius: 32px;
            overflow: hidden;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.5);
          }
          .signup-form-col {
            padding: 64px;
          }
          @media (max-width: 768px) {
            .signup-form-col {
              padding: 32px 24px;
            }
            .signup-card {
              border-radius: 24px;
            }
          }
        `}
      </style>
    </div>
  )
}
