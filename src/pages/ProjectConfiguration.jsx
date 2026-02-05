import React from 'react';
import { Typography, Input, Button, Select, Space, Card, Radio } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;
const { Option } = Select;

const ProjectConfiguration = () => {
    const navigate = useNavigate();

    const sectionStyle = {
        marginBottom: '32px'
    };

    const labelStyle = {
        display: 'block',
        marginBottom: '8px',
        fontWeight: 500,
        color: '#333'
    };

    const inputStyle = {
        height: '48px',
        borderRadius: '8px',
        width: '100%',
        maxWidth: '600px'
    };

    const selectStyle = {
        width: '100%',
        maxWidth: '600px',
        borderRadius: '8px'
    };

    return (
        <div style={{ padding: '0 24px', maxWidth: '1000px' }}>
            <div style={{ marginBottom: 32 }}>
                <Title level={2}>Project Configuration</Title>
            </div>

            {/* Project Identity Section */}
            <div style={sectionStyle}>
                <Title level={5}>Project Identity</Title>
                <div style={{ marginBottom: '16px' }}>
                    <label style={labelStyle}>Project Name</label>
                    <Input placeholder="Enter project name" style={inputStyle} />
                </div>
                <div>
                    <Radio.Group defaultValue="google" buttonStyle="solid">
                        <Radio.Button value="google" style={{ height: '40px', lineHeight: '38px', borderRadius: '8px 0 0 8px' }}>Google Ads</Radio.Button>
                        <Radio.Button value="meta" style={{ height: '40px', lineHeight: '38px', borderRadius: '0 8px 8px 0' }}>Meta Ads</Radio.Button>
                    </Radio.Group>
                </div>
            </div>

            {/* Tracking Setup Section */}
            <div style={sectionStyle}>
                <Title level={5}>Tracking Setup</Title>
                <label style={labelStyle}>Pixel ID or Google Conversion ID</label>
                <Input placeholder="Enter ID" style={inputStyle} />
            </div>

            {/* Event Configuration Section */}
            <div style={sectionStyle}>
                <Title level={5}>Event Configuration</Title>
                <label style={labelStyle}>Conversion Event</label>
                <Select placeholder="Select event" style={selectStyle} size="large">
                    <Option value="purchase">Purchase</Option>
                    <Option value="lead">Lead</Option>
                    <Option value="signup">Sign Up</Option>
                </Select>
            </div>

            {/* Telegram Integration Section */}
            <div style={sectionStyle}>
                <Title level={5}>Telegram Integration</Title>
                <div style={{ marginBottom: '16px' }}>
                    <label style={labelStyle}>Telegram Bot</label>
                    <Select placeholder="Select bot" style={selectStyle} size="large">
                        <Option value="bot1">TrackBridge_Bot</Option>
                    </Select>
                </div>
                <div>
                    <label style={labelStyle}>Telegram Channel</label>
                    <Select placeholder="Select channel" style={selectStyle} size="large">
                        <Option value="chan1">Marketing Leads</Option>
                    </Select>
                </div>
            </div>

            {/* Domain Setup Section */}
            <div style={sectionStyle}>
                <Title level={5}>Domain Setup</Title>
                <label style={labelStyle}>Verified Tracking Domain</label>
                <Select placeholder="Select domain" style={selectStyle} size="large">
                    <Option value="dom1">track.example.com</Option>
                </Select>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '48px', paddingBottom: '48px' }}>
                <Button
                    onClick={() => navigate('/projects')}
                    style={{ height: '40px', borderRadius: '8px', padding: '0 24px' }}
                >
                    Cancel
                </Button>
                <Button
                    type="primary"
                    onClick={() => navigate('/projects')}
                    style={{ height: '40px', borderRadius: '8px', padding: '0 24px' }}
                >
                    Save Project
                </Button>
            </div>
        </div>
    );
};

export default ProjectConfiguration;
