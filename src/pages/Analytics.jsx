import React from 'react';
import { Card, Row, Col, Typography, DatePicker, Table, Space, Tag, Modal, List, Avatar, Button } from 'antd';
import { CalendarOutlined, RiseOutlined, FallOutlined, UserOutlined, AimOutlined } from '@ant-design/icons';
import { useLocation } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

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

// Cost Per Conversion Data
const cpaChartData = [
    { name: 'Jan', value: 12.5 },
    { name: 'Feb', value: 11.2 },
    { name: 'Mar', value: 13.8 },
    { name: 'Apr', value: 10.5 },
    { name: 'May', value: 9.8 },
    { name: 'Jun', value: 10.2 },
    { name: 'Jul', value: 8.5 },
];

const campaignData = [
    { key: '1', campaign: 'Summer Sale 2024', spend: 1200, conversions: 140, unsubs: 45, cpa: 8.57, status: 'Active' },
    { key: '2', campaign: 'New User Promo', spend: 850, conversions: 95, unsubs: 12, cpa: 8.95, status: 'Active' },
    { key: '3', campaign: 'Retargeting - Cart', spend: 450, conversions: 30, unsubs: 8, cpa: 15.00, status: 'Paused' },
    { key: '4', campaign: 'Brand Awareness', spend: 2000, conversions: 150, unsubs: 60, cpa: 13.33, status: 'Active' },
    { key: '5', campaign: 'Holiday Special', spend: 3000, conversions: 350, unsubs: 110, cpa: 8.57, status: 'Completed' },
];

