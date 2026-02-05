import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { DeleteOutlined, HolderOutlined, SendOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Input, Form, Typography, Upload, message } from 'antd';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';

const { TextArea } = Input;
const { Title, Text } = Typography;

const TextComponent = ({ content, onChange, isEditing }) => {
    if (isEditing) {
        return (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <Input
                    placeholder="Enter title (optional)"
                    value={content.title || ''}
                    onChange={(e) => onChange({ title: e.target.value })}
                    style={{
                        fontSize: '20px',
                        fontWeight: '600',
                        border: '1px dashed #d9d9d9'
                    }}
                />
                <TextArea
                    placeholder="Enter paragraph text"
                    value={content.paragraph || content.text || ''}
                    onChange={(e) => onChange({ paragraph: e.target.value })}
                    autoSize={{ minRows: 3 }}
                    style={{
                        resize: 'none',
                        border: '1px dashed #d9d9d9'
                    }}
                />
            </div>
        );
    }
    return (
        <div style={{
            padding: '8px',
            height: '100%',
            overflow: 'hidden'
        }}>
            {content.title && (
                <h2 style={{
                    fontSize: '24px',
                    fontWeight: '600',
                    margin: '0 0 12px 0',
                    color: '#1a1a1a'
                }}>
                    {content.title}
                </h2>
            )}
            {(content.paragraph || content.text) && (
                <p style={{
                    fontSize: '16px',
                    lineHeight: '1.6',
                    margin: 0,
                    color: '#333'
                }}>
                    {content.paragraph || content.text}
                </p>
            )}
        </div>
    );
};

const ImageComponent = ({ content, onChange, isEditing }) => {
    const handleUpload = (info) => {
        if (info.file.status === 'done' || info.file.status === 'error' || info.file.status === 'uploading') {
            // For standard upload behavior we'd check status, but since we prevent default upload we handle "beforeUpload"
            return;
        }
    };

    const beforeUpload = (file) => {
        const isImage = file.type.startsWith('image/');
        if (!isImage) {
            message.error('You can only upload image files!');
            return Upload.LIST_IGNORE;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            onChange({ src: e.target.result });
        };
        reader.readAsDataURL(file);
        return false; // Prevent auto upload
    };

    if (isEditing) {
        return (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Input
                    placeholder="Image URL"
                    value={content.src}
                    onChange={(e) => onChange({ src: e.target.value })}
                    style={{ marginBottom: '8px' }}
                />
                <div style={{ textAlign: 'center', marginBottom: '8px' }}>
                    <Text type="secondary" style={{ fontSize: '12px' }}>- OR -</Text>
                </div>
                <Upload
                    showUploadList={false}
                    beforeUpload={beforeUpload}
                    onChange={handleUpload}
                    maxCount={1}
                >
                    <Button icon={<UploadOutlined />} block>Upload Local Image</Button>
                </Upload>

                <div style={{ flex: 1, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '8px' }}>
                    <img src={content.src} alt={content.alt} style={{ maxWidth: '100%', maxHeight: '100%' }} />
                </div>
            </div>
        )
    }
    return <img src={content.src} alt="Block" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }} />;
};



