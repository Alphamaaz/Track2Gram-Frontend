import React, { useState, useEffect, useCallback } from 'react';
import { Card, Row, Col, Typography, DatePicker, Table, Space, Tag, Modal, List, Avatar, Button, Skeleton, App, Empty } from 'antd';
import { CalendarOutlined, RiseOutlined, FallOutlined, UserOutlined, AimOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { projectService } from '../services/project';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const Analytics = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { message } = App.useApp();
    const project = location.state?.project;

    // State for data
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);
    const [chartData, setChartData] = useState([]);
    const [performanceReport, setPerformanceReport] = useState([]);
    const [activityLog, setActivityLog] = useState([]);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 20, total: 0 });

    // Filters
    const [dateRange, setDateRange] = useState([
        dayjs().subtract(30, 'day'),
        dayjs()
    ]);

    // UI state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDetail, setSelectedDetail] = useState(null);
    const [modalConfig, setModalConfig] = useState({ title: 'Subscribers', color: '#084b8a' });

    const { current, pageSize } = pagination;

    const fetchAllData = useCallback(async () => {
        if (!project?._id) return;

        setLoading(true);
        const startDate = dateRange[0]?.format('YYYY-MM-DD');
        const endDate = dateRange[1]?.format('YYYY-MM-DD');

        try {
            const [statsRes, chartRes, reportRes, activityRes] = await Promise.all([
                projectService.getStats(project._id, startDate, endDate),
                projectService.getSubscriptionsChart(project._id, startDate, endDate),
                projectService.getPerformanceReport(project._id),
                projectService.getActivityLog(project._id, startDate, endDate, current, pageSize)
            ]);

            if (statsRes.success) setStats(statsRes.data);
            if (chartRes.success) {
                const formattedChart = chartRes.data.chart.xAxis.values.map((val, idx) => ({
                    name: val,
                    value: chartRes.data.chart.yAxis.values[idx]
                }));
                setChartData(formattedChart);
            }
            if (reportRes.success) setPerformanceReport(reportRes.data.report || []);
            if (activityRes.success) {
                setActivityLog(activityRes.data.items || []);
                const newTotal = activityRes.data.pagination?.total || 0;
                setPagination(prev => prev.total === newTotal ? prev : { ...prev, total: newTotal });
            }
        } catch (error) {
            console.error('Failed to fetch analytics data:', error);
            message.error(error?.message || 'Failed to load analytics data');
        } finally {
            setLoading(false);
        }
    }, [project?._id, dateRange, current, pageSize, message]);

    useEffect(() => {
        fetchAllData();
    }, [fetchAllData]);

    if (!project) {
        return (
            <div style={{ textAlign: 'center', padding: '100px 0' }}>
                <Empty description="No project selected">
                    <Button type="primary" onClick={() => navigate('/projects')}>Go to Projects</Button>
                </Empty>
            </div>
        );
    }

    const showModal = (data, type = 'subscribers') => {
        setSelectedDetail(data);
        if (type === 'unsubscribers') {
            setModalConfig({ title: 'Unsubscriptions', color: '#ef4444' });
        } else {
            setModalConfig({ title: 'Subscribers', color: '#084b8a' });
        }
        setIsModalOpen(true);
    };

    const statCards = [
        { title: 'Total Visits', value: stats?.visitors || 0, color: '#E0F2FE' },
        { title: 'Total Clicks', value: stats?.clicks || 0, color: '#F0F9FF' },
        { title: 'Subscriptions', value: stats?.subscribers || 0, color: '#E0F2FE' },
        { title: 'Unsubscriptions', value: stats?.unsubscribers || 0, color: '#F0F9FF', isNegative: true },
        { title: 'Conversion Rate', value: `${stats?.conversionRate || 0}%`, color: '#E0F2FE' },
        { title: 'Total Ad Spend', value: `$${stats?.adSpend || 0}`, color: '#F0F9FF' },
    ];

    const campaignColumns = [
        {
            title: 'Campaign Name',
            dataIndex: 'campaignName',
            key: 'campaignName',
            width: '50%',
            render: text => <Text strong style={{ color: '#1e293b' }}>{text || 'Unattributed'}</Text>
        },
        {
            title: 'Conversions',
            dataIndex: 'subscribers',
            key: 'subscribers',
            align: 'right',
            render: (sub) => (
                <div style={{ cursor: 'pointer' }} onClick={() => showModal(sub, 'subscribers')}>
                    <Tag color="#eff6ff" style={{
                        color: '#084b8a', borderRadius: '12px', fontWeight: 600,
                        fontSize: '13px', border: '1px solid #dbeafe', margin: 0
                    }}>
                        +{sub?.count || 0}
                    </Tag>
                </div>
            )
        },
        {
            title: 'Unsubs',
            dataIndex: 'unsubscribers',
            key: 'unsubscribers',
            align: 'right',
            render: (unsub) => (
                <div style={{ cursor: 'pointer' }} onClick={() => showModal(unsub, 'unsubscribers')}>
                    <Tag color="#fef2f2" style={{
                        color: '#ef4444', borderRadius: '12px', fontWeight: 600,
                        fontSize: '13px', border: '1px solid #fee2e2', margin: 0
                    }}>
                        -{unsub?.count || 0}
                    </Tag>
                </div>
            )
        }
    ];

    const activityColumns = [
        {
            title: 'Source',
            dataIndex: 'source',
            key: 'source',
            width: 100,
            render: text => <Tag color="blue" style={{ borderRadius: '4px', textTransform: 'uppercase', fontSize: '10px', fontWeight: 700 }}>{text}</Tag>
        },
        {
            title: 'IP Address',
            dataIndex: 'ipAddress',
            key: 'ip',
            width: 130,
            render: text => <Text type="secondary" style={{ fontFamily: 'monospace', fontSize: '12px' }}>{text}</Text>
        },
        {
            title: 'User Agent',
            dataIndex: 'userAgent',
            key: 'agent',
            render: text => <Text type="secondary" style={{ fontSize: '12px' }} ellipsis={{ tooltip: text }}>{text}</Text>
        },
        {
            title: 'Time',
            dataIndex: 'createdAt',
            key: 'time',
            width: 160,
            align: 'right',
            render: text => <Text type="secondary" style={{ fontSize: '12px' }}>{dayjs(text).format('MMM D, HH:mm')}</Text>
        },
    ];

    return (
        <div style={{ padding: '0 clamp(12px, 3vw, 24px)', paddingBottom: '40px', maxWidth: '1600px', margin: '0 auto' }}>
            <div style={{ marginBottom: '32px' }}>
                <Title level={2} style={{ margin: 0, fontWeight: 800, letterSpacing: '-0.02em', color: '#0f172a' }}>
                    {project.name} Analytics
                </Title>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: '8px',
                    flexWrap: 'wrap',
                    gap: '16px'
                }}>
                    <Text style={{ color: '#64748b', fontSize: '14px' }}>Detailed performance metrics for your project.</Text>
                    <RangePicker
                        value={dateRange}
                        onChange={setDateRange}
                        style={{ borderRadius: '8px', padding: '8px 12px' }}
                    />
                </div>
            </div>

            {loading ? (
                <Skeleton active paragraph={{ rows: 12 }} />
            ) : (
                <>
                    {/* Stats Grid */}
                    <Row gutter={[16, 16]} style={{ marginBottom: '32px' }}>
                        {statCards.map((stat, index) => (
                            <Col xs={12} sm={8} md={8} lg={4} key={index}>
                                <Card
                                    variant="borderless"
                                    style={{
                                        borderRadius: '16px',
                                        backgroundColor: stat.color,
                                        boxShadow: 'none',
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center'
                                    }}
                                    styles={{ body: { padding: 'clamp(12px, 2vw, 20px)' } }}
                                >
                                    <Text style={{ color: '#475569', fontWeight: 500, fontSize: 'clamp(11px, 1.2vw, 13px)', display: 'block', marginBottom: '4px' }}>
                                        {stat.title}
                                    </Text>
                                    <Title level={4} style={{ margin: 0, fontWeight: 800, color: stat.isNegative ? '#ef4444' : '#0f172a', fontSize: 'clamp(18px, 2vw, 24px)' }}>
                                        {stat.value}
                                    </Title>
                                </Card>
                            </Col>
                        ))}
                    </Row>

                    {/* Chart Section */}
                    <Card
                        variant="borderless"
                        style={{ borderRadius: '20px', marginBottom: '32px', boxShadow: '0 4px 20px -5px rgba(0, 0, 0, 0.05)', background: '#fff' }}
                        styles={{ body: { padding: 'clamp(16px, 3vw, 32px)' } }}
                        title={<Text strong style={{ color: '#1e293b', fontSize: '15px' }}>Daily Subscriptions</Text>}
                    >
                        <div style={{ height: '350px', width: '100%' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#084b8a" stopOpacity={0.15} />
                                            <stop offset="95%" stopColor="#084b8a" stopOpacity={0.01} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', padding: '12px' }} />
                                    <Area type="monotone" dataKey="value" stroke="#084b8a" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" dot={{ r: 4, fill: '#084b8a', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6, strokeWidth: 0 }} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>

                    {/* Vertical Tables Layout */}
                    <Space direction="vertical" size={32} style={{ width: '100%' }}>
                        <Card
                            title={<Text strong style={{ fontSize: '16px', color: '#1e293b' }}>Campaign Performance</Text>}
                            variant="borderless"
                            style={{ borderRadius: '20px', boxShadow: '0 4px 20px -5px rgba(0, 0, 0, 0.05)', background: '#fff' }}
                            styles={{ body: { padding: '8px 0' } }}
                        >
                            <Table
                                columns={campaignColumns}
                                dataSource={performanceReport}
                                pagination={false}
                                rowKey={(record, index) => record.campaignName || `unattributed-${index}`}
                                className="premium-table"
                                scroll={{ x: 600 }}
                            />
                        </Card>

                        <Card
                            title={<Text strong style={{ fontSize: '16px', color: '#1e293b' }}>Activity Log</Text>}
                            variant="borderless"
                            style={{ borderRadius: '20px', boxShadow: '0 4px 20px -5px rgba(0, 0, 0, 0.05)', background: '#fff' }}
                            styles={{ body: { padding: '8px 0' } }}
                        >
                            <Table
                                columns={activityColumns}
                                dataSource={activityLog}
                                pagination={{
                                    ...pagination,
                                    size: 'small',
                                    showSizeChanger: false,
                                    onChange: (page) => setPagination(prev => ({ ...prev, current: page }))
                                }}
                                rowKey={(record) => record._id || Math.random()}
                                className="premium-table"
                                scroll={{ x: 800 }}
                            />
                        </Card>
                    </Space>
                </>
            )}

            <Modal
                title={
                    <div style={{ background: modalConfig.color, padding: '20px 24px', margin: '-20px -24px 20px -24px', borderTopLeftRadius: '12px', borderTopRightRadius: '12px' }}>
                        <Text style={{ color: 'white', fontSize: '18px', fontWeight: 600 }}>{modalConfig.title}</Text>
                    </div>
                }
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
                width={500}
                centered
                styles={{ content: { borderRadius: '12px', overflow: 'hidden', padding: 0 } }}
            >
                <div style={{ padding: '0 24px 24px' }}>
                    <List
                        dataSource={selectedDetail?.users || []}
                        renderItem={(user) => (
                            <List.Item style={{ padding: '16px', background: '#f8fafc', borderRadius: '12px', marginBottom: '12px', border: '1px solid #f1f5f9' }}>
                                <List.Item.Meta
                                    avatar={<Avatar icon={<UserOutlined />} style={{ backgroundColor: '#e2e8f0', color: '#64748b' }} size="large" />}
                                    title={<Text strong style={{ color: '#0f172a' }}>{user.username || 'Anonymous User'}</Text>}
                                    description={<Text type="secondary" style={{ fontSize: '13px' }}>ID: {user.telegramUserId}</Text>}
                                />
                            </List.Item>
                        )}
                        locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No user details available" /> }}
                    />
                </div>
            </Modal>

            <style>
                {`
                    .premium-table .ant-table-thead > tr > th {
                        background: #f8fafc !important;
                        color: #64748b !important;
                        font-weight: 600 !important;
                        font-size: 11px !important;
                        text-transform: uppercase !important;
                        letter-spacing: 0.05em !important;
                        border-bottom: 1px solid #f1f5f9 !important;
                        padding: 16px 24px !important;
                    }
                    .premium-table .ant-table-tbody > tr > td {
                        border-bottom: 1px solid #f1f5f9 !important;
                        padding: 16px 24px !important;
                    }
                    .premium-table .ant-table-tbody > tr:hover > td {
                        background: #f8fafc !important;
                    }
                    .premium-table .ant-table {
                        background: transparent !important;
                    }
                    .premium-table .ant-pagination {
                        padding: 16px 24px !important;
                        margin: 0 !important;
                    }
                    @media (max-width: 576px) {
                        .ant-picker-range {
                            width: 100% !important;
                        }
                    }
                `}
            </style>
        </div>
    );
};

export default Analytics;
