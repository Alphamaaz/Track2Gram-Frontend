import { useState, useEffect, useCallback } from 'react'
import {
  Card, Table, Button, Modal, Form, Input, Select, Slider, Switch,
  Tag, Space, Typography, Row, Col, Statistic, Divider, Tooltip,
  Badge, message, Popconfirm, Empty, Alert, Spin
} from 'antd'
import {
  PlusOutlined, EditOutlined, DeleteOutlined, PlayCircleOutlined,
  PauseCircleOutlined, SendOutlined, UserOutlined, MessageOutlined,
  ClockCircleOutlined, StopOutlined, ReloadOutlined, TeamOutlined,
  ThunderboltOutlined, RollbackOutlined, WarningOutlined, LinkOutlined
} from '@ant-design/icons'
import { API_BASE_URL } from '../config'

const { Title, Text, Paragraph } = Typography
const { TextArea } = Input
const { Option } = Select

// ─── API helpers ────────────────────────────────────────────────────────────

const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token')}`,
})

async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_BASE_URL}/retention${path}`, {
    ...options,
    headers: { ...authHeaders(), ...options.headers },
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Request failed')
  return data
}

// ─── Schedule options ────────────────────────────────────────────────────────

const SCHEDULE_OPTIONS = [
  { label: '1× per day', value: 1 },
  { label: '2× per day (every 12h)', value: 2 },
  { label: '3× per day (every 8h)', value: 3 },
  { label: '4× per day (every 6h)', value: 4 },
]

// ─── Campaign Form Modal ─────────────────────────────────────────────────────

function CampaignModal({ open, campaign, onClose, onSaved }) {
  const [form] = Form.useForm()
  const [saving, setSaving] = useState(false)
  const isEdit = !!campaign?._id

  useEffect(() => {
    if (open) {
      form.setFieldsValue(
        campaign
          ? {
              name: campaign.name,
              channelId: campaign.channelId,
              message: campaign.message,
              timesPerDay: campaign.schedule?.timesPerDay ?? 1,
              maxDmsPerUser: campaign.maxDmsPerUser ?? 3,
              isActive: campaign.isActive !== false,
            }
          : { timesPerDay: 1, maxDmsPerUser: 3, isActive: true }
      )
    }
  }, [open, campaign, form])

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      setSaving(true)
      const payload = {
        channelId: values.channelId,
        name: values.name,
        message: values.message,
        schedule: { timesPerDay: values.timesPerDay },
        maxDmsPerUser: values.maxDmsPerUser,
        isActive: values.isActive,
      }
      if (isEdit) {
        await apiFetch(`/campaigns/${campaign._id}`, { method: 'PUT', body: JSON.stringify(payload) })
        message.success('Campaign updated!')
      } else {
        await apiFetch('/campaigns', { method: 'POST', body: JSON.stringify(payload) })
        message.success('Campaign created!')
      }
      onSaved()
      onClose()
    } catch (e) {
      if (e?.errorFields) return // ant form validation error
      message.error(e.message || 'Failed to save campaign')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal
      title={
        <Space>
          <MessageOutlined style={{ color: '#084b8a' }} />
          {isEdit ? 'Edit Campaign' : 'New Retention Campaign'}
        </Space>
      }
      open={open}
      onCancel={onClose}
      onOk={handleSubmit}
      okText={isEdit ? 'Save Changes' : 'Create Campaign'}
      confirmLoading={saving}
      width={600}
      styles={{ body: { paddingTop: 8 } }}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="name" label="Campaign Name" rules={[{ required: true, message: 'Name is required' }]}>
          <Input placeholder="e.g. Win-Back Campaign" />
        </Form.Item>

        <Form.Item name="channelId" label="Channel ID" rules={[{ required: true, message: 'Channel ID is required' }]}>
          <Input placeholder="-100123456789 or @channelhandle" style={{ fontFamily: 'monospace' }} />
        </Form.Item>

        <Form.Item
          name="message"
          label={
            <Space>
              Message
              <Tooltip title="Use {firstName}, {username} or {name} as placeholders">
                <Tag color="blue" style={{ cursor: 'help', marginLeft: 4 }}>Supports {'{firstName}'} {'{username}'}</Tag>
              </Tooltip>
            </Space>
          }
          rules={[{ required: true, message: 'Message is required' }]}
        >
          <TextArea
            rows={5}
            placeholder={`Hi {firstName}! 👋\n\nWe miss you in our community! Come back and join us again — there's a lot of exclusive content waiting for you. 🚀`}
            showCount
            maxLength={4096}
          />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="timesPerDay" label="Broadcast Frequency">
              <Select>
                {SCHEDULE_OPTIONS.map(o => (
                  <Option key={o.value} value={o.value}>{o.label}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="maxDmsPerUser" label="Max DMs per User (1–20)">
              <Slider min={1} max={20} marks={{ 1: '1', 5: '5', 10: '10', 20: '20' }} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="isActive" label="Status" valuePropName="checked">
          <Switch checkedChildren="Active" unCheckedChildren="Paused" />
        </Form.Item>
      </Form>
    </Modal>
  )
}

// ─── Main page ───────────────────────────────────────────────────────────────

export default function RetentionCampaigns() {
  const [campaigns, setCampaigns] = useState([])
  const [leavers, setLeavers] = useState([])
  const [stats, setStats] = useState({ total: 0, optedOut: 0, messagedToday: 0, activeCampaigns: 0 })
  const [loading, setLoading] = useState(true)
  const [leaversLoading, setLeaversLoading] = useState(true)
  const [leaversPagination, setLeaversPagination] = useState({ page: 1, limit: 20, total: 0 })
  const [modalOpen, setModalOpen] = useState(false)
  const [editingCampaign, setEditingCampaign] = useState(null)
  const [broadcastingId, setBroadcastingId] = useState(null)

  // Welcome settings state
  const [welcomeSettings, setWelcomeSettings] = useState({ enabled: false, message: '', url: '', botInviteUrl: '' })
  const [welcomeLoading, setWelcomeLoading] = useState(false)
  const [welcomeSaving, setWelcomeSaving] = useState(false)
  const [welcomeForm] = Form.useForm()

  // ── data loaders ──────────────────────────────────────────────────────────

  const loadWelcomeSettings = useCallback(async () => {
    try {
      setWelcomeLoading(true)
      const data = await apiFetch('/welcome-settings')
      setWelcomeSettings(data)
      welcomeForm.setFieldsValue(data)
    } catch (e) {
      console.warn('[retention] Welcome settings load error:', e.message)
    } finally {
      setWelcomeLoading(false)
    }
  }, [welcomeForm])

  const loadCampaigns = useCallback(async () => {
    try {
      setLoading(true)
      const data = await apiFetch('/campaigns')
      setCampaigns(data.campaigns || [])
    } catch (e) {
      message.error(e.message || 'Failed to load campaigns')
    } finally {
      setLoading(false)
    }
  }, [])

  const loadStats = useCallback(async () => {
    try {
      const data = await apiFetch('/stats')
      setStats(data.stats || {})
    } catch (e) {
      // stats errors are non-critical; silently ignore
      console.warn('[retention] Stats load error:', e?.message || e)
    }
  }, [])

  const loadLeavers = useCallback(async (page = 1) => {
    try {
      setLeaversLoading(true)
      const data = await apiFetch(`/leavers?page=${page}&limit=${leaversPagination.limit}`)
      setLeavers(data.leavers || [])
      setLeaversPagination(p => ({ ...p, total: data.total, page }))
    } catch (e) {
      message.error(e.message || 'Failed to load leavers')
    } finally {
      setLeaversLoading(false)
    }
  }, [leaversPagination.limit])

  useEffect(() => {
    loadCampaigns()
    loadStats()
    loadLeavers()
    loadWelcomeSettings()
  }, []) // eslint-disable-line

  // ── welcome settings ──────────────────────────────────────────────────────

  const handleSaveWelcome = async (values) => {
    try {
      setWelcomeSaving(true)
      await apiFetch('/welcome-settings', { method: 'POST', body: JSON.stringify(values) })
      message.success('Welcome bonus settings saved!')
      setWelcomeSettings(values)
    } catch (e) {
      message.error(e.message || 'Save failed')
    } finally {
      setWelcomeSaving(false)
    }
  }

  // ── campaign actions ──────────────────────────────────────────────────────

  const handleToggle = async (campaign) => {
    try {
      await apiFetch(`/campaigns/${campaign._id}/toggle`, { method: 'PATCH' })
      message.success(`Campaign ${campaign.status === 'active' ? 'paused' : 'resumed'}`)
      loadCampaigns()
    } catch (e) {
      message.error(e.message || 'Toggle failed')
    }
  }

  const handleDelete = async (id) => {
    try {
      await apiFetch(`/campaigns/${id}`, { method: 'DELETE' })
      message.success('Campaign deleted')
      loadCampaigns()
      loadStats()
    } catch (e) {
      message.error(e.message || 'Delete failed')
    }
  }

  const handleBroadcast = async (campaignId) => {
    try {
      setBroadcastingId(campaignId)
      await apiFetch('/broadcasts/trigger', { method: 'POST', body: JSON.stringify({ campaignId }) })
      message.success('Broadcast triggered! DMs are being sent in the background.')
    } catch (e) {
      message.error(e.message || 'Broadcast failed')
    } finally {
      setBroadcastingId(null)
    }
  }

  const handleResetOptedOut = async (leaverId) => {
    try {
      await apiFetch(`/leavers/${leaverId}/reset-opted-out`, { method: 'POST' })
      message.success('Reset! User will receive DMs on the next broadcast.')
      loadLeavers(leaversPagination.page)
      loadStats()
    } catch (e) {
      message.error(e.message || 'Reset failed')
    }
  }

  const handleResetAllOptedOut = async () => {
    try {
      const data = await apiFetch('/leavers/reset-all-opted-out', { method: 'POST' })
      message.success(data.message || 'All opted-out users reset.')
      loadLeavers(leaversPagination.page)
      loadStats()
    } catch (e) {
      message.error(e.message || 'Reset failed')
    }
  }

  // ── campaign table columns ─────────────────────────────────────────────────

  const campaignColumns = [
    {
      title: 'Campaign',
      dataIndex: 'name',
      key: 'name',
      render: (name, record) => (
        <Space direction="vertical" size={0}>
          <Text strong>{name}</Text>
          <Text type="secondary" style={{ fontSize: 12, fontFamily: 'monospace' }}>
            {record.channelId}
          </Text>
        </Space>
      ),
    },
    {
      title: 'Message Preview',
      dataIndex: 'message',
      key: 'message',
      ellipsis: true,
      render: (msg) => (
        <Tooltip title={msg} placement="topLeft">
          <Text style={{ maxWidth: 260, display: 'inline-block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {msg}
          </Text>
        </Tooltip>
      ),
    },
    {
      title: 'Schedule',
      key: 'schedule',
      render: (_, r) => {
        const tpd = r.schedule?.timesPerDay || 1
        return (
          <Space>
            <ClockCircleOutlined style={{ color: '#084b8a' }} />
            <Text>{tpd === 1 ? 'Once daily' : `${tpd}× per day`}</Text>
          </Space>
        )
      },
    },
    {
      title: 'Max DMs',
      dataIndex: 'maxDmsPerUser',
      key: 'maxDmsPerUser',
      width: 90,
      align: 'center',
      render: (v) => <Tag color="blue">{v}</Tag>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => (
        <Badge
          status={status === 'active' ? 'success' : 'warning'}
          text={<Text style={{ textTransform: 'capitalize' }}>{status}</Text>}
        />
      ),
    },
    {
      title: 'Last Broadcast',
      dataIndex: 'lastBroadcastAt',
      key: 'lastBroadcastAt',
      width: 160,
      render: (d) => d ? <Text type="secondary">{new Date(d).toLocaleString()}</Text> : <Text type="secondary">Never</Text>,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 200,
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit">
            <Button
              size="small"
              icon={<EditOutlined />}
              onClick={() => { setEditingCampaign(record); setModalOpen(true) }}
            />
          </Tooltip>
          <Tooltip title={record.status === 'active' ? 'Pause' : 'Resume'}>
            <Button
              size="small"
              icon={record.status === 'active' ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
              onClick={() => handleToggle(record)}
              style={{ color: record.status === 'active' ? '#f59e0b' : '#10b981' }}
            />
          </Tooltip>
          <Tooltip title="Send Now">
            <Button
              size="small"
              icon={<SendOutlined />}
              type="primary"
              loading={broadcastingId === record._id}
              onClick={() => handleBroadcast(record._id)}
            />
          </Tooltip>
          <Popconfirm
            title="Delete this campaign?"
            description="This cannot be undone."
            onConfirm={() => handleDelete(record._id)}
            okText="Delete"
            okType="danger"
          >
            <Tooltip title="Delete">
              <Button size="small" danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  // ── leavers table columns ─────────────────────────────────────────────────

  const leaverColumns = [
    {
      title: 'User',
      key: 'user',
      render: (_, r) => {
        const name = [r.telegramFirstName, r.telegramLastName].filter(Boolean).join(' ') || '—'
        return (
          <Space direction="vertical" size={0}>
            <Text strong>{name}</Text>
            {r.telegramUsername && <Text type="secondary" style={{ fontSize: 12 }}>@{r.telegramUsername}</Text>}
          </Space>
        )
      },
    },
    {
      title: 'Telegram ID',
      dataIndex: 'telegramUserId',
      key: 'telegramUserId',
      render: (id) => <Text style={{ fontFamily: 'monospace' }}>{id}</Text>,
    },
    {
      title: 'Channel',
      dataIndex: 'channelId',
      key: 'channelId',
      render: (id) => <Text style={{ fontFamily: 'monospace', fontSize: 12 }}>{id}</Text>,
    },
    {
      title: 'Left At',
      dataIndex: 'leftAt',
      key: 'leftAt',
      render: (d) => d ? new Date(d).toLocaleString() : '—',
    },
    {
      title: 'DMs Sent',
      dataIndex: 'dmCount',
      key: 'dmCount',
      align: 'center',
      render: (v) => <Tag color={v > 0 ? 'blue' : 'default'}>{v || 0}</Tag>,
    },
    {
      title: 'Last DM',
      dataIndex: 'lastDmSentAt',
      key: 'lastDmSentAt',
      render: (d) => d ? new Date(d).toLocaleString() : '—',
    },
    {
      title: 'Opted Out',
      dataIndex: 'dmOptedOut',
      key: 'dmOptedOut',
      align: 'center',
      render: (v) => v ? <Tag icon={<StopOutlined />} color="error">Blocked</Tag> : <Tag color="success">Active</Tag>,
    },
    {
      title: 'Action',
      key: 'action',
      align: 'center',
      width: 80,
      render: (_, record) =>
        record.dmOptedOut ? (
          <Tooltip title="User has blocked the bot or never started it. Ask them to unblock the bot, then click Reset to retry.">
            <Button
              size="small"
              icon={<RollbackOutlined />}
              onClick={() => handleResetOptedOut(record._id)}
            >
              Reset
            </Button>
          </Tooltip>
        ) : null,
    },
  ]

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div style={{ padding: '0 0 40px' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <Title level={3} style={{ margin: 0, color: '#0f172a' }}>
          <MessageOutlined style={{ marginRight: 10, color: '#084b8a' }} />
          Retention Campaigns
        </Title>
        <Text type="secondary">
          Re-engage users who left your Telegram channel with scheduled personalised messages.
        </Text>
      </div>

      {/* Stats row */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {[
          { title: 'Total Leavers', value: stats.total, icon: <UserOutlined />, color: '#3b82f6' },
          { title: 'Active Campaigns', value: stats.activeCampaigns, icon: <ThunderboltOutlined />, color: '#10b981' },
          { title: 'Messaged Today', value: stats.messagedToday, icon: <SendOutlined />, color: '#f59e0b' },
          { title: 'Opted Out', value: stats.optedOut, icon: <StopOutlined />, color: '#ef4444' },
        ].map((s) => (
          <Col xs={12} sm={12} md={6} key={s.title}>
            <Card
              size="small"
              bordered={false}
              style={{ borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
            >
              <Statistic
                title={<Text type="secondary" style={{ fontSize: 13 }}>{s.title}</Text>}
                value={s.value ?? 0}
                prefix={<span style={{ color: s.color, marginRight: 4 }}>{s.icon}</span>}
                valueStyle={{ color: '#0f172a', fontWeight: 700 }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* Permissions Strategy Card */}
      <Card
        title={
          <Space>
            <Tooltip title="This strategy helps you unlock DM permissions so retention messages actually go through.">
              <TeamOutlined style={{ color: '#084b8a' }} />
            </Tooltip>
            <span>Permissions Strategy (Welcome Bonus)</span>
          </Space>
        }
        bordered={false}
        style={{ borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', marginBottom: 24 }}
      >
        <Alert
          type="warning"
          showIcon
          icon={<WarningOutlined />}
          style={{ marginBottom: 20, borderRadius: 10 }}
          message="Unlock DM Permissions"
          description={
            <span>
              Because you use a frictionless 'Direct Join' setup, users never start your bot.
              <strong> Bots cannot DM users unless the user /starts them first.</strong>
              Enable a Welcome Bonus below and post its link in your channel (e.g. '🎁 Claim your welcome gift in our bot') to grant the bot permission to DM them if they leave.
            </span>
          }
        />
        <Spin spinning={welcomeLoading}>
          <Form
            form={welcomeForm}
            layout="vertical"
            initialValues={welcomeSettings}
            onFinish={handleSaveWelcome}
          >
            <Form.Item name="enabled" valuePropName="checked" label="Enable Subscriber Bonus">
              <Switch checkedChildren="ON" unCheckedChildren="OFF" />
            </Form.Item>

            {welcomeSettings.enabled && (
              <div style={{ marginBottom: 24, padding: 12, backgroundColor: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>
                  STEP 1: Copy this link and post it in your Telegram Channel (e.g. as a pinned message)
                </Text>
                <Space.Compact style={{ width: '100%' }}>
                  <Input readOnly value={welcomeSettings.botInviteUrl} prefix={<LinkOutlined />} style={{ backgroundColor: '#fff' }} />
                  <Button
                    type="primary"
                    onClick={() => {
                      navigator.clipboard.writeText(welcomeSettings.botInviteUrl)
                      message.success('Link copied to clipboard!')
                    }}
                    style={{ backgroundColor: '#084b8a' }}
                  >
                    Copy Link
                  </Button>
                </Space.Compact>
                <Alert
                  type="info"
                  showIcon
                  icon={<MessageOutlined />}
                  style={{ marginTop: 12, borderRadius: 8, border: 'none', backgroundColor: '#eff6ff' }}
                  message="Subscriber Gift = Direct Message"
                  description="When a user clicks this link, the bot will send them a PRIVATE message (DM) with your bonus. It will not post in the channel."
                />
              </div>
            )}

            <Row gutter={16}>
              <Col xs={24} md={16}>
                <Form.Item name="message" label="Bonus Message (HTML supported)">
                  <TextArea rows={4} placeholder="e.g. Thanks for joining! 👋 Here is your exclusive welcome PDF guide to getting started with our premium signals." />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item name="url" label="Bonus Link (PDF / Bonus code URL)">
                  <Input prefix={<LinkOutlined />} placeholder="https://example.com/gift.pdf" />
                </Form.Item>
              </Col>
            </Row>

            <Button type="primary" htmlType="submit" loading={welcomeSaving} style={{ backgroundColor: '#084b8a' }}>
              Save Strategy
            </Button>
          </Form>
        </Spin>
      </Card>

      {/* Campaigns section */}
      <Card
        title={
          <Space>
            <ThunderboltOutlined style={{ color: '#084b8a' }} />
            <span>Campaigns</span>
            <Badge count={campaigns.length} showZero style={{ backgroundColor: '#084b8a' }} />
          </Space>
        }
        extra={
          <Space>
            <Button icon={<ReloadOutlined />} onClick={() => { loadCampaigns(); loadStats() }} />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => { setEditingCampaign(null); setModalOpen(true) }}
              style={{ backgroundColor: '#084b8a' }}
            >
              New Campaign
            </Button>
          </Space>
        }
        bordered={false}
        style={{ borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', marginBottom: 24 }}
      >
        <Table
          dataSource={campaigns}
          columns={campaignColumns}
          rowKey="_id"
          loading={loading}
          locale={{ emptyText: <Empty description="No campaigns yet. Create one to get started." /> }}
          pagination={false}
          scroll={{ x: 900 }}
          size="middle"
        />
      </Card>

      {/* Leavers table */}
      <Card
        title={
          <Space>
            <TeamOutlined style={{ color: '#084b8a' }} />
            <span>Channel Leavers</span>
            <Badge count={leaversPagination.total} showZero style={{ backgroundColor: '#6b7280' }} />
          </Space>
        }
        extra={
          <Space>
            <Popconfirm
              title="Reset all opted-out users?"
              description="This lets you retry sending DMs to users that previously blocked the bot. Only do this after they have unblocked it."
              onConfirm={handleResetAllOptedOut}
              okText="Reset All"
              okType="default"
            >
              <Tooltip title="Reset opted-out status for all blocked users so they can receive DMs again">
                <Button icon={<RollbackOutlined />} size="small">Reset All Opted-Out</Button>
              </Tooltip>
            </Popconfirm>
            <Button icon={<ReloadOutlined />} onClick={() => loadLeavers(leaversPagination.page)} />
          </Space>
        }
        bordered={false}
        style={{ borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
      >
        <Alert
          type="info"
          showIcon
          style={{ marginBottom: 16, borderRadius: 10 }}
          message="Why are users showing as Blocked?"
          description={
            <span>
              Telegram only allows bots to DM users who have <strong>previously started the bot</strong> (via <code>/start</code>).
              If a user joined the channel <em>without</em> going through the bot's invite link, or if they blocked the bot in Telegram Settings,
              DMs will fail. Ask them to open the bot and press <strong>Start</strong> (or unblock it), then click <strong>Reset</strong> to retry.
            </span>
          }
        />
        <Table
          dataSource={leavers}
          columns={leaverColumns}
          rowKey="_id"
          loading={leaversLoading}
          locale={{ emptyText: <Empty description="No leavers recorded yet. Once users leave a tracked channel, they'll appear here." /> }}
          pagination={{
            current: leaversPagination.page,
            pageSize: leaversPagination.limit,
            total: leaversPagination.total,
            showTotal: (total) => `${total} leavers`,
            onChange: (page) => loadLeavers(page),
          }}
          scroll={{ x: 860 }}
          size="middle"
        />
      </Card>

      {/* Campaign create/edit modal */}
      <CampaignModal
        open={modalOpen}
        campaign={editingCampaign}
        onClose={() => { setModalOpen(false); setEditingCampaign(null) }}
        onSaved={() => { loadCampaigns(); loadStats() }}
      />
    </div>
  )
}
