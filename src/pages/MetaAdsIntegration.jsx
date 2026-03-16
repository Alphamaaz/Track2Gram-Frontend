import { useState, useEffect, useCallback } from 'react';
import { Typography, Input, Button, Space, Form, Skeleton, App, Row, Col, Alert, Select } from 'antd';
import { SaveOutlined, LinkOutlined, RocketOutlined, GithubOutlined } from '@ant-design/icons';
import { settingsService } from '../services/settings';
import { metaAdsService } from '../services/metaAds';

const { Title, Text } = Typography;

const META_EVENT_OPTIONS = [
    { value: 'Subscribe', label: 'Subscribe' },
    { value: 'Lead', label: 'Lead' },
    { value: 'LeadInitiated', label: 'LeadInitiated' },
    { value: 'SubscribeInitiated', label: 'SubscribeInitiated' },
];

const MetaAdsIntegration = () => {
    const { message, modal } = App.useApp();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [integrationScope, setIntegrationScope] = useState('platform');
    const [workspaceId, setWorkspaceId] = useState(null);
    const [allSettings, setAllSettings] = useState({});
    const [statusData, setStatusData] = useState(null);
    const [statusLoading, setStatusLoading] = useState(false);
    const [statusError, setStatusError] = useState(null);

    const mapMetaError = useCallback((rawMessage) => {
        const msg = String(rawMessage || '').trim();
        if (!msg) {
            return null;
        }

        if (/ads_management|ads_read/i.test(msg)) {
            return {
                title: 'Meta Ads permissions are missing',
                description: msg,
            };
        }

        if (/permission|forbidden|not authorized|oauth/i.test(msg)) {
            return {
                title: 'Meta connection permission error',
                description: msg,
            };
        }

        return {
            title: 'Meta integration error',
            description: msg,
        };
    }, []);

    const fetchStatus = useCallback(async () => {
        try {
            setStatusLoading(true);
            setStatusError(null);
            const status = await metaAdsService.getStatus();
            if (status.success) {
                setStatusData(status.data);
                if (status.data?.error) {
                    setStatusError(status.data.error);
                }
            }
        } catch (error) {
            console.error('Failed to fetch status:', error);
            setStatusError(error?.message || 'Failed to fetch Meta integration status');
        } finally {
            setStatusLoading(false);
        }
    }, []);

    const fetchSettings = useCallback(async (silent = false) => {
        try {
            if (!silent) setLoading(true);
            const data = await settingsService.getSettings();
            setAllSettings(data);
            form.setFieldsValue(data);

            // Set scope and workspaceId from fetched settings
            setIntegrationScope(data.scope || 'platform');
            setWorkspaceId(data.workspaceId || null);

            // Also fetch technical status
            fetchStatus();
        } catch (error) {
            console.error('Failed to fetch settings:', error);
            if (!silent) message.error(error.message || 'Failed to load settings');
        } finally {
            if (!silent) setLoading(false);
        }
    }, [form, message, fetchStatus]);

    useEffect(() => {
        fetchSettings(false); // Initial load with skeleton
    }, [fetchSettings]);

    const onFinish = async (values) => {
        try {
            setSaving(true);
            const selectedEventName = values?.META_EVENT_NAME;
            const isValidEvent = META_EVENT_OPTIONS.some((option) => option.value === selectedEventName);
            if (!isValidEvent) {
                message.error('Please select a valid Meta event from the dropdown.');
                return;
            }
            // Combine existing settings with new form values, scope and workspaceId
            const payload = {
                ...allSettings,
                ...values,
                META_EVENT_NAME: selectedEventName,
                scope: integrationScope,
                workspaceId: workspaceId
            };
            await settingsService.updateSettings(payload);

            // Refresh status immediately and wait for it to show real progress
            const status = await metaAdsService.getStatus();
            if (status.success) {
                setStatusData(status.data);
                if (status.data?.error) {
                    setStatusError(status.data.error);
                } else {
                    setStatusError(null);
                }
                if (status.data.isConfigured) {
                    message.success('Configuration saved. Meta Ads is now LIVE and ACTIVE.');
                } else {
                    message.warning('Settings saved, but technical connection is still incomplete.');
                }
            } else {
                message.success('Configuration saved successfully');
            }

            // Silent refresh of form data in background
            fetchSettings(true);
        } catch (error) {
            console.error('Failed to update settings:', error);
            const backendMessage = error?.message || error?.error || 'Failed to update settings';
            setStatusError(backendMessage);
            if (/permission|permissions|oauth|access token|not configured|not connected/i.test(String(backendMessage))) {
                message.error(`Meta connection error: ${backendMessage}`);
            } else {
                message.error(backendMessage);
            }
        } finally {
            setSaving(false);
        }
    };

    const handleDisconnect = () => {
        modal.confirm({
            title: 'Disconnect Meta Ads?',
            content: 'Are you sure you want to disconnect Meta Ads? This will clear your credentials and disable server-side tracking.',
            okText: 'Disconnect',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk: async () => {
                try {
                    setSaving(true);
                    await metaAdsService.disconnect();
                    message.success('Meta Ads disconnected successfully');
                    form.resetFields();
                    fetchSettings();
                } catch (error) {
                    console.error('Failed to disconnect:', error);
                    message.error(error.message || 'Failed to disconnect Meta Ads');
                } finally {
                    setSaving(false);
                }
            }
        });
    };

    // Removed handleCheckStatus as its functionality is covered by fetchSettings (called on Save/Refresh)
    // and the status indicator is updated automatically.

    if (loading) {
        return (
            <div style={{ padding: '24px 20px', maxWidth: '1100px', margin: '0 auto' }}>
                <Skeleton active title={{ width: 300 }} paragraph={{ rows: 10 }} />
            </div>
        );
    }

    const cardStyle = {
        borderRadius: '24px',
        border: '1px solid rgba(226, 232, 240, 0.7)',
        background: '#ffffff',
        boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.04)',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        maxWidth: '1100px',
        margin: '0 auto',
        width: '100%',
        position: 'relative'
    };

    const headerGradient = {
        background: `linear-gradient(135deg, #084b8a 0%, #0a5a9e 100%)`, // Platform Blue
        padding: '24px 32px',
        color: '#fff',
    };

    const statusAlerts = [];
    const parsedStatusError = mapMetaError(statusError);
    if (parsedStatusError) {
        statusAlerts.push({
            type: 'error',
            message: parsedStatusError.title,
            description: parsedStatusError.description,
        });
    }
    if (statusData) {
        if (!statusData.accessTokenSet) {
            statusAlerts.push({
                type: 'error',
                message: 'Meta Access Token is missing',
                description: 'Add a valid Meta Conversion API Access Token to connect your workspace.',
            });
        }
        if (!statusData.pixelIdSet) {
            statusAlerts.push({
                type: 'error',
                message: 'Meta Pixel is not connected',
                description: 'Enter a valid Pixel ID so events can be sent to the correct data source.',
            });
        }
        if (!statusData.adAccountIdSet) {
            statusAlerts.push({
                type: 'warning',
                message: 'Meta Ad Account is not connected',
                description: 'Set your Meta Ad Account ID to enable ad spend sync and account-level validation.',
            });
        }
        if (statusData.adAccountIdSet && statusData.adAccountAccessChecked && !statusData.adAccountAccessOk && statusData.error) {
            const parsedApiError = mapMetaError(statusData.error);
            statusAlerts.push({
                type: 'error',
                message: parsedApiError?.title || 'Meta Ad Account access failed',
                description: parsedApiError?.description || statusData.error,
            });
        }
        if (!statusData.isConfigured && statusData.accessTokenSet && statusData.pixelIdSet) {
            statusAlerts.push({
                type: 'warning',
                message: 'Meta integration is incomplete',
                description: 'Credentials are present, but the connection is still not fully configured. Save settings after selecting an event.',
            });
        }
    }

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', minHeight: '100vh', background: '#f8fafc' }}>
            {/* Header Section */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px', gap: '20px', flexWrap: 'wrap' }}>
                <div>
                    <Title level={1} style={{ margin: 0, fontWeight: 800, fontSize: 'clamp(1.6rem, 5vw, 2.2rem)', color: '#1e293b', letterSpacing: '-0.02em' }}>
                        Meta Ads Integration
                    </Title>
                    <Text type="secondary" style={{ fontSize: '14px', marginTop: '4px', display: 'block' }}>
                        Configure Meta Pixel and Conversion API (CAPI) for advanced event tracking
                    </Text>
                </div>
            </div>

            {statusAlerts.length > 0 && (
                <Space direction="vertical" size={12} style={{ width: '100%', marginBottom: 20 }}>
                    {statusAlerts.map((alert, idx) => (
                        <Alert
                            key={`${alert.type}-${idx}`}
                            type={alert.type}
                            showIcon
                            message={alert.message}
                            description={alert.description}
                        />
                    ))}
                </Space>
            )}

            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                requiredMark={false}
                autoComplete="off"
            >
                <div style={cardStyle} className="hover-card">
                    <div style={headerGradient}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Space size={20}>
                                <div style={{
                                    width: '52px', height: '52px',
                                    background: 'rgba(255,255,255,0.15)',
                                    borderRadius: '14px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    backdropFilter: 'blur(10px)',
                                    border: '1px solid rgba(255,255,255,0.2)'
                                }}>
                                    <RocketOutlined style={{ fontSize: '26px', color: '#fff' }} />
                                </div>
                                <div>
                                    <Title level={3} style={{ color: '#fff', margin: 0, fontWeight: 700, fontSize: '18px', letterSpacing: '-0.01em' }}>
                                        CAPI Setup
                                    </Title>
                                    <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: '12px' }}>
                                        Reliable server-side tracking via Meta Conversion API
                                    </Text>
                                </div>
                            </Space>
                            <div style={{
                                background: statusData?.isConfigured ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.1)',
                                padding: '6px 16px',
                                borderRadius: '30px',
                                border: `1px solid ${statusData?.isConfigured ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
                                backdropFilter: 'blur(4px)'
                            }}>
                                <Space size={8}>
                                    <div style={{
                                        width: '8px',
                                        height: '8px',
                                        borderRadius: '50%',
                                        background: statusLoading ? '#94a3b8' : (statusData?.isConfigured ? '#10b981' : '#ff4d4f'),
                                        boxShadow: statusLoading ? 'none' : `0 0 8px ${statusData?.isConfigured ? '#10b981' : '#ff4d4f'}`,
                                        animation: (statusData?.isConfigured && !statusLoading) ? 'pulse-green 2s infinite' : 'none'
                                    }} />
                                    <Text style={{ color: '#fff', fontSize: '11px', fontWeight: 700, letterSpacing: '0.05em' }}>
                                        {statusLoading ? 'CHECKING...' : (statusData?.isConfigured ? 'CAPI ACTIVE' : 'DISCONNECTED')}
                                    </Text>
                                </Space>
                            </div>
                        </div>
                    </div>

                    <div style={{ padding: '40px' }}>

                        <Row gutter={[32, 24]}>
                            <Col xs={24} lg={12}>
                                <Form.Item
                                    label={<Text strong style={{ color: '#334155', fontSize: '14px' }}>Meta Pixel ID</Text>}
                                    name="META_PIXEL_ID"
                                    rules={[{ required: true, message: 'Please enter your Pixel ID' }]}
                                    tooltip="The numeric ID of your Meta Pixel found in Events Manager"
                                >
                                    <Input
                                        placeholder="Enter Pixel ID"
                                        size="large"
                                        className="premium-input-field"
                                        style={{ height: '50px' }}
                                        prefix={<LinkOutlined style={{ color: '#cbd5e1', marginRight: '8px' }} />}
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} lg={12}>
                                <Form.Item
                                    label={<Text strong style={{ color: '#334155', fontSize: '14px' }}>Pixel Event Name</Text>}
                                    name="META_EVENT_NAME"
                                    rules={[
                                        { required: true, message: 'Please select a Meta event name' },
                                        {
                                            validator: (_, value) => {
                                                if (!value || META_EVENT_OPTIONS.some((option) => option.value === value)) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(new Error('Please select a valid Meta event from the list'));
                                            }
                                        }
                                    ]}
                                    tooltip="Select the event name that should be sent to Meta Conversion API"
                                >
                                    <Select
                                        placeholder="Select Meta event"
                                        size="large"
                                        className="premium-input-field premium-select-field"
                                        style={{ height: '50px' }}
                                        options={META_EVENT_OPTIONS}
                                        showSearch
                                        optionFilterProp="label"
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24}>
                                <Form.Item
                                    label={<Text strong style={{ color: '#334155', fontSize: '14px' }}>Meta Ad Account ID</Text>}
                                    name="META_AD_ACCOUNT_ID"
                                    rules={[{ required: true, message: 'Please enter your Ad Account ID' }]}
                                    tooltip="Enter your Meta Ad Account ID (e.g., act_123456789)"
                                >
                                    <Input
                                        placeholder="Enter Ad Account ID"
                                        size="large"
                                        className="premium-input-field"
                                        style={{ height: '50px' }}
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24}>
                                <Form.Item
                                    label={<Text strong style={{ color: '#334155', fontSize: '14px' }}>Conversion API Access Token</Text>}
                                    name="META_ACCESS_TOKEN"
                                    rules={[{ required: true, message: 'Please enter your Access Token' }]}
                                    tooltip="Generate this in Meta Events Manager > Settings > Conversions API > Generate access token"
                                >
                                    <Input.Password
                                        placeholder="Enter Access Token"
                                        size="large"
                                        className="premium-input-field"
                                        style={{ height: '50px' }}
                                    />
                                </Form.Item>
                            </Col>
                           
                        </Row>

                        <div style={{ marginTop: '40px', paddingTop: '32px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                            <Space size={20}>
                                {statusData?.isConfigured && (
                                    <Button
                                        danger
                                        type="text"
                                        icon={<LinkOutlined rotate={45} />}
                                        onClick={handleDisconnect}
                                        style={{ fontWeight: 600, borderRadius: '10px', height: '42px' }}
                                    >
                                        Disconnect
                                    </Button>
                                )}
                                <Button
                                    type="primary"
                                    size="large"
                                    loading={saving}
                                    icon={<SaveOutlined />}
                                    onClick={() => form.submit()}
                                    style={{
                                        borderRadius: '10px',
                                        padding: '0 30px',
                                        height: '42px',
                                        fontWeight: 600,
                                        minWidth: '180px',
                                        background: '#084b8a',
                                        boxShadow: '0 4px 12px -2px rgba(8, 75, 138, 0.2)',
                                        border: 'none'
                                    }}
                                >
                                    {saving ? 'Processing...' : 'Save & Update'}
                                </Button>
                            </Space>
                        </div>
                    </div>

                    {/* Decorative background element */}
                    <div style={{
                        position: 'absolute',
                        bottom: '-20px',
                        right: '-20px',
                        opacity: 0.03,
                        pointerEvents: 'none'
                    }}>
                        <GithubOutlined style={{ fontSize: '200px' }} />
                    </div>
                </div>
            </Form>

            <style>
                {`
                    .premium-input-field {
                        border-radius: 12px !important;
                        border: 1.5px solid #e2e8f0 !important;
                        padding: 12px 16px !important;
                        background: #ffffff !important;
                        font-size: 15px !important;
                        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
                    }
                    .premium-input-field:hover {
                        border-color: #cbd5e1 !important;
                    }
                    .premium-input-field:focus, .ant-input-affix-wrapper-focused.premium-input-field {
                        border-color: #084b8a !important;
                        box-shadow: 0 0 0 4px rgba(8, 75, 138, 0.1) !important;
                    }
                    .premium-select-field .ant-select-selector {
                        border-radius: 12px !important;
                        border: 1.5px solid #e2e8f0 !important;
                        min-height: 50px !important;
                        display: flex !important;
                        align-items: center !important;
                        box-shadow: none !important;
                    }
                    .premium-select-field.ant-select-focused .ant-select-selector {
                        border-color: #084b8a !important;
                        box-shadow: 0 0 0 4px rgba(8, 75, 138, 0.1) !important;
                    }
                    .ant-form-item-label {
                        padding-bottom: 10px !important;
                    }
                    .hover-card:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 20px 40px -4px rgba(0, 0, 0, 0.08) !important;
                    }
                    .ant-input-password-icon {
                        color: #94a3b8 !important;
                    }
                    @keyframes pulse-green {
                        0% { boxShadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
                        70% { boxShadow: 0 0 0 10px rgba(16, 185, 129, 0); }
                        100% { boxShadow: 0 0 0 0 rgba(16, 185, 129, 0); }
                    }
                `}
            </style>
        </div>
    );
};

export default MetaAdsIntegration;
