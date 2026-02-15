import React from 'react';
import { Typography, Table, Select, Button, Space, Tag, Checkbox, Breadcrumb } from 'antd';
import {
    DownloadOutlined,
    ExportOutlined,
    UnorderedListOutlined,
    CalendarOutlined,
    GlobalOutlined,
    ProjectOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

const LeadManagement = () => {
    const columns = [
        {
            title: 'Lead ID',
            dataIndex: 'leadId',
            key: 'leadId',
            render: (text) => <Text strong>{text}</Text>,
        },
        {
            title: 'Timestamp',
            dataIndex: 'timestamp',
            key: 'timestamp',
            render: (record) => (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <Text>{record.date}</Text>
                    <Text type="secondary" style={{ fontSize: '12px' }}>{record.time}</Text>
                </div>
            ),
        },
        {
            title: 'IP Address',
            dataIndex: 'ipAddress',
            key: 'ipAddress',
        },
        {
            title: 'Referrer (Source URL)',
            dataIndex: 'referrer',
            key: 'referrer',
            render: (text) => <Text style={{ color: '#595959' }}>{text}</Text>,
        },
        {
            title: 'Project Name',
            dataIndex: 'projectName',
            key: 'projectName',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag
                    color={status === 'Subscribed' ? 'blue' : 'default'}
                    style={{
                        borderRadius: '12px',
                        padding: '2px 12px',
                        fontWeight: 500,
                        background: status === 'Subscribed' ? '#E6F4FF' : '#F5F5F5',
                        color: status === 'Subscribed' ? '#1677FF' : '#595959',
                        border: 'none',
                        fontSize: '12px'
                    }}
                >
                    {status}
                </Tag>
            ),
        },
    ];

    const data = [
        { key: '1', leadId: 'Lead 12345', timestamp: { date: '2024-01-15', time: '10:00 AM' }, ipAddress: '192.168.1.1', referrer: 'example.com', projectName: 'Project Alpha', status: 'Subscribed' },
        { key: '2', leadId: 'Lead 67890', timestamp: { date: '2024-01-15', time: '11:30 AM' }, ipAddress: '192.168.1.2', referrer: 'another-example.com', projectName: 'Project Beta', status: 'Pending' },
        { key: '3', leadId: 'Lead 11223', timestamp: { date: '2024-01-15', time: '01:00 PM' }, ipAddress: '192.168.1.3', referrer: 'third-example.com', projectName: 'Project Alpha', status: 'Subscribed' },
        { key: '4', leadId: 'Lead 44556', timestamp: { date: '2024-01-15', time: '02:45 PM' }, ipAddress: '192.168.1.4', referrer: 'fourth-example.com', projectName: 'Project Gamma', status: 'Subscribed' },
        { key: '5', leadId: 'Lead 77889', timestamp: { date: '2024-01-15', time: '04:20 PM' }, ipAddress: '192.168.1.5', referrer: 'fifth-example.com', projectName: 'Project Beta', status: 'Pending' },
        { key: '6', leadId: 'Lead 99001', timestamp: { date: '2024-01-15', time: '06:00 PM' }, ipAddress: '192.168.1.6', referrer: 'sixth-example.com', projectName: 'Project Alpha', status: 'Subscribed' },
        { key: '7', leadId: 'Lead 22334', timestamp: { date: '2024-01-15', time: '07:30 PM' }, ipAddress: '192.168.1.7', referrer: 'seventh-example.com', projectName: 'Project Gamma', status: 'Subscribed' },
        { key: '8', leadId: 'Lead 55667', timestamp: { date: '2024-01-15', time: '09:15 PM' }, ipAddress: '192.168.1.8', referrer: 'eighth-example.com', projectName: 'Project Beta', status: 'Pending' },
        { key: '9', leadId: 'Lead 88990', timestamp: { date: '2024-01-15', time: '10:50 PM' }, ipAddress: '192.168.1.9', referrer: 'ninth-example.com', projectName: 'Project Alpha', status: 'Subscribed' },
        { key: '10', leadId: 'Lead 11223', timestamp: { date: '2024-01-15', time: '11:59 PM' }, ipAddress: '192.168.1.10', referrer: 'tenth-example.com', projectName: 'Project Gamma', status: 'Subscribed' },
    ];

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        },
    };

    return (
        <div style={{ padding: 'clamp(8px, 3vw, 32px)', background: '#fff', minHeight: '100%' }}>
            <Title level={2} style={{ marginBottom: '24px', fontWeight: 600 }}>Leads Management</Title>

            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '24px',
                flexWrap: 'wrap',
                gap: '16px'
            }}>
                <Space size="middle" wrap>
                    <Select
                        placeholder="Date Range"
                        style={{ width: 140 }}
                        suffixIcon={<CalendarOutlined />}
                        size="large"
                        className="custom-select"
                    >
                        <Option value="30">Last 30 Days</Option>
                        <Option value="7">Last 7 Days</Option>
                        <Option value="1">Today</Option>
                    </Select>
                    <Select
                        placeholder="Platform"
                        style={{ width: 130 }}
                        suffixIcon={<GlobalOutlined />}
                        size="large"
                        className="custom-select"
                    >
                        <Option value="meta">Meta Ads</Option>
                        <Option value="google">Google Ads</Option>
                        <Option value="telegram">Telegram</Option>
                    </Select>
                    <Select
                        placeholder="Project"
                        style={{ width: 130 }}
                        suffixIcon={<ProjectOutlined />}
                        size="large"
                        className="custom-select"
                    >
                        <Option value="alpha">Project Alpha</Option>
                        <Option value="beta">Project Beta</Option>
                        <Option value="gamma">Project Gamma</Option>
                    </Select>
                </Space>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <Space size="small">
                        <Button icon={<UnorderedListOutlined />} type="text" size="large" />
                        <Button icon={<DownloadOutlined />} type="text" size="large" />
                    </Space>
                    <Button
                        type="primary"
                        icon={<ExportOutlined />}
                        size="large"
                        style={{
                            borderRadius: '8px',
                            padding: '0 24px',
                            height: '40px',
                            background: '#084b8a',
                            border: 'none',
                            fontWeight: 500
                        }}
                    >
                        Export
                    </Button>
                </div>
            </div>

            <div style={{
                background: '#fff',
                borderRadius: '16px',
                border: '1px solid #f0f0f0',
                overflow: 'hidden'
            }}>
                <Table
                    rowSelection={{
                        type: 'checkbox',
                        ...rowSelection,
                    }}
                    columns={columns}
                    dataSource={data}
                    pagination={{ pageSize: 12, position: ['bottomCenter'] }}
                    scroll={{ x: 1000 }}
                    className="leads-table"
                />
            </div>

            <style>
                {`
          .custom-select .ant-select-selector {
            border-radius: 12px !important;
            border-color: #f0f0f0 !important;
            background: #F9FAFB !important;
          }
          .leads-table .ant-table-thead > tr > th {
            font-weight: 600 !important;
            color: #ffffff !important;
            border-bottom: 1px solid #f0f0f0 !important;
            font-size: 13px !important;
            padding: 16px !important;
          }
          .leads-table .ant-table-tbody > tr > td {
            padding: 16px !important;
            border-bottom: 1px solid #f9f9f9 !important;
          }
          .leads-table .ant-table-row:hover > td {
            background: #fbfbfb !important;
          }
          .ant-checkbox-inner {
            border-radius: 4px !important;
          }
          .ant-pagination-item {
            border-radius: 8px !important;
          }
          .ant-pagination-item-active {
            border-color: #084b8a !important;
          }
          .ant-pagination-item-active a {
            color: #084b8a !important;
          }
        `}
            </style>
        </div>
    );
};

export default LeadManagement;
