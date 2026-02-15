import React, { useState } from 'react';
import { Card, Table, Tag, Space, Button, Input, Typography, Row, Col, Avatar } from 'antd';
import { SearchOutlined, DownloadOutlined, UserOutlined, WalletOutlined, HistoryOutlined, CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const TransactionHistory = () => {
    const [searchText, setSearchText] = useState('');

    const columns = [
        {
            title: 'TRANSACTION ID',
            dataIndex: 'id',
            key: 'id',
            render: (text) => <Text strong style={{ color: '#1e293b' }}>{text}</Text>,
        },
        {
            title: 'BUYER',
            dataIndex: 'buyer',
            key: 'buyer',
            render: (text) => (
                <Space>
                    <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#E0F2FE', color: '#084b8a' }} />
                    <Text strong style={{ color: '#1e293b' }}>{text}</Text>
                </Space>
            ),
        },
        {
            title: 'AMOUNT',
            dataIndex: 'amount',
            key: 'amount',
            render: (text) => <Text strong style={{ color: '#059669' }}>{text}</Text>,
        },
        {
            title: 'STATUS',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                let color = 'default';
                let bg = '#F1F5F9';
                let textColor = '#64748B';
                let icon = null;

                if (status === 'Completed') {
                    color = 'success';
                    bg = '#DCFCE7';
                    textColor = '#16A34A';
                    icon = <CheckCircleOutlined />;
                } else if (status === 'Pending') {
                    color = 'warning';
                    bg = '#FEF9C3';
                    textColor = '#CA8A04';
                    icon = <ClockCircleOutlined />;
                } else if (status === 'Failed') {
                    color = 'error';
                    bg = '#FEE2E2';
                    textColor = '#DC2626';
                    icon = <CloseCircleOutlined />;
                }

                return (
                    <Tag color={color} style={{ borderRadius: '12px', fontWeight: 600, border: 'none', background: bg, color: textColor, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        {icon}
                        {status.toUpperCase()}
                    </Tag>
                );
            },
        },
        {
            title: 'PAYMENT METHOD',
            dataIndex: 'method',
            key: 'method',
            render: (text) => <Text style={{ color: '#1e293b' }}>{text}</Text>,
        },
        {
            title: 'DATE',
            dataIndex: 'date',
            key: 'date',
            render: (text) => <Text style={{ color: '#64748B' }}>{text}</Text>,
        },
    ];

    const data = [
        { key: '1', id: '#TRX-8901', buyer: 'Michael Scott', amount: '$450.00', status: 'Completed', method: 'Credit Card', date: 'Jan 24, 2024' },
        { key: '2', id: '#TRX-8902', buyer: 'Dwight Schrute', amount: '$1,299.00', status: 'Completed', method: 'PayPal', date: 'Jan 23, 2024' },
        { key: '3', id: '#TRX-8903', buyer: 'Jim Halpert', amount: '$85.50', status: 'Pending', method: 'Credit Card', date: 'Jan 23, 2024' },
        { key: '4', id: '#TRX-8904', buyer: 'Pam Beesly', amount: '$210.00', status: 'Completed', method: 'Bank Transfer', date: 'Jan 22, 2024' },
        { key: '5', id: '#TRX-8905', buyer: 'Ryan Howard', amount: '$45.00', status: 'Failed', method: 'Credit Card', date: 'Jan 21, 2024' },
    ];

    const filteredData = data.filter(item =>
        item.buyer.toLowerCase().includes(searchText.toLowerCase()) ||
        item.id.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <div style={{ padding: 'clamp(8px, 3vw, 32px)' }}>
            <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                    <Title level={2} style={{ margin: 0, fontWeight: 800, color: '#1e293b' }}>Transaction History</Title>
                    <Text style={{ color: '#1e293b' }}>View and track all your recent transactions</Text>
                </div>
                <Button
                    type="primary"
                    icon={<DownloadOutlined />}
                    size="large"
                    style={{ background: '#084b8a', borderColor: '#084b8a', borderRadius: '8px', height: '44px', fontWeight: 600 }}
                >
                    Export History
                </Button>
            </div>



            <Card
                variant="borderless"
                style={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}
                styles={{ body: { padding: '0' } }}
            >
                <div style={{ padding: '24px', borderBottom: '1px solid #f0f0f0' }}>
                    <Input
                        placeholder="Search transactions..."
                        prefix={<SearchOutlined style={{ color: '#BFBFBF' }} />}
                        style={{ width: '100%', maxWidth: '300px', borderRadius: '8px', background: '#F8FAFC', border: '1px solid #E2E8F0' }}
                        size="large"
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                </div>
                <Table
                    columns={columns}
                    dataSource={filteredData}
                    pagination={{ pageSize: 10 }}
                    rowClassName={() => 'hover-row'}
                    scroll={{ x: 1000 }}
                />
            </Card>

            <style>
                {`
                    .ant-table-thead > tr > th {
                        font-size: 11px !important;
                        font-weight: 900 !important;
                        color: #ffffff !important;
                        text-transform: uppercase !important;
                        letter-spacing: 0.1em !important;
                        border-bottom: 2px solid #f0f0f0 !important;
                    }
                    .hover-row:hover > td {
                        background-color: #F8FAFC !important;
                    }
                `}
            </style>
        </div>
    );
};

export default TransactionHistory;
