import { useState, useEffect, useCallback } from 'react';
import { Typography, Input, Button, Card, Space, Form, Skeleton, App, Row, Col, Alert, Tooltip, Table, Tag, Modal, Popconfirm, Select, Switch } from 'antd';
import { SaveOutlined, LinkOutlined, RocketOutlined, CheckCircleFilled, SyncOutlined, InfoCircleOutlined, GithubOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { settingsService } from '../services/settings';
import { metaAdsService } from '../services/metaAds';
import connectionService from '../services/connections';

const { Title, Text } = Typography;

const META_EVENT_OPTIONS = [
    'Subscribe',
    'Lead',
    'LeadInitiated',
    'SubscribeInitiated',
    'InitiateCheckout',
    'CompleteRegistration',
    'Purchase',
    'Contact',
    'SubmitApplication',
];
const MetaAdsIntegration = () => {
    const { message, modal } = App.useApp();
    const [form] = Form.useForm();
    const [connectionForm] = Form.useForm();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [integrationScope, setIntegrationScope] = useState('platform');
    const [workspaceId, setWorkspaceId] = useState(null);
    const [allSettings, setAllSettings] = useState({});
    const [statusData, setStatusData] = useState(null);
    const [statusLoading, setStatusLoading] = useState(false);
    const [metaConnections, setMetaConnections] = useState([]);
    const [showSetupForm, setShowSetupForm] = useState(false);
    const [connectionModalOpen, setConnectionModalOpen] = useState(false);
    const [editingConnection, setEditingConnection] = useState(null);
    const [connectionSaving, setConnectionSaving] = useState(false);

    const fetchMetaConnections = useCallback(async () => {
        try {
            const response = await connectionService.getConnections('meta');
            setMetaConnections(Array.isArray(response?.data) ? response.data : []);
        } catch (error) {
            console.error('Failed to fetch Meta connections:', error);
        }
    }, []);

    const fetchStatus = useCallback(async () => {
        try {
            setStatusLoading(true);
            const status = await metaAdsService.getStatus();
            if (status.success) {
                setStatusData(status.data);
            }
        } catch (error) {
            console.error('Failed to fetch status:', error);
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

            await Promise.all([fetchStatus(), fetchMetaConnections()]);
        } catch (error) {
            console.error('Failed to fetch settings:', error);
            if (!silent) message.error(error.message || 'Failed to load settings');
        } finally {
            if (!silent) setLoading(false);
        }
    }, [form, message, fetchStatus, fetchMetaConnections]);

    useEffect(() => {
        fetchSettings(false); // Initial load with skeleton
    }, [fetchSettings]);

    const onFinish = async (values) => {
        try {
            setSaving(true);
            // Combine existing settings with new form values, scope and workspaceId
            const payload = {
                ...allSettings,
                ...values,
                scope: integrationScope,
                workspaceId: workspaceId
            };
            await settingsService.updateSettings(payload);
            await connectionService.createConnection('meta', {
                label: values.META_AD_ACCOUNT_ID ? `Meta ${values.META_AD_ACCOUNT_ID}` : 'Meta Ads Account',
                adAccountId: values.META_AD_ACCOUNT_ID,
                pixelId: values.META_PIXEL_ID,
                accessToken: values.META_ACCESS_TOKEN,
                eventName: values.META_EVENT_NAME,
                testEventCode: values.META_TEST_EVENT_CODE,
                isDefault: true,
            }).catch((error) => {
                console.warn('Meta connection create skipped:', error?.message || error);
            });

            // Refresh status immediately and wait for it to show real progress
            const status = await metaAdsService.getStatus();
            if (status.success) {
                setStatusData(status.data);
                if (status.data.isConfigured) {
                    message.success('Configuration saved. Meta Ads is now LIVE and ACTIVE.');
                } else {
                    message.warning('Settings saved, but technical connection is still incomplete.');
                }
            } else {
                message.success('Configuration saved successfully');
            }

            // Silent refresh of form data in background
            setShowSetupForm(false);
            fetchSettings(true);
        } catch (error) {
            console.error('Failed to update settings:', error);
            message.error(error.message || 'Failed to update settings');
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

    const openConnectionModal = (record) => {
        setEditingConnection(record);
        connectionForm.setFieldsValue({
            label: record?.label || '',
            adAccountId: record?.adAccountId || '',
            pixelId: record?.pixelId || '',
            accessToken: '',
            eventName: record?.eventName || 'Subscribe',
            testEventCode: record?.testEventCode || '',
            status: record?.status || 'active',
            isDefault: Boolean(record?.isDefault),
        });
        setConnectionModalOpen(true);
    };

    const closeConnectionModal = () => {
        setConnectionModalOpen(false);
        setEditingConnection(null);
        connectionForm.resetFields();
    };

    const handleConnectionSave = async () => {
        if (!editingConnection?.id) return;
        try {
            const values = await connectionForm.validateFields();
            setConnectionSaving(true);
            const payload = {
                label: values.label,
                adAccountId: values.adAccountId,
                pixelId: values.pixelId,
                eventName: values.eventName,
                testEventCode: values.testEventCode,
                status: values.status,
                isDefault: Boolean(values.isDefault),
            };
            if (values.accessToken) payload.accessToken = values.accessToken;
            await connectionService.updateConnection('meta', editingConnection.id, payload);
            message.success('Meta account updated');
            closeConnectionModal();
            await fetchMetaConnections();
        } catch (error) {
            if (error?.errorFields) return;
            console.error('Failed to update Meta connection:', error);
            message.error(error?.message || 'Failed to update Meta account');
        } finally {
            setConnectionSaving(false);
        }
    };

    const handleToggleConnectionStatus = async (record) => {
        try {
            const nextStatus = record.status === 'active' ? 'inactive' : 'active';
            await connectionService.updateConnection('meta', record.id, { status: nextStatus });
            message.success(nextStatus === 'active' ? 'Meta account enabled' : 'Meta account disabled');
            await fetchMetaConnections();
        } catch (error) {
            console.error('Failed to update Meta status:', error);
            message.error(error?.message || 'Failed to update Meta account status');
        }
    };

    const handleSetDefaultConnection = async (record) => {
        try {
            await connectionService.updateConnection('meta', record.id, { isDefault: true });
            message.success('Default Meta account updated');
            await fetchMetaConnections();
        } catch (error) {
            console.error('Failed to set default Meta account:', error);
            message.error(error?.message || 'Failed to set default Meta account');
        }
    };

    const handleDeleteConnection = async (record) => {
        try {
            await connectionService.deleteConnection('meta', record.id);
            message.success('Meta account deleted');
            await fetchMetaConnections();
        } catch (error) {
            console.error('Failed to delete Meta connection:', error);
            message.error(error?.message || 'Failed to delete Meta account');
        }
    };
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

    const showMetaForm = showSetupForm || metaConnections.length === 0;
    const metaColumns = [
        {
            title: 'Account',
            key: 'account',
            render: (_, record) => (
                <Space direction="vertical" size={2}>
                    <Space wrap>
                        <Text strong>{record.label || 'Meta Ads Account'}</Text>
                        {record.isDefault && <Tag color="blue">Default</Tag>}
                    </Space>
                    <Text type="secondary" style={{ fontSize: 12 }}>act_{record.adAccountId || 'N/A'}</Text>
                </Space>
            ),
        },
        {
            title: 'Pixel',
            dataIndex: 'pixelId',
            key: 'pixelId',
            render: value => value || 'N/A',
        },
        {
            title: 'Event',
            dataIndex: 'eventName',
            key: 'eventName',
            render: value => <Tag color="blue">{value || 'Subscribe'}</Tag>,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 120,
            render: value => (
                <Tag color={value === 'active' ? 'green' : value === 'inactive' ? 'orange' : 'red'}>
                    {String(value || 'active').toUpperCase()}
                </Tag>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 280,
            render: (_, record) => (
                <Space wrap size={[8, 8]}>
                    <Button size="small" icon={<EditOutlined />} onClick={() => openConnectionModal(record)}>
                        Edit
                    </Button>
                    {!record.isDefault && (
                        <Button size="small" onClick={() => handleSetDefaultConnection(record)}>
                            Set Default
                        </Button>
                    )}
                    <Button size="small" onClick={() => handleToggleConnectionStatus(record)}>
                        {record.status === 'active' ? 'Disable' : 'Enable'}
                    </Button>
                    <Popconfirm
                        title="Delete Meta account?"
                        description="Projects using this account must be reassigned first."
                        okText="Delete"
                        okButtonProps={{ danger: true }}
                        onConfirm={() => handleDeleteConnection(record)}
                    >
                        <Button size="small" danger icon={<DeleteOutlined />}>
                            Delete
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

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
                <Space wrap>
                    {showSetupForm && metaConnections.length > 0 && (
                        <Button onClick={() => setShowSetupForm(false)}>
                            Cancel Setup
                        </Button>
                    )}
                    <Button type="primary" icon={<LinkOutlined />} onClick={() => setShowSetupForm(true)}>
                        Add Meta Account
                    </Button>
                </Space>
            </div>

            {showMetaForm && (
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
                                    tooltip="Standard Meta event to fire (e.g., Lead, Subscribe, Purchase)"
                                >
                                    <Input
                                        placeholder="Enter event name (e.g. Lead)"
                                        size="large"
                                        className="premium-input-field"
                                        style={{ height: '50px' }}
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
            )}

            <Card
                style={{
                    borderRadius: '20px',
                    border: '1px solid rgba(226, 232, 240, 0.7)',
                    margin: showMetaForm ? '24px auto 0' : '0 auto',
                    maxWidth: '1100px',
                    boxShadow: '0 4px 20px -5px rgba(0, 0, 0, 0.05)',
                }}
                title="Connected Meta Accounts"
                extra={<Button onClick={fetchMetaConnections} icon={<SyncOutlined />}>Refresh</Button>}
            >
                <Table
                    rowKey="id"
                    dataSource={metaConnections}
                    columns={metaColumns}
                    scroll={{ x: 760 }}
                    pagination={{ pageSize: 6, hideOnSinglePage: true }}
                    locale={{ emptyText: 'No Meta accounts added yet' }}
                />
            </Card>
            <Modal
                title="Edit Meta Account"
                open={connectionModalOpen}
                onCancel={closeConnectionModal}
                onOk={handleConnectionSave}
                okText="Save Changes"
                confirmLoading={connectionSaving}
                destroyOnClose
            >
                <Form form={connectionForm} layout="vertical">
                    <Form.Item name="label" label="Account Label" rules={[{ required: true, message: 'Enter an account label' }]}>
                        <Input placeholder="Meta Main Account" />
                    </Form.Item>
                    <Row gutter={12}>
                        <Col xs={24} md={12}>
                            <Form.Item name="adAccountId" label="Ad Account ID" rules={[{ required: true, message: 'Enter the Meta ad account ID' }]}>
                                <Input placeholder="act_123456789" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item name="pixelId" label="Pixel ID" rules={[{ required: true, message: 'Enter the Meta Pixel ID' }]}>
                                <Input placeholder="123456789" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item name="accessToken" label="CAPI Access Token">
                        <Input.Password placeholder="Leave blank to keep the current token" />
                    </Form.Item>
                    <Row gutter={12}>
                        <Col xs={24} md={12}>
                            <Form.Item name="eventName" label="Event Name" rules={[{ required: true, message: 'Select an event' }]}>
                                <Select options={META_EVENT_OPTIONS.map(value => ({ value, label: value }))} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item name="testEventCode" label="Test Event Code">
                                <Input placeholder="Optional" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={12}>
                        <Col xs={24} md={12}>
                            <Form.Item name="status" label="Status">
                                <Select options={[{ value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }]} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item name="isDefault" label="Default Account" valuePropName="checked">
                                <Switch checkedChildren="Default" unCheckedChildren="No" />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>

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


