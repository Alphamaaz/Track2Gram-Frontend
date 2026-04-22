import React, { useState, useEffect, useCallback } from 'react';
import { Typography, Table, Select, Button, Space, Tag, Input, Card, Row, Col, DatePicker, Avatar, App, Skeleton, Empty, Tooltip } from 'antd';
import {
    DownloadOutlined,
    ExportOutlined,
    SearchOutlined,
    CalendarOutlined,
    ProjectOutlined,
    UserOutlined,
    UserAddOutlined,
    UserDeleteOutlined,
    ReloadOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import projectService from '../services/project';
import { getDateRangePresets } from '../utils/dateRangePresets';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const LeadManagement = () => {
    const { message } = App.useApp();
    const [loading, setLoading] = useState(true);
    const [leads, setLeads] = useState([]);
    const [projects, setProjects] = useState([]);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 20, total: 0 });
    const [filters, setFilters] = useState({
        projectId: null,
        status: 'all',
        q: '',
        dateRange: null
    });
    const [stats, setStats] = useState({ total: 0, subscribed: 0, unsubscribed: 0 });

    const { current, pageSize } = pagination;

    const fetchLeads = useCallback(async () => {
        setLoading(true);
        try {
            const params = {
                page: current,
                limit: pageSize,
                projectId: filters.projectId,
                status: filters.status,
                q: filters.q,
                startDate: filters.dateRange?.[0]?.format('YYYY-MM-DD'),
                endDate: filters.dateRange?.[1]?.format('YYYY-MM-DD')
            };

            const response = await projectService.getLeads(params);
            if (response.success) {
                setLeads(response.data.items || []);
                setPagination(prev => ({
                    ...prev,
                    total: response.data.pagination.total
                }));

                const currentItems = response.data.items || [];
                setStats({
                    total: response.data.pagination.total,
                    subscribed: currentItems.filter(l => l.status === 'subscribed').length,
                    unsubscribed: currentItems.filter(l => l.status === 'unsubscribed').length
                });
            }
        } catch (error) {
            console.error('Fetch leads error:', error);
            message.error(error.message || 'Failed to fetch leads');
        } finally {
            setLoading(false);
        }
    }, [current, pageSize, filters.projectId, filters.status, filters.q, filters.dateRange, message]);

    const handleExport = () => {
        if (leads.length === 0) {
            message.warning('No data to export');
            return;
        }

        const headers = ['Telegram ID', 'Subscriber Name', 'Username', 'Platform', 'Project', 'Status', 'Last Activity'];
        const csvRows = [
            headers.join(','),
            ...leads.map(lead => [
                `"${lead.telegramUserId}"`,
                `"${lead.subscriberName || 'Unknown'}"`,
                `"${lead.telegramUsername || 'N/A'}"`,
                `"${lead.platform}"`,
                `"${lead.project?.name || 'N/A'}"`,
                `"${lead.status}"`,
                `"${dayjs(lead.lastEventAt).format('YYYY-MM-DD HH:mm:ss')}"`
            ].join(','))
        ];

        const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `leads_export_${dayjs().format('YYYYMMDD')}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        message.success('Leads exported successfully');
    };

    const fetchProjects = async () => {
        try {
            const response = await projectService.getProjects();
            if (response.success) {
                setProjects(response.data || []);
            }
        } catch (error) {
            console.error('Fetch projects error:', error);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    useEffect(() => {
        fetchLeads();
    }, [fetchLeads]);

    const handleTableChange = (newPagination) => {
        setPagination(prev => ({ ...prev, current: newPagination.current }));
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setPagination(prev => ({ ...prev, current: 1 }));
    };

    const columns = [
        {
            title: 'SUBSCRIBER',
            dataIndex: 'subscriberName',
            key: 'subscriber',
            render: (text, record) => (
                <Space>
                    <Avatar
                        icon={<UserOutlined />}
                        style={{ backgroundColor: record.status === 'subscribed' ? '#084b8a' : '#94a3b8' }}
                    />
                    <div>
                        <Text strong style={{ display: 'block' }}>{text || 'Unknown'}</Text>
                        <Space size={4}>
                            <Text type="secondary" style={{ fontSize: '11px' }}>ID: {record.telegramUserId}</Text>
                            {record.telegramUsername && (
                                <Text type="secondary" style={{ fontSize: '11px' }}>• @{record.telegramUsername}</Text>
                            )}
                        </Space>
                    </div>
                </Space>
            ),
        },
        {
            title: 'PLATFORM',
            dataIndex: 'platform',
            key: 'platform',
            render: (platform) => (
                <Tag
                    color={platform === 'meta' ? 'blue' : platform === 'google' ? 'orange' : 'default'}
                    style={{ borderRadius: '6px', textTransform: 'uppercase', fontSize: '10px', fontWeight: 700 }}
                >
                    {platform}
                </Tag>
            )
        },
        {
            title: 'PROJECT',
            dataIndex: ['project', 'name'],
            key: 'project',
            render: (name) => (
                <Tag icon={<ProjectOutlined />} style={{ borderRadius: '6px', border: 'none', background: 'rgba(8, 75, 138, 0.1)', color: '#084b8a' }}>
                    {name}
                </Tag>
            ),
        },
        {
            title: 'STATUS',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag
                    style={{
                        borderRadius: '12px',
                        padding: '0 12px',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        fontSize: '11px',
                        border: 'none',
                        background: status === 'subscribed' ? 'rgba(8, 75, 138, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                        color: status === 'subscribed' ? '#084b8a' : '#ef4444'
                    }}
                >
                    {status}
                </Tag>
            ),
        },
        {
            title: 'LAST ACTIVITY',
            dataIndex: 'lastEventAt',
            key: 'lastEventAt',
            render: (date) => (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <Text style={{ fontSize: '13px' }}>{dayjs(date).format('MMM DD, YYYY')}</Text>
                    <Text type="secondary" style={{ fontSize: '11px' }}>{dayjs(date).format('HH:mm A')}</Text>
                </div>
            ),
        }
    ];

    const statCards = [
        { title: 'Total Leads', value: stats.total, icon: <UserOutlined />, color: '#084b8a', bg: 'rgba(8, 75, 138, 0.08)' },
        { title: 'Active (Subscribed)', value: stats.subscribed, icon: <UserAddOutlined />, color: '#084b8a', bg: 'rgba(8, 75, 138, 0.08)' },
        { title: 'Unsubscribed', value: stats.unsubscribed, icon: <UserDeleteOutlined />, color: '#ef4444', bg: 'rgba(239, 68, 68, 0.08)' },
    ];

    return (
        <div style={{ padding: '0 clamp(12px, 3vw, 24px)', paddingBottom: '40px', maxWidth: '1600px', margin: '0 auto', background: '#F8FAFC' }}>
            {/* Header */}
            <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', paddingTop: '24px' }}>
                <div>
                    <Title level={2} style={{ margin: 0, fontWeight: 800, letterSpacing: '-0.02em', color: '#084b8a' }}>Lead Management</Title>
                    <Text style={{ color: '#64748b', fontWeight: 500 }}>Manage and monitor your lead activities across all projects.</Text>
                </div>
                <Space size="middle">
                    <Button
                        type="primary"
                        icon={<ExportOutlined />}
                        onClick={handleExport}
                        style={{ background: '#084b8a', borderRadius: '8px', height: '40px', fontWeight: 600 }}
                    >
                        Export Leads
                    </Button>
                </Space>
            </div>

            {/* Stats Grid */}
            <Row gutter={[20, 20]} style={{ marginBottom: '32px' }}>
                {statCards.map((stat, index) => (
                    <Col xs={24} sm={8} key={index}>
                        <Card variant="borderless" style={{ background: '#E6ECF2', borderRadius: '20px', border: '1px solid rgba(8, 75, 138, 0.1)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02)' }} styles={{ body: { padding: '24px' } }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <Text style={{ fontSize: '13px', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '8px' }}>{stat.title}</Text>
                                    <Title level={2} style={{ margin: 0, fontWeight: 800, color: stat.color === '#084b8a' ? '#084b8a' : stat.color }}>{stat.value}</Title>
                                </div>
                                <div style={{ width: '48px', height: '48px', background: '#fff', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                                    {React.cloneElement(stat.icon, { style: { color: stat.color === '#084b8a' ? '#084b8a' : stat.color, fontSize: '20px' } })}
                                </div>
                            </div>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* Filters Bar */}
            <div style={{ background: '#E6ECF2', padding: '20px', borderRadius: '20px', marginBottom: '24px', border: '1px solid rgba(8, 75, 138, 0.1)', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                <Space size="middle" wrap>
                    <Input
                        placeholder="Search leads..."
                        prefix={<SearchOutlined style={{ color: '#084b8a' }} />}
                        style={{ width: 250, borderRadius: '10px' }}
                        value={filters.q}
                        onChange={(e) => handleFilterChange('q', e.target.value)}
                        className="custom-input"
                    />
                    <Select
                        placeholder="Project"
                        style={{ width: 180 }}
                        onChange={(v) => handleFilterChange('projectId', v)}
                        allowClear
                        options={projects.map(p => ({ value: p._id, label: p.name }))}
                        className="custom-select"
                    />
                    <Select
                        placeholder="Status"
                        style={{ width: 150 }}
                        defaultValue="all"
                        onChange={(v) => handleFilterChange('status', v)}
                        options={[
                            { value: 'all', label: 'All Status' },
                            { value: 'subscribed', label: 'Subscribed' },
                            { value: 'unsubscribed', label: 'Unsubscribed' },
                        ]}
                        className="custom-select"
                    />
                    <RangePicker
                        style={{ borderRadius: '10px' }}
                        presets={getDateRangePresets()}
                        onChange={(dates) => handleFilterChange('dateRange', dates)}
                    />
                </Space>
            </div>

            {/* Table Area */}
            <div style={{ background: '#fff', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                {loading ? (
                    <div style={{ padding: '40px' }}><Skeleton active paragraph={{ rows: 10 }} /></div>
                ) : (
                    <Table
                        columns={columns}
                        dataSource={leads}
                        pagination={{
                            ...pagination,
                            showSizeChanger: true,
                            showTotal: (total) => `Total ${total} leads`
                        }}
                        onChange={handleTableChange}
                        rowKey={(record) => `${record.telegramUserId}_${record.project?.id || 'noproject'}_${record.platform}`}
                        locale={{ emptyText: <Empty description="No leads found" /> }}
                        scroll={{ x: 'max-content' }}
                        className="premium-table"
                    />
                )}
            </div>

            <style>
                {`
                .custom-input:hover, .custom-input:focus, .ant-input-affix-wrapper:hover, .ant-input-affix-wrapper-focused {
                    border-color: #084b8a !important;
                    box-shadow: 0 0 0 2px rgba(8, 75, 138, 0.1) !important;
                }
                .ant-picker:hover, .ant-picker-focused {
                    border-color: #084b8a !important;
                }
                .ant-picker-range .ant-picker-active-bar {
                    background: #084b8a !important;
                }
                .custom-select .ant-select-selector:hover, .custom-select.ant-select-focused .ant-select-selector {
                    border-color: #084b8a !important;
                }
                .custom-select .ant-select-selector {
                    border-radius: 10px !important;
                }
                .premium-table .ant-table-thead > tr > th {
                    background: #f8fafc !important;
                    color: #64748b !important;
                    font-weight: 600 !important;
                    font-size: 11px !important;
                    text-transform: uppercase !important;
                    letter-spacing: 0.05em !important;
                    padding: 16px 24px !important;
                    border-bottom: 1px solid #f1f5f9 !important;
                }
                .premium-table .ant-table-tbody > tr > td {
                    padding: 16px 24px !important;
                    border-bottom: 1px solid #f1f5f9 !important;
                }
                .premium-table .ant-table-row:hover > td {
                    background: #f8fafc !important;
                }
                .ant-pagination-item-active {
                    border-color: #084b8a !important;
                }
                .ant-pagination-item-active a {
                    color: #084b8a !important;
                }
                .ant-btn-primary {
                    background-color: #084b8a !important;
                    border-color: #084b8a !important;
                }
                .ant-btn-primary:hover {
                    background-color: #063a6e !important;
                    border-color: #063a6e !important;
                }
                .ant-select-item-option-selected:not(.ant-select-item-option-disabled) {
                    background-color: rgba(8, 75, 138, 0.1) !important;
                }
                `}
            </style>
        </div>
    );
};

export default LeadManagement;
