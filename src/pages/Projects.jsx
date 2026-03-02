import React, { useState, useEffect } from 'react';
import {
  Table,
  Input,
  Button,
  Tag,
  Space,
  Typography,
  Avatar,
  App,
  Card,
  Row,
  Col,
  Statistic,
  Tooltip,
  Dropdown,
  Menu
} from 'antd';
import {
  SearchOutlined,
  PlusOutlined,
  MoreOutlined,
  GlobalOutlined,
  FacebookOutlined,
  GoogleOutlined,
  RocketOutlined,
  EyeOutlined,
  EditOutlined,
  LineChartOutlined,
  ArrowUpOutlined,
  ProjectOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import projectService from '../services/project';
import { BASE_DOMAIN } from '../config';

const { Title, Text } = Typography;

const Projects = () => {
  const navigate = useNavigate();
  const { message, modal } = App.useApp();
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);

  const fetchProjects = React.useCallback(async () => {
    setLoading(true);
    try {
      const response = await projectService.getProjects();
      if (response.success) {
        setProjects(response.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      message.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  }, [message]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleDelete = (id, name) => {
    modal.confirm({
      title: 'Delete Project',
      content: `Are you sure you want to delete "${name}"? This action cannot be undone.`,
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          const response = await projectService.deleteProject(id);
          if (response.success) {
            message.success('Project deleted successfully');
            fetchProjects();
          }
        } catch (error) {
          message.error(error.message || 'Failed to delete project');
        }
      }
    });
  };

  const columns = [
    {
      title: 'Project ID',
      dataIndex: '_id',
      key: 'id',
      render: (id) => <Text style={{ fontSize: '13px', color: '#666' }}>{id?.substring(0, 12)}</Text>,
    },
    {
      title: 'Project Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Space size="middle">
          <Avatar
            shape="circle"
            size={32}
            icon={<ProjectOutlined />}
            style={{
              backgroundColor: '#084b8a',
              color: '#ffffff',
            }}
          />
          <div>
            <Text strong style={{ fontSize: '14px', color: '#1f1f1f', display: 'block' }}>{text}</Text>
            <Text type="secondary" style={{ fontSize: '11px' }}>{record.slug}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Platforms',
      dataIndex: 'adPlatforms',
      key: 'adPlatforms',
      render: (platforms) => (
        <Space size={4}>
          {(platforms || []).map(p => (
            <Tooltip key={p} title={p.charAt(0).toUpperCase() + p.slice(1)}>
              <Avatar
                size="small"
                icon={p === 'google' ? <GoogleOutlined /> : <FacebookOutlined />}
                style={{ backgroundColor: p === 'google' ? '#4285F4' : '#0668E1' }}
              />
            </Tooltip>
          ))}
          {(!platforms || platforms.length === 0) && <Tag color="default">General</Tag>}
        </Space>
      ),
    },
    {
      title: 'Visits',
      dataIndex: 'stats',
      key: 'visits',
      align: 'center',
      render: (stats) => <Text style={{ fontWeight: 500 }}>{stats?.visitors || 0}</Text>,
    },
    {
      title: 'Clicks',
      dataIndex: 'stats',
      key: 'clicks',
      align: 'center',
      render: (stats) => <Text style={{ fontWeight: 500 }}>{stats?.clicks || 0}</Text>,
    },
    {
      title: 'Subscriptions',
      dataIndex: 'stats',
      key: 'subscribers',
      align: 'center',
      render: (stats) => <Text style={{ color: '#52c41a', fontWeight: 'bold' }}>{stats?.subscribers || 0}</Text>,
    },
    {
      title: 'Unsubscriptions',
      dataIndex: 'stats',
      key: 'unsubscribers',
      align: 'center',
      render: (stats) => <Text style={{ color: '#ff4d4f', fontWeight: 'bold' }}>{stats?.unsubscribers || 0}</Text>,
    },
    {
      title: 'Analytics',
      key: 'analytics',
      render: (_, record) => (
        <Button
          type="link"
          size="small"
          onClick={() => navigate('/analytics', { state: { project: record } })}
          style={{ padding: 0, fontSize: '13px', color: '#084b8a' }}
        >
          View Analytics
        </Button>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'right',
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            style={{ borderRadius: '6px', fontSize: '12px', height: '32px' }}
            onClick={() => window.open(`${BASE_DOMAIN}/p/${record.slug}`, '_blank')}
          >
            Open
          </Button>
          <Button
            type="default"
            style={{ borderRadius: '6px', fontSize: '12px', height: '32px', border: '1px solid #e2e8f0' }}
            onClick={() => navigate(`/projects/edit/${record._id}`)}
          >
            Edit
          </Button>
          <Button
            danger
            type="text"
            style={{ borderRadius: '6px', fontSize: '12px', height: '32px' }}
            onClick={() => handleDelete(record._id, record.name)}
          >
            Delete
          </Button>
        </Space>
      )
    },
  ];

  const filteredData = projects.filter(item =>
    item.name.toLowerCase().includes(searchText.toLowerCase()) ||
    item.slug?.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <style>
        {`
                    .ant-table-thead > tr > th {
                        font-weight: 600 !important;
                        font-size: 13px !important;
                    }
                    .ant-table-wrapper .ant-table-scrollbar {
                      display: none !important;
                    }
                    /* Hide scrollbar track */
                    .ant-table-body::-webkit-scrollbar,
                    .ant-table-content::-webkit-scrollbar {
                      display: none !important;
                    }
                    .ant-table-body,
                    .ant-table-content {
                      -ms-overflow-style: none !important;
                      scrollbar-width: none !important;
                    }
                    @media (max-width: 576px) {
                        .projects-header {
                            flex-direction: column !important;
                            align-items: flex-start !important;
                            gap: 16px !important;
                        }
                        .create-project-btn {
                            width: 100% !important;
                        }
                    }
                `}
      </style>
      {/* Page Header */}
      <div className="projects-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32 }}>
        <div>
          <Title level={2} style={{ margin: 0, fontSize: '28px', fontWeight: 700 }}>Projects Overview</Title>
          <Text type="secondary">Manage your tracking campaigns and monitor performance.</Text>
        </div>
        <Button
          type="primary"
          size="large"
          icon={<PlusOutlined />}
          onClick={() => navigate('/projects/new')}
          className="create-project-btn"
          style={{
            height: '42px',
            borderRadius: '8px',
            fontWeight: 600,
            boxShadow: '0 4px 12px rgba(8, 75, 138, 0.2)'
          }}
        >
          Create Project
        </Button>
      </div>

      {/* Table Container */}
      <Card
        style={{
          borderRadius: '16px',
          border: '1px solid #f0f0f0',
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
        }}
        styles={{ body: { padding: 0 } }}
      >
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #f0f0f0' }}>
          <Input
            placeholder="Search project name or ID..."
            prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            style={{ maxWidth: 350, height: '40px', borderRadius: '8px', background: '#f5f5f5', border: 'none' }}
          />
        </div>

        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="_id"
          loading={loading}
          pagination={{
            pageSize: 8,
            showSizeChanger: false,
            placement: 'bottomCenter'
          }}
          scroll={{ x: 'max-content' }}
          style={{ background: '#fff' }}
        />
      </Card>
    </div>
  );
};

export default Projects;
