import React, { useState, useEffect } from 'react';
import { Table, Typography, Space, Button, Tag, App } from 'antd';
import { PlusOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import landingPageService from '../services/landingPage';

const { Title, Text } = Typography;

const LandingPages = () => {
    const navigate = useNavigate();
    const { message } = App.useApp();
    const [loading, setLoading] = useState(false);
    const [landingPages, setLandingPages] = useState([]);

    const fetchLandingPages = React.useCallback(async () => {
        setLoading(true);
        try {
            const response = await landingPageService.getLandingPages();
            if (response.success && Array.isArray(response.data)) {
                setLandingPages(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch landing pages:', error);
            message.error('Failed to load landing pages');
        } finally {
            setLoading(false);
        }
    }, [message]);

    useEffect(() => {
        fetchLandingPages();
    }, [fetchLandingPages]);

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text) => <Text strong>{text}</Text>,
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
            render: (type) => <Tag color="blue">{type}</Tag>,
        },
        {
            title: 'Scope',
            dataIndex: 'scope',
            key: 'scope',
            render: (scope) => <Tag color={scope === 'global' ? 'geekblue' : 'green'}>{scope}</Tag>,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={status === 'active' ? 'success' : 'default'}>
                    {status ? status.toUpperCase() : 'UNKNOWN'}
                </Tag>
            ),
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date) => new Date(date).toLocaleDateString(),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => navigate(`/landing-pages/${record._id}`)}
                    >
                        Edit
                    </Button>
                    <Button
                        icon={<EyeOutlined />}
                        onClick={() => window.open(`http://72.62.241.45:4000/api/landing-pages/${record._id}/render`, '_blank')}
                    >
                        Preview
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <Title level={2} style={{ margin: 0 }}>Landing Pages</Title>
                    <Text type="secondary">Manage your landing pages and templates</Text>
                </div>
                {/* <Button type="primary" icon={<PlusOutlined />} size="large">
                    Create New Page
                </Button> */}
            </div>

            <Table
                columns={columns}
                dataSource={landingPages}
                rowKey="_id"
                loading={loading}
                pagination={{ pageSize: 10 }}
                style={{ background: '#fff', borderRadius: '8px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
            />
        </div>
    );
};

export default LandingPages;
