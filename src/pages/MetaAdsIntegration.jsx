import React from 'react';
import { Typography, Input, Button, Card, Space, Breadcrumb } from 'antd';

const { Title, Text } = Typography;

const MetaAdsIntegration = () => {
    return (
        <div style={{ padding: 'clamp(16px, 5vw, 40px) clamp(8px, 3vw, 24px)', maxWidth: '1200px', margin: '0 auto', background: '#fff', minHeight: '100%' }}>
            <Title level={2} style={{ marginBottom: '8px', fontWeight: 600, fontSize: 'clamp(1.5rem, 4vw, 2rem)' }}>Meta Ads Integration</Title>
            <Text type="secondary" style={{ display: 'block', marginBottom: 'clamp(24px, 6vw, 40px)', fontSize: 'clamp(14px, 2vw, 16px)' }}>
                Integrate your Meta Ads (Facebook/Instagram) with Track Bridge for enhanced tracking.
            </Text>

            <Card
                style={{
                    borderRadius: '12px',
                    border: '1px solid #f0f0f0',
                    boxShadow: 'none',
                    background: '#fff'
                }}
                bodyStyle={{ padding: 'clamp(16px, 4vw, 32px)' }}
            >
                <div style={{ marginBottom: '24px' }}>
                    <Text strong style={{ display: 'block', marginBottom: '12px', fontSize: '15px' }}>Pixel ID</Text>
                    <Input
                        placeholder="Enter your Pixel ID"
                        size="large"
                        style={{ borderRadius: '10px', width: '100%', maxWidth: '600px', height: '48px' }}
                    />
                </div>

                <div style={{ marginBottom: '32px' }}>
                    <Text strong style={{ display: 'block', marginBottom: '12px', fontSize: '15px' }}>Conversion API Access Token</Text>
                    <Input
                        placeholder="Enter your Access Token"
                        size="large"
                        style={{ borderRadius: '10px', width: '100%', maxWidth: '600px', height: '48px' }}
                    />
                </div>

                <Space size="middle" wrap style={{ width: '100%' }}>
                    <Button type="primary" size="large" style={{ borderRadius: '10px', padding: '0 32px', height: '48px', fontWeight: 500, minWidth: '160px' }}>
                        Connect Meta Ads
                    </Button>
                    <Button size="large" style={{ borderRadius: '10px', padding: '0 32px', height: '48px', background: '#f5f5f5', border: 'none', minWidth: '160px' }}>
                        Test Connection
                    </Button>
                </Space>
            </Card>
        </div>
    );
};

export default MetaAdsIntegration;
