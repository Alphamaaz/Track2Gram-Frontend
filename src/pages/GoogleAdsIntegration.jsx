import { useState, useEffect, useCallback } from 'react';
import { Typography, Button, Card, Space, Form, Input, Skeleton, message, Tag, Row, Col, Divider, Select } from 'antd';
import { QuestionCircleOutlined, SaveOutlined, GoogleOutlined, SendOutlined } from '@ant-design/icons';
import { settingsService } from '../services/settings';

const { Title, Text } = Typography;

const GoogleAdsIntegration = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState(null);

    const fetchSettings = useCallback(async () => {
        try {
            setLoading(true);
            const data = await settingsService.getSettings();
            setSettings(data);
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
            message.success('Settings updated successfully');
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
                <Skeleton active title={{ width: 300 }} paragraph={{ rows: 12 }} />
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
        height: '100%',
    };

    const headerGradient = (color1, color2) => ({
        background: `linear-gradient(135deg, ${color1} 0%, ${color2} 100%)`,
        padding: '24px',
        color: '#fff',
    });

    return (
        <div style={{ padding: '24px clamp(16px, 3vw, 40px)', maxWidth: '1200px', margin: '0 auto', minHeight: '100vh', background: '#f8fafc' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', gap: '20px', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '300px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <div style={{ width: '40px', height: '40px', background: '#084b8a', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(8, 75, 138, 0.3)' }}>
                            <GoogleOutlined style={{ fontSize: '20px', color: '#fff' }} />
                        </div>
                        <Title level={1} style={{ margin: 0, fontWeight: 800, fontSize: 'clamp(1.75rem, 5vw, 2.5rem)', color: '#0f172a', letterSpacing: '-0.025em' }}>
                            Integration Center
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
                    Update Infrastructure
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
                    <div style={headerGradient('#084b8a', '#0a5a9e')}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Space size={14}>
                                <div style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.15)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
                                    <GoogleOutlined style={{ fontSize: '22px', color: '#fff' }} />
                                </div>
                                <div>
                                    <Title level={4} style={{ color: '#fff', margin: 0, fontWeight: 700, fontSize: '16px' }}>Google Ads Configuration</Title>
                                    <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: '11px' }}>Manage your advertising engine settings</Text>
                                </div>
                            </Space>
                            {settings?.GOOGLE_ADS_REFRESH_TOKEN_SET ?
                                <Tag bordered={false} style={{ background: 'rgba(52, 211, 153, 0.2)', color: '#fff', borderRadius: '12px', padding: '2px 12px', fontWeight: 600, border: '1px solid rgba(52, 211, 153, 0.3)', fontSize: '11px' }}>
                                    Active Connection
                                </Tag> :
                                <Tag bordered={false} style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#fff', borderRadius: '12px', padding: '2px 12px', fontWeight: 600, border: '1px solid rgba(245, 158, 11, 0.3)', fontSize: '11px' }}>
                                    Action Required
                                </Tag>
                            }
                        </div>
                    </div>
                    <div style={{ padding: '24px 32px' }}>
                        <Row gutter={[24, 16]}>
                            <Col span={24}>
                                <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)' }}>
                                    <Row gutter={[24, 16]}>
                                        <Col xs={24} md={12}>
                                            <Form.Item
                                                label={<Text strong style={{ color: '#000000', fontSize: '14px' }}>Customer Account ID <span style={{ color: '#ef4444' }}>*</span></Text>}
                                                name="GOOGLE_ADS_CUSTOMER_ID"
                                                rules={[{ required: true, message: 'Required' }]}
                                            >
                                                <Input size="large" className="premium-input" placeholder="000-000-0000" />
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} md={12}>
                                            <Form.Item
                                                label={<Text strong style={{ color: '#000000', fontSize: '14px' }}>MCC ID (Manager) <span style={{ color: '#64748b', fontWeight: 400, fontSize: '12px', marginLeft: '4px' }}>(Optional)</span></Text>}
                                                name="GOOGLE_ADS_MCC_ID"
                                            >
                                                <Input size="large" className="premium-input" placeholder="Manager ID" />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </div>
                            </Col>
                            <Col xs={24} md={16} lg={12}>
                                <Form.Item
                                    label={<Text strong style={{ color: '#000000', fontSize: '14px' }}>Conversion Action Point</Text>}
                                    name="GOOGLE_ADS_CONVERSION_ACTION_ID"
                                    tooltip="Select the conversion action in your Google Ads account."
                                >
                                    <Select
                                        size="large"
                                        className="premium-select"
                                        placeholder="Select Conversion Action"
                                        options={[
                                            { value: 'default', label: 'Primary Conversion' },
                                            { value: 'signup', label: 'Sign-up Conversion' },
                                            { value: 'purchase', label: 'Purchase Conversion' }
                                        ]}
                                        style={{ width: '100%' }}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    </div>
                </div>
            </Form>
        </div>
    );
};

export default GoogleAdsIntegration;
