import React, { useState, useEffect, useRef } from 'react';
import { Layout, Button, List, Card, Input, Modal, Space, Typography, Upload, message, Radio, Drawer } from 'antd';
import {
    EditOutlined,
    DeleteOutlined,
    ArrowUpOutlined,
    ArrowDownOutlined,
    FontSizeOutlined,
    PictureOutlined,
    SendOutlined,
    UploadOutlined,
    ExclamationCircleOutlined
} from '@ant-design/icons';

const { Sider, Content } = Layout;
const { TextArea } = Input;
const { Title, Text } = Typography;
const { confirm } = Modal;

const LandingBuilder = ({ onHtmlChange }) => {
    const [blocks, setBlocks] = useState(() => {
        const saved = localStorage.getItem('landing-page-blocks');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.error('Failed to parse saved blocks:', e);
                return [];
            }
        }
        return [];
    });
    const [editingBlock, setEditingBlock] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [isMobile, setIsMobile] = useState(false);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [inlineEditing, setInlineEditing] = useState(null); // { blockId, field: 'title' | 'paragraph' }
    const idCounterRef = useRef(blocks && blocks.length > 0 ? Math.max(...blocks.map(b => b.id || 0)) + 1 : 1);
    const inputRef = useRef(null);



    // Check screen size for responsive design
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);



    // Focus input when inline editing starts
    useEffect(() => {
        if (inlineEditing && inputRef.current) {
            inputRef.current.focus();
            // Only select for Input, not TextArea
            if (inputRef.current.select && typeof inputRef.current.select === 'function') {
                inputRef.current.select();
            }
        }
    }, [inlineEditing]);

    const generateHtml = (currentBlocks) => {
        const bodyContent = currentBlocks.map(block => {
            if (block.type === 'text') {
                let html = '<div style="padding: 20px; max-width: 800px; margin: 0 auto;">';
                if (block.content.title) {
                    html += `<h2 style="font-size: 28px; font-weight: 600; margin: 0 0 16px 0; color: #1a1a1a; text-align: ${block.content.align || 'left'};">${block.content.title}</h2>`;
                }
                if (block.content.paragraph) {
                    html += `<p style="font-size: 16px; line-height: 1.6; margin: 0; color: #333; text-align: ${block.content.align || 'left'};">${block.content.paragraph}</p>`;
                }
                html += '</div>';
                return html;
            } else if (block.type === 'image') {
                return `<div style="text-align: center; padding: 20px;">
                    <img src="${block.content.src}" alt="${block.content.alt || 'Image'}" style="max-width: 100%; height: auto; border-radius: 8px;" />
                </div>`;
            } else if (block.type === 'subscribe') {
                return `<div style="display: flex; justify-content: center; padding: 20px;">
                    <div style="padding: 32px; border: 1px solid #e0e0e0; border-radius: 12px; background: #f0f8ff; max-width: 500px; width: 100%; text-align: center;">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#0088cc" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom: 16px;"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                        <h3 style="margin: 0 0 12px 0; color: #333; font-size: 24px;">${block.content.title}</h3>
                        <p style="margin: 0 0 20px 0; color: #666; font-size: 16px;">${block.content.description}</p>
                        <a href="${block.content.link || '#'}" style="background: #0088cc; color: white; text-decoration: none; padding: 12px 32px; border-radius: 6px; font-weight: bold; display: inline-block;">${block.content.buttonText}</a>
                    </div>
                </div>`;
            }
            return '';
        }).join('\n');

        return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Landing Page</title>
  <style>
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background: #f9fafb; }
      .container { background: white; min-height: 100vh; }
      @media (max-width: 768px) {
          h2 { font-size: 22px !important; }
          p { font-size: 14px !important; }
      }
  </style>
</head>
<body>
  <div class="container">
      ${bodyContent}
  </div>
</body>
</html>`;
    };

    // Save to localStorage and generate HTML on every change
    useEffect(() => {
        localStorage.setItem('landing-page-blocks', JSON.stringify(blocks));
        if (onHtmlChange) {
            onHtmlChange(generateHtml(blocks));
        }
    }, [blocks, onHtmlChange]);

    const addBlock = (type) => {
        const newBlock = {
            id: ++idCounterRef.current,
            type,
            content: getDefaultContent(type)
        };
        setBlocks(prev => [...prev, newBlock]);
        message.success(`${type === 'text' ? 'Text Block' : type === 'image' ? 'Image' : 'Subscribe'} added!`);
    };

    const getDefaultContent = (type) => {
        switch (type) {
            case 'text':
                return { title: 'Your Title Here', paragraph: 'Your paragraph text goes here.', align: 'left' };
            case 'image':
                return { src: 'https://placehold.co/600x400?text=Upload+Image', alt: 'Placeholder Image' };
            case 'subscribe':
                return { title: 'Join Our Community', description: 'Subscribe to get the latest updates.', buttonText: 'Subscribe Now', link: '#' };
            default:
                return {};
        }
    };

    const startEdit = (block) => {
        setEditingBlock(block);
        // Create a deep copy to avoid reference issues
        setEditForm(JSON.parse(JSON.stringify(block.content)));
        if (isMobile) {
            setDrawerVisible(true);
        }
    };

    const saveEdit = () => {
        setBlocks(prevBlocks => prevBlocks.map(b =>
            b.id === editingBlock.id ? { ...b, content: { ...editForm } } : b
        ));
        setEditingBlock(null);
        setEditForm({});
        setDrawerVisible(false);
        message.success('Changes saved!');
    };

    const cancelEdit = () => {
        setEditingBlock(null);
        setEditForm({});
        setDrawerVisible(false);
    };

    const deleteBlock = (id) => {
        confirm({
            title: 'Delete Component?',
            icon: <ExclamationCircleOutlined />,
            content: 'Are you sure you want to delete this component?',
            okText: 'Delete',
            okType: 'danger',
            onOk() {
                setBlocks(prevBlocks => prevBlocks.filter(b => b.id !== id));
                if (editingBlock?.id === id) {
                    setEditingBlock(null);
                    setEditForm({});
                    setDrawerVisible(false);
                }
                message.success('Component deleted!');
            }
        });
    };

    const moveBlock = (index, direction) => {
        const newBlocks = [...blocks];
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex >= 0 && newIndex < blocks.length) {
            [newBlocks[index], newBlocks[newIndex]] = [newBlocks[newIndex], newBlocks[index]];
            setBlocks(newBlocks);
        }
    };

    const handleImageUpload = (file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            setEditForm(prev => ({ ...prev, src: e.target.result }));
        };
        reader.readAsDataURL(file);
        return false;
    };

    const handleInputChange = (field, value) => {
        setEditForm(prev => ({ ...prev, [field]: value }));
    };

    // Start inline editing
    const startInlineEdit = (blockId, field) => {
        setInlineEditing({ blockId, field });
    };

    const renderEditPanel = () => {
        if (!editingBlock) return null;

        const content = (
            <div style={{ padding: isMobile ? '16px' : '20px', background: '#fff', height: '100%', overflowY: 'auto' }}>
                <Title level={5} style={{ marginBottom: '20px' }}>
                    Edit {editingBlock.type === 'text' ? 'Text Block' : editingBlock.type === 'image' ? 'Image' : 'Subscribe'}
                </Title>

                {editingBlock.type === 'text' && (
                    <Space direction="vertical" style={{ width: '100%' }} size="middle">
                        <div>
                            <Text strong>Title</Text>
                            <Input
                                placeholder="Enter title"
                                value={editForm.title || ''}
                                onChange={(e) => handleInputChange('title', e.target.value)}
                                style={{ marginTop: '8px' }}
                            />
                        </div>
                        <div>
                            <Text strong>Paragraph</Text>
                            <TextArea
                                placeholder="Enter paragraph text"
                                value={editForm.paragraph || ''}
                                onChange={(e) => handleInputChange('paragraph', e.target.value)}
                                rows={4}
                                style={{ marginTop: '8px' }}
                            />
                        </div>
                        <div>
                            <Text strong>Text Alignment</Text>
                            <Radio.Group
                                value={editForm.align || 'left'}
                                onChange={(e) => handleInputChange('align', e.target.value)}
                                style={{ marginTop: '8px', display: 'block' }}
                            >
                                <Radio.Button value="left">Left</Radio.Button>
                                <Radio.Button value="center">Center</Radio.Button>
                                <Radio.Button value="right">Right</Radio.Button>
                            </Radio.Group>
                        </div>
                    </Space>
                )}

                {editingBlock.type === 'image' && (
                    <Space direction="vertical" style={{ width: '100%' }} size="middle">
                        <div>
                            <Text strong>Image URL</Text>
                            <Input
                                placeholder="https://example.com/image.jpg"
                                value={editForm.src || ''}
                                onChange={(e) => handleInputChange('src', e.target.value)}
                                style={{ marginTop: '8px' }}
                            />
                        </div>
                        <div>
                            <Text strong>Or Upload Image</Text>
                            <Upload
                                beforeUpload={handleImageUpload}
                                showUploadList={false}
                                accept="image/*"
                            >
                                <Button icon={<UploadOutlined />} block style={{ marginTop: '8px' }}>Upload Image</Button>
                            </Upload>
                        </div>
                        <div>
                            <Text strong>Alt Text</Text>
                            <Input
                                placeholder="Image description"
                                value={editForm.alt || ''}
                                onChange={(e) => handleInputChange('alt', e.target.value)}
                                style={{ marginTop: '8px' }}
                            />
                        </div>
                        {editForm.src && (
                            <div style={{ marginTop: '16px' }}>
                                <Text strong>Preview:</Text>
                                <img src={editForm.src} alt="Preview" style={{ width: '100%', marginTop: '8px', borderRadius: '4px' }} />
                            </div>
                        )}
                    </Space>
                )}

                {editingBlock.type === 'subscribe' && (
                    <Space direction="vertical" style={{ width: '100%' }} size="middle">
                        <div>
                            <Text strong>Title</Text>
                            <Input
                                placeholder="Join Our Community"
                                value={editForm.title || ''}
                                onChange={(e) => handleInputChange('title', e.target.value)}
                                style={{ marginTop: '8px' }}
                            />
                        </div>
                        <div>
                            <Text strong>Description</Text>
                            <TextArea
                                placeholder="Subscribe to get updates"
                                value={editForm.description || ''}
                                onChange={(e) => handleInputChange('description', e.target.value)}
                                rows={3}
                                style={{ marginTop: '8px' }}
                            />
                        </div>
                        <div>
                            <Text strong>Button Text</Text>
                            <Input
                                placeholder="Subscribe Now"
                                value={editForm.buttonText || ''}
                                onChange={(e) => handleInputChange('buttonText', e.target.value)}
                                style={{ marginTop: '8px' }}
                            />
                        </div>
                        <div>
                            <Text strong>Link URL</Text>
                            <Input
                                placeholder="https://t.me/yourchannel"
                                value={editForm.link || ''}
                                onChange={(e) => handleInputChange('link', e.target.value)}
                                style={{ marginTop: '8px' }}
                            />
                        </div>
                    </Space>
                )}

                <div style={{ marginTop: '24px', display: 'flex', gap: '8px' }}>
                    <Button type="primary" onClick={saveEdit} block>Save Changes</Button>
                    <Button onClick={cancelEdit} block>Cancel</Button>
                </div>
            </div>
        );

        if (isMobile) {
            return (
                <Drawer
                    title={`Edit ${editingBlock.type === 'text' ? 'Text Block' : editingBlock.type === 'image' ? 'Image' : 'Subscribe'}`}
                    placement="bottom"
                    onClose={cancelEdit}
                    open={drawerVisible}
                    height="80%"
                >
                    {content}
                </Drawer>
            );
        }

        return content;
    };

    const getBlockIcon = (type) => {
        switch (type) {
            case 'text': return <FontSizeOutlined />;
            case 'image': return <PictureOutlined />;
            case 'subscribe': return <SendOutlined />;
            default: return null;
        }
    };

    const getBlockTitle = (block) => {
        if (block.type === 'text') return block.content.title || 'Text Block';
        if (block.type === 'image') return 'Image';
        if (block.type === 'subscribe') return block.content.title || 'Subscribe';
        return 'Component';
    };

    // Render inline editable text
    const renderInlineEditableText = (block, field, isTitle = false) => {
        const isEditing = inlineEditing?.blockId === block.id && inlineEditing?.field === field;
        const value = block.content[field] || '';

        if (isEditing) {
            if (isTitle) {
                return (
                    <Input
                        ref={inputRef}
                        value={value}
                        onChange={(e) => {
                            setBlocks(prevBlocks => prevBlocks.map(b =>
                                b.id === block.id ? { ...b, content: { ...b.content, [field]: e.target.value } } : b
                            ));
                        }}
                        onBlur={() => setInlineEditing(null)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                setInlineEditing(null);
                            } else if (e.key === 'Escape') {
                                setInlineEditing(null);
                            }
                        }}
                        style={{
                            fontSize: isMobile ? '22px' : '28px',
                            fontWeight: '600',
                            border: '2px solid #1890ff',
                            borderRadius: '4px'
                        }}
                    />
                );
            } else {
                return (
                    <TextArea
                        ref={inputRef}
                        value={value}
                        onChange={(e) => {
                            setBlocks(prevBlocks => prevBlocks.map(b =>
                                b.id === block.id ? { ...b, content: { ...b.content, [field]: e.target.value } } : b
                            ));
                        }}
                        onBlur={() => setInlineEditing(null)}
                        onKeyDown={(e) => {
                            if (e.key === 'Escape') {
                                setInlineEditing(null);
                            }
                            // Allow Enter for new lines in textarea
                        }}
                        autoSize
                        style={{
                            fontSize: isMobile ? '14px' : '16px',
                            lineHeight: '1.6',
                            border: '2px solid #1890ff',
                            borderRadius: '4px'
                        }}
                    />
                );
            }
        }

        if (isTitle) {
            return (
                <h2
                    onClick={(e) => {
                        e.stopPropagation();
                        startInlineEdit(block.id, field);
                    }}
                    style={{
                        fontSize: isMobile ? '22px' : '28px',
                        fontWeight: '600',
                        margin: '0 0 16px 0',
                        color: '#1a1a1a',
                        cursor: 'pointer',
                        padding: '8px',
                        borderRadius: '4px',
                        transition: 'background 0.2s',
                        background: 'transparent',
                        minHeight: '20px'
                    }}
                    onMouseEnter={(e) => e.target.style.background = '#f0f0f0'}
                    onMouseLeave={(e) => e.target.style.background = 'transparent'}
                    title="Click to edit"
                >
                    {value || 'Click to add title'}
                </h2>
            );
        } else {
            return (
                <p
                    onClick={(e) => {
                        e.stopPropagation();
                        startInlineEdit(block.id, field);
                    }}
                    style={{
                        fontSize: isMobile ? '14px' : '16px',
                        lineHeight: '1.6',
                        margin: 0,
                        color: '#333',
                        cursor: 'pointer',
                        padding: '8px',
                        borderRadius: '4px',
                        transition: 'background 0.2s',
                        background: 'transparent',
                        minHeight: '20px'
                    }}
                    onMouseEnter={(e) => e.target.style.background = '#f0f0f0'}
                    onMouseLeave={(e) => e.target.style.background = 'transparent'}
                    title="Click to edit"
                >
                    {value || 'Click to add paragraph'}
                </p>
            );
        }
    };

    // Mobile layout
    if (isMobile) {
        return (
            <div style={{ height: '100%', background: '#f5f5f5', overflowY: 'auto' }}>
                <div style={{ padding: '16px', background: '#fff', borderBottom: '1px solid #f0f0f0' }}>
                    <Title level={5} style={{ marginBottom: '12px' }}>Add Components</Title>
                    <Space style={{ width: '100%', marginBottom: '16px' }} direction="vertical">
                        <Button icon={<FontSizeOutlined />} onClick={() => addBlock('text')} block>Text Block</Button>
                        <Button icon={<PictureOutlined />} onClick={() => addBlock('image')} block>Image</Button>
                        <Button icon={<SendOutlined />} onClick={() => addBlock('subscribe')} block>Subscribe</Button>
                    </Space>

                    <Title level={5} style={{ marginBottom: '12px' }}>Components ({blocks.length})</Title>
                    {blocks.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
                            <Text type="secondary">No components yet</Text>
                        </div>
                    ) : (
                        <List
                            dataSource={blocks}
                            renderItem={(block, index) => (
                                <Card size="small" style={{ marginBottom: '8px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                        {getBlockIcon(block.type)}
                                        <Text strong style={{ flex: 1, fontSize: '13px' }}>{getBlockTitle(block)}</Text>
                                    </div>
                                    <Space size="small" wrap>
                                        <Button size="small" icon={<EditOutlined />} onClick={() => startEdit(block)}>Edit</Button>
                                        <Button size="small" icon={<ArrowUpOutlined />} onClick={() => moveBlock(index, 'up')} disabled={index === 0} />
                                        <Button size="small" icon={<ArrowDownOutlined />} onClick={() => moveBlock(index, 'down')} disabled={index === blocks.length - 1} />
                                        <Button size="small" icon={<DeleteOutlined />} onClick={() => deleteBlock(block.id)} danger />
                                    </Space>
                                </Card>
                            )}
                        />
                    )}
                </div>

                <div style={{ padding: '16px' }}>
                    <div style={{ background: '#fff', borderRadius: '8px', minHeight: '400px', padding: '16px' }}>
                        {blocks.length === 0 ? (
                            <div style={{ padding: '40px 20px', textAlign: 'center', color: '#999' }}>
                                <Title level={5} type="secondary">Your landing page is empty</Title>
                                <Text type="secondary">Add components above</Text>
                            </div>
                        ) : (
                            blocks.map(block => (
                                <div key={block.id} style={{ borderBottom: '1px dashed #e0e0e0', marginBottom: '16px', paddingBottom: '16px' }}>
                                    {block.type === 'text' && (
                                        <div style={{ textAlign: block.content.align || 'left' }}>
                                            {renderInlineEditableText(block, 'title', true)}
                                            {renderInlineEditableText(block, 'paragraph', false)}
                                        </div>
                                    )}
                                    {block.type === 'image' && (
                                        <div
                                            style={{ textAlign: 'center', padding: '20px', cursor: 'pointer', transition: 'background 0.2s', borderRadius: '8px' }}
                                            onClick={() => startEdit(block)}
                                            onMouseEnter={(e) => e.currentTarget.style.background = '#f9f9f9'}
                                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                            title="Click to edit image"
                                        >
                                            <img src={block.content.src || 'https://via.placeholder.com/600x300?text=Click+to+Upload+Image'} alt={block.content.alt} style={{ maxWidth: '100%', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }} />
                                            {!block.content.src && <Text type="secondary" style={{ display: 'block', marginTop: '8px' }}>Click to upload image</Text>}
                                        </div>
                                    )}
                                    {block.type === 'subscribe' && (
                                        <div style={{ padding: '20px' }}>
                                            <div style={{ padding: '32px', border: '1px solid #e0e0e0', borderRadius: '12px', background: '#f0f8ff', textAlign: 'center' }}>
                                                <SendOutlined style={{ fontSize: '36px', color: '#0088cc', marginBottom: '12px' }} />
                                                <div style={{ cursor: 'text' }}>
                                                    {renderInlineEditableText(block, 'title', true)}
                                                    {renderInlineEditableText(block, 'description', false)}
                                                </div>
                                                <Button
                                                    type="primary"
                                                    style={{ background: '#0088cc', marginTop: '16px' }}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        startEdit(block);
                                                    }}
                                                >
                                                    {block.content.buttonText || 'Subscribe'}
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {renderEditPanel()}
            </div>
        );
    }

    // Desktop layout
    return (
        <Layout style={{ height: '100%', background: '#fff' }}>
            <Sider width={editingBlock ? 280 : 320} theme="light" style={{ borderRight: '1px solid #f0f0f0', overflowY: 'auto' }}>
                <div style={{ padding: '20px' }}>
                    <Title level={5} style={{ marginBottom: '16px' }}>Add Components</Title>
                    <Space direction="vertical" style={{ width: '100%', marginBottom: '24px' }}>
                        <Button icon={<FontSizeOutlined />} onClick={() => addBlock('text')} block>Text Block</Button>
                        <Button icon={<PictureOutlined />} onClick={() => addBlock('image')} block>Image</Button>
                        <Button icon={<SendOutlined />} onClick={() => addBlock('subscribe')} block>Subscribe</Button>
                    </Space>

                    <Title level={5} style={{ marginBottom: '16px' }}>Components ({blocks.length})</Title>
                    {blocks.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
                            <Text type="secondary">No components yet. Click a button above to add one!</Text>
                        </div>
                    ) : (
                        <List
                            dataSource={blocks}
                            renderItem={(block, index) => (
                                <Card
                                    size="small"
                                    style={{ marginBottom: '8px', background: editingBlock?.id === block.id ? '#e6f7ff' : '#fff' }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        {getBlockIcon(block.type)}
                                        <Text strong style={{ flex: 1, fontSize: '13px' }}>{getBlockTitle(block)}</Text>
                                    </div>
                                    <div style={{ marginTop: '8px', display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                                        <Button size="small" icon={<EditOutlined />} onClick={() => startEdit(block)} type={editingBlock?.id === block.id ? 'primary' : 'default'}>Edit</Button>
                                        <Button size="small" icon={<ArrowUpOutlined />} onClick={() => moveBlock(index, 'up')} disabled={index === 0} />
                                        <Button size="small" icon={<ArrowDownOutlined />} onClick={() => moveBlock(index, 'down')} disabled={index === blocks.length - 1} />
                                        <Button size="small" icon={<DeleteOutlined />} onClick={() => deleteBlock(block.id)} danger />
                                    </div>
                                </Card>
                            )}
                        />
                    )}
                </div>
            </Sider>

            <Content style={{ background: '#f5f5f5', overflowY: 'auto', display: 'flex' }}>
                <div style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
                    <div style={{ background: '#fff', borderRadius: '8px', minHeight: '500px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                        {blocks.length === 0 ? (
                            <div style={{ padding: '60px 20px', textAlign: 'center', color: '#999' }}>
                                <Title level={4} type="secondary">Your landing page is empty</Title>
                                <Text type="secondary">Add components from the left sidebar to build your page</Text>
                            </div>
                        ) : (
                            blocks.map(block => (
                                <div key={block.id} style={{ borderBottom: '1px dashed #e0e0e0' }}>
                                    {block.type === 'text' && (
                                        <div style={{ padding: '20px', textAlign: block.content.align || 'left' }}>
                                            {renderInlineEditableText(block, 'title', true)}
                                            {renderInlineEditableText(block, 'paragraph', false)}
                                        </div>
                                    )}
                                    {block.type === 'image' && (
                                        <div
                                            style={{ padding: '20px', textAlign: 'center', cursor: 'pointer', transition: 'background 0.2s', borderRadius: '8px' }}
                                            onClick={() => startEdit(block)}
                                            onMouseEnter={(e) => e.currentTarget.style.background = '#f9f9f9'}
                                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                            title="Click to edit image"
                                        >
                                            <img src={block.content.src || 'https://via.placeholder.com/600x300?text=Click+to+Upload+Image'} alt={block.content.alt || 'Image'} style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }} />
                                        </div>
                                    )}
                                    {block.type === 'subscribe' && (
                                        <div style={{ padding: '20px', display: 'flex', justifyContent: 'center' }}>
                                            <div style={{ padding: '32px', border: '1px solid #e0e0e0', borderRadius: '12px', background: '#f0f8ff', maxWidth: '500px', width: '100%', textAlign: 'center' }}>
                                                <SendOutlined style={{ fontSize: '48px', color: '#0088cc', marginBottom: '16px' }} />
                                                <div style={{ cursor: 'text' }}>
                                                    {renderInlineEditableText(block, 'title', true)}
                                                    {renderInlineEditableText(block, 'description', false)}
                                                </div>
                                                <Button
                                                    type="primary"
                                                    size="large"
                                                    style={{ background: '#0088cc', borderColor: '#0088cc', marginTop: '20px' }}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        startEdit(block);
                                                    }}
                                                >
                                                    {block.content.buttonText || 'Subscribe'}
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {editingBlock && !isMobile && (
                    <div style={{ width: '320px', background: '#fff', borderLeft: '1px solid #f0f0f0' }}>
                        {renderEditPanel()}
                    </div>
                )}
            </Content>
        </Layout>
    );
};

export default LandingBuilder;
