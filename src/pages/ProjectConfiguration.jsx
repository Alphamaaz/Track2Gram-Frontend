import React, { useState, useEffect } from 'react';
import { Typography, Input, Button, Select, Space, Card, Radio, App, Checkbox, Row, Col, Divider, Tooltip, Tag } from 'antd';
import {
    ArrowLeftOutlined,
    RocketOutlined,
    GlobalOutlined,
    ThunderboltOutlined,
    SettingOutlined,
    InfoCircleOutlined,
    CheckCircleFilled,
    GoogleOutlined,
    FacebookOutlined
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import projectService from '../services/project';
import landingPageService from '../services/landingPage';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const ProjectConfiguration = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { message, modal } = App.useApp();
    const [loading, setLoading] = useState(false);
    const [templates, setTemplates] = useState([]);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        landingPageSource: 'internal',
        customHtml: null,
        landingPageTemplateId: '',
        adPlatforms: ['google'],
        pageTitle: '',
        customDomain: ''
    });
    const [domainType, setDomainType] = useState('subdomain');

    useEffect(() => {
        const fetchTemplates = async () => {
            try {
                const response = await landingPageService.getLandingPages();
                if (response.success) {
                    setTemplates(response.data || []);
                }
            } catch {
                console.error('Failed to fetch templates');
            }
        };

        const fetchProject = async () => {
            if (id && id !== 'new') {
                setLoading(true);
                try {
                    const response = await projectService.getProject(id);
                    if (response.success) {
                        setFormData(response.data);
                        if (response.data.customDomain) {
                            setDomainType(response.data.customDomain.endsWith('.track2gram.com') ? 'subdomain' : 'custom');
                        }
                    }
                } catch {
                    message.error('Failed to load project details');
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchTemplates();
        fetchProject();
    }, [id, message]);

    const handleSave = async () => {
        if (!formData.name) return message.error('Project Name is required');
        if (formData.landingPageSource === 'internal' && !formData.landingPageTemplateId) {
            return message.error('Please select a landing page template');
        }

        setLoading(true);
        try {
            let response;
            const payload = { ...formData, pageTitle: formData.name };
            
            if (id && id !== 'new') {
                response = await projectService.updateProject(id, payload);
            } else {
                response = await projectService.createProject(payload);
            }

            if (response.success) {
                message.success(id ? 'Project updated successfully' : 'Project created successfully');
                navigate('/projects');
            }
        } catch (error) {
            message.error(error.message || 'Failed to save project');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = () => {
        modal.confirm({
            title: 'Delete Project',
            content: `Are you sure you want to delete "${formData.name}"? This action cannot be undone.`,
            okText: 'Delete',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk: async () => {
                setLoading(true);
                try {
                    const response = await projectService.deleteProject(id);
                    if (response.success) {
                        message.success('Project deleted successfully');
                        navigate('/projects');
                    }
                } catch (error) {
                    message.error(error.message || 'Failed to delete project');
                } finally {
                    setLoading(false);
                }
            }
        });
    };

    const cardStyle = {
        borderRadius: '12px',
        border: '1px solid #f0f0f0',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        marginBottom: '24px'
    };

    const labelStyle = {
        display: 'block',
        marginBottom: '8px',
        fontWeight: 600,
        color: '#1f1f1f',
        fontSize: '14px'
    };

    const platformCardStyle = (isActive) => ({
        padding: '16px',
        borderRadius: '8px',
        border: isActive ? '2px solid #084b8a' : '1px solid #d9d9d9',
        background: isActive ? '#f0f7ff' : '#fff',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        width: '100%'
    });

    return (
        <div style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto' }}>
            {/* Header Area */}
            <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Space size="middle">
                    <Button
                        icon={<ArrowLeftOutlined />}
                        onClick={() => navigate('/projects')}
                        type="default"
                        style={{ borderRadius: '8px' }}
                    />
                    <div>
                        <Title level={2} style={{ margin: 0, fontSize: '24px' }}>
                            {id ? 'Project Settings' : 'Create New Project'}
                        </Title>
                        <Text type="secondary">Configure your project identity and tracking settings.</Text>
                    </div>
                </Space>
            </div>

            <Row gutter={24}>
                <Col span={24}>
                    {/* Basic Info Card */}
                    <Card
                        title={<Space><SettingOutlined /> <Text strong>Project Identity</Text></Space>}
                        style={cardStyle}
                        styles={{ header: { borderBottom: '1px solid #f0f0f0', background: '#fafafa' } }}
                    >
                        <div style={{ marginBottom: '24px' }}>
                            <label style={labelStyle}>
                                Project Name
                                <Tooltip title="Give your project a descriptive name for internal tracking.">
                                    <InfoCircleOutlined style={{ marginLeft: '8px', color: '#8c8c8c' }} />
                                </Tooltip>
                            </label>
                            <Input
                                placeholder="e.g., Summer Campaign 2024"
                                style={{ height: '44px', borderRadius: '8px' }}
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                autoComplete="off"
                            />
                        </div>

                        <div>
                            <label style={labelStyle}>Target Platforms</label>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <div
                                        style={platformCardStyle(formData.adPlatforms.includes('google'))}
                                        onClick={() => {
                                            const platforms = formData.adPlatforms.includes('google')
                                                ? formData.adPlatforms.filter(p => p !== 'google')
                                                : [...formData.adPlatforms, 'google'];
                                            setFormData({ ...formData, adPlatforms: platforms });
                                        }}
                                    >
                                        <GoogleOutlined style={{ fontSize: '24px', color: '#4285F4' }} />
                                        <div style={{ flex: 1 }}>
                                            <Text strong style={{ display: 'block' }}>Google Ads</Text>
                                            <Text type="secondary" style={{ fontSize: '12px' }}>Search & Display</Text>
                                        </div>
                                        {formData.adPlatforms.includes('google') && <CheckCircleFilled style={{ color: '#084b8a' }} />}
                                    </div>
                                </Col>
                                <Col span={12}>
                                    <div
                                        style={platformCardStyle(formData.adPlatforms.includes('meta'))}
                                        onClick={() => {
                                            const platforms = formData.adPlatforms.includes('meta')
                                                ? formData.adPlatforms.filter(p => p !== 'meta')
                                                : [...formData.adPlatforms, 'meta'];
                                            setFormData({ ...formData, adPlatforms: platforms });
                                        }}
                                    >
                                        <FacebookOutlined style={{ fontSize: '24px', color: '#0668E1' }} />
                                        <div style={{ flex: 1 }}>
                                            <Text strong style={{ display: 'block' }}>Meta Ads</Text>
                                            <Text type="secondary" style={{ fontSize: '12px' }}>Facebook & Insta</Text>
                                        </div>
                                        {formData.adPlatforms.includes('meta') && <CheckCircleFilled style={{ color: '#084b8a' }} />}
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </Card>

                    {/* Landing Page Card */}
                    <Card
                        title={<Space><GlobalOutlined /> <Text strong>Landing Page Configuration</Text></Space>}
                        style={cardStyle}
                        styles={{ header: { borderBottom: '1px solid #f0f0f0', background: '#fafafa' } }}
                    >
                        <div style={{ marginBottom: '24px' }}>
                            <label style={labelStyle}>Source Selection</label>
                            <Radio.Group
                                value={formData.landingPageSource}
                                onChange={e => setFormData({ ...formData, landingPageSource: e.target.value })}
                                optionType="button"
                                buttonStyle="solid"
                                style={{ width: '100%' }}
                            >
                                <Radio.Button value="internal" style={{ width: '50%', textAlign: 'center', height: '40px', lineHeight: '38px' }}>
                                    TrackBridge Builder
                                </Radio.Button>
                                <Radio.Button value="external" style={{ width: '50%', textAlign: 'center', height: '40px', lineHeight: '38px' }}>
                                    External URL
                                </Radio.Button>
                            </Radio.Group>
                        </div>

                        {formData.landingPageSource === 'internal' ? (
                            <div>
                                <label style={labelStyle}>Select Template</label>
                                <Select
                                    placeholder="Choose from your saved landing pages..."
                                    style={{ width: '100%', height: '44px', borderRadius: '8px' }}
                                    size="large"
                                    value={formData.landingPageTemplateId || undefined}
                                    onChange={value => setFormData({ ...formData, landingPageTemplateId: value })}
                                >
                                    {templates.map(t => (
                                        <Option key={t._id} value={t._id}>
                                            <Space>
                                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#52c41a' }} />
                                                {t.name}
                                            </Space>
                                        </Option>
                                    ))}
                                </Select>
                                {templates.length === 0 && (
                                    <Text type="warning" style={{ fontSize: '12px', marginTop: '8px', display: 'block' }}>
                                        No templates found. Go to Landing Page Builder to create one first.
                                    </Text>
                                )}
                                </div>
                        ) : (
                            <div>
                                <label style={labelStyle}>Destination URL</label>
                                <Input
                                    placeholder="https://your-page.com"
                                    style={{ height: '44px', borderRadius: '8px' }}
                                    autoComplete="url"
                                />
                                <Text type="secondary" style={{ fontSize: '12px' }}>
                                    Traffic will be redirected to this URL after tracking.
                                </Text>
                            </div>
                        )}

                        <Divider style={{ margin: '24px 0' }} />

                        <div>
                            <label style={labelStyle}>Domain Settings</label>
                            <Radio.Group
                                value={domainType}
                                onChange={e => {
                                    setDomainType(e.target.value);
                                    setFormData({ ...formData, customDomain: '' });
                                }}
                                style={{ marginBottom: '16px', display: 'block' }}
                            >
                                <Space direction="vertical" style={{ width: '100%' }}>
                                    <Radio value="subdomain">
                                        <Text strong>Branded Subdomain</Text>
                                        <Tag color="green" style={{ marginLeft: '8px' }}>Automatic SSL</Tag>
                                        <div style={{ paddingLeft: '24px', marginTop: '8px' }}>
                                            <Input
                                                placeholder="my-project"
                                                addonAfter=".track2gram.com"
                                                style={{ width: '300px' }}
                                                value={domainType === 'subdomain' && formData.customDomain?.endsWith('.track2gram.com') ? formData.customDomain.replace('.track2gram.com', '') : ''}
                                                onChange={e => {
                                                    const val = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
                                                    setFormData({ ...formData, customDomain: val ? `${val}.track2gram.com` : '' });
                                                }}
                                                disabled={domainType !== 'subdomain'}
                                            />
                                            <div style={{ marginTop: '4px' }}>
                                                <Text type="secondary" style={{ fontSize: '12px' }}>
                                                    Instantly live. No DNS setup required.
                                                </Text>
                                            </div>
                                        </div>
                                    </Radio>

                                    <Divider style={{ margin: '12px 0' }} />

                                    <Radio value="custom">
                                        <Text strong>External Custom Domain</Text>
                                        <div style={{ paddingLeft: '24px', marginTop: '8px' }}>
                                            <Input
                                                placeholder="e.g. landing.mybrand.com"
                                                style={{ width: '300px', borderRadius: '8px' }}
                                                value={domainType === 'custom' ? formData.customDomain : ''}
                                                onChange={e => setFormData({ ...formData, customDomain: e.target.value.toLowerCase().trim() })}
                                                disabled={domainType !== 'custom'}
                                            />
                                            <div style={{ marginTop: '4px' }}>
                                                <Text type="secondary" style={{ fontSize: '12px' }}>
                                                    Requires pointing your A Record to <b>72.62.241.45</b>
                                                </Text>
                                            </div>
                                        </div>
                                    </Radio>
                                </Space>
                            </Radio.Group>
                        </div>
                    </Card>

                    {/* Bottom Actions */}
                    <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end', marginTop: '32px', alignItems: 'center' }}>
                        {id && id !== 'new' && (
                            <Button
                                danger
                                type="text"
                                onClick={handleDelete}
                                style={{ height: '48px', borderRadius: '8px', padding: '0 24px', marginRight: 'auto', fontWeight: 500 }}
                            >
                                Delete Project
                            </Button>
                        )}
                        <Button
                            onClick={() => navigate('/projects')}
                            style={{ height: '48px', borderRadius: '8px', padding: '0 32px' }}
                        >
                            Discard
                        </Button>
                        <Button
                            type="primary"
                            icon={<RocketOutlined />}
                            onClick={handleSave}
                            loading={loading}
                            style={{
                                height: '48px',
                                borderRadius: '8px',
                                padding: '0 48px',
                                fontWeight: 600,
                                fontSize: '16px',
                                boxShadow: '0 4px 12px rgba(8, 75, 138, 0.3)'
                            }}
                        >
                            {id ? 'Update Project' : 'Launch Project'}
                        </Button>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default ProjectConfiguration;
