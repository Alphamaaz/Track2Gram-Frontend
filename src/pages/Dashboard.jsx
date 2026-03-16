import React, { useState, useEffect, useCallback } from 'react'
import { Card, Row, Col, Typography, Table, Tag, DatePicker, Space, Select, Skeleton, App, Empty, Button } from 'antd'
import { ArrowUpOutlined, ArrowDownOutlined, SearchOutlined, ProjectOutlined } from '@ant-design/icons'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import dayjs from 'dayjs'
import projectService from '../services/project'
import { useNavigate } from 'react-router-dom'

const { Title, Text } = Typography
const { RangePicker } = DatePicker

const METRIC_ALIAS = {
  visits: 'visitors',
  visitor: 'visitors',
  visitors: 'visitors',
  clicks: 'clicks',
  subscribers: 'subscribers',
  unsubscribers: 'unsubscribers',
  unsubscriptions: 'unsubscribers',
  totalspend: 'totalSpend',
  totalSpend: 'totalSpend',
  spend: 'totalSpend',
  cost: 'totalSpend',
  conversionrate: 'conversionRate',
  conversion_rate: 'conversionRate',
  conversionRate: 'conversionRate',
}

const METRIC_META = {
  visitors: { label: 'Visitors' },
  clicks: { label: 'Clicks' },
  subscribers: { label: 'Subscribers' },
  unsubscribers: { label: 'Unsubscribers' },
  totalSpend: { label: 'Total Spend' },
  conversionRate: { label: 'Conversion Rate' },
}

const METRIC_DISPLAY_ORDER = ['totalSpend', 'clicks', 'subscribers', 'unsubscribers', 'conversionRate', 'visitors']
const DEFAULT_CHART_METRICS = ['totalSpend', 'clicks', 'subscribers', 'unsubscribers', 'conversionRate']

const normalizeMetric = (metric) => {
  const raw = String(metric || '').trim()
  return METRIC_ALIAS[raw] || METRIC_ALIAS[raw.toLowerCase()] || raw
}

const toDateLabel = (value, fallbackStartDate) => {
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return dayjs(value).format('MMM DD')
  }
  if (typeof value === 'number' && fallbackStartDate) {
    return fallbackStartDate.add(value - 1, 'day').format('MMM DD')
  }
  return String(value ?? '')
}

