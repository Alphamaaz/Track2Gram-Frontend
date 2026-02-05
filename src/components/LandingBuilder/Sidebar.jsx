import React from 'react';
import { Button, Typography, Space } from 'antd';
import { FontSizeOutlined, PictureOutlined, SendOutlined, PlusOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;

const Sidebar = ({ onAddBlock }) => {
    return (
        <div style={{ padding: '20px' }}>
            <Title level={5} style={{ marginBottom: '16px' }}>Add Components</Title>
            <Text type="secondary" style={{ display: 'block', marginBottom: '16px', fontSize: '12px' }}>
                Click to add components to your page
            </Text>

            <Space direction="vertical" style={{ width: '100%' }}>
                <Button
                    type="default"
                    icon={<FontSizeOutlined />}
                    onClick={() => onAddBlock('text')}
                    block
                    style={{
                        height: '48px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        borderRadius: '8px',
                        border: '1px solid #d9d9d9'
                    }}
                >
                    <span style={{ marginLeft: '8px' }}>Text Block</span>
                </Button>

                <Button
                    type="default"
                    icon={<PictureOutlined />}
                    onClick={() => onAddBlock('image')}
                    block
                    style={{
                        height: '48px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        borderRadius: '8px',
                        border: '1px solid #d9d9d9'
                    }}
                >
                    <span style={{ marginLeft: '8px' }}>Image</span>
                </Button>

                <Button
                    type="default"
                    icon={<SendOutlined />}
                    onClick={() => onAddBlock('telegram')}
                    block
                    style={{
                        height: '48px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        borderRadius: '8px',
                        border: '1px solid #d9d9d9'
                    }}
                >
                    <span style={{ marginLeft: '8px' }}>Telegram Subscribe</span>
                </Button>
            </Space>

            <div style={{
                marginTop: '24px',
                padding: '12px',
                background: '#f0f8ff',
                borderRadius: '8px',
                border: '1px solid #bae7ff'
            }}>
                <Text type="secondary" style={{ fontSize: '12px' }}>
                    💡 Tip: Click a block on the canvas to edit it. Drag blocks to reorder them.
                </Text>
            </div>
        </div>
    );
};

export default Sidebar;
