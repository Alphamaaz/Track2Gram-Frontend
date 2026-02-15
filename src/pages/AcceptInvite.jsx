import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Typography, message, Result } from 'antd';
import { UserOutlined, LockOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useSearchParams, useNavigate } from 'react-router-dom';
import authService from '../services/auth';

const { Title, Text } = Typography;

const AcceptInvite = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const token = searchParams.get('token');

    useEffect(() => {
        if (!token) {
            message.error('Invalid invitation link. Token is missing.');
        }
    }, [token]);

    const onFinish = async (values) => {
        if (!token) {
            message.error('Missing invitation token');
            return;
        }

        setLoading(true);
        try {
            await authService.acceptInvite({
                name: values.name,
                password: values.password,
                token: token
            });
            setSuccess(true);
            message.success('Invitation accepted! You can now log in.');
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (error) {
            console.error('Accept invite failed:', error);
            message.error(error.message || 'Failed to accept invitation');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div style={{
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                background: '#f8fafc'
            }}>
                <Card style={{ maxWidth: 400, width: '100%', borderRadius: 12, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
                    <Result
                        status="success"
                        title="Invitation Accepted!"
                        subTitle="Your account has been set up successfully. Redirecting to login page..."
                        extra={[
                            <Button type="primary" key="login" onClick={() => navigate('/login')}>
                                Go to Login
                            </Button>
                        ]}
                    />
                </Card>
            </div>
        );
    }

    if (!token) {
        return (
            <div style={{
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                background: '#f8fafc'
            }}>
                <Card style={{ maxWidth: 400, width: '100%', borderRadius: 12, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
                    <Result
                        status="error"
                        title="Invalid Link"
                        subTitle="This invitation link is invalid or expired."
                        extra={[
                            <Button type="primary" key="home" onClick={() => navigate('/')}>
                                Back to Home
                            </Button>
                        ]}
                    />
                </Card>
            </div>
        );
    }

    return (
        <div style={{
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)'
        }}>
            <Card
                style={{
                    maxWidth: 450,
                    width: '100%',
                    borderRadius: 16,
                    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)'
                }}
            >
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                    <div style={{
                        width: 64,
                        height: 64,
                        background: '#084b8a',
                        borderRadius: 16,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        margin: '0 auto 16px',
                        boxShadow: '0 10px 15px -3px rgba(8, 75, 138, 0.3)'
                    }}>
                        <CheckCircleOutlined style={{ fontSize: 32, color: '#fff' }} />
                    </div>
                    <Title level={2} style={{ margin: 0, color: '#1e293b' }}>Join the Team</Title>
                    <Text type="secondary">Complete your profile to accept the invitation</Text>
                </div>

                <Form
                    name="accept_invite"
                    layout="vertical"
                    onFinish={onFinish}
                    requiredMark={false}
                >
                    <Form.Item
                        name="name"
                        label="Full Name"
                        rules={[{ required: true, message: 'Please enter your full name' }]}
                    >
                        <Input
                            prefix={<UserOutlined style={{ color: '#94a3b8' }} />}
                            placeholder="John Doe"
                            size="large"
                            style={{ borderRadius: 8 }}
                        />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label="Password"
                        rules={[
                            { required: true, message: 'Please set a password' },
                            { min: 6, message: 'Password must be at least 6 characters' }
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined style={{ color: '#94a3b8' }} />}
                            placeholder="Set your password"
                            size="large"
                            style={{ borderRadius: 8 }}
                        />
                    </Form.Item>

                    <Form.Item style={{ marginTop: 24 }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            block
                            size="large"
                            style={{
                                height: 48,
                                borderRadius: 8,
                                background: '#084b8a',
                                border: 'none',
                                fontWeight: 600,
                                fontSize: 16
                            }}
                        >
                            Accept Invitation
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default AcceptInvite;
