import { useState, useEffect, useCallback } from 'react';
import { Typography, Button, Space, Form, Input, Skeleton, App, Row, Col, Alert, Card, Table, Tag, Switch, Modal, Popconfirm, Select } from 'antd';
import { SaveOutlined, SendOutlined, SyncOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { settingsService } from '../services/settings';
import connectionService from '../services/connections';

const { Title, Text } = Typography;

const TelegramIntegration = () => {
    const { message } = App.useApp();
    const [form] = Form.useForm();
    const [connectionForm] = Form.useForm();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [tokenVisible, setTokenVisible] = useState(false);
    const [statusLoading, setStatusLoading] = useState(false);
    const [telegramStatus, setTelegramStatus] = useState(null);
    const [telegramConnections, setTelegramConnections] = useState([]);
    const [showSetupForm, setShowSetupForm] = useState(false);
    const [connectionModalOpen, setConnectionModalOpen] = useState(false);
    const [editingConnection, setEditingConnection] = useState(null);
    const [connectionSaving, setConnectionSaving] = useState(false);

    const fetchTelegramConnections = useCallback(async () => {
        try {
            const response = await connectionService.getConnections('telegram');
            setTelegramConnections(Array.isArray(response?.data) ? response.data : []);
        } catch (error) {
            console.error('Failed to fetch Telegram connections:', error);
        }
    }, []);

    const fetchTelegramStatus = useCallback(async (silent = true) => {
        try {
            setStatusLoading(true);
            const response = await settingsService.getTelegramStatus();
            setTelegramStatus(response?.data || null);
        } catch (error) {
            console.error('Failed to fetch Telegram status:', error);
            if (!silent) {
                message.error(error?.message || 'Failed to check Telegram integration status');
            }
        } finally {
            setStatusLoading(false);
        }
    }, [message]);

    const fetchSettings = useCallback(async () => {
        try {
            setLoading(true);
            const data = await settingsService.getSettings();
            form.setFieldsValue(data);
            await Promise.all([fetchTelegramStatus(true), fetchTelegramConnections()]);
        } catch (error) {
            console.error('Failed to fetch settings:', error);
            message.error(error.message || 'Failed to load settings');
        } finally {
            setLoading(false);
        }
    }, [form, message, fetchTelegramStatus, fetchTelegramConnections]);

    useEffect(() => {
        fetchSettings();
    }, [fetchSettings]);

    const onFinish = async (values) => {
        try {
            setSaving(true);
            const { TELEGRAM_MANUAL_APPROVAL_REQUIRED, ...settingsValues } = values;
            await settingsService.updateSettings(settingsValues);
            await connectionService.createConnection('telegram', {
                label: values.TELEGRAM_BOT_USERNAME || values.TELEGRAM_CHANNEL_ID || 'Telegram Channel',
                botToken: values.TELEGRAM_BOT_TOKEN,
                botUsername: values.TELEGRAM_BOT_USERNAME,
                channelId: values.TELEGRAM_CHANNEL_ID,
                redirectUrl: values.TELEGRAM_REDIRECT_URL,
                manualApprovalRequired: Boolean(TELEGRAM_MANUAL_APPROVAL_REQUIRED),
                isDefault: true,
            }).catch((error) => {
                console.warn('Telegram connection create skipped:', error?.message || error);
            });
            const statusResponse = await settingsService.getTelegramStatus();
            const status = statusResponse?.data || null;
            setTelegramStatus(status);

            if (status?.error) {
                message.warning(`Settings saved, but Telegram is not ready: ${status.error}`);
            } else if (!status?.isConfigured) {
                message.warning('Settings saved, but Telegram integration is incomplete.');
            } else {
                message.success('Telegram settings updated successfully');
            }
            setShowSetupForm(false);
            fetchSettings();
        } catch (error) {
            console.error('Failed to update settings:', error);
            message.error(error.message || 'Failed to update settings');
        } finally {
            setSaving(false);
        }
    };

    const openConnectionModal = (record) => {
        setEditingConnection(record);
        connectionForm.setFieldsValue({
            label: record?.label || record?.channelTitle || '',
            botToken: '',
            botUsername: record?.botUsername || '',
            channelId: record?.channelId || '',
            channelTitle: record?.channelTitle || '',
            redirectUrl: record?.redirectUrl || '',
            manualApprovalRequired: Boolean(record?.manualApprovalRequired),
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
                botUsername: values.botUsername,
                channelId: values.channelId,
                channelTitle: values.channelTitle,
                redirectUrl: values.redirectUrl,
                manualApprovalRequired: Boolean(values.manualApprovalRequired),
                status: values.status,
                isDefault: Boolean(values.isDefault),
            };
            if (values.botToken) payload.botToken = values.botToken;
            await connectionService.updateConnection('telegram', editingConnection.id, payload);
            message.success('Telegram channel updated');
            closeConnectionModal();
            await fetchTelegramConnections();
        } catch (error) {
            if (error?.errorFields) return;
            console.error('Failed to update Telegram connection:', error);
            message.error(error?.message || 'Failed to update Telegram channel');
        } finally {
            setConnectionSaving(false);
        }
    };

    const handleToggleConnectionStatus = async (record) => {
        try {
            const nextStatus = record.status === 'active' ? 'inactive' : 'active';
            await connectionService.updateConnection('telegram', record.id, { status: nextStatus });
            message.success(nextStatus === 'active' ? 'Telegram channel enabled' : 'Telegram channel disabled');
            await fetchTelegramConnections();
        } catch (error) {
            console.error('Failed to update Telegram status:', error);
            message.error(error?.message || 'Failed to update Telegram channel status');
        }
    };

    const handleSetDefaultConnection = async (record) => {
        try {
            await connectionService.updateConnection('telegram', record.id, { isDefault: true });
            message.success('Default Telegram channel updated');
            await fetchTelegramConnections();
        } catch (error) {
            console.error('Failed to set default Telegram channel:', error);
            message.error(error?.message || 'Failed to set default Telegram channel');
        }
    };

    const handleDeleteConnection = async (record) => {
        try {
            await connectionService.deleteConnection('telegram', record.id);
            message.success('Telegram channel deleted');
            await fetchTelegramConnections();
        } catch (error) {
            console.error('Failed to delete Telegram connection:', error);
            message.error(error?.message || 'Failed to delete Telegram channel');
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

    const showTelegramForm = showSetupForm || telegramConnections.length === 0;
    const telegramColumns = [
        {
            title: 'Bot / Channel',
            key: 'botChannel',
            render: (_, record) => (
                <Space direction="vertical" size={2}>
                    <Space wrap>
                        <Text strong>{record.label || record.channelTitle || 'Telegram Channel'}</Text>
                        {record.isDefault && <Tag color="blue">Default</Tag>}
                    </Space>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                        {record.botUsername ? `@${record.botUsername}` : 'Bot username missing'}
                    </Text>
                </Space>
            ),
        },
        {
            title: 'Channel ID',
            dataIndex: 'channelId',
            key: 'channelId',
            render: value => value || 'N/A',
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
            title: 'Approval',
            dataIndex: 'manualApprovalRequired',
            key: 'manualApprovalRequired',
            width: 140,
            render: value => <Tag color={value ? 'orange' : 'green'}>{value ? 'MANUAL' : 'AUTO'}</Tag>,
        },
        {
            title: 'Last Error',
            dataIndex: 'lastError',
            key: 'lastError',
            ellipsis: true,
            render: value => value ? <Text type="danger">{value}</Text> : <Text type="secondary">None</Text>,
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 300,
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
                        title="Delete Telegram channel?"
                        description="Projects using this channel must be reassigned first."
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

    const statusAlerts = [];
    if (telegramStatus) {
        if (!telegramStatus.botTokenSet) {
            statusAlerts.push({
                type: 'error',
                message: 'Telegram bot token is missing',
                description: 'Add TELEGRAM_BOT_TOKEN from @BotFather to enable bot connectivity.',
            });
        }
        if (!telegramStatus.channelIdSet) {
            statusAlerts.push({
                type: 'error',
                message: 'Telegram channel ID is missing',
                description: 'Set TELEGRAM_CHANNEL_ID (e.g. -100123456789) for the bot to manage joins.',
            });
        }
        if (telegramStatus.botTokenSet && !telegramStatus.botReachable) {
            const networkIssue = telegramStatus.errorCode === 'TELEGRAM_NETWORK_TIMEOUT'
                || telegramStatus.errorCode === 'TELEGRAM_NETWORK_UNREACHABLE';
            statusAlerts.push({
                type: 'error',
                message: networkIssue ? 'Telegram API is unreachable from server' : 'Bot token is invalid or inaccessible',
                description: telegramStatus.error || (networkIssue
                    ? 'Server cannot connect to api.telegram.org:443. Check network/firewall/proxy.'
                    : 'Telegram rejected the bot token. Verify it in BotFather.'),
            });
        }
        if (telegramStatus.botReachable && telegramStatus.channelIdSet && !telegramStatus.channelReachable) {
            statusAlerts.push({
                type: 'error',
                message: 'Bot cannot access the target channel',
                description: telegramStatus.error || 'Make sure TELEGRAM_CHANNEL_ID is correct and the bot is added to the channel.',
            });
        }
        if (telegramStatus.channelReachable && !telegramStatus.botIsAdmin) {
            statusAlerts.push({
                type: 'error',
                message: 'Bot is not admin in the channel',
                description: 'Promote the bot to admin in your Telegram channel before running tracking.',
            });
        }
        if (telegramStatus.botIsAdmin && !telegramStatus.canInviteUsers) {
            statusAlerts.push({
                type: 'warning',
                message: 'Missing "Invite Users" permission',
                description: 'Enable Invite Users permission for the bot admin role to generate join links.',
            });
        }
        if (telegramStatus.error && statusAlerts.length === 0) {
            statusAlerts.push({
                type: 'warning',
                message: 'Telegram integration needs attention',
                description: telegramStatus.error,
            });
        }
        if (telegramStatus.isConfigured) {
            statusAlerts.push({
                type: 'success',
                message: statusLoading ? 'Checking Telegram integration...' : 'Telegram integration is active',
                description: 'Bot token, channel access, admin role, and invite permissions are all valid.',
            });
        }
    }

    return (
        <div style={{ padding: '16px 20px', maxWidth: '1200px', margin: '0 auto', minHeight: '100vh', background: '#f8fafc' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', gap: '20px', flexWrap: 'wrap' }}>
                <div>
                    <Title level={1} style={{ margin: 0, fontWeight: 800, fontSize: 'clamp(1.4rem, 4vw, 1.85rem)', color: '#1e293b', letterSpacing: '-0.02em' }}>
                        Telegram Integration
                    </Title>
                    <Text type="secondary" style={{ fontSize: '13px' }}>Connect and manage your Telegram bot relay settings</Text>
                </div>
                <Space wrap>
                    {showSetupForm && telegramConnections.length > 0 && (
                        <Button onClick={() => setShowSetupForm(false)}>
                            Cancel Setup
                        </Button>
                    )}
                    <Button
                        type="primary"
                        icon={<SendOutlined style={{ fontSize: '15px' }} />}
                        size="large"
                        onClick={() => setShowSetupForm(true)}
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
                        Add Telegram Channel
                    </Button>
                </Space>
            </div>

            {statusAlerts.length > 0 && (
                <Space direction="vertical" size={10} style={{ width: '100%', marginBottom: 16 }}>
                    {statusAlerts.map((alert, index) => (
                        <Alert
                            key={`${alert.type}-${index}`}
                            type={alert.type}
                            showIcon
                            message={alert.message}
                            description={alert.description}
                        />
                    ))}
                </Space>
            )}

            {showTelegramForm && (
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
                            style={{ marginBottom: '22px' }}
                        >
                            <Input size="large" className="premium-input" placeholder="https://t.me/your_channel_link" />
                        </Form.Item>
                        <Form.Item
                            label={<Text strong style={{ color: '#334155', fontSize: '14px' }}>Manual approval required</Text>}
                            name="TELEGRAM_MANUAL_APPROVAL_REQUIRED"
                            valuePropName="checked"
                            initialValue={false}
                            extra={<Text type="secondary" style={{ fontSize: '12px' }}>When enabled, users send a join request and conversions are tracked only after a channel admin approves them.</Text>}
                            style={{ marginBottom: 0 }}
                        >
                            <Switch checkedChildren="Manual" unCheckedChildren="Auto" />
                        </Form.Item>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 28 }}>
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
                                }}
                            >
                                Save Channel
                            </Button>
                        </div>
                    </div>
                </div>
            </Form>
            )}

            <Card
                style={{
                    marginTop: showTelegramForm ? 24 : 0,
                    borderRadius: '20px',
                    border: '1px solid rgba(226, 232, 240, 0.7)',
                    boxShadow: '0 4px 20px -5px rgba(0, 0, 0, 0.05)',
                }}
                title="Connected Telegram Channels"
                extra={<Button onClick={fetchTelegramConnections} icon={<SyncOutlined />}>Refresh</Button>}
            >
                <Table
                    rowKey="id"
                    dataSource={telegramConnections}
                    columns={telegramColumns}
                    scroll={{ x: 760 }}
                    pagination={{ pageSize: 6, hideOnSinglePage: true }}
                    locale={{ emptyText: 'No Telegram channels added yet' }}
                />
            </Card>
            <Modal
                title="Edit Telegram Channel"
                open={connectionModalOpen}
                onCancel={closeConnectionModal}
                onOk={handleConnectionSave}
                okText="Save Changes"
                confirmLoading={connectionSaving}
                destroyOnClose
            >
                <Form form={connectionForm} layout="vertical">
                    <Form.Item name="label" label="Connection Label" rules={[{ required: true, message: 'Enter a label' }]}>
                        <Input placeholder="Main Telegram Channel" />
                    </Form.Item>
                    <Form.Item name="botToken" label="Bot Token">
                        <Input.Password placeholder="Leave blank to keep the current token" />
                    </Form.Item>
                    <Row gutter={12}>
                        <Col xs={24} md={12}>
                            <Form.Item name="botUsername" label="Bot Username">
                                <Input placeholder="Ads2trackbot" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item name="channelId" label="Channel ID" rules={[{ required: true, message: 'Enter the channel ID' }]}>
                                <Input placeholder="-1001234567890" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item name="channelTitle" label="Channel Title">
                        <Input placeholder="VIP Signals" />
                    </Form.Item>
                    <Form.Item name="redirectUrl" label="Redirect URL">
                        <Input placeholder="https://t.me/yourchannel" />
                    </Form.Item>
                    <Row gutter={12}>
                        <Col xs={24} md={12}>
                            <Form.Item name="status" label="Status">
                                <Select options={[{ value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }]} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item name="manualApprovalRequired" label="Join Approval" valuePropName="checked">
                                <Switch checkedChildren="Manual" unCheckedChildren="Auto" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item name="isDefault" label="Default Channel" valuePropName="checked">
                        <Switch checkedChildren="Default" unCheckedChildren="No" />
                    </Form.Item>
                </Form>
            </Modal>

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


