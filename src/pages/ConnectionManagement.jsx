import { useCallback, useEffect, useMemo, useState } from 'react';
import {
    Alert,
    App,
    Button,
    Card,
    Col,
    Form,
    Input,
    Modal,
    Popconfirm,
    Row,
    Select,
    Space,
    Switch,
    Table,
    Tag,
    Typography,
} from 'antd';
import {
    ApiOutlined,
    CheckCircleFilled,
    DeleteOutlined,
    EditOutlined,
    GoogleOutlined,
    PlusOutlined,
    SendOutlined,
    SyncOutlined,
} from '@ant-design/icons';
import connectionService from '../services/connections';

const { Title, Text } = Typography;

const TYPE_CONFIG = {
    google: {
        title: 'Google Ads Accounts',
        shortTitle: 'Google',
        icon: <GoogleOutlined />,
        addLabel: 'Add Google Account',
        description: 'Customer IDs, MCC IDs, and conversion actions used by Google projects.',
        color: '#0f766e',
    },
    meta: {
        title: 'Meta Pixels & Ad Accounts',
        shortTitle: 'Meta',
        icon: <ApiOutlined />,
        addLabel: 'Add Meta Account',
        description: 'Pixel, ad account, event, and CAPI token used by Meta projects.',
        color: '#084b8a',
    },
    telegram: {
        title: 'Telegram Bots & Channels',
        shortTitle: 'Telegram',
        icon: <SendOutlined />,
        addLabel: 'Add Telegram Channel',
        description: 'Bot/channel pairs used to create invite links and detect joins/leaves.',
        color: '#0369a1',
    },
};

const META_EVENTS = [
    'Subscribe',
    'Lead',
    'InitiateCheckout',
    'CompleteRegistration',
    'Purchase',
    'Contact',
    'SubmitApplication',
    'SubscribeInitiated',
    'LeadInitiated',
];

function getErrorMessage(error, fallback = 'Request failed') {
    return error?.message || error?.error || error?.details || fallback;
}

function formatDate(value) {
    if (!value) return 'Never';
    try {
        return new Intl.DateTimeFormat('en', {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        }).format(new Date(value));
    } catch {
        return 'Invalid date';
    }
}

function normalizeConnections(payload) {
    return {
        google: payload?.google || [],
        meta: payload?.meta || [],
        telegram: payload?.telegram || [],
    };
}

