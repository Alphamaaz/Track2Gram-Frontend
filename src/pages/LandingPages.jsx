import React, { useState } from 'react';
import { Typography, Space, Button, Radio, Input, Breadcrumb, message } from 'antd';
import {
    CopyOutlined,
    DownloadOutlined,
    ShareAltOutlined,
    LeftOutlined,
    SaveOutlined
} from '@ant-design/icons';
import Editor from '@monaco-editor/react';
import LandingBuilder from '../components/LandingBuilder/LandingBuilder';

const { Title, Text } = Typography;

const LandingPages = () => {
    const [activeTab, setActiveTab] = useState('visual');
    const [previewDevice, setPreviewDevice] = useState('desktop');
    const [htmlCode, setHtmlCode] = useState(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Landing Page</title>
    <style>
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; 
            line-height: 1.6;
            margin: 0;
            padding: 0;
            color: #333;
        }
        .container { 
            max-width: 960px; 
            margin: 0 auto; 
            padding: 40px 20px; 
            text-align: center;
        }
        h1 { 
            font-size: 2.5rem; 
            margin-bottom: 20px; 
            color: #1a1a1a;
        }
        p { 
            font-size: 1.1rem; 
            color: #666; 
            margin-bottom: 30px;
        }
        .cta-button {
            display: inline-block;
            background-color: #3B82F6;
            color: white;
            padding: 12px 32px;
            border-radius: 6px;
            text-decoration: none;
            font-weight: 600;
            transition: background-color 0.2s;
        }
        .cta-button:hover {
            background-color: #2563EB;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Welcome to Your New Landing Page</h1>
        <p>This is a starter template. You can edit this HTML directly to build your custom landing page.</p>
        <a href="#" class="cta-button">Get Started</a>
    </div>
</body>
</html>`);

    const renderVisualTab = () => (
        <div style={{ height: 'calc(100vh - 200px)', minHeight: '600px', background: '#fff', borderRadius: '12px', overflow: 'hidden' }}>
            <LandingBuilder onHtmlChange={setHtmlCode} />
        </div>
    );

    const renderCodeTab = () => (
        <div style={{ padding: '24px 16px', height: '100%' }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Title level={4} style={{ margin: 0 }}>Code Editor</Title>
                    <div style={{
                        background: '#e6f7ff',
                        color: '#1890ff',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        border: '1px solid #91d5ff'
                    }}>
                        HTML Mode
                    </div>
                </div>
                <Space>
                    <Button icon={<CopyOutlined />} onClick={() => { navigator.clipboard.writeText(htmlCode) }}>Copy Code</Button>
                    <Button icon={<LeftOutlined />} onClick={() => setActiveTab('visual')}>
                        Back to Visual
                    </Button>
                </Space>
            </div>

            <div style={{ height: 'calc(100vh - 300px)', minHeight: '600px', border: '1px solid #434343', borderRadius: '8px', overflow: 'hidden' }}>
                <Editor
                    height="100%"
                    defaultLanguage="html"
                    theme="vs-dark"
                    value={htmlCode}
                    onChange={(value) => setHtmlCode(value)}
                    options={{
                        minimap: { enabled: true },
                        fontSize: 14,
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                        wordWrap: 'on',
                        padding: { top: 16, bottom: 16 }
                    }}
                />
            </div>

            <div style={{ marginTop: '16px' }}>
                <div style={{
                    padding: '8px 12px',
                    background: '#f6ffed',
                    border: '1px solid #b7eb8f',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#52c41a' }}></div>
                    <Text type="success" style={{ fontSize: '13px' }}>Code is ready for preview.</Text>
                </div>
            </div>
        </div>
    );

    const renderPreviewTab = () => (
        <div style={{ padding: '24px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '12px',
                marginBottom: '24px',
                flexWrap: 'wrap'
            }}>
                <Button type="primary" icon={<DownloadOutlined />} style={{ borderRadius: '6px' }}>Download Landing page</Button>
                <Button icon={<ShareAltOutlined />} style={{ borderRadius: '6px' }}>Share Preview Link</Button>
            </div>

            <div style={{ background: '#f0f2f5', padding: '4px', borderRadius: '8px', marginBottom: '24px', overflowX: 'auto', maxWidth: '100%' }}>
                <Radio.Group
                    value={previewDevice}
                    onChange={(e) => setPreviewDevice(e.target.value)}
                    buttonStyle="solid"
                    style={{ display: 'flex', flexWrap: 'nowrap' }}
                >
                    <Radio.Button value="desktop" style={{ width: '150px', textAlign: 'center', borderRadius: '6px' }}>Desktop</Radio.Button>
                    <Radio.Button value="mobile" style={{ width: '150px', textAlign: 'center', borderRadius: '6px' }}>Mobile</Radio.Button>
                </Radio.Group>
            </div>

            <div style={{ width: '100%', maxWidth: '600px', marginBottom: '24px' }}>
                <Input
                    prefix={<Text type="secondary" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '150px' }}>http://www.landingpage.com</Text>}
                    suffix={<CopyOutlined style={{ color: 'rgba(0,0,0,0.45)' }} />}
                    readOnly
                    style={{ borderRadius: '8px' }}
                />
            </div>

            <div style={{
                width: previewDevice === 'desktop' ? '100%' : '375px',
                maxWidth: previewDevice === 'desktop' ? '1200px' : '375px',
                height: '600px',
                background: '#fff',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                borderRadius: '8px',
                overflow: 'hidden',
                transition: 'width 0.3s ease',
                border: '1px solid #f0f0f0'
            }}>
                <iframe
                    title="Landing Page Preview"
                    srcDoc={htmlCode}
                    style={{
                        width: '100%',
                        height: '100%',
                        border: 'none',
                        background: '#fff'
                    }}
                    sandbox="allow-scripts"
                />
            </div>
        </div>
    );

    return (
        <div style={{ padding: '16px 8px', maxWidth: '1400px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', padding: '0 16px' }}>
                <Space direction="vertical" size={0}>
                    <Breadcrumb
                        items={[
                            { title: 'Dashboard' },
                            { title: 'Landing Pages' }
                        ]}
                    />
                    <Title level={2} style={{ margin: '8px 0 0 0', fontSize: 'clamp(1.5rem, 5vw, 2rem)' }}>Landing Page Builder</Title>
                </Space>
                <Button
                    type="primary"
                    size="large"
                    icon={<SaveOutlined />}
                    onClick={() => message.success('Landing page saved successfully!')}
                    style={{ height: '48px', padding: '0 32px', borderRadius: '8px', fontWeight: 'bold' }}
                >
                    Save Page
                </Button>
            </div>

            <div style={{ marginBottom: '24px', padding: '0 16px', overflowX: 'auto', whiteSpace: 'nowrap' }}>
                <Space size="large">
                    <span
                        onClick={() => setActiveTab('visual')}
                        style={{
                            cursor: 'pointer',
                            fontSize: '18px',
                            fontWeight: activeTab === 'visual' ? '600' : '400',
                            color: activeTab === 'visual' ? '#000' : '#8c8c8c',
                            paddingBottom: '4px',
                            borderBottom: activeTab === 'visual' ? '2px solid #3B82F6' : 'none'
                        }}
                    >
                        Visual
                    </span>
                    <span style={{ color: '#d9d9d9', fontSize: '18px' }}>/</span>
                    <span
                        onClick={() => setActiveTab('code')}
                        style={{
                            cursor: 'pointer',
                            fontSize: '18px',
                            fontWeight: activeTab === 'code' ? '600' : '400',
                            color: activeTab === 'code' ? '#000' : '#8c8c8c',
                            paddingBottom: '4px',
                            borderBottom: activeTab === 'code' ? '2px solid #3B82F6' : 'none'
                        }}
                    >
                        Code
                    </span>
                    <span style={{ color: '#d9d9d9', fontSize: '18px' }}>/</span>
                    <span
                        onClick={() => setActiveTab('preview')}
                        style={{
                            cursor: 'pointer',
                            fontSize: '18px',
                            fontWeight: activeTab === 'preview' ? '600' : '400',
                            color: activeTab === 'preview' ? '#000' : '#8c8c8c',
                            paddingBottom: '4px',
                            borderBottom: activeTab === 'preview' ? '2px solid #3B82F6' : 'none'
                        }}
                    >
                        Preview
                    </span>
                </Space>
            </div>

            <div style={{ background: '#fff', borderRadius: '12px', minHeight: '600px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                {activeTab === 'visual' && renderVisualTab()}
                {activeTab === 'code' && renderCodeTab()}
                {activeTab === 'preview' && renderPreviewTab()}
            </div>
        </div>
    );
};

export default LandingPages;