const formatMetricValue = (metric, value) => {
  const num = Number(value || 0)
  if (metric === 'totalSpend') return `PKR ${num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  if (metric === 'conversionRate') return `${num.toFixed(2)}%`
  return num.toLocaleString()
}

const Dashboard = () => {
  const navigate = useNavigate()
  const { message } = App.useApp()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)
  const [chartData, setChartData] = useState([])
  const [projects, setProjects] = useState([])
  const [platformFilter, setPlatformFilter] = useState('all')
  const [dateRange, setDateRange] = useState([dayjs().subtract(19, 'days'), dayjs()])
  const [selectedMetric, setSelectedMetric] = useState('clicks')
  const [availableMetrics, setAvailableMetrics] = useState(DEFAULT_CHART_METRICS)

  const fetchDashboardData = useCallback(async () => {
    setLoading(true)
    const startDate = dateRange[0]?.format('YYYY-MM-DD')
    const endDate = dateRange[1]?.format('YYYY-MM-DD')

    // Use the exact filter or the default "meta,google"
    const platform = platformFilter

    try {
      const [statsRes, chartRes, projectsRes] = await Promise.all([
        projectService.getDashboardStats(platform, startDate, endDate),
        projectService.getDashboardChart(platform, startDate, endDate, selectedMetric),
        projectService.getProjects()
      ])

      if (statsRes?.success) setStats(statsRes.data)

      if (chartRes?.success && chartRes.data?.chart) {
        const chart = chartRes.data.chart
        const apiMetricsRaw = Array.isArray(chartRes.data.availableMetrics)
          ? chartRes.data.availableMetrics
          : Object.keys(chart.seriesByMetric || {})
        const normalizedApiMetrics = apiMetricsRaw
          .map(normalizeMetric)
          .filter((m) => !!METRIC_META[m])
        const orderedMetrics = METRIC_DISPLAY_ORDER.filter((m) => normalizedApiMetrics.includes(m))
        const nextAvailableMetrics = orderedMetrics.length ? orderedMetrics : DEFAULT_CHART_METRICS
        setAvailableMetrics(nextAvailableMetrics)

        const selectedFromApi = normalizeMetric(chartRes.data.selectedMetric || selectedMetric)
        const resolvedMetric = nextAvailableMetrics.includes(selectedFromApi)
          ? selectedFromApi
          : nextAvailableMetrics[0]
        if (resolvedMetric !== selectedMetric) {
          setSelectedMetric(resolvedMetric)
        }

        const currentSeries = Array.isArray(chart.series)
          ? chart.series
          : (chart.seriesByMetric?.[resolvedMetric] || [])
        const xAxisLabels = Array.isArray(chart?.xAxis?.labels) && chart.xAxis.labels.length
          ? chart.xAxis.labels
          : (chart?.xAxis?.values || [])

        const formattedData = xAxisLabels.map((val, idx) => {
          const entry = { name: toDateLabel(val, dateRange[0]) }
          currentSeries.forEach((seriesItem) => {
            entry[seriesItem.key] = Number(seriesItem.values?.[idx] || 0)
          })
          return entry
        })
        setChartData(formattedData)
      }

      if (projectsRes?.success) setProjects(projectsRes.data || [])
    } catch (error) {
      console.error('Dashboard fetch error:', error)
      message.error(error?.message || 'Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }, [dateRange, platformFilter, message, selectedMetric])

  useEffect(() => {
    fetchDashboardData()
  }, [fetchDashboardData])

  const statCards = [
    { title: 'Total Visits', metric: 'visitors', value: stats?.visitors || 0, icon: <SearchOutlined /> },
    { title: 'Total Clicks', metric: 'clicks', value: stats?.clicks || 0, icon: <ArrowUpOutlined /> },
    { title: 'Subscribers', metric: 'subscribers', value: stats?.subscribers || 0, icon: <ProjectOutlined /> },
    { title: 'Unsubscribers', metric: 'unsubscribers', value: stats?.unsubscribers || 0, icon: <ArrowDownOutlined /> },
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
      render: (status) => (
        <Tag color={status === 'inactive' ? 'error' : 'success'} style={{ borderRadius: '12px', padding: '0 12px', fontWeight: 'bold', border: 'none', textTransform: 'uppercase' }}>
          {status || 'ACTIVE'}
        </Tag>
      ),
    },
  ]

  const filteredProjects = projects;

  return (
    <div style={{ padding: '0 clamp(12px, 3vw, 24px)', paddingBottom: '40px', maxWidth: '1600px', margin: '0 auto', background: '#F8FAFC' }}>
      <div className="dashboard-header" style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', paddingTop: '24px' }}>
        <div>
          <Title level={2} style={{ margin: 0, fontWeight: 800, letterSpacing: '-0.02em', color: '#084b8a' }}>Global Dashboard</Title>
          <Text style={{ color: '#64748b', fontWeight: 500 }}>Real-time overview of all your tracking campaigns.</Text>
        </div>
        <Space size="middle" wrap>
          <Select
            value={platformFilter}
            style={{ width: 160 }}
            onChange={setPlatformFilter}
            options={[
              { value: 'all', label: 'All Platforms' },
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
                    background: '#E6ECF2',
                    borderRadius: '20px',
                    height: '100%',
                    border: '1px solid rgba(8, 75, 138, 0.1)',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02)'
                  }}
                  styles={{ body: { padding: '24px' } }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <Text style={{ fontSize: '13px', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '8px' }}>
                        {stat.title}
                      </Text>
                      <Title level={2} style={{ margin: 0, fontWeight: 800, color: '#084b8a' }}>
                        {formatMetricValue(stat.metric, stat.value)}
                      </Title>
                    </div>
                    <div style={{ width: '40px', height: '40px', background: '#fff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <Text strong style={{ color: '#1e293b', fontSize: '16px' }}>Performance Overview</Text>
                <Space>
                  <Select
                    value={selectedMetric}
                    onChange={setSelectedMetric}
                    style={{ width: 190 }}
                    options={availableMetrics.map(m => ({
                      value: m,
                      label: METRIC_META[m]?.label || m
                    }))}
                  />
                  <Tag color="processing" style={{ borderRadius: '6px' }}>Live Data</Tag>
                </Space>
              </div>
            }
          >
            <div style={{ height: '350px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    {Object.entries({ google: '#084b8a', meta: '#6366f1', other: '#94a3b8' }).map(([key, color]) => (
                      <linearGradient key={`color${key}`} id={`color${key}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={color} stopOpacity={0.15} />
                        <stop offset="95%" stopColor={color} stopOpacity={0} />
                      </linearGradient>
                    ))}
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#94a3b8', fontSize: 11 }}
                    dy={10}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#94a3b8', fontSize: 11 }}
                    tickFormatter={(value) => {
                      if (selectedMetric === 'totalSpend') return `PKR ${Number(value || 0).toFixed(0)}`
                      if (selectedMetric === 'conversionRate') return `${Number(value || 0).toFixed(0)}%`
                      return Number(value || 0).toLocaleString()
                    }}
                  />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                    labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
                    formatter={(value) => [formatMetricValue(selectedMetric, value), METRIC_META[selectedMetric]?.label || 'Value']}
                  />
                  <Legend verticalAlign="top" height={36} iconType="circle" />
                  {chartData.length > 0 && Object.keys(chartData[0]).filter(key => key !== 'name').map(key => (
                    <Area
                      key={key}
                      name={key === 'all' ? 'All Platforms' : `${key.charAt(0).toUpperCase() + key.slice(1)} Ads`}
                      type="monotone"
                      dataKey={key}
                      stroke={key === 'google' ? '#084b8a' : key === 'meta' ? '#6366f1' : '#94a3b8'}
                      strokeWidth={3}
                      fillOpacity={1}
                      fill={`url(#color${['google', 'meta'].includes(key) ? key : 'other'})`}
                    />
                  ))}
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