export default function ConnectionManagement() {
    const { message } = App.useApp();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [connections, setConnections] = useState({ google: [], meta: [], telegram: [] });
    const [activeType, setActiveType] = useState('google');
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form] = Form.useForm();

    const loadConnections = useCallback(async () => {
        try {
            setLoading(true);
            const response = await connectionService.getConnections('all');
            setConnections(normalizeConnections(response?.data));
        } catch (error) {
            message.error(getErrorMessage(error, 'Failed to load connections'));
        } finally {
            setLoading(false);
        }
    }, [message]);

    useEffect(() => {
        loadConnections();
    }, [loadConnections]);

    const counts = useMemo(() => ({
        google: connections.google.length,
        meta: connections.meta.length,
        telegram: connections.telegram.length,
    }), [connections]);

    const openCreateModal = (type) => {
        setActiveType(type);
        setEditing(null);
        form.resetFields();
        form.setFieldsValue({
            status: 'active',
            isDefault: counts[type] === 0,
            validate: false,
            manualApprovalRequired: false,
        });
        setModalOpen(true);
    };

    const openEditModal = (type, record) => {
        setActiveType(type);
        setEditing(record);
        form.resetFields();
        form.setFieldsValue({
            ...record,
            status: record.status || 'active',
            isDefault: Boolean(record.isDefault),
            manualApprovalRequired: Boolean(record.manualApprovalRequired),
            validate: false,
        });
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditing(null);
        form.resetFields();
    };

    const buildPayload = (type, values) => {
        const base = {
            label: values.label,
            status: values.status || 'active',
            isDefault: Boolean(values.isDefault),
        };

        if (type === 'google') {
            return {
                ...base,
                customerId: values.customerId,
                managerCustomerId: values.managerCustomerId,
                conversionActionId: values.conversionActionId,
                refreshToken: values.refreshToken || undefined,
                developerToken: values.developerToken || undefined,
            };
        }

        if (type === 'meta') {
            return {
                ...base,
                adAccountId: values.adAccountId,
                pixelId: values.pixelId,
                accessToken: values.accessToken || undefined,
                eventName: values.eventName,
                testEventCode: values.testEventCode,
            };
        }

        return {
            ...base,
            botToken: values.botToken || undefined,
            botUsername: values.botUsername,
            channelId: values.channelId,
            channelTitle: values.channelTitle,
            redirectUrl: values.redirectUrl,
            manualApprovalRequired: Boolean(values.manualApprovalRequired),
            validate: Boolean(values.validate),
        };
    };

    const handleSave = async () => {
        try {
            const values = await form.validateFields();
            setSaving(true);
            const payload = buildPayload(activeType, values);

            if (editing) {
                await connectionService.updateConnection(activeType, editing.id, payload);
                message.success(`${TYPE_CONFIG[activeType].shortTitle} connection updated`);
            } else {
                await connectionService.createConnection(activeType, payload);
                message.success(`${TYPE_CONFIG[activeType].shortTitle} connection added`);
            }

            closeModal();
            await loadConnections();
        } catch (error) {
            if (error?.errorFields) return;
            message.error(getErrorMessage(error, 'Failed to save connection'));
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (type, id) => {
        try {
            await connectionService.deleteConnection(type, id);
            message.success('Connection deleted');
            await loadConnections();
        } catch (error) {
            message.error(getErrorMessage(error, 'Failed to delete connection'));
        }
    };

    const handleSetDefault = async (type, record) => {
        try {
            await connectionService.updateConnection(type, record.id, { isDefault: true });
            message.success(`${TYPE_CONFIG[type].shortTitle} default updated`);
            await loadConnections();
        } catch (error) {
            message.error(getErrorMessage(error, 'Failed to update default connection'));
        }
    };

    const handleToggleStatus = async (type, record) => {
        try {
            const nextStatus = record.status === 'active' ? 'inactive' : 'active';
            await connectionService.updateConnection(type, record.id, { status: nextStatus });
            message.success(`Connection marked ${nextStatus}`);
            await loadConnections();
        } catch (error) {
            message.error(getErrorMessage(error, 'Failed to update connection status'));
        }
    };

    const compactId = (value, prefix = '') => {
        const raw = value ? String(value) : 'N/A';
        const display = raw.length > 18 ? `${raw.slice(0, 8)}...${raw.slice(-6)}` : raw;
        return (
            <Text title={`${prefix}${raw}`} style={{ maxWidth: 170 }} ellipsis>
                {prefix}{display}
            </Text>
        );
    };

    const compactLabel = (value, fallback) => {
        const raw = value ? String(value) : fallback;
        return raw.length > 28 ? `${raw.slice(0, 18)}...${raw.slice(-6)}` : raw;
    };

    const commonColumns = (type) => [
        {
            title: 'Name',
            dataIndex: 'label',
            key: 'label',
            width: 300,
            render: (value, record) => (
                <Space className="connection-name-cell" direction="vertical" size={4}>
                    <div className="connection-name-main">
                        <Text
                            strong
                            title={value || TYPE_CONFIG[type].shortTitle}
                            className="connection-label-text"
                        >
                            {compactLabel(value, TYPE_CONFIG[type].shortTitle)}
                        </Text>
                        {record.isDefault && <Tag className="connection-default-tag" color="blue">Default</Tag>}
                    </div>
                    <Text type="secondary" style={{ fontSize: 12 }}>Created {formatDate(record.createdAt)}</Text>
                </Space>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 130,
            render: (status) => (
                <Tag color={status === 'active' ? 'green' : status === 'inactive' ? 'orange' : 'red'}>
                    {String(status || 'active').toUpperCase()}
                </Tag>
            ),
        },
        {
            title: 'Last Sync / Check',
            key: 'lastActivity',
            width: 190,
            render: (_, record) => formatDate(record.lastSyncedAt || record.lastCheckedAt),
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 310,
            render: (_, record) => (
                <Space wrap>
                    <Button size="small" icon={<EditOutlined />} onClick={() => openEditModal(type, record)}>
                        Edit
                    </Button>
                    {!record.isDefault && (
                        <Button size="small" onClick={() => handleSetDefault(type, record)}>
                            Set Default
                        </Button>
                    )}
                    <Button size="small" onClick={() => handleToggleStatus(type, record)}>
                        {record.status === 'active' ? 'Disable' : 'Enable'}
                    </Button>
                    <Popconfirm
                        title="Delete connection?"
                        description="Projects using this connection must be updated first."
                        okText="Delete"
                        okButtonProps={{ danger: true }}
                        onConfirm={() => handleDelete(type, record.id)}
                    >
                        <Button size="small" danger icon={<DeleteOutlined />}>
                            Delete
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const columnsByType = {
        google: [
            ...commonColumns('google').slice(0, 1),
            {
                title: 'Customer',
                key: 'customer',
                width: 170,
                render: (_, record) => (
                    <Space direction="vertical" size={2}>
                        {compactId(record.customerId)}
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            MCC: {record.managerCustomerId ? compactId(record.managerCustomerId) : 'None'}
                        </Text>
                    </Space>
                ),
            },
            {
                title: 'Conversion Action',
                dataIndex: 'conversionActionId',
                key: 'conversionActionId',
                width: 180,
                ellipsis: true,
                render: (value) => value ? compactId(value) : 'Workspace fallback',
            },
            {
                title: 'OAuth Token',
                dataIndex: 'tokenSet',
                key: 'tokenSet',
                width: 130,
                render: (value) => value ? <Tag color="green">Set</Tag> : <Tag color="orange">Fallback</Tag>,
            },
            ...commonColumns('google').slice(1),
        ],
        meta: [
            ...commonColumns('meta').slice(0, 1),
            {
                title: 'Ad Account / Pixel',
                key: 'metaIds',
                width: 220,
                render: (_, record) => (
                    <Space direction="vertical" size={2}>
                        {compactId(record.adAccountId, 'act_')}
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            Pixel: {record.pixelId ? compactId(record.pixelId) : 'N/A'}
                        </Text>
                    </Space>
                ),
            },
            {
                title: 'Event',
                dataIndex: 'eventName',
                key: 'eventName',
                width: 160,
                render: (value) => <Tag color="blue">{value || 'Subscribe'}</Tag>,
            },
            {
                title: 'Token',
                dataIndex: 'accessTokenSet',
                key: 'accessTokenSet',
                width: 110,
                render: (value) => value ? <Tag color="green">Set</Tag> : <Tag color="red">Missing</Tag>,
            },
            ...commonColumns('meta').slice(1),
        ],
        telegram: [
            ...commonColumns('telegram').slice(0, 1),
            {
                title: 'Bot / Channel',
                key: 'telegramIds',
                width: 230,
                render: (_, record) => (
                    <Space direction="vertical" size={2}>
                        <Text>{record.botUsername ? `@${record.botUsername}` : 'Bot username missing'}</Text>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            {record.channelTitle || (record.channelId ? compactId(record.channelId) : 'Channel missing')}
                        </Text>
                    </Space>
                ),
            },
            {
                title: 'Invite Redirect',
                dataIndex: 'redirectUrl',
                key: 'redirectUrl',
                width: 220,
                ellipsis: true,
                render: (value) => value || 'Telegram default',
            },
            {
                title: 'Approval',
                dataIndex: 'manualApprovalRequired',
                key: 'manualApprovalRequired',
                width: 150,
                render: (value) => (
                    <Tag color={value ? 'orange' : 'green'}>
                        {value ? 'MANUAL' : 'AUTO'}
                    </Tag>
                ),
            },
            {
                title: 'Last Error',
                dataIndex: 'lastError',
                key: 'lastError',
                width: 220,
                ellipsis: true,
                render: (value) => value ? <Text type="danger">{value}</Text> : <Text type="secondary">None</Text>,
            },
            ...commonColumns('telegram').slice(1),
        ],
    };

    const renderFormFields = () => {
        if (activeType === 'google') {
            return (
                <>
                    <Form.Item
                        name="customerId"
                        label="Google Ads Customer ID"
                        rules={[{ required: true, message: 'Customer ID is required' }]}
                    >
                        <Input placeholder="3845655841" />
                    </Form.Item>
                    <Row gutter={12}>
                        <Col xs={24} md={12}>
                            <Form.Item name="managerCustomerId" label="Manager Customer ID">
                                <Input placeholder="Optional MCC ID" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item name="conversionActionId" label="Conversion Action ID">
                                <Input placeholder="7413484448" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Alert
                        showIcon
                        type="info"
                        style={{ marginBottom: 16 }}
                        message="OAuth token behavior"
                        description="If this connection has no refresh token, the backend uses the workspace OAuth token but still uploads/syncs against this selected customer ID."
                    />
                    <Row gutter={12}>
                        <Col xs={24} md={12}>
                            <Form.Item name="refreshToken" label={editing ? 'Refresh Token (leave blank to keep)' : 'Refresh Token'}>
                                <Input.Password placeholder="Optional if workspace OAuth is already connected" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item name="developerToken" label={editing ? 'Developer Token (leave blank to keep)' : 'Developer Token'}>
                                <Input.Password placeholder="Optional platform fallback" />
                            </Form.Item>
                        </Col>
                    </Row>
                </>
            );
        }

        if (activeType === 'meta') {
            return (
                <>
                    <Row gutter={12}>
                        <Col xs={24} md={12}>
                            <Form.Item
                                name="adAccountId"
                                label="Meta Ad Account ID"
                                rules={[{ required: true, message: 'Ad account ID is required' }]}
                            >
                                <Input placeholder="act_123456789 or 123456789" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item
                                name="pixelId"
                                label="Meta Pixel ID"
                                rules={[{ required: true, message: 'Pixel ID is required' }]}
                            >
                                <Input placeholder="807397898904647" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item
                        name="accessToken"
                        label={editing ? 'Access Token (leave blank to keep)' : 'Access Token'}
                        rules={editing ? [] : [{ required: true, message: 'Access token is required' }]}
                    >
                        <Input.Password placeholder="Meta Conversion API token" />
                    </Form.Item>
                    <Row gutter={12}>
                        <Col xs={24} md={12}>
                            <Form.Item name="eventName" label="Default Event Name" initialValue="Subscribe">
                                <Select
                                    showSearch
                                    options={META_EVENTS.map(eventName => ({ label: eventName, value: eventName }))}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item name="testEventCode" label="Test Event Code">
                                <Input placeholder="Optional Meta test code" />
                            </Form.Item>
                        </Col>
                    </Row>
                </>
            );
        }

        return (
            <>
                <Row gutter={12}>
                    <Col xs={24} md={12}>
                        <Form.Item
                            name="botToken"
                            label={editing ? 'Bot Token (leave blank to keep)' : 'Bot Token'}
                            rules={editing ? [] : [{ required: true, message: 'Bot token is required' }]}
                        >
                            <Input.Password placeholder="123456:ABC..." />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item name="botUsername" label="Bot Username">
                            <Input placeholder="Track2GramBot" prefix="@" />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={12}>
                    <Col xs={24} md={12}>
                        <Form.Item
                            name="channelId"
                            label="Channel ID"
                            rules={[{ required: true, message: 'Channel ID is required' }]}
                        >
                            <Input placeholder="-1001234567890" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item name="channelTitle" label="Channel Title">
                            <Input placeholder="Premium Channel" />
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item name="redirectUrl" label="Telegram Redirect URL">
                    <Input placeholder="Optional fallback URL" />
                </Form.Item>
                <Form.Item
                    name="manualApprovalRequired"
                    label="Manual approval required"
                    valuePropName="checked"
                    extra="When enabled, users send a join request and conversions are tracked only after a channel admin approves them."
                >
                    <Switch checkedChildren="Manual" unCheckedChildren="Auto" />
                </Form.Item>
                <Form.Item name="validate" label="Validate bot admin permissions now" valuePropName="checked">
                    <Switch />
                </Form.Item>
            </>
        );
    };

    return (
        <div style={{ padding: '18px 20px 40px', background: '#f8fafc', minHeight: '100vh' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap', marginBottom: 22 }}>
                <div>
                    <Title level={1} style={{ margin: 0, fontWeight: 800, color: '#1e293b', letterSpacing: '-0.03em' }}>
                        Connected Accounts
                    </Title>
                    <Text type="secondary">
                        Manage multiple Google, Meta, and Telegram connections, then assign the correct one inside each project.
                    </Text>
                </div>
                <Button icon={<SyncOutlined />} onClick={loadConnections} loading={loading}>
                    Refresh
                </Button>
            </div>

            <Alert
                type="info"
                showIcon
                style={{ marginBottom: 18, borderRadius: 12 }}
                message="Project routing is connection-aware"
                description="Conversions use the connection selected on the project. Ad spend sync stores account and connection IDs, then project analytics aggregate only rows matched to that project URL."
            />

            <Row gutter={[16, 16]} style={{ marginBottom: 18 }}>
                {Object.entries(TYPE_CONFIG).map(([type, config]) => (
                    <Col xs={24} md={8} key={type}>
                        <Card
                            hoverable
                            onClick={() => setActiveType(type)}
                            style={{
                                borderRadius: 18,
                                border: activeType === type ? `2px solid ${config.color}` : '1px solid #e2e8f0',
                                boxShadow: activeType === type ? '0 14px 34px rgba(8,75,138,0.12)' : '0 8px 22px rgba(15,23,42,0.04)',
                            }}
                        >
                            <Space align="start">
                                <div style={{
                                    width: 44,
                                    height: 44,
                                    borderRadius: 14,
                                    background: `${config.color}14`,
                                    color: config.color,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: 22,
                                }}>
                                    {config.icon}
                                </div>
                                <div>
                                    <Text strong style={{ display: 'block', fontSize: 15 }}>{config.shortTitle}</Text>
                                    <Title level={2} style={{ margin: '2px 0 0', color: config.color }}>{counts[type]}</Title>
                                </div>
                            </Space>
                        </Card>
                    </Col>
                ))}
            </Row>

            <Card
                style={{
                    borderRadius: 20,
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 10px 30px rgba(15,23,42,0.05)',
                    overflow: 'hidden',
                }}
                title={
                    <Space>
                        {TYPE_CONFIG[activeType].icon}
                        <span>{TYPE_CONFIG[activeType].title}</span>
                    </Space>
                }
                extra={
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => openCreateModal(activeType)}>
                        {TYPE_CONFIG[activeType].addLabel}
                    </Button>
                }
            >
                <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
                    {TYPE_CONFIG[activeType].description}
                </Text>
                <Table
                    className="connected-accounts-table"
                    rowKey="id"
                    loading={loading}
                    columns={columnsByType[activeType]}
                    dataSource={connections[activeType]}
                    tableLayout="fixed"
                    scroll={{ x: activeType === 'google' ? 1340 : 1280 }}
                    pagination={{ pageSize: 8, hideOnSinglePage: true }}
                    locale={{ emptyText: `No ${TYPE_CONFIG[activeType].shortTitle} connections yet` }}
                />
            </Card>

            <Modal
                open={modalOpen}
                title={
                    <Space>
                        {TYPE_CONFIG[activeType].icon}
                        <span>{editing ? 'Edit' : 'Add'} {TYPE_CONFIG[activeType].shortTitle} Connection</span>
                    </Space>
                }
                onCancel={closeModal}
                onOk={handleSave}
                okText={editing ? 'Save Changes' : 'Create Connection'}
                confirmLoading={saving}
                width={760}
                destroyOnHidden
            >
                <Form form={form} layout="vertical" requiredMark={false}>
                    <Row gutter={12}>
                        <Col xs={24} md={12}>
                            <Form.Item name="label" label="Connection Label">
                                <Input placeholder={`${TYPE_CONFIG[activeType].shortTitle} Main Account`} />
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

                    {renderFormFields()}

                    <Form.Item name="isDefault" label="Use as workspace default" valuePropName="checked">
                        <Switch checkedChildren={<CheckCircleFilled />} />
                    </Form.Item>
                </Form>
            </Modal>

            <style>{`
                .connected-accounts-table .ant-table {
                    min-width: 100%;
                }
                .connected-accounts-table .ant-table-cell {
                    vertical-align: middle;
                    white-space: nowrap;
                    word-break: normal !important;
                    overflow-wrap: normal !important;
                }
                .connected-accounts-table .connection-name-cell,
                .connected-accounts-table .connection-name-cell {
                    min-width: 0;
                    max-width: 100%;
                }
                .connected-accounts-table .connection-name-main {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    min-width: 0;
                    max-width: 100%;
                }
                .connected-accounts-table .connection-label-text {
                    display: inline-block;
                    max-width: 205px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap !important;
                    word-break: normal !important;
                    overflow-wrap: normal !important;
                }
                .connected-accounts-table .connection-default-tag {
                    flex: 0 0 auto;
                    white-space: nowrap !important;
                    word-break: keep-all !important;
                }
                .connected-accounts-table .ant-table-thead > tr > th {
                    font-weight: 800;
                    letter-spacing: 0.01em;
                }
                .connected-accounts-table .ant-space {
                    max-width: 100%;
                }
            `}</style>
        </div>
    );
}
