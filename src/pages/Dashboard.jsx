import React, { useState } from 'react'
import { Card, Row, Col, Typography, Table, Tag, DatePicker, Space, Input, Select } from 'antd'
import { ArrowUpOutlined, ArrowDownOutlined, CalendarOutlined, SearchOutlined } from '@ant-design/icons'

const { Title, Text } = Typography

const Dashboard = () => {
  const [searchText, setSearchText] = useState('')
  const [platformFilter, setPlatformFilter] = useState('All')

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
    { title: 'CLIENT', dataIndex: 'client', key: 'client', render: (text) => <Text style={{ color: '#084b8a', cursor: 'pointer', fontWeight: '500' }}>{text}</Text> },
    { title: 'SUBSCRIBERS', dataIndex: 'subscriptions', key: 'subscriptions', render: (text) => <Text type="secondary">{text}</Text> },
    { title: 'UNSUBSCRIBERS', dataIndex: 'unsubscriptions', key: 'unsubscriptions', render: (text) => <Text type="secondary">{text}</Text> },
    { title: 'PLATFORM', dataIndex: 'platform', key: 'platform', render: (text) => <Text style={{ color: text === 'Google Ads' ? '#084b8a' : '#6366F1', fontWeight: 'bold' }}>{text}</Text> },
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
    { key: '1', id: 1, name: 'Project Alpha', visits: 87, clicks: 29, client: 'Client A', subscriptions: 12, unsubscriptions: 2, platform: 'Google Ads', status: 'Active' },
    { key: '2', id: 2, name: 'Meta Campaign X', visits: 156, clicks: 42, client: 'Client B', subscriptions: 24, unsubscriptions: 1, platform: 'Meta Ads', status: 'Active' },
    { key: '3', id: 3, name: 'Crypto Leads', visits: 45, clicks: 12, client: 'Client C', subscriptions: 5, unsubscriptions: 8, platform: 'Google Ads', status: 'Inactive' },
    { key: '4', id: 4, name: 'Real Estate 2024', visits: 230, clicks: 98, client: 'Client D', subscriptions: 45, unsubscriptions: 3, platform: 'Meta Ads', status: 'Active' },
    { key: '5', id: 6, name: 'E-commerce Sale', visits: 540, clicks: 120, client: 'Client A', subscriptions: 67, unsubscriptions: 5, platform: 'Google Ads', status: 'Active' },
    { key: '6', id: 7, name: 'SaaS Beta', visits: 92, clicks: 15, client: 'Client B', subscriptions: 8, unsubscriptions: 0, platform: 'Meta Ads', status: 'Active' },
  ]

  const filteredData = data.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchText.toLowerCase())
    const matchesPlatform = platformFilter === 'All' || item.platform === platformFilter
    return matchesSearch && matchesPlatform
  })

  return (
    <div style={{ padding: '0 0 40px 0' }}>
      <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <Title level={4} style={{ margin: 0 }}>Dashboard</Title>
        <Space size="middle" wrap>
          <Input
            placeholder="Search projects..."
            prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
            style={{ borderRadius: '8px', width: '250px' }}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Select
            defaultValue="All"
            style={{ width: 150, borderRadius: '8px' }}
            onChange={setPlatformFilter}
            options={[
              { value: 'All', label: 'All Platforms' },
              { value: 'Google Ads', label: 'Google Ads' },
              { value: 'Meta Ads', label: 'Meta Ads' },
            ]}
          />
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
                background: 'rgba(8, 75, 138, 0.08)',
                borderRadius: '16px',
                height: '100%',
                border: '1px solid rgba(8, 75, 138, 0.12)'
              }}
              styles={{ body: { padding: '24px' } }}
            >
              <Text style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#000000' }}>
                {stat.title}
              </Text>
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: '12px' }}>
                <div>
                  <Title level={2} style={{ margin: 0, fontWeight: 800, color: '#000000' }}>{stat.value}</Title>
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
            <Text strong style={{ color: '#64748B', display: 'block', marginBottom: '4px' }}>Campaign Performance Trend</Text>
            <Space align="baseline">
              <Title level={2} style={{ margin: 0, fontWeight: 900 }}>+15.3%</Title>
              <Text style={{ color: '#10B981', fontWeight: 'bold' }}>Monthly Growth</Text>
            </Space>
          </div>
          <Space wrap>
            <Tag color="black">Meta Ads</Tag>
            <Tag color="black">Google Ads</Tag>
          </Space>
        </div>

        {/* Simplified Wave Chart using SVG */}
        <div style={{ height: '280px', width: '100%', position: 'relative' }}>
          <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 800 200" style={{ overflow: 'visible' }}>
            <defs>
              <linearGradient id="chartGradient" x1="0" y2="1" x2="0" y1="0">
                <stop offset="0%" stopColor="#084b8a" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#084b8a" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d="M 0 150 C 50 130, 100 170, 150 110 C 200 50, 250 130, 300 90 C 350 50, 400 140, 450 120 C 500 100, 550 170, 600 150 C 650 130, 700 40, 750 70 C 800 100, 800 200, 0 200 Z"
              fill="url(#chartGradient)"
            />
            <path
              d="M 0 150 C 50 130, 100 170, 150 110 C 200 50, 250 130, 300 90 C 350 50, 400 140, 450 120 C 500 100, 550 170, 600 150 C 650 130, 700 40, 750 70"
              fill="none"
              stroke="#084b8a"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px', padding: '0 8px' }}>
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
              <Text key={day} style={{ fontSize: '11px', fontWeight: 'bold', color: '#94A3B8' }}>{day}</Text>
            ))}
          </div>
        </div>
      </Card>

      {/* Projects Table */}
      <div className="projects-table-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', padding: '0 8px' }}>
          <Title level={4} style={{ margin: 0 }}>Active Tracking Projects</Title>
          <Text type="secondary">{filteredData.length} items found</Text>
        </div>
        <Card
          variant="borderless"
          style={{ borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', overflow: 'hidden' }}
          styles={{ body: { padding: 0 } }}
        >
          <Table
            columns={columns}
            dataSource={filteredData}
            pagination={{ pageSize: 5 }}
            scroll={{ x: 'max-content' }}
            rowClassName={() => 'hover-row'}
          />
        </Card>
      </div>

      <style>
        {`
          .ant-table-thead > tr > th {
            font-size: 11px !important;
            font-weight: 900 !important;
            color: #ffffff !important;
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
