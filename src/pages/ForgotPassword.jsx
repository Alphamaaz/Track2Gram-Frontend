import { Form, Input, Button, Typography, Card } from 'antd'
import { Link } from 'react-router-dom'
import { MailOutlined, ArrowLeftOutlined } from '@ant-design/icons'

const { Title, Text } = Typography

export const ForgotPassword = () => {
  const onFinish = (values) => {
    console.log('Reset link requested for:', values)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyItems: 'center', background: '#F8FAFC', padding: '24px' }}>
      <Card
        style={{
          maxWidth: '500px',
          width: '100%',
          borderRadius: '24px',
          margin: '0 auto',
          boxShadow: '0 10px 40px rgba(0,0,0,0.05)',
          padding: '24px'
        }}
        variant="borderless"
      >
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <Title level={2} style={{ margin: 0, fontWeight: 800 }}>Forgot password?</Title>
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
              style={{ borderRadius: '12px', padding: '12px 16px' }}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: '24px' }}>
            <Button
              type="primary"
              htmlType="submit"
              block
              style={{ height: '54px', borderRadius: '12px', fontWeight: 'bold', fontSize: '16px' }}
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
    </div>
  )
}
