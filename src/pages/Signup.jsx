import { Form, Input, Button, Divider, Typography, Row, Col } from 'antd'
import { Link } from 'react-router-dom'
import { GoogleOutlined } from '@ant-design/icons'
import loginImage from '../assets/login.png'

const { Title, Text } = Typography

export const Signup = () => {
  const onFinish = (values) => {
    console.log('Signup values:', values)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC', padding: '24px' }}>
      <Row
        style={{
          maxWidth: '1200px',
          width: '100%',
          background: '#fff',
          borderRadius: '24px',
          overflow: 'hidden',
          boxShadow: '0 10px 40px rgba(0,0,0,0.05)'
        }}
        align="middle"
      >
        {/* Left Side - Form */}
        <Col xs={24} md={12} style={{ padding: '64px' }}>
          <div style={{ marginBottom: '40px' }}>
            <Title level={2} style={{ margin: 0, fontWeight: 800 }}>Get started</Title>
            <Text type="secondary">Create your account to start tracking</Text>
          </div>

          <Form
            name="signup"
            onFinish={onFinish}
            layout="vertical"
            size="large"
            autoComplete="off"
          >
            <Form.Item
              name="fullname"
              rules={[{ required: true, message: 'Please input your full name!' }]}
            >
              <Input placeholder="Full Name" style={{ borderRadius: '12px', padding: '12px 16px' }} />
            </Form.Item>

            <Form.Item
              name="email"
              rules={[{ required: true, message: 'Please input your email!' }, { type: 'email', message: 'Please enter a valid email!' }]}
            >
              <Input placeholder="Email" style={{ borderRadius: '12px', padding: '12px 16px' }} />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Please input your password!' }, { min: 6, message: 'Password must be at least 6 characters!' }]}
            >
              <Input.Password placeholder="Password" style={{ borderRadius: '12px', padding: '12px 16px' }} />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                style={{ height: '54px', borderRadius: '12px', fontWeight: 'bold', fontSize: '16px', marginTop: '12px' }}
              >
                Create Account
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
              Sign up with Google
            </Button>

            <div style={{ textAlign: 'center', marginTop: '32px' }}>
              <Text type="secondary">Already have an account? </Text>
              <Link to="/login" style={{ color: '#3B82F6', fontWeight: 'bold' }}>
                Log in
              </Link>
            </div>
          </Form>
        </Col>

        {/* Right Side - Image */}
        <Col xs={0} md={12} style={{ background: '#F1F5F9', height: '100%', padding: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img
            src={loginImage}
            alt="Track Bridge illustration"
            style={{ maxWidth: '100%', maxHeight: '500px', objectFit: 'contain' }}
          />
        </Col>
      </Row>
    </div>
  )
}
