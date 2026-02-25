import React, { useState, useEffect } from 'react';
import { Layout, Button, Input, Typography, Upload, App, Space } from 'antd';
import {
    EditOutlined,
    PictureOutlined,
    SearchOutlined,
    LinkOutlined
} from '@ant-design/icons';

const { TextArea } = Input;
const { Title, Text } = Typography;

const LandingBuilder = ({ onHtmlChange, initialBlocks = [] }) => {
    const { message } = App.useApp();
    const [blocks, setBlocks] = useState(initialBlocks);
    const [activeCategory, setActiveCategory] = useState('texts');
    const [searchQuery, setSearchQuery] = useState('');

    // We rely on the parent component (LandingPageEditor) to force a re-render
    // by changing the 'key' prop when loading new data.

    useEffect(() => {
        if (onHtmlChange) {
            onHtmlChange(null, blocks);
        }
    }, [blocks, onHtmlChange]);

    const compressImage = (file) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 1200;
                    const MAX_HEIGHT = 1200;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    resolve(canvas.toDataURL('image/jpeg', 0.7));
                };
            };
        });
    };

    const handleInputChange = (blockId, field, value) => {
        setBlocks(prevBlocks => prevBlocks.map(b =>
            b.id === blockId ? { ...b, content: { ...b.content, [field]: value } } : b
        ));
    };

    const handleImageUpload = async (blockId, file) => {
        try {
            const compressedBase64 = await compressImage(file);
            handleInputChange(blockId, 'src', compressedBase64);
            message.success('Image optimized and uploaded');
        } catch (error) {
            console.error('Compression failed:', error);
            message.error('Failed to process image');
        }
        return false;
    };

    const renderBlock = (block) => {
        return (
            <div key={block.id} style={{
                marginBottom: '16px',
                padding: '16px',
                background: '#2b2b3d',
                borderRadius: '12px',
                border: '1px solid #3d3d52',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <Space size="middle">
                        <Text style={{
                            color: '#084b8a',
                            fontWeight: 800,
                            fontSize: '14px',
                            letterSpacing: '0.5px'
                        }}>
                            {block.tagName || (block.type === 'text' ? 'TEXT' : block.type === 'image' ? 'IMG' : 'BTN')}
                        </Text>
                    </Space>
                </div>

                {block.type === 'image' ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ width: '100%', height: '120px', background: '#161625', borderRadius: '8px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {block.content.src ? (
                                <img src={block.content.src} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                            ) : (
                                <PictureOutlined style={{ fontSize: '32px', color: '#3d3d52' }} />
                            )}
                        </div>
                        <Input
                            value={block.content.src || ''}
                            onChange={(e) => handleInputChange(block.id, 'src', e.target.value)}
                            placeholder="Image URL"
                            style={{ background: '#161625', border: '1px solid #3d3d52', color: '#fff' }}
                        />
                        <Upload
                            beforeUpload={(file) => handleImageUpload(block.id, file)}
                            showUploadList={false}
                            accept="image/*"
                        >
                            <Button icon={<PictureOutlined />} style={{ width: '100%', background: '#084b8a', border: 'none', color: '#fff', fontWeight: 600 }}>Replace Image</Button>
                        </Upload>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {block.content.title !== undefined && (
                            <div>
                                <Text style={{ color: '#8c8c9e', fontSize: '11px', marginBottom: '4px', display: 'block' }}>NAME / TITLE</Text>
                                <TextArea
                                    value={block.content.title || ''}
                                    onChange={(e) => handleInputChange(block.id, 'title', e.target.value)}
                                    autoSize={{ minRows: 1, maxRows: 3 }}
                                    placeholder="Enter name or title..."
                                    style={{ background: '#161625', border: '1px solid #3d3d52', color: '#fff', borderRadius: '8px' }}
                                />
                            </div>
                        )}
                        {block.content.paragraph !== undefined && (
                            <div>
                                <Text style={{ color: '#8c8c9e', fontSize: '11px', marginBottom: '4px', display: 'block' }}></Text>
                                <TextArea
                                    value={block.content.paragraph || ''}
                                    onChange={(e) => handleInputChange(block.id, 'paragraph', e.target.value)}
                                    autoSize={{ minRows: 1, maxRows: 4 }}
                                    placeholder="Enter meta or paragraph..."
                                    style={{ background: '#161625', border: '1px solid #3d3d52', color: '#fff', borderRadius: '8px' }}
                                />
                            </div>
                        )}
                        {block.content.description !== undefined && (
                            <div>
                                <Text style={{ color: '#8c8c9e', fontSize: '11px', marginBottom: '4px', display: 'block' }}>DESCRIPTION</Text>
                                <TextArea
                                    value={block.content.description || ''}
                                    onChange={(e) => handleInputChange(block.id, 'description', e.target.value)}
                                    autoSize={{ minRows: 2, maxRows: 8 }}
                                    placeholder="Enter description..."
                                    style={{ background: '#161625', border: '1px solid #3d3d52', color: '#fff', borderRadius: '8px' }}
                                />
                            </div>
                        )}
                        {block.type === 'subscribe' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <div>
                                    <Text style={{ color: '#8c8c9e', fontSize: '11px', marginBottom: '4px', display: 'block' }}>BUTTON TEXT</Text>
                                    <Input
                                        value={block.content.buttonText || ''}
                                        onChange={(e) => handleInputChange(block.id, 'buttonText', e.target.value)}
                                        placeholder="Button Text"
                                        style={{ background: '#161625', border: '1px solid #3d3d52', color: '#fff' }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div style={{
            padding: '0',
            height: '100%',
            overflowY: 'auto',
            background: '#161625',
            color: '#fff'
        }}>
            <div style={{
                padding: '24px',
                background: '#1e1e2d',
                borderBottom: '1px solid #2b2b3d',
                position: 'sticky',
                top: 0,
                zIndex: 10
            }}>
                <div style={{ marginBottom: '20px' }}>
                    <Title level={4} style={{ color: '#084b8a', margin: 0, fontSize: '20px', fontWeight: 800 }}>
                        <EditOutlined style={{ marginRight: '8px' }} /> Visual Editor
                    </Title>
                </div>

                <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
                    <Button
                        onClick={() => setActiveCategory('texts')}
                        style={{
                            flex: 1,
                            background: activeCategory === 'texts' ? '#084b8a' : '#2b2b3d',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '6px',
                            height: '36px',
                            fontWeight: activeCategory === 'texts' ? 700 : 400
                        }}
                    >
                        Texts
                    </Button>
                    <Button
                        onClick={() => setActiveCategory('images')}
                        style={{
                            flex: 1,
                            background: activeCategory === 'images' ? '#084b8a' : '#2b2b3d',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '6px',
                            height: '36px',
                            fontWeight: activeCategory === 'images' ? 700 : 400
                        }}
                    >
                        Images
                    </Button>
                    <Button
                        onClick={() => setActiveCategory('links')}
                        style={{
                            flex: 1,
                            background: activeCategory === 'links' ? '#084b8a' : '#2b2b3d',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '6px',
                            height: '36px',
                            fontWeight: activeCategory === 'links' ? 700 : 400
                        }}
                    >
                        Links
                    </Button>
                </div>

                <Input
                    prefix={<SearchOutlined style={{ color: '#6a6a85' }} />}
                    placeholder="Global search..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    style={{
                        background: '#161625',
                        border: '1px solid #2b2b3d',
                        color: '#fff',
                        height: '40px',
                        borderRadius: '8px'
                    }}
                />
            </div>

            <div style={{ padding: '24px' }}>
                {blocks.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px 20px', color: '#6a6a85' }}>
                        <Text type="secondary" style={{ color: '#6a6a85' }}>No components found for editing.</Text>
                    </div>
                ) : (
                    blocks
                        .filter(b => {
                            if (searchQuery) {
                                const content = JSON.stringify(b.content || {}).toLowerCase();
                                const tagName = (b.tagName || '').toLowerCase();
                                const className = (b.className || '').toLowerCase();
                                const query = searchQuery.toLowerCase();
                                return content.includes(query) || tagName.includes(query) || className.includes(query);
                            }
                            if (activeCategory === 'texts' && b.type !== 'text') return false;
                            if (activeCategory === 'images' && b.type !== 'image') return false;
                            if (activeCategory === 'links' && b.type !== 'subscribe') return false;
                            return true;
                        })
                        .map((block) => renderBlock(block))
                )}
            </div>
        </div>
    );
};

export default LandingBuilder;