const TelegramComponent = ({ content, onChange, isEditing }) => {
    if (isEditing) {
        return (
            <div style={{ height: '100%', overflow: 'auto' }}>
                <Input
                    placeholder="Title"
                    value={content.title}
                    onChange={(e) => onChange({ title: e.target.value })}
                    style={{ marginBottom: '8px' }}
                />
                <Input
                    placeholder="Description"
                    value={content.description}
                    onChange={(e) => onChange({ description: e.target.value })}
                    style={{ marginBottom: '8px' }}
                />
                <Input
                    placeholder="Button Text"
                    value={content.buttonText}
                    onChange={(e) => onChange({ buttonText: e.target.value })}
                    style={{ marginBottom: '8px' }}
                />
                <div style={{ textAlign: 'center', padding: '16px', background: '#f0f8ff', borderRadius: '8px', border: '1px solid #bae7ff' }}>
                    <SendOutlined style={{ fontSize: '32px', color: '#0088cc', marginBottom: '8px' }} />
                    <Title level={5} style={{ margin: '0 0 4px 0' }}>{content.title}</Title>
                    <Text type="secondary" style={{ display: 'block', marginBottom: '8px' }}>{content.description}</Text>
                    <Button type="primary" style={{ background: '#0088cc' }}>{content.buttonText}</Button>
                </div>
            </div>
        )
    }
    return (
        <div style={{ textAlign: 'center', padding: '16px', background: '#f0f8ff', borderRadius: '8px', border: '1px solid #bae7ff', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <SendOutlined style={{ fontSize: '32px', color: '#0088cc', marginBottom: '8px' }} />
            <Title level={5} style={{ margin: '0 0 4px 0' }}>{content.title}</Title>
            <Text type="secondary" style={{ display: 'block', marginBottom: '8px' }}>{content.description}</Text>
            <Button type="primary" style={{ background: '#0088cc' }}>{content.buttonText}</Button>
        </div>
    );
};

const SortableBlock = ({ block, isSelected, onSelect, onUpdate, onDelete }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: block.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        border: isSelected ? '2px solid #1890ff' : '1px solid transparent',
        background: '#fff',
        marginBottom: '16px',
        borderRadius: '8px',
        position: 'relative',
        marginTop: '0px',
        // We remove padding from here and put it inside or handle it carefully with resize
        boxShadow: isSelected ? '0 4px 12px rgba(0,0,0,0.1)' : 'none',
        display: 'flex',
        justifyContent: 'center'
    };

    const handleContentChange = (newContent) => {
        onUpdate(block.id, newContent);
    }

    const handleResizeStop = (e, { size }) => {
        onUpdate(block.id, { width: size.width, height: size.height });
    };

    // Default sizes if not set
    const width = block.content.width || 600;
    const height = block.content.height || 150;

    return (
        <div ref={setNodeRef} style={style} {...attributes} onClick={() => onSelect(block.id)}>
            {/* Drag Handle */}
            <div
                {...listeners}
                style={{
                    position: 'absolute',
                    top: '-12px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    cursor: 'grab',
                    color: '#bfbfbf',
                    padding: '4px',
                    background: '#fff',
                    border: '1px solid #eee',
                    borderRadius: '4px',
                    zIndex: 10,
                    display: isSelected ? 'block' : 'none' // Only show handle when selected to reduce clutter? Or always
                }}
            >
                <HolderOutlined />
            </div>

            {/* Visual indicator for drag handle if not selected, or just keep it simple */}
            {!isSelected && <div {...listeners} style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '20px', cursor: 'grab', zIndex: 5 }}></div>}

            {isSelected && (
                <Button
                    type="text"
                    icon={<DeleteOutlined />}
                    danger
                    style={{ position: 'absolute', top: '-12px', right: '-12px', zIndex: 10, background: '#fff', border: '1px solid #eee', borderRadius: '50%' }}
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(block.id);
                    }}
                />
            )}

            <ResizableBox
                width={width}
                height={height}
                axis="both"
                resizeHandles={['se']}
                minConstraints={[100, 50]}
                maxConstraints={[800, 800]}
                onResizeStop={handleResizeStop}
                className={isSelected ? 'active-resizable' : ''}
                style={{
                    position: 'relative',
                    border: isSelected ? '1px dashed #d9d9d9' : 'none',
                    padding: '16px', // Add padding back inside
                }}
            >
                <div style={{ width: '100%', height: '100%' }}>
                    {block.type === 'text' && <TextComponent content={block.content} onChange={handleContentChange} isEditing={isSelected} />}
                    {block.type === 'image' && <ImageComponent content={block.content} onChange={handleContentChange} isEditing={isSelected} />}

                    {block.type === 'telegram' && <TelegramComponent content={block.content} onChange={handleContentChange} isEditing={isSelected} />}
                </div>
            </ResizableBox>
        </div>
    );
};
export default SortableBlock;
