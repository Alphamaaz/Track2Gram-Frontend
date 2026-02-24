import React, { useState, useEffect, useCallback } from 'react'
import { Card, Row, Col, Typography, Table, Tag, DatePicker, Space, Input, Select, Skeleton, App, Empty, Button } from 'antd'
import { ArrowUpOutlined, ArrowDownOutlined, SearchOutlined, DatabaseOutlined, ProjectOutlined } from '@ant-design/icons'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import dayjs from 'dayjs'
import projectService from '../services/project'
import { useNavigate } from 'react-router-dom'

const { Title, Text } = Typography
const { RangePicker } = DatePicker

const Dashboard = () => {
  const navigate = useNavigate()
  const { message } = App.useApp()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)
  const [chartData, setChartData] = useState([])
  const [projects, setProjects] = useState([])
  const [platformFilter, setPlatformFilter] = useState('all')
  const [dateRange, setDateRange] = useState([dayjs().subtract(30, 'days'), dayjs()])

  const fetchDashboardData = useCallback(async () => {
    setLoading(true)
    const startDate = dateRange[0]?.format('YYYY-MM-DD')
    const endDate = dateRange[1]?.format('YYYY-MM-DD')
    const platform = platformFilter === 'All' ? 'all' : platformFilter.toLowerCase()

    try {
      const [statsRes, chartRes, projectsRes] = await Promise.all([
        projectService.getDashboardStats(platform, startDate, endDate),
        projectService.getDashboardChart(platform, startDate, endDate),
        projectService.getProjects()
      ])

      if (statsRes.success) setStats(statsRes.data)

      if (chartRes.success && chartRes.data.chart) {
        const { xAxis, series } = chartRes.data.chart
        const formattedData = xAxis.values.map((val, idx) => {
          const entry = { name: val }
          series.forEach(s => {
            entry[s.key] = s.values[idx] || 0
          })
          return entry
        })
        setChartData(formattedData)
      }

      if (projectsRes.success) setProjects(projectsRes.data)
    } catch (error) {
      console.error('Dashboard fetch error:', error)
      message.error(error?.message || 'Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }, [dateRange, platformFilter, message])

  useEffect(() => {
    fetchDashboardData()
  }, [fetchDashboardData])

  const statCards = [
    { title: 'Total Visits', value: stats?.visitors || 0, color: 'rgba(8, 75, 138, 0.08)', icon: <SearchOutlined /> },
    { title: 'Total Clicks', value: stats?.clicks || 0, color: 'rgba(8, 75, 138, 0.08)', icon: <ArrowUpOutlined /> },
    { title: 'Subscriptions', value: stats?.subscribers || 0, color: 'rgba(8, 75, 138, 0.08)', icon: <ProjectOutlined /> },
    { title: 'Unsubscriptions', value: stats?.unsubscribers || 0, color: 'rgba(8, 75, 138, 0.08)', icon: <ArrowDownOutlined /> },
  ]

  const columns = [
    {
      title: 'PROJECT NAME',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Space onClick={() => navigate(`/analytics?projectId=${record._id}`)} style={{ cursor: 'pointer' }}>
          <div style={{ width: '32px', height: '32px', background: '#f1f5f9', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ProjectOutlined style={{ color: '#64748b' }} />
          </div>
          <Text strong style={{ color: '#1e293b' }}>{text}</Text>
        </Space>
      )
    },
    {
      title: 'AD PLATFORMS',
      dataIndex: 'adPlatforms',
      key: 'platforms',
      render: (platforms) => (
        <Space size={4}>
          {platforms?.map(p => (
            <Tag key={p} color={p === 'google' ? 'blue' : 'purple'} style={{ borderRadius: '6px', fontSize: '11px', textTransform: 'capitalize' }}>
              {p}
            </Tag>
          ))}
        </Space>
      )
    },
    {
      title: 'SOURCE',
      dataIndex: 'landingPageSource',
      key: 'source',
      render: (source) => <Tag style={{ borderRadius: '6px', fontSize: '11px' }}>{source === 'template' ? 'In-house' : 'External URL'}</Tag>
    },
    {
      title: 'STATUS',
      dataIndex: 'status',
      key: 'status',
      align: 'right',
      render: () => (
        <Tag color="success" style={{ borderRadius: '12px', padding: '0 12px', fontWeight: 'bold', border: 'none' }}>
          ACTIVE
        </Tag>
      ),
    },
  ]

  const filteredProjects = projects;

  return (
    <div style={{ padding: '0 clamp(12px, 3vw, 24px)', paddingBottom: '40px', maxWidth: '1600px', margin: '0 auto' }}>
      <div className="dashboard-header" style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <Title level={2} style={{ margin: 0, fontWeight: 800, letterSpacing: '-0.02em', color: '#0f172a' }}>Global Dashboard</Title>
          <Text style={{ color: '#64748b' }}>Real-time overview of all your tracking campaigns.</Text>
        </div>
        <Space size="middle" wrap>
          <Select
            defaultValue="All"
            style={{ width: 160 }}
            onChange={setPlatformFilter}
            options={[
              { value: 'All', label: 'All Platforms' },
              { value: 'google', label: 'Google Ads' },
              { value: 'meta', label: 'Meta Ads' },
            ]}
          />
          <RangePicker
            value={dateRange}
            onChange={setDateRange}
            style={{ borderRadius: '8px', padding: '8px 12px' }}
          />
        </Space>
      </div>

      {loading ? (
        <Skeleton active paragraph={{ rows: 12 }} />
      ) : (
        <>
          {/* Stats Grid */}
          <Row gutter={[20, 20]} style={{ marginBottom: '32px' }}>
            {statCards.map((stat, index) => (
              <Col xs={12} sm={12} xl={6} key={index}>
                <Card
                  variant="borderless"
                  style={{
                    background: 'rgba(8, 75, 138, 0.04)',
                    borderRadius: '20px',
                    height: '100%',
                    border: '1px solid rgba(8, 75, 138, 0.08)'
                  }}
                  styles={{ body: { padding: '24px' } }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <Text style={{ fontSize: '13px', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '8px' }}>
                        {stat.title}
                      </Text>
                      <Title level={2} style={{ margin: 0, fontWeight: 800, color: '#0f172a' }}>
                        {stat.value}
                      </Title>
                    </div>
                    <div style={{ width: '40px', height: '40px', background: stat.color, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {React.cloneElement(stat.icon, { style: { color: '#084b8a', fontSize: '18px' } })}
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Chart Section */}
          <Card
            variant="borderless"
            style={{ borderRadius: '24px', marginBottom: '32px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.03)', background: '#fff' }}
            styles={{ body: { padding: 'clamp(16px, 3vw, 32px)' } }}
            title={
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text strong style={{ color: '#1e293b', fontSize: '16px' }}>Performance Overview</Text>
                <Space>
                  <Tag color="processing" style={{ borderRadius: '6px' }}>Live Data</Tag>
                </Space>
              </div>
            }
          >
            <div style={{ height: '350px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorGoogle" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#084b8a" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#084b8a" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorMeta" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} />
                  <Legend verticalAlign="top" height={36} iconType="circle" />
                  <Area name="Google Ads" type="monotone" dataKey="google" stroke="#084b8a" strokeWidth={3} fillOpacity={1} fill="url(#colorGoogle)" />
                  <Area name="Meta Ads" type="monotone" dataKey="meta" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorMeta)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Projects Table */}
          <div className="projects-table-container">
            <Card
              title={<Text strong style={{ fontSize: '16px', color: '#1e293b' }}>Active Tracking Projects</Text>}
              variant="borderless"
              style={{ borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', background: '#fff' }}
              styles={{ body: { padding: '8px 0' } }}
              extra={<Button type="link" onClick={() => navigate('/projects')}>View All</Button>}
            >
              <Table
                columns={columns}
                dataSource={filteredProjects}
                pagination={{ pageSize: 5, hideOnSinglePage: true }}
                scroll={{ x: 'max-content' }}
                rowClassName="premium-row"
                locale={{ emptyText: <Empty description="No projects found" /> }}
              />
            </Card>
          </div>
        </>
      )}

      <style>
        {`
          .premium-row:hover {
            background-color: #f8fafc !important;
          }
          .ant-table-thead > tr > th {
            background: #f8fafc !important;
            color: #64748b !important;
            font-weight: 600 !important;
            font-size: 11px !important;
            text-transform: uppercase !important;
            letter-spacing: 0.05em !important;
            border-bottom: 1px solid #f1f5f9 !important;
            padding: 16px 24px !important;
          }
          .ant-table-tbody > tr > td {
            padding: 16px 24px !important;
            border-bottom: 1px solid #f1f5f9 !important;
          }
          .ant-table-wrapper .ant-table-container {
             border-radius: 0 !important;
          }
          @media (max-width: 576px) {
            .dashboard-header {
              flex-direction: column !important;
              align-items: flex-start !important;
              gap: 16px !important;
            }
            .dashboard-header .ant-space {
              width: 100% !important;
            }
            .dashboard-header .ant-select {
              width: 100% !important;
            }
            .dashboard-header .ant-picker {
              width: 100% !important;
            }
          }
        `}
      </style>
    </div>
  )
}

export default Dashboard;
