import { Form, Input, Button, Checkbox, Divider, Typography, Row, Col } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import { GoogleOutlined } from '@ant-design/icons'
import loginImage from '../assets/login.png'
import logo from '../assets/tyy 1.svg'

const { Title, Text } = Typography

export const Login = () => {
  const navigate = useNavigate()

  const onFinish = (values) => {
    console.log('Login values:', values)
    navigate('/dashboard')
  }

  return (
    <div className="login-container">
      <Row
        className="login-card"
        align="middle"
      >
        {/* Left Side - Form */}
        <Col xs={24} md={12} className="login-form-col">
          <div style={{ marginBottom: '32px' }}>
            <img src={logo} alt="Track Bridge" style={{ height: '48px', marginBottom: '24px' }} />
            <Title level={2} style={{ margin: 0, fontWeight: 800, background: 'linear-gradient(45deg, #2563EB, #3B82F6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Welcome back</Title>
            <Text type="secondary">Enter your details to access your account</Text>
          </div>

          <Form
            name="login"
            onFinish={onFinish}
            layout="vertical"
            size="large"
            autoComplete="off"
          >
            <Form.Item
              name="email"
              rules={[{ required: true, message: 'Please input your email!' }, { type: 'email', message: 'Please enter a valid email!' }]}
            >
              <Input placeholder="Email" style={{ borderRadius: '12px', padding: '12px 16px', background: '#F8FAFC', border: '1px solid #E2E8F0' }} />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <Input.Password placeholder="Password" style={{ borderRadius: '12px', padding: '12px 16px', background: '#F8FAFC', border: '1px solid #E2E8F0' }} />
            </Form.Item>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Remember me</Checkbox>
              </Form.Item>
              <Link to="/forgot-password" style={{ color: '#3B82F6', fontWeight: 500 }}>
                Forgot password?
              </Link>
            </div>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                style={{ height: '54px', borderRadius: '12px', fontWeight: 'bold', fontSize: '16px', background: 'linear-gradient(to right, #2563EB, #3B82F6)', border: 'none', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)' }}
              >
                Log in
              </Button>
            </Form.Item>

            <Divider plain style={{ margin: '32px 0' }}>
              <Text type="secondary" style={{ fontSize: '12px' }}>Or continue with</Text>
            </Divider>

            <Button
              block
              icon={<GoogleOutlined />}
              style={{ height: '54px', borderRadius: '12px', fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              Login with Google
            </Button>

            <div style={{ textAlign: 'center', marginTop: '32px' }}>
              <Text type="secondary">Don't have an account? </Text>
              <Link to="/signup" style={{ color: '#3B82F6', fontWeight: 'bold' }}>
                Sign up
              </Link>
            </div>
          </Form>
        </Col>

        {/* Right Side - Image */}
        <Col xs={0} md={12} style={{ background: '#F8FAFC', height: '100%', padding: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-50%', right: '-50%', width: '100%', height: '100%', background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, rgba(255,255,255,0) 70%)', transform: 'scale(1.5)' }}></div>
          <img
            src={loginImage}
            alt="Track Bridge illustration"
            style={{ maxWidth: '100%', maxHeight: '500px', objectFit: 'contain', position: 'relative', zIndex: 1 }}
          />
        </Col>
      </Row>

      <style>
        {`
          .login-container {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #F0F4F8;
            padding: 24px;
            background-image: 
              radial-gradient(at 0% 0%, rgba(59, 130, 246, 0.1) 0px, transparent 50%),
              radial-gradient(at 100% 100%, rgba(99, 102, 241, 0.1) 0px, transparent 50%);
          }
          .login-card {
            max-width: 1200px;
            width: 100%;
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(20px);
            border-radius: 32px;
            overflow: hidden;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.5);
          }
          .login-form-col {
            padding: 64px;
          }
          @media (max-width: 768px) {
            .login-form-col {
              padding: 32px 24px;
            }
            .login-card {
              border-radius: 24px;
            }
          }
        `}
      </style>
    </div>
  )
}
