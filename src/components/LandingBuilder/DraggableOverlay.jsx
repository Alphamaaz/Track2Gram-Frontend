import React from 'react';
import { Card, Typography, Space } from 'antd';
import { FontSizeOutlined, PictureOutlined, FormOutlined, SendOutlined } from '@ant-design/icons';

const { Text } = Typography;

const DraggableOverlay = ({ id }) => {
    // In a real app we would lookup the item by ID to get name/icon
    // Here we cheat a bit since we know the mapping
    let type = '';
    if (id.includes('text')) type = 'text';
    else if (id.includes('image')) type = 'image';
    else if (id.includes('form')) type = 'form';
    else if (id.includes('telegram')) type = 'telegram';
    else type = 'text'; // Fallback

    const mapping = {
        'text': { name: 'Text Block', icon: <FontSizeOutlined /> },
        'image': { name: 'Image', icon: <PictureOutlined /> },
        'form': { name: 'Form', icon: <FormOutlined /> },
        'telegram': { name: 'Telegram Subscribe', icon: <SendOutlined /> },
    }

    const item = mapping[type];

    return (
        <div style={{
            opacity: 0.8,
            cursor: 'grabbing',
            border: '1px solid #1890ff',
            borderRadius: '8px',
            padding: '12px',
            background: 'white',
            width: '250px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        }}>
            <Space>
                {item?.icon}
                <Text>{item?.name}</Text>
            </Space>
        </div>
    );
};

export default DraggableOverlay;
