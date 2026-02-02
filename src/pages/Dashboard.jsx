import { Card, Row, Col, Typography, Table, Tag, DatePicker, Space } from 'antd'
import { ArrowUpOutlined, ArrowDownOutlined, CalendarOutlined } from '@ant-design/icons'

const { Title, Text } = Typography

const Dashboard = () => {
  const stats = [
    { title: 'Total Visits', value: '12,345', change: '+12%', positive: true },
    { title: 'Total Clicks', value: '8,765', change: '+8%', positive: true },
    { title: 'Subscriptions', value: '3,456', change: '+12%', positive: true },
    { title: 'Unsubscriptions', value: '1,234', change: '-5%', positive: false },
  ]

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    { title: 'PROJECT NAME', dataIndex: 'name', key: 'name', render: (text) => <Text strong>{text}</Text> },
    { title: 'VISITS', dataIndex: 'visits', key: 'visits' },
    { title: 'CLICKS', dataIndex: 'clicks', key: 'clicks' },
    { title: 'CLIENT', dataIndex: 'client', key: 'client', render: (text) => <Text style={{ color: '#3B82F6', cursor: 'pointer' }}>{text}</Text> },
    { title: 'SUBSCRIBERS', dataIndex: 'subscriptions', key: 'subscriptions', render: (text) => <Text type="secondary">{text}</Text> },
    { title: 'UNSUBSCRIBERS', dataIndex: 'unsubscriptions', key: 'unsubscriptions', render: (text) => <Text type="secondary">{text}</Text> },
    { title: 'PLATFORM', dataIndex: 'platform', key: 'platform', render: (text) => <Text style={{ color: '#6366F1', fontWeight: 'bold' }}>{text}</Text> },
    {
      title: 'STATUS',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'Active' ? 'default' : '#f5f5f5'} style={{ borderRadius: '12px', padding: '0 12px', fontWeight: 'bold', color: status === 'Active' ? '#475569' : '#94A3B8', border: 'none' }}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
  ]

  const data = [
    { key: '1', id: 1, name: 'Project Alpha', visits: 87, clicks: 29, client: 'Client A', subscriptions: 'Subscribers', unsubscriptions: 'Unsubscribers', platform: 'Google Ads', status: 'Active' },
    { key: '2', id: 2, name: 'Project Alpha', visits: 87, clicks: 29, client: 'Client A', subscriptions: 'Subscribers', unsubscriptions: 'Unsubscribers', platform: 'Google Ads', status: 'Active' },
    { key: '3', id: 3, name: 'Project Alpha', visits: 87, clicks: 29, client: 'Client A', subscriptions: 'Subscribers', unsubscriptions: 'Unsubscribers', platform: 'Google Ads', status: 'Inactive' },
    { key: '4', id: 4, name: 'Project Alpha', visits: 87, clicks: 29, client: 'Client A', subscriptions: 'Subscribers', unsubscriptions: 'Unsubscribers', platform: 'Google Ads', status: 'Active' },
    { key: '5', id: 6, name: 'Project Alpha', visits: 87, clicks: 29, client: 'Client A', subscriptions: 'Subscribers', unsubscriptions: 'Unsubscribers', platform: 'Google Ads', status: 'Active' },
    { key: '6', id: 7, name: 'Project Alpha', visits: 87, clicks: 29, client: 'Client A', subscriptions: 'Subscribers', unsubscriptions: 'Unsubscribers', platform: 'Google Ads', status: 'Active' },
  ]

  return (
    <div style={{ padding: '0 0 40px 0' }}>
      <div style={{ marginBottom: '32px' }}>
        <Title level={4} style={{ marginBottom: '24px' }}>Dashboard</Title>
        <Space size="middle" wrap>
          <DatePicker placeholder="Start Date" suffixIcon={<CalendarOutlined />} style={{ borderRadius: '8px' }} />
          <DatePicker placeholder="End Date" suffixIcon={<CalendarOutlined />} style={{ borderRadius: '8px' }} />
        </Space>
      </div>

      {/* Stats Grid */}
      <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
        {stats.map((stat, index) => (
          <Col xs={24} sm={12} xl={6} key={index}>
            <Card
              variant="borderless"
              style={{
                background: '#D1E4FF',
                borderRadius: '16px',
                height: '100%'
              }}
              styles={{ body: { padding: '24px' } }}
            >
              <Text type="secondary" style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#475569' }}>
                {stat.title}
              </Text>
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: '12px' }}>
                <div>
                  <Title level={2} style={{ margin: 0, fontWeight: 800 }}>{stat.value}</Title>
                  <Space style={{ color: stat.positive ? '#10B981' : '#EF4444', fontWeight: 'bold', fontSize: '14px', marginTop: '4px' }}>
                    {stat.positive ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                    {stat.change}
                  </Space>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Chart Section */}
      <Card
        variant="borderless"
        style={{ borderRadius: '24px', marginBottom: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}
        styles={{ body: { padding: '32px' } }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <Text strong style={{ color: '#64748B', display: 'block', marginBottom: '4px' }}>Google Ads vs Meta Ads</Text>
            <Space align="baseline">
              <Title level={2} style={{ margin: 0, fontWeight: 900 }}>+15%</Title>
              <Text style={{ color: '#10B981', fontWeight: 'bold' }}>Overall Growth</Text>
            </Space>
          </div>
          <Space wrap>
            <DatePicker placeholder="Start Date" size="small" style={{ borderRadius: '8px' }} />
            <DatePicker placeholder="End Date" size="small" style={{ borderRadius: '8px' }} />
          </Space>
        </div>

        {/* Simplified Wave Chart using SVG */}
        <div style={{ height: '280px', width: '100%', position: 'relative' }}>
          <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 800 200" style={{ overflow: 'visible' }}>
            <defs>
              <linearGradient id="chartGradient" x1="0" y2="1" x2="0" y1="0">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d="M 0 150 C 50 120, 100 160, 150 100 C 200 40, 250 120, 300 80 C 350 40, 400 130, 450 110 C 500 90, 550 160, 600 140 C 650 120, 700 30, 750 60 C 800 90, 800 200, 0 200 Z"
              fill="url(#chartGradient)"
            />
            <path
              d="M 0 150 C 50 120, 100 160, 150 100 C 200 40, 250 120, 300 80 C 350 40, 400 130, 450 110 C 500 90, 550 160, 600 140 C 650 120, 700 30, 750 60"
              fill="none"
              stroke="#3B82F6"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px', padding: '0 8px' }}>
            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'].map(month => (
              <Text key={month} style={{ fontSize: '12px', fontWeight: 'bold', color: '#94A3B8' }}>{month}</Text>
            ))}
          </div>
        </div>
      </Card>

      {/* Projects Table */}
      <div className="projects-table-container">
        <Title level={4} style={{ marginBottom: '24px', paddingLeft: '8px' }}>All Projects</Title>
        <Card
          variant="borderless"
          style={{ borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', overflow: 'hidden' }}
          styles={{ body: { padding: 0 } }}
        >
          <Table
            columns={columns}
            dataSource={data}
            pagination={false}
            scroll={{ x: 'max-content' }}
            rowClassName={() => 'hover-row'}
          />
        </Card>
      </div>

      <style>
        {`
          .ant-table-thead > tr > th {
            background: #ffffff !important;
            font-size: 11px !important;
            font-weight: 900 !important;
            color: #94A3B8 !important;
            text-transform: uppercase !important;
            letter-spacing: 0.1em !important;
            padding: 20px 24px !important;
            border-bottom: 1px solid #f0f0f0 !important;
          }
          .ant-table-tbody > tr > td {
            padding: 16px 24px !important;
            border-bottom: 1px solid #f5f5f5 !important;
            font-size: 13px !important;
          }
          .hover-row:hover {
            background-color: #fafafa !important;
          }
          /* Hide scrollbar under table as requested */
          .ant-table-body::-webkit-scrollbar {
            display: none !important;
          }
          .ant-table-content {
            scrollbar-width: none !important;
            -ms-overflow-style: none !important;
          }
        `}
      </style>
    </div>
  )
}

export default Dashboard
