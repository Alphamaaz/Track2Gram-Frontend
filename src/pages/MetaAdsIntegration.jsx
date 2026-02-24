import React from 'react';
import { Typography, Input, Button, Card, Space, Breadcrumb } from 'antd';
import { SaveOutlined, LinkOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const MetaAdsIntegration = () => {
    const cardStyle = {
        borderRadius: '20px',
        border: '1px solid rgba(226, 232, 240, 0.7)',
        background: '#ffffff',
        boxShadow: '0 4px 20px -5px rgba(0, 0, 0, 0.05)',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        maxWidth: '1100px',
        margin: '0 auto',
        width: '100%'
    };

    const headerGradient = {
        background: `linear-gradient(135deg, #084b8a 0%, #0a5a9e 100%)`,
        padding: '16px 24px',
        color: '#fff',
    };

    return (
        <div style={{ padding: '16px 20px', maxWidth: '1200px', margin: '0 auto', minHeight: '100vh', background: '#f8fafc' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', gap: '20px', flexWrap: 'wrap' }}>
                <div>
                    <Title level={1} style={{ margin: 0, fontWeight: 800, fontSize: 'clamp(1.4rem, 4vw, 1.85rem)', color: '#1e293b', letterSpacing: '-0.02em' }}>
                        Meta Ads Integration
                    </Title>
                    <Text type="secondary" style={{ fontSize: '13px' }}>Integrate your Meta Ads (Facebook/Instagram) for enhanced tracking</Text>
                </div>
                <Button
                    type="primary"
                    icon={<SaveOutlined style={{ fontSize: '15px' }} />}
                    size="large"
                    style={{
                        borderRadius: '10px',
                        height: '42px',
                        padding: '0 24px',
                        fontSize: '14px',
                        fontWeight: 600,
                        background: '#084b8a',
                        border: 'none',
                        boxShadow: '0 4px 12px rgba(8, 75, 138, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}
                >
                    Connect Meta
                </Button>
            </div>

            <div style={cardStyle} className="hover-card">
                <div style={headerGradient}>
                    <Space size={16}>
                        <div style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.18)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)' }}>
                            <LinkOutlined style={{ fontSize: '20px', color: '#fff' }} />
                        </div>
                        <div>
                            <Title level={4} style={{ color: '#fff', margin: 0, fontWeight: 700, fontSize: '16px', letterSpacing: '-0.01em' }}>Configuration Details</Title>
                            <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: '12px' }}>Setup your Meta Pixel and API tokens</Text>
                        </div>
                    </Space>
                </div>

                <div style={{ padding: '32px' }}>
                    <div style={{ marginBottom: '24px' }}>
                        <Text strong style={{ display: 'block', marginBottom: '8px', color: '#334155', fontSize: '14px' }}>Pixel ID</Text>
                        <Input
                            placeholder="Enter your Pixel ID"
                            size="large"
                            className="premium-input"
                            style={{ width: '100%', height: '46px' }}
                        />
                    </div>

                    <div style={{ marginBottom: '32px' }}>
                        <Text strong style={{ display: 'block', marginBottom: '8px', color: '#334155', fontSize: '14px' }}>Conversion API Access Token</Text>
                        <Input.Password
                            placeholder="Enter your Access Token"
                            size="large"
                            className="premium-input"
                            style={{ width: '100%', height: '46px' }}
                        />
                    </div>

                    <Space size="middle" wrap>
                        <Button type="primary" size="large" style={{ borderRadius: '10px', padding: '0 32px', height: '44px', fontWeight: 600, minWidth: '160px' }}>
                            Connect Meta Ads
                        </Button>
                        <Button size="large" style={{ borderRadius: '10px', padding: '0 32px', height: '44px', background: '#f8fafc', fontWeight: 500, minWidth: '160px' }}>
                            Test Connection
                        </Button>
                    </Space>
                </div>
            </div>

            <style>
                {`
                    .premium-input {
                        border-radius: 12px !important;
                        border: 1px solid #e2e8f0 !important;
                        padding: 10px 16px !important;
                        background: #ffffff !important;
                        font-size: 14px !important;
                        transition: all 0.2s !important;
                    }
                    .premium-input:hover, .premium-input:focus {
                        border-color: #084b8a !important;
                        box-shadow: 0 0 0 3px rgba(8, 75, 138, 0.08) !important;
                    }
                    .hover-card:hover {
                        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02) !important;
                    }
                `}
            </style>
        </div>
    );
};

export default MetaAdsIntegration;
