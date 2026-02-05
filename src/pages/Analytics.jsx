import React from 'react';
import { Card, Row, Col, Typography, DatePicker, Table, Space } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';
import { useLocation } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const { Title, Text } = Typography;

// Mock Data
const chartData = [
    { name: 'Jan', value: 240 },
    { name: 'Feb', value: 300 },
    { name: 'Mar', value: 200 },
    { name: 'Apr', value: 278 },
    { name: 'May', value: 189 },
    { name: 'Jun', value: 430 },
    { name: 'Jul', value: 340 },
];

const activityData = [
    { key: '1', ip: '192.168.1.1', agent: 'Chrome 91 / Windows 10', source: 'Direct', country: 'UK', time: '2024-07-26 10:00:00' },
    { key: '2', ip: '192.168.1.2', agent: 'Safari 14 / macOS 11', source: 'Referral', country: 'Pakistan', time: '2024-07-26 10:05:00' },
    { key: '3', ip: '192.168.1.3', agent: 'Firefox 89 / Linux', source: 'Organic', country: 'US', time: '2024-07-26 10:10:00' },
    { key: '4', ip: '192.168.1.4', agent: 'Edge 91 / Windows 10', source: 'Paid', country: 'South Africa', time: '2024-07-26 10:15:00' },
    { key: '5', ip: '192.168.1.5', agent: 'Chrome 91 / Windows 10', source: 'Direct', country: 'Turkey', time: '2024-07-26 10:20:00' },
    { key: '6', ip: '192.168.1.6', agent: 'Safari 14 / macOS 11', source: 'Referral', country: 'UK', time: '2024-07-26 10:25:00' },
    { key: '7', ip: '192.168.1.7', agent: 'Firefox 89 / Linux', source: 'Organic', country: 'UK', time: '2024-07-26 10:30:00' },
    { key: '8', ip: '192.168.1.8', agent: 'Edge 91 / Windows 10', source: 'Paid', country: 'UK', time: '2024-07-26 10:35:00' },
    { key: '9', ip: '192.168.1.9', agent: 'Chrome 91 / Windows 10', source: 'Direct', country: 'UK', time: '2024-07-26 10:40:00' },
];

const Analytics = () => {
    const location = useLocation();
    const project = location.state?.project;

    // Stats configuration
    const stats = [
        { title: 'Total Visits', value: '12,345', change: '+2.5%', isPositive: true },
        { title: 'Total Clicks', value: '8,765', change: '+1.8%', isPositive: true },
        { title: 'Subscriptions', value: '456', change: '+0.5%', isPositive: true },
        { title: 'Conversion Rate', value: '3.7%', change: '-0.2%', isPositive: false },
    ];

    const tableColumns = [
        { title: 'IP Address', dataIndex: 'ip', key: 'ip', render: text => <Text type="secondary">{text}</Text> },
        { title: 'User Agent', dataIndex: 'agent', key: 'agent', render: text => <Text type="secondary">{text}</Text> },
        { title: 'Source', dataIndex: 'source', key: 'source', render: text => <Text>{text}</Text> },
        { title: 'Country', dataIndex: 'country', key: 'country', render: text => <Text strong>{text}</Text> },
        { title: 'Timestamp', dataIndex: 'time', key: 'time', render: text => <Text type="secondary">{text}</Text> },
    ];

    return (
        <div style={{ padding: '0 clamp(8px, 2vw, 24px)', paddingBottom: '40px' }}>
            <div style={{ marginBottom: '32px' }}>
                <Title level={2} style={{ margin: 0, fontWeight: 700 }}>
                    {project ? `${project.name} Analytics` : 'Project Analytics'}
                </Title>
                <Text type="secondary" style={{ display: 'block', marginBottom: '24px' }}>
                    Detailed analytics for your project
                </Text>
                <Space size="middle" wrap>
                    <DatePicker placeholder="Start Date" style={{ borderRadius: '8px', width: '150px' }} suffixIcon={<CalendarOutlined />} />
                    <DatePicker placeholder="End Date" style={{ borderRadius: '8px', width: '150px' }} suffixIcon={<CalendarOutlined />} />
                </Space>
            </div>

            {/* Stats Grid */}
            <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
                {stats.map((stat, index) => (
                    <Col xs={24} sm={12} lg={6} key={index}>
                        <Card
                            bordered={false}
                            style={{
                                borderRadius: '12px',
                                backgroundColor: index % 2 === 0 ? '#E0F2FE' : '#F0F9FF',
                                boxShadow: 'none'
                            }}
                            styles={{ body: { padding: '24px' } }}
                        >
                            <Text style={{ color: '#334155', fontWeight: 500 }}>{stat.title}</Text>
                            <div style={{ marginTop: '8px' }}>
                                <Title level={2} style={{ margin: 0, fontWeight: 700, color: '#0F172A' }}>{stat.value}</Title>
                                <Text style={{
                                    color: stat.isPositive ? '#10B981' : '#EF4444',
                                    fontWeight: 600,
                                    fontSize: '13px'
                                }}>
                                    {stat.change}
                                </Text>
                            </div>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* Chart Section */}
            <Card
                bordered={false}
                style={{ borderRadius: '16px', marginBottom: '32px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)' }}
                styles={{ body: { padding: '32px' } }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
                    <div>
                        <Text strong style={{ color: '#64748B', fontSize: '14px' }}>Daily Subscriptions</Text>
                        <div style={{ marginTop: '4px' }}>
                            <Title level={2} style={{ margin: 0, fontWeight: 700 }}>123</Title>
                            <Text type="secondary">Last 30 Days <Text type="success" strong>+15%</Text></Text>
                        </div>
                    </div>
                    <Space size="small" wrap>
                        <DatePicker placeholder="Start Date" size="middle" style={{ borderRadius: '6px' }} />
                        <DatePicker placeholder="End Date" size="middle" style={{ borderRadius: '6px' }} />
                    </Space>
                </div>

                <div style={{ height: '350px', width: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#94A3B8', fontSize: 12 }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#94A3B8', fontSize: 12 }}
                            />
                            <Tooltip
                                shadow
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                cursor={{ stroke: '#E2E8F0', strokeWidth: 1 }}
                            />
                            <Area
                                type="monotone"
                                dataKey="value"
                                stroke="#3B82F6"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorValue)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </Card>

            {/* Activity Log */}
            <div>
                <Title level={4} style={{ marginBottom: '24px', fontWeight: 700 }}>Activity Log</Title>
                <Card
                    bordered={false}
                    style={{ borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', overflow: 'hidden' }}
                    styles={{ body: { padding: '0' } }}
                >
                    <Table
                        columns={tableColumns}
                        dataSource={activityData}
                        pagination={false}
                        scroll={{ x: 'max-content' }}
                        rowClassName={() => 'activity-row'}
                    />
                </Card>
            </div>

            <style>{`
                .activity-row:hover td {
                    background-color: #F8FAFC !important;
                }
            `}</style>
        </div>
    );
};

export default Analytics;