const subscribersData = [
    { name: 'Sabreen', time: '06.02.2026 07:29', avatar: 'SA', color: '#fde3cf' },
    { name: 'Ali', time: '06.02.2026 07:02', avatar: 'AL', color: '#87d068' },
    { name: 'maleeha', time: '06.02.2026 07:02', sub: 'MA', avatar: 'MA', color: '#87d068' },
    { name: 'Maaz', time: '06.02.2026 06:47', sub: '@maaz', avatar: 'MZ', color: '#f56a00' },
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
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [selectedRecord, setSelectedRecord] = React.useState(null);
    const [modalConfig, setModalConfig] = React.useState({ title: 'Subscribers', color: '#10b981' });

    const showModal = (record, type = 'conversions') => {
        setSelectedRecord(record);
        if (type === 'unsubs') {
            setModalConfig({ title: 'Unsubscriptions', color: '#ef4444' });
        } else {
            setModalConfig({ title: 'Subscribers', color: '#10b981' });
        }
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    // Stats configuration
    const stats = [
        { title: 'Total Visits', value: '12,345', change: '+2.5%', isPositive: true },
        { title: 'Total Clicks', value: '8,765', change: '+1.8%', isPositive: true },
        { title: 'Subscriptions', value: '456', change: '+0.5%', isPositive: true },
        { title: 'Conversion Rate', value: '3.7%', change: '-0.2%', isPositive: false },
    ];

    // Cost Stats configuration
    const costStats = [
        { title: 'Total Ad Spend', value: '$7,500', change: '+12%', isPositive: false, prefix: '$' },
        { title: 'Total Conversions', value: '765', change: '+18%', isPositive: true, prefix: '' },
    ];

    const tableColumns = [
        { title: 'IP Address', dataIndex: 'ip', key: 'ip', render: text => <Text type="secondary">{text}</Text> },
        { title: 'User Agent', dataIndex: 'agent', key: 'agent', render: text => <Text type="secondary">{text}</Text> },
        { title: 'Source', dataIndex: 'source', key: 'source', render: text => <Text>{text}</Text> },
        { title: 'Country', dataIndex: 'country', key: 'country', render: text => <Text strong>{text}</Text> },
        { title: 'Timestamp', dataIndex: 'time', key: 'time', render: text => <Text type="secondary">{text}</Text> },
    ];

    const campaignColumns = [
        {
            title: 'Campaign Name',
            dataIndex: 'campaign',
            key: 'campaign',
            render: text => <Text strong>{text}</Text>
        },
        {
            title: 'Conversions',
            dataIndex: 'conversions',
            key: 'conversions',
            render: (val, record) => (
                <div style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => showModal(record, 'conversions')}>
                    <Tag color="#ecfdf5" style={{
                        color: '#10b981',
                        borderRadius: '12px',
                        fontWeight: 700,
                        fontSize: '14px',
                        border: '1px solid #10b981',
                        padding: '4px 12px',
                        display: 'block',
                        marginBottom: '4px',
                        width: 'fit-content',
                        margin: '0 auto'
                    }}>
                        +{val}
                    </Tag>
                    <Space size={4} style={{ color: '#64748b', fontSize: '12px' }}>
                        <AimOutlined /> {Math.floor(val * 0.9)}
                    </Space>
                </div>
            ),
            sorter: (a, b) => a.conversions - b.conversions,
            align: 'center',
        },
        {
            title: 'Unsubs',
            dataIndex: 'unsubs',
            key: 'unsubs',
            render: (val, record) => (
                <div style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => showModal(record, 'unsubs')}>
                    <Tag color="#fef2f2" style={{
                        color: '#ef4444',
                        borderRadius: '12px',
                        fontWeight: 700,
                        fontSize: '14px',
                        border: '1px solid #ef4444',
                        padding: '4px 12px',
                        display: 'block',
                        width: 'fit-content',
                        margin: '0 auto'
                    }}>
                        -{val}
                    </Tag>
                </div>
            ),
            sorter: (a, b) => a.unsubs - b.unsubs,
            align: 'center',
        },
        {
            title: 'Cost per Conversion',
            dataIndex: 'cpa',
            key: 'cpa',
            render: val => (
                <Text strong style={{ color: '#1e293b' }}>
                    ${val.toFixed(2)}
                </Text>
            ),
            sorter: (a, b) => a.cpa - b.cpa,
            align: 'center',
        },
    ];

    return (
        <div style={{ padding: '0 clamp(8px, 2vw, 24px)', paddingBottom: '40px' }}>
            <div style={{ marginBottom: '32px' }}>
                <Title level={2} style={{ margin: 0, fontWeight: 700 }}>
                    {project ? `${project.name} Analytics` : 'Project Analytics'}
                </Title>
                <Text type="secondary" style={{ display: 'block', marginBottom: '24px' }}>
                    Detailed analytics and cost tracking for your project
                </Text>
                <Space size="middle" wrap>
                    <DatePicker placeholder="Start Date" style={{ borderRadius: '8px', width: '150px' }} suffixIcon={<CalendarOutlined />} />
                    <DatePicker placeholder="End Date" style={{ borderRadius: '8px', width: '150px' }} suffixIcon={<CalendarOutlined />} />
                </Space>
            </div>

            {/* General Stats Grid */}
            <Title level={4} style={{ marginBottom: '16px', fontWeight: 700 }}>General Performance</Title>
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

            {/* General Chart Section */}
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

            {/* Cost Per Conversion Section */}
            <div style={{ marginBottom: '32px', marginTop: '48px' }}>
                <Title level={2} style={{ margin: 0, fontWeight: 700 }}>Cost & Conversion Analysis</Title>
                <Text type="secondary" style={{ display: 'block' }}>
                    Track your advertising efficiency and acquisition costs
                </Text>
            </div>

            {/* Cost Stats Grid */}
            <Row gutter={[16, 16]} style={{ marginBottom: '32px' }}>
                {costStats.map((stat, index) => (
                    <Col xs={24} sm={12} lg={6} key={index} style={{ display: 'flex' }}>
                        <Card
                            bordered={false}
                            style={{
                                width: '100%',
                                borderRadius: '12px',
                                backgroundColor: '#fff',
                                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                                border: '1px solid #f1f5f9',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between'
                            }}
                            styles={{ body: { padding: '20px', width: '100%' } }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <Text type="secondary" style={{ fontWeight: 500, fontSize: '14px' }}>{stat.title}</Text>
                                    <Title level={2} style={{ margin: '8px 0 0 0', fontWeight: 700, color: '#1e293b', fontSize: '24px' }}>
                                        {stat.value}
                                    </Title>
                                </div>
                                <div style={{
                                    padding: '4px 8px',
                                    borderRadius: '6px',
                                    backgroundColor: stat.isPositive ? '#ecfdf5' : '#fef2f2',
                                    color: stat.isPositive ? '#10b981' : '#ef4444',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    fontSize: '12px',
                                    fontWeight: 600
                                }}>
                                    {stat.isPositive ? <RiseOutlined /> : <FallOutlined />}
                                    {stat.change}
                                </div>
                            </div>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* CPA Trend Chart */}
            <Card
                title={<Title level={4} style={{ margin: 0, fontSize: '18px', color: '#1e293b' }}>CPA Trend (Last 7 Months)</Title>}
                bordered={false}
                style={{ borderRadius: '12px', marginBottom: '32px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)', border: '1px solid #f1f5f9' }}
                styles={{ body: { padding: '24px' } }}
            >
                <div style={{ height: '350px', width: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={cpaChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorCpa" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#64748b', fontSize: 12 }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#64748b', fontSize: 12 }}
                                unit="$"
                            />
                            <Tooltip
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                formatter={(value) => [`$${value}`, 'Avg. CPA']}
                            />
                            <Area
                                type="monotone"
                                dataKey="value"
                                stroke="#3B82F6"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorCpa)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </Card>

            {/* Campaigns Table */}
            <Card
                title={<Title level={4} style={{ margin: 0, fontSize: '18px', color: '#1e293b' }}>Performance Report</Title>}
                bordered={false}
                style={{ borderRadius: '12px', marginBottom: '32px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)', border: '1px solid #f1f5f9', overflow: 'hidden' }}
                styles={{ body: { padding: '0' } }}
            >
                <Table
                    columns={campaignColumns}
                    dataSource={campaignData}
                    pagination={false}
                    scroll={{ x: 800 }}
                />
            </Card>

            <Modal
                title={
                    <div style={{
                        background: modalConfig.color,
                        padding: '16px 24px',
                        margin: '-20px -24px 20px -24px',
                        borderTopLeftRadius: '8px',
                        borderTopRightRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}>
                        <Text style={{ color: 'white', fontSize: '16px', fontWeight: 600 }}>
                            {modalConfig.title}: {selectedRecord ? `${selectedRecord.campaign} (${modalConfig.title === 'Subscribers' ? selectedRecord.conversions : selectedRecord.unsubs})` : ''}
                        </Text>
                    </div>
                }
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={null}
                width={600}
                styles={{ content: { padding: '20px' } }}
            >
                <List
                    itemLayout="horizontal"
                    dataSource={subscribersData}
                    renderItem={(item) => (
                        <List.Item style={{ borderBottom: 'none', padding: '12px', marginBottom: '8px', background: '#f8fafc', borderRadius: '8px' }}>
                            <List.Item.Meta
                                avatar={<Avatar style={{ backgroundColor: item.color, verticalAlign: 'middle' }} size="large">{item.avatar}</Avatar>}
                                title={<Text strong>{item.name}</Text>}
                                description={
                                    <Space direction="vertical" size={0}>
                                        {item.sub && <Text type="secondary" style={{ fontSize: '12px' }}>{item.sub}</Text>}
                                        <Text type="secondary" style={{ fontSize: '12px' }}>{item.time}</Text>
                                    </Space>
                                }
                            />
                        </List.Item>
                    )}
                />
            </Modal>

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
