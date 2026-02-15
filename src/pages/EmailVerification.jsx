import React, { useState, useEffect } from 'react';
import { Card, Typography, Space, Spin, Button } from 'antd';
import { CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons';
import { useSearchParams, useNavigate } from 'react-router-dom';
import authService from '../services/auth';

const { Title, Text } = Typography;

const EmailVerification = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');

    const [status, setStatus] = useState('loading'); // 'loading', 'success', 'error'
    const [apiMessage, setApiMessage] = useState('Verifying your email...');

    const hasExecuted = React.useRef(false);

    useEffect(() => {
        const performVerification = async () => {
            // Prevent double execution in StrictMode
            if (hasExecuted.current) return;

            if (!token) {
                setStatus('error');
                setApiMessage('Missing verification token. Please use the link provided in your email.');
                return;
            }

            hasExecuted.current = true;
            console.log('Starting verification for token:', token);

            try {
                const data = await authService.verifyEmail(token);
                console.log('Verification successful:', data);
                setStatus('success');
                setApiMessage(data.message || 'Email verified successfully! You can now access your account.');
            } catch (error) {
                console.error('Verification failed:', error);

                // If it's a "token already used" or the email is already verified, we can treat it as success or a special error
                if (error.message?.toLowerCase().includes('already verified')) {
                    setStatus('success');
                    setApiMessage('Email is already verified. You can proceed to login.');
                    return;
                }

                setStatus('error');
                const errorMsg = error.message || error.error || (typeof error === 'string' ? error : 'The verification link is invalid or has expired.');
                setApiMessage(errorMsg);
            }
        };

        performVerification();
    }, [token]);

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%)',
            padding: '24px',
            fontFamily: "'Inter', sans-serif"
        }}>
            <Card
                bordered={false}
                style={{
                    maxWidth: 480,
                    width: '100%',
                    borderRadius: '24px',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.08)',
                    textAlign: 'center',
                    backgroundColor: '#ffffff'
                }}
                styles={{ body: { padding: '60px 40px' } }}
            >
                <Space direction="vertical" size={32} style={{ width: '100%' }}>

                    {/* Status Icon */}
                    {status === 'loading' && (
                        <div style={{ margin: '0 auto', marginBottom: '8px' }}>
                            <Spin size="large" />
                        </div>
                    )}

                    {status === 'success' && (
                        <div style={{
                            width: '90px',
                            height: '90px',
                            background: '#ecfdf5',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto',
                            border: '8px solid #f0fdf4'
                        }}>
                            <CheckCircleFilled style={{ fontSize: '48px', color: '#10b981' }} />
                        </div>
                    )}

                    {status === 'error' && (
                        <div style={{
                            width: '90px',
                            height: '90px',
                            background: '#fef2f2',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto',
                            border: '8px solid #fff1f1'
                        }}>
                            <CloseCircleFilled style={{ fontSize: '48px', color: '#ef4444' }} />
                        </div>
                    )}

                    <div>
                        {/* Main Heading */}
                        <Title level={2} style={{
                            margin: 0,
                            fontWeight: 700,
                            color: '#0f172a',
                            fontSize: '28px',
                            letterSpacing: '-0.02em'
                        }}>
                            {status === 'loading' ? 'Verifying...' : status === 'success' ? 'Verification Success' : 'Verification Error'}
                        </Title>

                        {/* Description */}
                        <div style={{ marginTop: '16px' }}>
                            <Text style={{
                                fontSize: '16px',
                                color: '#64748b',
                                display: 'block',
                                lineHeight: 1.6,
                                fontWeight: 400
                            }}>
                                {apiMessage}
                            </Text>
                        </div>
                    </div>

                    {/* Progress Bar or Action Button */}
                    {status === 'loading' ? (
                        <div style={{
                            width: '100%',
                            height: '4px',
                            background: '#f1f5f9',
                            borderRadius: '2px',
                            marginTop: '12px',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            <div className="shimmer-bar" style={{
                                position: 'absolute',
                                left: '-100%',
                                top: 0,
                                height: '100%',
                                width: '100%',
                                background: '#084b8a',
                                borderRadius: '2px',
                                animation: 'shimmer 2s infinite linear'
                            }} />
                        </div>
                    ) : (
                        <Button
                            type="primary"
                            size="large"
                            onClick={() => navigate('/login')}
                            style={{
                                width: '100%',
                                height: '50px',
                                borderRadius: '12px',
                                fontWeight: 600,
                                background: '#084b8a',
                                border: 'none',
                                fontSize: '16px',
                                marginTop: '16px',
                                boxShadow: '0 4px 12px rgba(8, 75, 138, 0.3)'
                            }}
                        >
                            Go to Login
                        </Button>
                    )}
                </Space>
            </Card>

            <style>{`
                @keyframes shimmer {
                    0% { left: -100%; }
                    100% { left: 100%; }
                }
            `}</style>
        </div>
    );
};

export default EmailVerification;
