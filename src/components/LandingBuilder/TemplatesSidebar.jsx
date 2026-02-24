import React from 'react';
import { Typography, Upload, Button, App, Select, Space } from 'antd';
import {
    LayoutOutlined,
    UploadOutlined,
    CloudUploadOutlined,
    FileImageOutlined
} from '@ant-design/icons';


const { Title, Text } = Typography;

const TemplatesSidebar = ({ onSelectTemplate, onUpload, myPages = [], onSelectPage }) => {


    const handleBeforeUpload = (file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target.result;
            if (onUpload) {
                onUpload(content, file.name);
            } else if (onSelectTemplate) {
                onSelectTemplate(null, content);
            }
        };
        reader.readAsText(file);
        return false; // Prevent automatic upload
    };

    return (
        <div style={{
            width: '100%',
            background: '#084b8a',
            height: '100vh',
            padding: '30px 20px',
            color: '#fff',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px'
        }}>
            <div>
                <Title level={4} style={{ color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '12px', fontSize: '22px', letterSpacing: '1px' }}>
                    <LayoutOutlined style={{ fontSize: '26px' }} /> TEMPLATE
                </Title>
                <div style={{ height: '1px', background: 'rgba(255,255,255,0.2)', marginTop: '16px' }} />
            </div>

            <div>
                <Text style={{ color: '#fff', display: 'block', marginBottom: '12px', fontSize: '16px', fontWeight: 500 }}>Select Template or Page</Text>
                <Select
                    placeholder="-- Choose template --"
                    style={{ width: '100%' }}
                    size="large"
                    onChange={(val) => {
                        if (val.startsWith('page_')) {
                            const pageId = val.replace('page_', '');
                            if (onSelectPage) {
                                onSelectPage(pageId);
                            } else {
                                window.location.href = `/landing-pages/builder/${pageId}`;
                            }
                        }
                    }}
                    options={[
                        {
                            label: 'My Saved Pages',
                            options: myPages.map(p => ({ label: p.name || 'Untitled', value: `page_${p._id}` }))
                        }
                    ]}
                />
            </div>

            <div style={{ marginTop: '0px' }}>
                <Text style={{ color: '#fff', display: 'block', marginBottom: '12px', fontSize: '16px', fontWeight: 500 }}>Upload index.html</Text>
                <Upload
                    showUploadList={false}
                    beforeUpload={handleBeforeUpload}
                >
                    <Button
                        icon={<CloudUploadOutlined style={{ fontSize: '20px' }} />}
                        style={{
                            width: '100%',
                            height: '52px',
                            background: '#ffffff',
                            borderColor: '#ffffff',
                            color: '#084b8a',
                            borderRadius: '10px',
                            fontWeight: 700,
                            fontSize: '18px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '12px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                        }}
                    >
                        Choose File
                    </Button>
                </Upload>
            </div>
        </div>
    );
};

export default TemplatesSidebar;
