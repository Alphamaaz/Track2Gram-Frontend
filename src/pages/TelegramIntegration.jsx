import React from 'react';
import { Typography, Input, Button, Card, Space } from 'antd';

const { Title, Text } = Typography;

const TelegramIntegration = () => {
    return (
        <div style={{ padding: 'clamp(16px, 5vw, 40px) clamp(8px, 3vw, 24px)', maxWidth: '1200px', margin: '0 auto', background: '#fff', minHeight: '100%' }}>
            <Title level={2} style={{ marginBottom: '8px', fontWeight: 600, fontSize: 'clamp(1.5rem, 4vw, 2rem)' }}>Telegram Integration</Title>
            <Text type="secondary" style={{ display: 'block', marginBottom: 'clamp(24px, 6vw, 40px)', fontSize: 'clamp(14px, 2vw, 16px)' }}>
                Integrate your telegram bot for subscription tracking.
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
                    <Text strong style={{ display: 'block', marginBottom: '12px', fontSize: '15px' }}>Bot Token</Text>
                    <Input
                        placeholder="Enter your token"
                        size="large"
                        style={{ borderRadius: '10px', width: '100%', maxWidth: '600px', height: '48px' }}
                    />
                </div>

                <div style={{ marginBottom: '32px' }}>
                    <Text strong style={{ display: 'block', marginBottom: '12px', fontSize: '15px' }}>Channel/Group Username</Text>
                    <Input
                        placeholder="Enter your username"
                        size="large"
                        style={{ borderRadius: '10px', width: '100%', maxWidth: '600px', height: '48px' }}
                    />
                </div>

                <Button type="primary" size="large" style={{ borderRadius: '10px', width: '100%', maxWidth: '300px', height: '48px', fontWeight: 500 }}>
                    Connect Telegram
                </Button>
            </Card>
        </div>
    );
};

export default TelegramIntegration;
