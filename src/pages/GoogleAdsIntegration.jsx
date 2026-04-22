import { useState, useEffect, useCallback } from 'react';
import { Typography, Button, Form, Input, Skeleton, App, Row, Col, Select, Alert, Space, Card, Table, Tag, Modal, Popconfirm, Switch } from 'antd';
import { GoogleOutlined, LoadingOutlined, SyncOutlined, CheckCircleFilled, ApiOutlined, ArrowRightOutlined, ArrowLeftOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { settingsService } from '../services/settings';
import { googleAdsService } from '../services/googleAds';
import connectionService from '../services/connections';

const { Title, Text } = Typography;

const GoogleAdsIntegration = () => {
    const { message } = App.useApp();
    const [form] = Form.useForm();
    const [accountForm] = Form.useForm();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [accountSaving, setAccountSaving] = useState(false);
    const [accountsLoading, setAccountsLoading] = useState(false);
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
    const [googleConnections, setGoogleConnections] = useState([]);
    const [addAccountFlow, setAddAccountFlow] = useState(() => {
        if (typeof sessionStorage === 'undefined') return false;
        return sessionStorage.getItem('google_add_account_flow') === '1';
    });
    const [accountModalOpen, setAccountModalOpen] = useState(false);
    const [editingAccount, setEditingAccount] = useState(null);

    const fetchGoogleConnections = useCallback(async () => {
        try {
            setAccountsLoading(true);
            const response = await connectionService.getConnections('google');
            setGoogleConnections(Array.isArray(response?.data) ? response.data : []);
        } catch (error) {
            console.error('Failed to fetch Google connections:', error);
            message.error(error?.message || 'Failed to load Google accounts');
        } finally {
            setAccountsLoading(false);
        }
    }, [message]);

    const fetchStatus = useCallback(async () => {
        try {
            setIntegrationError(null);
            const status = await googleAdsService.getStatus();
            setConnectionStatus(status.data);

            // If adding another account, the existing workspace OAuth must not
            // skip the new account authorization step.
            const isAddingAccount = sessionStorage.getItem('google_add_account_flow') === '1';
            const addAccountOAuthDone = sessionStorage.getItem('google_add_account_oauth_done') === '1';

            // If connected, determine the current step based on configuration
            if (status.data.isConnected) {
                if (isAddingAccount) {
                    setCurrentStep(addAccountOAuthDone ? 2 : 1);
                } else if (status.data.customerId) {
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
            if (
                errMsg.includes("not associated with any Ads accounts")
                || /permission|access|forbidden|unauthorized/i.test(errMsg)
            ) {
                setIntegrationError(errMsg);
            }
        }
    }, []);

    const fetchSettings = useCallback(async () => {
        try {
            setLoading(true);
            const data = await settingsService.getSettings();
            setSettings(data);
            await Promise.all([fetchStatus(), fetchGoogleConnections()]);
        } catch (error) {
            console.error('Failed to fetch settings:', error);
            const errorMessage = typeof error === 'string' ? error : (error?.message || 'Failed to load settings');
            message.error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [fetchStatus, fetchGoogleConnections, message]);

    useEffect(() => {
        if (!loading && settings) {
            const isAddingAccount = sessionStorage.getItem('google_add_account_flow') === '1';
            form.setFieldsValue(isAddingAccount ? {
                ...(settings || {}),
                GOOGLE_ADS_CUSTOMER_ID: '',
                GOOGLE_ADS_MCC_ID: '',
                GOOGLE_ADS_CONVERSION_ACTION_ID: undefined,
            } : settings);
        }
    }, [loading, settings, form]);

    useEffect(() => {
        fetchSettings();
    }, [fetchSettings]);

    useEffect(() => {
        if (!loading && sessionStorage.getItem('google_add_account_flow') === '1') {
            setAddAccountFlow(true);
        }
    }, [loading]);

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
            setIntegrationError(null);
            sessionStorage.setItem('google_add_account_flow', '1');
            sessionStorage.removeItem('google_add_account_oauth_done');
            sessionStorage.removeItem('google_pending_connection_id');
            setAddAccountFlow(true);
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
                setIntegrationError(errorMessage);
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
            } else if (/permission|access|forbidden|unauthorized/i.test(errorMessage)) {
                setIntegrationError(errorMessage);
                message.error(`Google Ads permission error: ${errorMessage}`);
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

            if (addAccountFlow && currentStep === 2) {
                const customerId = values.GOOGLE_ADS_CUSTOMER_ID;
                setSettings(prev => ({ ...(prev || {}), ...values }));
                setConnectionStatus(prev => ({ ...prev, isConnected: true, customerId }));
                setCurrentStep(3);
                await fetchConversionActions(customerId);
                message.success('Google Ads customer saved. Select the conversion action next.');
                return;
            }

            const pendingConnectionId = sessionStorage.getItem('google_pending_connection_id');
            const connectionPayload = {
                label: values.GOOGLE_ADS_CUSTOMER_ID ? `Google Ads ${values.GOOGLE_ADS_CUSTOMER_ID}` : 'Google Ads Account',
                customerId: values.GOOGLE_ADS_CUSTOMER_ID,
                managerCustomerId: values.GOOGLE_ADS_MCC_ID,
                conversionActionId: values.GOOGLE_ADS_CONVERSION_ACTION_ID,
                status: 'active',
                isDefault: googleConnections.length === 0,
            };

            const saveConnection = pendingConnectionId
                ? connectionService.updateConnection('google', pendingConnectionId, connectionPayload)
                : connectionService.createConnection('google', connectionPayload);

            await saveConnection.catch((error) => {
                console.warn('Google connection create skipped:', error?.message || error);
            });

            message.success('Configuration saved successfully');
            if (currentStep < 4) {
                setCurrentStep(prev => prev + 1);
            }
            if (addAccountFlow && currentStep >= 3) {
                sessionStorage.removeItem('google_add_account_flow');
                sessionStorage.removeItem('google_add_account_oauth_done');
                sessionStorage.removeItem('google_pending_connection_id');
                setAddAccountFlow(false);
            }
            fetchSettings();
        } catch (error) {
            console.error('Failed to update settings:', error);
            message.error(error?.message || 'Failed to update settings');
        } finally {
            setSaving(false);
        }
    };

    const startAddAccountFlow = () => {
        sessionStorage.setItem('google_add_account_flow', '1');
        sessionStorage.removeItem('google_add_account_oauth_done');
        sessionStorage.removeItem('google_pending_connection_id');
        setAddAccountFlow(true);
        setIntegrationError(null);
        setSyncResult(null);
        setConversionActions([]);
        form.setFieldsValue({
            ...(settings || {}),
            GOOGLE_ADS_CUSTOMER_ID: '',
            GOOGLE_ADS_MCC_ID: '',
            GOOGLE_ADS_CONVERSION_ACTION_ID: undefined,
        });
        setCurrentStep(1);
    };

    const cancelAddAccountFlow = () => {
        sessionStorage.removeItem('google_add_account_flow');
        sessionStorage.removeItem('google_add_account_oauth_done');
        sessionStorage.removeItem('google_pending_connection_id');
        setAddAccountFlow(false);
        setIntegrationError(null);
        setConversionActions([]);
        fetchSettings();
    };

    const openAccountModal = (account = null) => {
        setEditingAccount(account);
        accountForm.resetFields();
        accountForm.setFieldsValue({
            label: account?.label || '',
            customerId: account?.customerId || '',
            managerCustomerId: account?.managerCustomerId || '',
            conversionActionId: account?.conversionActionId || '',
            status: account?.status || 'active',
            isDefault: account ? Boolean(account.isDefault) : googleConnections.length === 0,
        });
        setAccountModalOpen(true);
    };

    const closeAccountModal = () => {
        setAccountModalOpen(false);
        setEditingAccount(null);
        accountForm.resetFields();
    };

    const handleAccountSave = async () => {
        try {
            const values = await accountForm.validateFields();
            setAccountSaving(true);
            const payload = {
                label: values.label,
                customerId: values.customerId,
                managerCustomerId: values.managerCustomerId,
                conversionActionId: values.conversionActionId,
                status: values.status || 'active',
                isDefault: Boolean(values.isDefault),
            };

            if (editingAccount) {
                await connectionService.updateConnection('google', editingAccount.id, payload);
                message.success('Google account updated');
            } else {
                await connectionService.createConnection('google', payload);
                message.success('Google account added');
            }

            closeAccountModal();
            await fetchGoogleConnections();
        } catch (error) {
            if (error?.errorFields) return;
            message.error(error?.message || 'Failed to save Google account');
        } finally {
            setAccountSaving(false);
        }
    };

    const handleSetDefaultAccount = async (account) => {
        try {
            await connectionService.updateConnection('google', account.id, { isDefault: true });
            message.success('Default Google account updated');
            await fetchGoogleConnections();
        } catch (error) {
            message.error(error?.message || 'Failed to update default Google account');
        }
    };

    const handleToggleAccountStatus = async (account) => {
        try {
            const nextStatus = account.status === 'active' ? 'inactive' : 'active';
            await connectionService.updateConnection('google', account.id, { status: nextStatus });
            message.success(`Google account marked ${nextStatus}`);
            await fetchGoogleConnections();
        } catch (error) {
            message.error(error?.message || 'Failed to update Google account status');
        }
    };

    const handleDeleteAccount = async (account) => {
        try {
            await connectionService.deleteConnection('google', account.id);
            message.success('Google account deleted');
            await fetchGoogleConnections();
        } catch (error) {
            message.error(error?.message || 'Failed to delete Google account');
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

    const statusAlerts = [];
    if (addAccountFlow && currentStep === 1) {
        statusAlerts.push({
            type: 'info',
            message: 'Authorize the new Google account',
            description: 'Existing Google Ads accounts will not be reused for this setup. Continue with Google OAuth to add another account.',
        });
    }
    if (!connectionStatus.isConnected && !addAccountFlow) {
        statusAlerts.push({
            type: 'warning',
            message: 'Google Ads is not connected',
            description: 'Connect a Google account via OAuth before configuring customer and conversion actions.',
        });
    }
    if (connectionStatus.isConnected && !connectionStatus.customerId) {
        statusAlerts.push({
            type: 'error',
            message: 'Google Ads Customer ID is missing',
            description: 'Add GOOGLE_ADS_CUSTOMER_ID to enable campaign and spend sync.',
        });
    }
    if (connectionStatus.syncStatus === 'failed') {
        statusAlerts.push({
            type: 'error',
            message: 'Last Google Ads sync failed',
            description: connectionStatus.syncError || 'Sync failed due to an unknown error.',
        });
    }
    if (connectionStatus.syncError && /permission|access|forbidden|unauthorized|not associated/i.test(String(connectionStatus.syncError))) {
        statusAlerts.push({
            type: 'error',
            message: 'Google Ads permission issue detected',
            description: connectionStatus.syncError,
        });
    }
    if (connectionStatus.isConnected && connectionStatus.customerId && connectionStatus.syncStatus !== 'failed' && !addAccountFlow) {
        statusAlerts.push({
            type: 'success',
            message: 'Google Ads connection looks healthy',
            description: 'OAuth and customer mapping are available. You can run sync and conversion tracking.',
        });
    }

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

            {connectionStatus.isConnected && !addAccountFlow ? (
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
                    {connecting ? 'Connecting...' : (addAccountFlow ? 'Authorize Google Account' : 'Connect Google Ads')}
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

    const googleAccountColumns = [
        {
            title: 'Account',
            key: 'account',
            render: (_, record) => (
                <Space direction="vertical" size={2}>
                    <Space wrap>
                        <Text strong>{record.label || 'Google Ads Account'}</Text>
                        {record.isDefault && <Tag color="blue">Default</Tag>}
                    </Space>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                        Customer ID: {record.customerId || 'N/A'}
                    </Text>
                </Space>
            ),
        },
        {
            title: 'MCC',
            dataIndex: 'managerCustomerId',
            key: 'managerCustomerId',
            render: value => value || 'None',
        },
        {
            title: 'Conversion Action',
            dataIndex: 'conversionActionId',
            key: 'conversionActionId',
            ellipsis: true,
            render: value => value || 'Workspace default',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 110,
            render: value => (
                <Tag color={value === 'active' ? 'green' : ['inactive', 'pending'].includes(value) ? 'orange' : 'red'}>
                    {String(value || 'active').toUpperCase()}
                </Tag>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 300,
            render: (_, record) => (
                <Space wrap>
                    <Button size="small" onClick={() => openAccountModal(record)}>
                        Edit
                    </Button>
                    {!record.isDefault && (
                        <Button size="small" onClick={() => handleSetDefaultAccount(record)}>
                            Set Default
                        </Button>
                    )}
                    <Button size="small" onClick={() => handleToggleAccountStatus(record)}>
                        {record.status === 'active' ? 'Disable' : 'Enable'}
                    </Button>
                    <Popconfirm
                        title="Delete Google account?"
                        description="Remove this from projects first if it is assigned."
                        okText="Delete"
                        okButtonProps={{ danger: true }}
                        onConfirm={() => handleDeleteAccount(record)}
                    >
                        <Button size="small" danger>
                            Delete
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const showSetupFlow = addAccountFlow || googleConnections.length === 0;

    return (
        <div style={{ padding: '20px', maxWidth: '1100px', margin: '0 auto', minHeight: '100vh', background: '#f8fafc' }}>
            {/* Page Header */}
            <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
                <div>
                    <Title level={2} style={{ margin: 0, fontWeight: 800, color: '#1e293b', letterSpacing: '-0.02em' }}>
                        Google Ads Integration
                    </Title>
                    <Text type="secondary">Complete the 4-step process to connect and configure your tracking.</Text>
                </div>
                <Space wrap>
                    {addAccountFlow && googleConnections.length > 0 && (
                        <Button onClick={cancelAddAccountFlow}>
                            Cancel Setup
                        </Button>
                    )}
                    <Button type="primary" icon={<ApiOutlined />} onClick={startAddAccountFlow}>
                        Add Google Account
                    </Button>
                </Space>
            </div>

            {showSetupFlow && statusAlerts.length > 0 && (
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

            {showSetupFlow && integrationError && (
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

            {showSetupFlow && (
                <>
                    <div className="stepper-container" style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '40px',
                        padding: '0 10px',
                        position: 'relative'
                    }}>
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

                        <div style={{ height: '4px', width: '100%', background: '#f1f5f9' }}>
                            <div style={{
                                height: '100%',
                                width: `${(currentStep / 4) * 100}%`,
                                background: '#084b8a',
                                transition: 'width 0.5s ease'
                            }} />
                        </div>
                    </div>
                </>
            )}

            <Card
                style={{
                    marginTop: 24,
                    borderRadius: 20,
                    border: '1.5px solid rgba(226, 232, 240, 0.9)',
                    boxShadow: '0 10px 30px -5px rgba(0,0,0,0.04)',
                }}
                title={
                    <Space>
                        <GoogleOutlined />
                        <span>Connected Google Ads Accounts</span>
                    </Space>
                }
                extra={
                    <Space wrap>
                        <Button onClick={fetchGoogleConnections} loading={accountsLoading} icon={<SyncOutlined />}>
                            Refresh
                        </Button>
                        <Button type="primary" onClick={startAddAccountFlow} icon={<ApiOutlined />}>
                            Add Another Account
                        </Button>
                    </Space>
                }
            >
                <Alert
                    type="info"
                    showIcon
                    style={{ marginBottom: 16, borderRadius: 12 }}
                    message="How multiple Google accounts work"
                    description="Each project can select one Google account. Spend sync and conversion upload use that selected customer ID and conversion action. If this row has no separate refresh token, the workspace OAuth login is used for access."
                />
                <Table
                    rowKey="id"
                    loading={accountsLoading}
                    dataSource={googleConnections}
                    columns={googleAccountColumns}
                    scroll={{ x: 900 }}
                    pagination={{ pageSize: 6, hideOnSinglePage: true }}
                    locale={{ emptyText: 'No Google accounts added yet' }}
                />
            </Card>

            <Modal
                open={accountModalOpen}
                title={editingAccount ? 'Edit Google Ads Account' : 'Add Google Ads Account'}
                onCancel={closeAccountModal}
                onOk={handleAccountSave}
                okText={editingAccount ? 'Save Changes' : 'Add Account'}
                confirmLoading={accountSaving}
                width={720}
                destroyOnHidden
            >
                <Alert
                    type="warning"
                    showIcon
                    style={{ marginBottom: 16, borderRadius: 12 }}
                    message="Use the real Google Ads customer ID for this project"
                    description="This must be the account that owns the GCLID click. Otherwise Google will reject conversion uploads with an account access error."
                />
                <Form form={accountForm} layout="vertical" requiredMark={false}>
                    <Row gutter={12}>
                        <Col xs={24} md={12}>
                            <Form.Item name="label" label="Account Label">
                                <Input placeholder="Client A Google Ads" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item name="status" label="Status" rules={[{ required: true }]}>
                                <Select
                                    options={[
                                        { label: 'Active', value: 'active' },
                                        { label: 'Inactive', value: 'inactive' },
                                        { label: 'Disconnected', value: 'disconnected' },
                                    ]}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={12}>
                        <Col xs={24} md={12}>
                            <Form.Item
                                name="customerId"
                                label="Customer ID"
                                rules={[{ required: true, message: 'Customer ID is required' }]}
                                extra="Example: 918-028-7937"
                            >
                                <Input placeholder="918-028-7937" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item
                                name="managerCustomerId"
                                label="MCC / Manager ID"
                                extra="Optional if customer is under a manager account"
                            >
                                <Input placeholder="Optional manager ID" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item
                        name="conversionActionId"
                        label="Conversion Action ID"
                        extra="Use the action ID from this customer account. Leave blank only if workspace default is correct."
                    >
                        <Input placeholder="7413484448" />
                    </Form.Item>
                    <Form.Item name="isDefault" label="Use as workspace default" valuePropName="checked">
                        <Switch />
                    </Form.Item>
                </Form>
            </Modal>

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
