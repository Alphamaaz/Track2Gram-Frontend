import { useState, useEffect, useCallback } from 'react';
import { Typography, Button, Card, Space, Form, Input, Skeleton, message, Row, Col } from 'antd';
import { SaveOutlined, SendOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { settingsService } from '../services/settings';

const { Title, Text } = Typography;

const TelegramIntegration = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const fetchSettings = useCallback(async () => {
        try {
            setLoading(true);
            const data = await settingsService.getSettings();
            form.setFieldsValue(data);
        } catch (error) {
            console.error('Failed to fetch settings:', error);
            message.error(error.message || 'Failed to load settings');
        } finally {
            setLoading(false);
        }
    }, [form]);

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
        borderRadius: '24px',
        border: '1px solid rgba(226, 232, 240, 0.8)',
        background: '#ffffff',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.04), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
        overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        maxWidth: '800px',
        margin: '0 auto'
    };

    const headerGradient = {
        background: `linear-gradient(135deg, #084b8a 0%, #0a5a9e 100%)`,
        padding: '32px',
        color: '#fff',
    };

    return (
        <div style={{ padding: '24px clamp(16px, 3vw, 40px)', maxWidth: '1200px', margin: '0 auto', minHeight: '100vh', background: '#f8fafc' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', gap: '20px', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '300px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>

                        <Title level={1} style={{ margin: 0, fontWeight: 800, fontSize: 'clamp(1.75rem, 5vw, 2.5rem)', color: '#0f172a', letterSpacing: '-0.025em' }}>
                            Telegram Integration
                        </Title>
                    </div>

                </div>
                <Button
                    type="primary"
                    icon={<SaveOutlined style={{ fontSize: '16px' }} />}
                    size="large"
                    loading={saving}
                    onClick={() => form.submit()}
                    style={{
                        borderRadius: '10px',
                        height: '38px',
                        padding: '0 20px',
                        fontSize: '14px',
                        fontWeight: 600,
                        background: '#084b8a',
                        border: 'none',
                        boxShadow: '0 4px 12px rgba(8, 75, 138, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'all 0.3s'
                    }}
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
                style={{ maxWidth: '800px', margin: '0 auto' }}
            >
                <div style={cardStyle} className="hover-card">
                    <div style={headerGradient}>
                        <Space size={14}>
                            <div style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.15)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
                                <SendOutlined style={{ fontSize: '22px', color: '#fff' }} />
                            </div>
                            <div>
                                <Title level={4} style={{ color: '#fff', margin: 0, fontWeight: 700, fontSize: '16px' }}>Relay Configuration</Title>
                                <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: '11px' }}>Setup your Telegram bot and channel details</Text>
                            </div>
                        </Space>
                    </div>
                    <div style={{ padding: '24px 32px' }}>
                        <Form.Item
                            label={<Text strong style={{ color: '#000000', fontSize: '14px' }}>Bot API Token</Text>}
                            name="TELEGRAM_BOT_TOKEN"
                            extra={<Text type="secondary" style={{ fontSize: '11px' }}>Obtain this from @BotFather on Telegram</Text>}
                        >
                            <Input.Password size="large" className="premium-input" placeholder="e.g. 123456789:ABCDefgh..." />
                        </Form.Item>

                        <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', margin: '16px 0 24px', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)' }}>
                            <Row gutter={24}>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        label={<Text strong style={{ color: '#000000', fontSize: '14px' }}>Bot Username</Text>}
                                        name="TELEGRAM_BOT_USERNAME"
                                    >
                                        <Input size="large" className="premium-input" placeholder="YourBotName" prefix={<span style={{ color: '#94a3b8' }}>@</span>} />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        label={<Text strong style={{ color: '#000000', fontSize: '14px' }}>Target Chat ID</Text>}
                                        name="TELEGRAM_CHANNEL_ID"
                                    >
                                        <Input size="large" className="premium-input" placeholder="-100123456789" />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </div>

                        <Form.Item
                            label={<Text strong style={{ color: '#000000', fontSize: '14px' }}>External Redirect Link</Text>}
                            name="TELEGRAM_REDIRECT_URL"
                        >
                            <Input size="large" className="premium-input" placeholder="https://t.me/your_channel_link" />
                        </Form.Item>
                    </div>
                </div>
            </Form>

            <style>
                {`
                    .premium-input, .premium-select .ant-select-selector {
                        border-radius: 12px !important;
                        border: 1px solid #e2e8f0 !important;
                        padding: 10px 16px !important;
                        background: #ffffff !important;
                    }
                    .premium-select .ant-select-selector {
                        height: 48px !important;
                        display: flex !important;
                        align-items: center !important;
                    }
                    .premium-input:hover, .premium-input:focus, .premium-select:hover .ant-select-selector {
                        border-color: #084b8a !important;
                        box-shadow: 0 0 0 4px rgba(8, 75, 138, 0.1) !important;
                    }
                    .ant-form-item-label {
                        padding-bottom: 6px !important;
                    }
                    .hover-card:hover {
                        transform: translateY(-4px);
                        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.06), 0 10px 10px -5px rgba(0, 0, 0, 0.04) !important;
                    }
                `}
            </style>
        </div>
    );
};

export default TelegramIntegration;
