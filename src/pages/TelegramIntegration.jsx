import { useState, useEffect, useCallback } from 'react';
import { Typography, Button, Card, Space, Form, Input, Skeleton, App, Row, Col } from 'antd';
import { SaveOutlined, SendOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { settingsService } from '../services/settings';

const { Title, Text } = Typography;

const TelegramIntegration = () => {
    const { message } = App.useApp();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [tokenVisible, setTokenVisible] = useState(false);

    const fetchSettings = useCallback(async () => {
        try {
            setLoading(true);
            const data = await settingsService.getSettings();
            console.log('settings response (TelegramIntegration)', data); // debug token issue
            console.log('TELEGRAM_BOT_TOKEN present?', 'TELEGRAM_BOT_TOKEN' in data, 'value:', data?.TELEGRAM_BOT_TOKEN);
            console.log('Response keys:', Object.keys(data));
            form.setFieldsValue(data);
        } catch (error) {
            console.error('Failed to fetch settings:', error);
            message.error(error.message || 'Failed to load settings');
        } finally {
            setLoading(false);
        }
    }, [form, message]);

    useEffect(() => {
        fetchSettings();
    }, [fetchSettings]);

    const onFinish = async (values) => {
        try {
            setSaving(true);
            await settingsService.updateSettings(values);
            message.success('Telegram settings updated successfully');
            fetchSettings();
        } catch (error) {
            console.error('Failed to update settings:', error);
            message.error(error.message || 'Failed to update settings');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div style={{ padding: 'clamp(24px, 5vw, 60px) clamp(16px, 3vw, 32px)', maxWidth: '1400px', margin: '0 auto' }}>
                <Skeleton active title={{ width: 300 }} paragraph={{ rows: 8 }} />
            </div>
        );
    }

    const cardStyle = {
        borderRadius: '20px',
        border: '1px solid rgba(226, 232, 240, 0.7)',
        background: '#ffffff',
        boxShadow: '0 4px 20px -5px rgba(0, 0, 0, 0.05)',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        maxWidth: '1100px',
        margin: '0 auto'
    };

    const headerGradient = {
        background: `linear-gradient(135deg, #084b8a 0%, #0a5a9e 100%)`,
        padding: '12px 24px',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
    };

    return (
        <div style={{ padding: '16px 20px', maxWidth: '1200px', margin: '0 auto', minHeight: '100vh', background: '#f8fafc' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', gap: '20px', flexWrap: 'wrap' }}>
                <div>
                    <Title level={1} style={{ margin: 0, fontWeight: 800, fontSize: 'clamp(1.4rem, 4vw, 1.85rem)', color: '#1e293b', letterSpacing: '-0.02em' }}>
                        Telegram Integration
                    </Title>
                    <Text type="secondary" style={{ fontSize: '13px' }}>Connect and manage your Telegram bot relay settings</Text>
                </div>
                <Button
                    type="primary"
                    icon={<SaveOutlined style={{ fontSize: '15px' }} />}
                    size="large"
                    loading={saving}
                    onClick={() => form.submit()}
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
                    className="sync-button"
                >
                    Sync Telegram
                </Button>
            </div>

            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                requiredMark={false}
                autoComplete="off"
            >
                <div style={cardStyle} className="hover-card">
                    <div style={headerGradient}>
                        <Space size={16}>
                            <div style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.18)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)' }}>
                                <SendOutlined style={{ fontSize: '18px', color: '#fff' }} />
                            </div>
                            <div>
                                <Title level={4} style={{ color: '#fff', margin: 0, fontWeight: 700, fontSize: '16px', letterSpacing: '-0.01em' }}>Relay Configuration</Title>
                                <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: '12px' }}>Configure your bot and target channel</Text>
                            </div>
                        </Space>
                    </div>

                    <div style={{ padding: '32px' }}>
                        <Form.Item
                            label={<Text strong style={{ color: '#334155', fontSize: '14px' }}>Bot API Token</Text>}
                            name="TELEGRAM_BOT_TOKEN"
                            extra={<Text type="secondary" style={{ fontSize: '12px', marginTop: '4px', display: 'block' }}>Obtain this from @BotFather on Telegram</Text>}
                            style={{ marginBottom: '28px' }}
                        >
                            <Input.Password 
                                size="large" 
                                className="premium-input" 
                                placeholder="e.g. 123456789:ABCDefgh..." 
                                visibilityToggle={{
                                    visible: tokenVisible,
                                    onVisibleChange: setTokenVisible,
                                }}
                            />
                        </Form.Item>
                        {form.getFieldValue('TELEGRAM_BOT_TOKEN') && (
                            <div style={{ marginBottom: '28px' }}>
                                <Text type="secondary" style={{ fontSize: '12px' }}>
                                    Current token (copyable):{' '}
                                    <Text copyable>{form.getFieldValue('TELEGRAM_BOT_TOKEN')}</Text>
                                </Text>
                            </div>
                        )}

                        <Row gutter={24}>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    label={<Text strong style={{ color: '#334155', fontSize: '14px' }}>Bot Username</Text>}
                                    name="TELEGRAM_BOT_USERNAME"
                                    style={{ marginBottom: '28px' }}
                                >
                                    <Input size="large" className="premium-input" placeholder="YourBotName" prefix={<span style={{ color: '#94a3b8', marginRight: '4px' }}>@</span>} />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    label={<Text strong style={{ color: '#334155', fontSize: '14px' }}>Target Chat ID</Text>}
                                    name="TELEGRAM_CHANNEL_ID"
                                    style={{ marginBottom: '28px' }}
                                >
                                    <Input size="large" className="premium-input" placeholder="-100123456789" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item
                            label={<Text strong style={{ color: '#334155', fontSize: '14px' }}>Telegram Channel Link</Text>}
                            name="TELEGRAM_REDIRECT_URL"
                            style={{ marginBottom: 0 }}
                        >
                            <Input size="large" className="premium-input" placeholder="https://t.me/your_channel_link" />
                        </Form.Item>
                    </div>
                </div>
            </Form>

            <style>
                {`
                    .premium-input, .premium-input .ant-input-password-input {
                        border-radius: 12px !important;
                        border: 1px solid #e2e8f0 !important;
                        padding: 10px 16px !important;
                        background: #ffffff !important;
                        font-size: 14px !important;
                        transition: all 0.2s !important;
                    }
                    .ant-input-affix-wrapper.premium-input {
                        padding: 0 16px !important;
                        height: 46px;
                        display: flex;
                        align-items: center;
                    }
                    .premium-input:hover, .ant-input-affix-wrapper-focused.premium-input {
                        border-color: #084b8a !important;
                        box-shadow: 0 0 0 3px rgba(8, 75, 138, 0.08) !important;
                    }
                    .ant-form-item-label {
                        padding-bottom: 8px !important;
                    }
                    .hover-card:hover {
                        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02) !important;
                    }
                    .sync-button:hover {
                        filter: brightness(1.1);
                        transform: translateY(-1px);
                    }
                    .sync-button:active {
                        transform: translateY(0);
                    }
                `}
            </style>
        </div>
    );
};

export default TelegramIntegration;
