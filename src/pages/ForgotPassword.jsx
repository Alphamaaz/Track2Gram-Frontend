import { useState } from 'react'
import { Form, Input, Button, Typography, Card, App } from 'antd'
import { Link } from 'react-router-dom'
import { MailOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import logo from '../assets/tyy 1.svg'
import authService from '../services/auth'

const { Title, Text } = Typography

export const ForgotPassword = () => {
  const { message } = App.useApp()
  const [loading, setLoading] = useState(false)

  const onFinish = async (values) => {
    setLoading(true)
    try {
      await authService.forgotPassword(values.email)
      message.success('A password reset link has been sent to your email.')
    } catch (error) {
      console.error('Forgot password failed:', error)
      const errorMessage = error.message || error.error || 'Failed to send reset link. Please try again.'
      message.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="forgot-password-container">
      <Card
        className="forgot-password-card"
        variant="borderless"
      >
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <img src={logo} alt="Track Bridge" style={{ height: '48px', marginBottom: '24px' }} />
          <Title level={2} style={{ margin: 0, fontWeight: 800, background: 'linear-gradient(45deg, #2563EB, #3B82F6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Forgot password?</Title>
          <Text type="secondary" style={{ display: 'block', marginTop: '12px' }}>
            Enter the email associated with your account and we'll send you instructions to reset your password.
          </Text>
        </div>

        <Form
          name="forgot_password"
          onFinish={onFinish}
          layout="vertical"
          size="large"
          autoComplete="off"
        >
          <Form.Item
            name="email"
            label="Email Address"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input
              prefix={<MailOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Enter your email"
              style={{ borderRadius: '12px', padding: '12px 16px', background: '#F8FAFC', border: '1px solid #E2E8F0' }}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: '24px' }}>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
              style={{ height: '54px', borderRadius: '12px', fontWeight: 'bold', fontSize: '16px', background: 'linear-gradient(to right, #2563EB, #3B82F6)', border: 'none', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)' }}
            >
              Send Reset Link
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center' }}>
            <Link to="/login" style={{ color: '#3B82F6', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <ArrowLeftOutlined /> Back to Login
            </Link>
          </div>
        </Form>
      </Card>

      <style>
        {`
          .forgot-password-container {
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
          .forgot-password-card {
            max-width: 500px;
            width: 100%;
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(20px);
            border-radius: 32px;
            margin: 0 auto;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.5);
            padding: 24px;
          }
          /* Override Antd Card padding if needed */
          .forgot-password-card .ant-card-body {
            padding: 24px;
          }
        `}
      </style>
    </div>
  )
}
