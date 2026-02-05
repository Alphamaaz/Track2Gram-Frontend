import React from 'react';
import { Typography, Button, Card, Space } from 'antd';

const { Title, Text } = Typography;

const GoogleAdsIntegration = () => {
    return (
        <div style={{ padding: 'clamp(16px, 5vw, 40px) clamp(8px, 3vw, 24px)', maxWidth: '1200px', margin: '0 auto', background: '#fff', minHeight: '100%' }}>
            <Title level={2} style={{ marginBottom: '8px', fontWeight: 600, fontSize: 'clamp(1.5rem, 4vw, 2rem)' }}>Google Ads Integration</Title>
            <Text type="secondary" style={{ display: 'block', marginBottom: 'clamp(24px, 6vw, 40px)', fontSize: 'clamp(14px, 2vw, 16px)' }}>
                Integrate your Google Ads account via OAuth.
            </Text>

            <Card
                style={{
                    borderRadius: '12px',
                    border: '1px solid #f0f0f0',
                    boxShadow: 'none',
                    textAlign: 'center',
                    padding: 'clamp(32px, 8vw, 60px) clamp(16px, 4vw, 32px)',
                    background: '#fff'
                }}
            >
                <Title level={4} style={{ marginBottom: '16px', fontWeight: 600, fontSize: 'clamp(1.1rem, 3vw, 1.25rem)' }}>Connect Google Ads Account</Title>
                <Text type="secondary" style={{ display: 'block', marginBottom: 'clamp(24px, 6vw, 40px)', maxWidth: '500px', margin: '0 auto clamp(24px, 6vw, 40px)', fontSize: 'clamp(14px, 2vw, 15px)' }}>
                    Connect your Google Ads account to Track Bridge to track conversions and optimize your campaigns.
                </Text>
                <Button type="primary" size="large" style={{ borderRadius: '10px', width: '100%', maxWidth: '300px', height: '48px', fontWeight: 500 }}>
                    Connect Google Ads
                </Button>
            </Card>
        </div>
    );
};

export default GoogleAdsIntegration;
