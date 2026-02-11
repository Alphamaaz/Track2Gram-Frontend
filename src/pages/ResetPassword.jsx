import { useState, useEffect } from 'react'
import { Form, Input, Button, Typography, Card, App } from 'antd'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { LockOutlined, ArrowLeftOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons'
import logo from '../assets/tyy 1.svg'
import authService from '../services/auth'

const { Title, Text } = Typography

export const ResetPassword = () => {
    const { message } = App.useApp()
    const [searchParams] = useSearchParams()
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const token = searchParams.get('token')

    useEffect(() => {
        if (!token) {
            message.error('Invalid or missing reset token. Redirecting to login.')
            const timer = setTimeout(() => navigate('/login'), 2000)
            return () => clearTimeout(timer)
        }
    }, [token, navigate, message])

    const onFinish = async (values) => {
        if (!token) {
            message.error('No reset token found.')
            return
        }

        setLoading(true)
        try {
            // Some backends use 'password', some use 'newPassword'. 
            // The user requested 'newPassword', so we prioritize that.
            await authService.resetPassword({
                newPassword: values.newPassword,
                token: token
            })
            message.success('Password reset successfully!')
            navigate('/login')
        } catch (error) {
            console.error('Reset password failed:', error)
            const errorMessage = error.message || error.error || 'Failed to reset password. The link may be expired.'
            message.error(errorMessage)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="reset-password-container">
            <Card className="reset-password-card" variant="borderless">
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <img src={logo} alt="Track Bridge" style={{ height: '48px', marginBottom: '24px' }} />
                    <Title level={2} style={{ margin: 0, fontWeight: 800, background: 'linear-gradient(45deg, #2563EB, #3B82F6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Reset Password
                    </Title>
                    <Text type="secondary" style={{ display: 'block', marginTop: '12px' }}>
                        Please enter your new password below to secure your account.
                    </Text>
                </div>

                <Form
                    name="reset_password"
                    onFinish={onFinish}
                    layout="vertical"
                    size="large"
                    autoComplete="off"
                >
                    <Form.Item
                        name="newPassword"
                        label="New Password"
                        rules={[
                            { required: true, message: 'Please input your new password!' },
                            { min: 6, message: 'Password must be at least 6 characters!' }
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                            placeholder="Enter new password"
                            iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                            style={{ borderRadius: '12px', padding: '12px 16px', background: '#F8FAFC', border: '1px solid #E2E8F0' }}
                        />
                    </Form.Item>

                    <Form.Item
                        name="confirmPassword"
                        label="Confirm New Password"
                        dependencies={['newPassword']}
                        rules={[
                            { required: true, message: 'Please confirm your new password!' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('newPassword') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Passwords do not match!'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                            placeholder="Confirm new password"
                            iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                            style={{ borderRadius: '12px', padding: '12px 16px', background: '#F8FAFC', border: '1px solid #E2E8F0' }}
                        />
                    </Form.Item>

                    <Form.Item style={{ marginBottom: '24px' }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                            loading={loading}
                            style={{
                                height: '54px',
                                borderRadius: '12px',
                                fontWeight: 'bold',
                                fontSize: '16px',
                                background: 'linear-gradient(to right, #2563EB, #3B82F6)',
                                border: 'none',
                                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)'
                            }}
                        >
                            Reset Password
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
                    .reset-password-container {
                        min-height: 100vh;
                        display: flex;
                        align-items: center;
                        justifyContent: center;
                        background: #F0F4F8;
                        padding: 24px;
                        background-image: 
                            radial-gradient(at 0% 0%, rgba(59, 130, 246, 0.1) 0px, transparent 50%),
                            radial-gradient(at 100% 100%, rgba(99, 102, 241, 0.1) 0px, transparent 50%);
                    }
                    .reset-password-card {
                        max-width: 500px;
                        width: 100%;
                        background: rgba(255, 255, 255, 0.9);
                        backdrop-filter: blur(20px);
                        border-radius: 32px;
                        margin: 0 auto;
                        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.1);
                        border: 1px solid rgba(255, 255, 255, 0.5);
                    }
                    .reset-password-card .ant-card-body {
                        padding: 40px;
                    }
                `}
            </style>
        </div>
    )
}
