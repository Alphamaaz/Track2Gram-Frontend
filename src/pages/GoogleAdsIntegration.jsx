import { useState, useEffect, useCallback } from 'react';
import { Typography, Button, Form, Input, Skeleton, App, Tag, Row, Col, Select, Alert, Space, Card } from 'antd';
import { SaveOutlined, GoogleOutlined, LoadingOutlined, SyncOutlined, CheckCircleFilled, ApiOutlined, ArrowRightOutlined, ArrowLeftOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { settingsService } from '../services/settings';
import { googleAdsService } from '../services/googleAds';

const { Title, Text } = Typography;

const GoogleAdsIntegration = () => {
    const { message } = App.useApp();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [connecting, setConnecting] = useState(false);
    const [disconnecting, setDisconnecting] = useState(false);
    const [syncing, setSyncing] = useState(false);
    const [syncResult, setSyncResult] = useState(null);
    const [settings, setSettings] = useState(null);
    const [connectionStatus, setConnectionStatus] = useState({ isConnected: false, customerId: null, message: '' });
    const [currentStep, setCurrentStep] = useState(1);
    const [conversionActions, setConversionActions] = useState([]);
    const [loadingActions, setLoadingActions] = useState(false);
    const [integrationError, setIntegrationError] = useState(null);

    const fetchStatus = useCallback(async () => {
        try {
            setIntegrationError(null);
            const status = await googleAdsService.getStatus();
            setConnectionStatus(status.data);

            // If connected, determine the current step based on configuration
            if (status.data.isConnected) {
                if (status.data.customerId) {
                    // Check if conversion action is set in settings
                    const data = await settingsService.getSettings();
                    if (data.GOOGLE_ADS_CONVERSION_ACTION_ID) {
                        setCurrentStep(4);
                    } else {
                        setCurrentStep(3);
                    }
                } else {
                    setCurrentStep(2);
                }
            } else {
                setCurrentStep(1);
            }
        } catch (error) {
            console.error('Failed to fetch connection status:', error);
            const errMsg = error?.message || error?.error || '';
            if (errMsg.includes("not associated with any Ads accounts")) {
                setIntegrationError(errMsg);
            }
        }
    }, []);

    const fetchSettings = useCallback(async () => {
        try {
            setLoading(true);
            const data = await settingsService.getSettings();
            setSettings(data);
            await fetchStatus();
        } catch (error) {
            console.error('Failed to fetch settings:', error);
            const errorMessage = typeof error === 'string' ? error : (error?.message || 'Failed to load settings');
            message.error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [fetchStatus, message]);

    useEffect(() => {
        if (!loading && settings) {
            form.setFieldsValue(settings);
        }
    }, [loading, settings, form]);

    useEffect(() => {
        fetchSettings();
    }, [fetchSettings]);

    const fetchConversionActions = useCallback(async (customerId) => {
        try {
            setLoadingActions(true);
            const response = await googleAdsService.getConversionActions(customerId);
            if (response.success) {
                setConversionActions(response.data || []);
            } else {
                throw new Error(response.message || 'Failed to fetch conversion actions');
            }
        } catch (error) {
            console.error('Failed to fetch conversion actions:', error);
            const errorMessage = error?.message || 'Failed to load conversion actions. Please ensure your customer ID is correct.';
            message.error(errorMessage);
        } finally {
            setLoadingActions(false);
        }
    }, [message]);

    useEffect(() => {
        if (currentStep === 3 && connectionStatus.customerId) {
            fetchConversionActions(connectionStatus.customerId);
        }
    }, [currentStep, connectionStatus.customerId, fetchConversionActions]);

    const handleConnect = async () => {
        try {
            setConnecting(true);
            const response = await googleAdsService.connect();
            if (response.success && response.data.authUrl) {
                window.location.href = response.data.authUrl;
            } else {
                throw new Error('Authorization URL not found');
            }
        } catch (error) {
            console.error('Failed to initiate connection:', error);
            let errorMessage = typeof error === 'string' ? error : (error?.message || 'Failed to connect to Google Ads');

            // Special handling for the "No Ads account" error
            if (errorMessage.includes("not associated with any Ads accounts")) {
                message.error({
                    content: (
                        <span>
                            {errorMessage} <br />
                            <Text type="secondary" style={{ fontSize: '12px' }}>
                                Try using a different Google account or create an Ads account first.
                            </Text>
                        </span>
                    ),
                    duration: 10,
                });
            } else {
                message.error(errorMessage);
            }
        } finally {
            setConnecting(false);
        }
    };

    const handleDisconnect = async () => {
        try {
            setDisconnecting(true);
            const response = await googleAdsService.disconnect();
            if (response.success) {
                message.success(response.message || 'Google Ads account disconnected successfully');
                await fetchStatus();
            } else {
                throw new Error(response.message || 'Failed to disconnect Google Ads account');
            }
        } catch (error) {
            console.error('Failed to disconnect:', error);
            message.error(error?.message || 'Failed to disconnect Google Ads account');
        } finally {
            setDisconnecting(false);
        }
    };

    const handleSync = async () => {
        try {
            setSyncing(true);
            setSyncResult(null);
            const response = await googleAdsService.sync();
            if (response.success) {
                message.success(response.message || 'Google Ads data synced successfully');
                setSyncResult(response.data);
            } else {
                throw new Error(response.message || 'Failed to sync Google Ads data');
            }
        } catch (error) {
            console.error('Failed to sync Google Ads data:', error);
            message.error(error?.message || 'Failed to sync Google Ads data');
        } finally {
            setSyncing(false);
        }
    };

    const onFinish = async (values) => {
        try {
            setSaving(true);
            await settingsService.updateSettings(values);
            message.success('Configuration saved successfully');
            if (currentStep < 4) {
                setCurrentStep(prev => prev + 1);
            }
            fetchSettings();
        } catch (error) {
            console.error('Failed to update settings:', error);
            message.error(error?.message || 'Failed to update settings');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div style={{ padding: '24px 20px', maxWidth: '860px', margin: '0 auto' }}>
                <Skeleton active title={{ width: 280 }} paragraph={{ rows: 8 }} />
            </div>
        );
    }

    const steps = [
        { title: 'Connect', desc: 'OAuth Authorization' },
        { title: 'Configure', desc: 'Account Details' },
        { title: 'Select Action', desc: 'Conversion Points' },
        { title: 'Summary', desc: 'Status & Sync' }
    ];

    const renderStep1 = () => (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <div style={{ marginBottom: '24px' }}>
                <div style={{
                    width: '64px', height: '64px', borderRadius: '16px',
                    background: '#f1f5f9', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 16px auto', border: '1px solid #e2e8f0'
                }}>
                    <GoogleOutlined style={{ fontSize: '32px', color: '#084b8a' }} />
                </div>
                <Title level={4}>Connect your Google account</Title>
                <Text type="secondary">Authenticate with Google to allow Track Bridge to access your Ads data.</Text>
            </div>

            {connectionStatus.isConnected ? (
                <Alert
                    message="Account Connected"
                    description="Your Google account is already authorized. You can proceed to configuration."
                    type="success"
                    showIcon
                    icon={<CheckCircleFilled style={{ color: '#084b8a' }} />}
                    style={{ borderRadius: '12px', marginBottom: '24px', textAlign: 'left', border: '1.5px solid #dbeafe', background: '#eff6ff' }}
                    action={
                        <Space direction="vertical" align="end">
                            <Button size="small" type="primary" onClick={() => setCurrentStep(2)}>
                                Go to Step 2
                            </Button>
                            <Button size="small" danger ghost loading={disconnecting} onClick={handleDisconnect}>
                                Disconnect
                            </Button>
                        </Space>
                    }
                />
            ) : (
                <Button
                    type="primary"
                    icon={connecting ? <LoadingOutlined /> : <GoogleOutlined />}
                    size="large"
                    loading={connecting}
                    onClick={handleConnect}
                    style={{
                        borderRadius: '10px', height: '48px', padding: '0 40px',
                        fontSize: '16px', fontWeight: 600, background: '#084b8a'
                    }}
                >
                    {connecting ? 'Connecting...' : 'Connect Google Ads'}
                </Button>
            )}
        </div>
    );

    const renderStep2 = () => (
        <div>
            <div style={{ marginBottom: '24px' }}>
                <Title level={4}>Configure Account IDs</Title>
                <Text type="secondary">Enter your Google Ads Customer ID and optional Manager (MCC) ID.</Text>
            </div>

            <Form form={form} layout="vertical" onFinish={onFinish} requiredMark={false}>
                <Row gutter={20}>
                    <Col xs={24} md={12}>
                        <Form.Item
                            label={<Text strong>Customer Account ID</Text>}
                            name="GOOGLE_ADS_CUSTOMER_ID"
                            rules={[{ required: true, message: 'Required' }]}
                            extra="Format: 123-456-7890"
                        >
                            <Input size="large" placeholder="000-000-0000" className="premium-input" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item
                            label={<Text strong>MCC ID (Manager)</Text>}
                            name="GOOGLE_ADS_MCC_ID"
                            extra="Optional, if using a manager account"
                        >
                            <Input size="large" placeholder="Manager ID" className="premium-input" />
                        </Form.Item>
                    </Col>
                </Row>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '32px' }}>
                    <Button icon={<ArrowLeftOutlined />} onClick={() => setCurrentStep(1)}>Back</Button>
                    <Button type="primary" icon={<ArrowRightOutlined />} loading={saving} onClick={() => form.submit()}>
                        Next: Select Action
                    </Button>
                </div>
            </Form>
        </div>
    );

    const renderStep3 = () => (
        <div>
            <div style={{ marginBottom: '24px' }}>
                <Title level={4}>Select Conversion Action</Title>
                <Text type="secondary">Choose which conversion action Track Bridge should optimize for.</Text>
            </div>

            <Form form={form} layout="vertical" onFinish={onFinish} requiredMark={false}>
                <Form.Item
                    label={<Text strong>Conversion Action</Text>}
                    name="GOOGLE_ADS_CONVERSION_ACTION_ID"
                    rules={[{ required: true, message: 'Please select an action' }]}
                >
                    <Select
                        size="large"
                        placeholder="Select conversion point..."
                        loading={loadingActions}
                        className="premium-select"
                        options={conversionActions.map(action => ({
                            value: action.id,
                            label: `${action.name} (${action.type || 'Standard'})`
                        }))}
                        notFoundContent={loadingActions ? <LoadingOutlined /> : 'No conversion actions found. Make sure your Customer ID is correct.'}
                    />
                </Form.Item>

                {conversionActions.length === 0 && !loadingActions && (
                    <Alert
                        message="No actions found"
                        description="We couldn't find any conversion actions for this account. You may need to create one in your Google Ads dashboard first."
                        type="info"
                        showIcon
                        style={{ borderRadius: '12px', marginBottom: '20px' }}
                    />
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '32px' }}>
                    <Button icon={<ArrowLeftOutlined />} onClick={() => setCurrentStep(2)}>Back</Button>
                    <Button type="primary" icon={<CheckCircleFilled />} loading={saving} onClick={() => form.submit()}>
                        Finish Setup
                    </Button>
                </div>
            </Form>
        </div>
    );

    const renderStep4 = () => (
        <div>
            <div style={{ marginBottom: '24px' }}>
                <Title level={4}>Integration Summary</Title>
                <Text type="secondary">Your Google Ads integration is active and correctly configured.</Text>
            </div>

            <Card style={{ borderRadius: '16px', background: '#eff6ff', border: '1px solid #dbeafe', marginBottom: '24px' }}>
                <div style={{ display: 'flex', gap: '20px' }}>
                    <div style={{
                        width: '48px', height: '48px', borderRadius: '50%',
                        background: '#084b8a', display: 'flex',
                        alignItems: 'center', justifyContent: 'center', flexShrink: 0
                    }}>
                        <CheckCircleFilled style={{ color: '#fff', fontSize: '24px' }} />
                    </div>
                    <div>
                        <Title level={5} style={{ margin: 0, color: '#1e3a8a' }}>Integration Active</Title>
                        <Space direction="vertical" size={2} style={{ marginTop: '8px' }}>
                            <Text><Text strong>Customer ID:</Text> {connectionStatus.customerId}</Text>
                            <Text><Text strong>Configured Action:</Text> {conversionActions.find(a => a.id === settings?.GOOGLE_ADS_CONVERSION_ACTION_ID)?.name || 'Default'}</Text>
                        </Space>
                    </div>
                </div>
            </Card>

            {syncResult && (
                <Alert
                    message="Sync Successful"
                    description={`Synced ${syncResult.campaignsSynced} campaigns and ${syncResult.adSpendRecords} spend records.`}
                    type="success"
                    showIcon
                    icon={<CheckCircleFilled style={{ color: '#084b8a' }} />}
                    closable
                    onClose={() => setSyncResult(null)}
                    style={{ borderRadius: '12px', marginBottom: '20px' }}
                />
            )}

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <Button icon={<SyncOutlined />} loading={syncing} onClick={handleSync}>Sync Now</Button>
                <Button icon={<ArrowLeftOutlined />} onClick={() => setCurrentStep(3)}>Adjust Config</Button>
                <Button danger icon={<ApiOutlined />} loading={disconnecting} onClick={handleDisconnect}>Disconnect</Button>
            </div>
        </div>
    )

    return (
        <div style={{ padding: '20px', maxWidth: '860px', margin: '0 auto', minHeight: '100vh', background: '#f8fafc' }}>
            {/* Page Header */}
            <div style={{ marginBottom: '32px' }}>
                <Title level={2} style={{ margin: 0, fontWeight: 800, color: '#1e293b', letterSpacing: '-0.02em' }}>
                    Google Ads Integration
                </Title>
                <Text type="secondary">Complete the 4-step process to connect and configure your tracking.</Text>
            </div>

            {integrationError && (
                <Alert
                    message="Google Ads Account Not Found"
                    description={
                        <div>
                            <Text>{integrationError}</Text>
                            <div style={{ marginTop: '12px' }}>
                                <Text type="secondary" style={{ fontSize: '13px', display: 'block', marginBottom: '8px' }}>
                                    <InfoCircleOutlined style={{ marginRight: '6px' }} />
                                    This usually happens when the Google account you used for OAuth does not have any active Google Ads accounts associated with it.
                                </Text>
                                <Space>
                                    <Button size="small" type="primary" onClick={handleConnect}>
                                        Try Different Account
                                    </Button>
                                    <Button size="small" onClick={() => setIntegrationError(null)}>
                                        Dismiss
                                    </Button>
                                </Space>
                            </div>
                        </div>
                    }
                    type="error"
                    showIcon
                    style={{ borderRadius: '16px', marginBottom: '24px', padding: '16px', border: '1.5px solid #feb2b2' }}
                />
            )}

            {/* Stepper UI */}
            <div className="stepper-container" style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '40px',
                padding: '0 10px',
                position: 'relative'
            }}>
                {/* Background line */}
                <div className="connector-line" style={{
                    position: 'absolute', top: '24px', left: '40px', right: '40px',
                    height: '2px', background: '#e2e8f0', zIndex: 0
                }} />

                {steps.map((step, index) => {
                    const stepNum = index + 1;
                    const isActive = currentStep === stepNum;
                    const isCompleted = currentStep > stepNum;

                    return (
                        <div key={stepNum} className="step-item" style={{
                            display: 'flex', flexDirection: 'column', alignItems: 'center',
                            zIndex: 1, width: '25%', opacity: isActive || isCompleted ? 1 : 0.6
                        }}>
                            <div style={{
                                width: '48px', height: '48px', borderRadius: '50%',
                                background: isCompleted ? '#084b8a' : (isActive ? '#084b8a' : '#fff'),
                                border: isCompleted ? 'none' : `2px solid ${isActive ? '#084b8a' : '#e2e8f0'}`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                marginBottom: '12px', transition: 'all 0.3s',
                                boxShadow: isActive ? '0 0 0 4px rgba(8, 75, 138, 0.1)' : 'none'
                            }}>
                                {isCompleted
                                    ? <CheckCircleFilled style={{ color: '#fff', fontSize: '24px' }} />
                                    : <span style={{ color: isActive ? '#fff' : '#94a3b8', fontWeight: 700 }}>{stepNum}</span>
                                }
                            </div>
                            <Text style={{ fontWeight: 700, fontSize: '12px', color: '#1e293b' }}>{step.title}</Text>
                            <Text type="secondary" style={{ fontSize: '10px' }}>{step.desc}</Text>
                        </div>
                    );
                })}
            </div>

            {/* Step Card */}
            <div style={{
                background: '#fff', borderRadius: '24px',
                border: '1.5px solid rgba(226, 232, 240, 0.8)',
                boxShadow: '0 10px 30px -5px rgba(0,0,0,0.05)',
                overflow: 'hidden', minHeight: '300px'
            }}>
                <div style={{ padding: '32px' }}>
                    {currentStep === 1 && renderStep1()}
                    {currentStep === 2 && renderStep2()}
                    {currentStep === 3 && renderStep3()}
                    {currentStep === 4 && renderStep4()}
                </div>

                {/* Progress bar at bottom of card */}
                <div style={{ height: '4px', width: '100%', background: '#f1f5f9' }}>
                    <div style={{
                        height: '100%',
                        width: `${(currentStep / 4) * 100}%`,
                        background: '#084b8a',
                        transition: 'width 0.5s ease'
                    }} />
                </div>
            </div>

            <style>{`
                .ant-form-item-label { padding-bottom: 8px !important; }
                @media (max-width: 576px) {
                    .stepper-container {
                        flex-direction: column !important;
                        align-items: flex-start !important;
                        gap: 20px !important;
                    }
                    .connector-line {
                        display: none !important;
                    }
                    .step-item {
                        width: 100% !important;
                        flex-direction: row !important;
                        gap: 16px !important;
                        align-items: center !important;
                    }
                    .step-item > div:first-child {
                        margin-bottom: 0 !important;
                        width: 40px !important;
                        height: 40px !important;
                        flex-shrink: 0 !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default GoogleAdsIntegration;
