import React, { useState } from 'react';
import { Table, Input, Button, Tag, Space, Typography, Avatar } from 'antd';
import { SearchOutlined, PlusOutlined, MoreOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const Projects = () => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');

  const projectsData = [
    {
      key: '1',
      name: 'Project Alpha',
      platform: 'Google Ads',
      platformIcon: 'G',
      trackingId: 'GA-1234567890',
      status: 'Active',
    },
    {
      key: '2',
      name: 'Project Beta',
      platform: 'Meta Ads',
      platformIcon: 'M',
      trackingId: 'FB-9876543210',
      status: 'Paused',
    },
    {
      key: '3',
      name: 'Project Gamma',
      platform: 'Google Ads',
      platformIcon: 'G',
      trackingId: 'GA-0123456789',
      status: 'Active',
    },
    {
      key: '4',
      name: 'Project Delta',
      platform: 'Meta Ads',
      platformIcon: 'M',
      trackingId: 'FB-8765432109',
      status: 'Active',
    },
    {
      key: '5',
      name: 'Project Epsilon',
      platform: 'Google Ads',
      platformIcon: 'G',
      trackingId: 'GA-9012345678',
      status: 'Paused',
    },
  ];

  const columns = [
    {
      title: 'Project Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <span style={{ fontWeight: 500 }}>{text}</span>,
    },
    {
      title: 'Platform',
      dataIndex: 'platform',
      key: 'platform',
      render: (text, record) => (
        <Space>
          <Avatar
            size="small"
            style={{
              backgroundColor: record.platform === 'Google Ads' ? '#f0f0f0' : '#0064f9',
              color: record.platform === 'Google Ads' ? '#555' : '#fff',
              fontSize: '10px'
            }}
          >
            {record.platformIcon}
          </Avatar>
          <span>{text}</span>
        </Space>
      ),
    },
    {
      title: 'Pixel/Tracking ID',
      dataIndex: 'trackingId',
      key: 'trackingId',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'Active' ? 'blue' : 'default'} style={{ borderRadius: '12px', padding: '0 12px' }}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" size="small" style={{ padding: 0 }}>View</Button>
          <Button type="link" size="small" style={{ padding: 0 }}>Edit</Button>
          <Button
            type="link"
            size="small"
            style={{ padding: 0 }}
            onClick={() => navigate('/analytics', { state: { project: record } })}
          >
            Analytics
          </Button>
        </Space>
      ),
    },
  ];

  const filteredData = projectsData.filter(item =>
    item.name.toLowerCase().includes(searchText.toLowerCase()) ||
    item.trackingId.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div style={{ padding: '0 clamp(8px, 2vw, 24px)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0 }}>Projects</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate('/projects/new')}
          style={{ height: '40px', borderRadius: '8px' }}
        >
          New Project
        </Button>
      </div>

      <div style={{ marginBottom: 24 }}>
        <Input
          placeholder="Search projects"
          prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          style={{ maxWidth: 400, height: '40px', borderRadius: '8px' }}
        />
      </div>

      <Table
        columns={columns}
        dataSource={filteredData}
        pagination={{ pageSize: 10 }}
        scroll={{ x: 'max-content' }}
        style={{ border: '1px solid #f0f0f0', borderRadius: '8px', overflow: 'hidden' }}
      />
    </div>
  );
};

export default Projects;
