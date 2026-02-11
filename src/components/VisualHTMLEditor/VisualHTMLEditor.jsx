import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button, Upload, message as antMessage, Space, Modal } from 'antd';
import { EditOutlined, PictureOutlined } from '@ant-design/icons';

const VisualHTMLEditor = ({ html, onHtmlChange }) => {
    const iframeRef = useRef(null);
    const [editMode, setEditMode] = useState(false);
    const [selectedElement, setSelectedElement] = useState(null);
    const [showImageUpload, setShowImageUpload] = useState(false);

    const updateHTML = useCallback(() => {
        if (iframeRef.current) {
            const iframe = iframeRef.current;
            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
            const updatedHTML = iframeDoc.documentElement.outerHTML;
            onHtmlChange(updatedHTML);
        }
    }, [onHtmlChange]);

    const makeTextEditable = useCallback((element) => {
        element.setAttribute('contenteditable', 'true');
        element.setAttribute('data-editing', 'true');
        element.focus();

        const saveEdit = () => {
            element.setAttribute('contenteditable', 'false');
            element.removeAttribute('data-editing');
            updateHTML();
        };

        element.addEventListener('blur', saveEdit, { once: true });
        element.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                saveEdit();
            }
        });
    }, [updateHTML]);

    const handleImageClick = useCallback((img) => {
        setSelectedElement(img);
        setShowImageUpload(true);
    }, []);

    const enableEditing = useCallback((doc) => {
        // Add visual editing styles
        const style = doc.createElement('style');
        style.id = 'visual-editor-styles';
        style.textContent = `
            [data-editable="true"] {
                outline: 2px dashed #3B82F6 !important;
                outline-offset: 2px;
                cursor: pointer;
                position: relative;
                transition: outline 0.2s;
            }
            [data-editable="true"]:hover {
                outline: 2px solid #3B82F6 !important;
                background: rgba(59, 130, 246, 0.05);
            }
            [data-editing="true"] {
                outline: 3px solid #10B981 !important;
                background: rgba(16, 185, 129, 0.1);
            }
        `;
        doc.head.appendChild(style);

        // Make text elements editable
        const textElements = doc.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, a, button, div');
        textElements.forEach(el => {
            const hasText = el.textContent.trim().length > 0;
            const hasOnlyImages = el.children.length > 0 && Array.from(el.children).every(child => child.tagName === 'IMG');

            if (hasText && !hasOnlyImages) {
                el.setAttribute('data-editable', 'true');
                el.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    makeTextEditable(el);
                });
            }
        });

        // Make images clickable
        const images = doc.querySelectorAll('img');
        images.forEach(img => {
            img.setAttribute('data-editable', 'true');
            img.style.cursor = 'pointer';
            img.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                handleImageClick(img);
            });
        });
    }, [makeTextEditable, handleImageClick]);

    const disableEditing = useCallback((doc) => {
        // Remove editing styles
        const styleElement = doc.getElementById('visual-editor-styles');
        if (styleElement) {
            styleElement.remove();
        }

        // Remove all data-editable attributes
        const editableElements = doc.querySelectorAll('[data-editable="true"]');
        editableElements.forEach(el => {
            el.removeAttribute('data-editable');
            el.style.cursor = '';
        });
    }, []);

    useEffect(() => {
        if (iframeRef.current && html) {
            const iframe = iframeRef.current;
            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

            iframeDoc.open();
            iframeDoc.write(html);
            iframeDoc.close();

            if (editMode) {
                enableEditing(iframeDoc);
            } else {
                disableEditing(iframeDoc);
            }
        }
    }, [html, editMode, enableEditing, disableEditing]);

    const handleImageUpload = (file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            if (selectedElement) {
                selectedElement.src = e.target.result;
                updateHTML();
                setShowImageUpload(false);
                antMessage.success('Image updated!');
            }
        };
        reader.readAsDataURL(file);
        return false;
    };

    const toggleEditMode = () => {
        const newEditMode = !editMode;
        setEditMode(newEditMode);

        if (!newEditMode) {
            // Exiting edit mode - save and clean up
            updateHTML();
            if (iframeRef.current) {
                const iframe = iframeRef.current;
                const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                disableEditing(iframeDoc);
            }
        }
    };

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{
                padding: '12px 16px',
                background: '#f5f5f5',
                borderBottom: '1px solid #e0e0e0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <Space>
                    <Button
                        type={editMode ? 'primary' : 'default'}
                        icon={<EditOutlined />}
                        onClick={toggleEditMode}
                    >
                        {editMode ? 'Exit Edit Mode' : 'Enable Editing'}
                    </Button>
                    {editMode && (
                        <div style={{
                            padding: '4px 12px',
                            background: '#e6f7ff',
                            borderRadius: '4px',
                            fontSize: '13px',
                            color: '#1890ff'
                        }}>
                            💡 Click text to edit, click images to replace
                        </div>
                    )}
                </Space>
            </div>

            <div style={{ flex: 1, overflow: 'auto', background: '#fff' }}>
                <iframe
                    ref={iframeRef}
                    title="Visual Editor"
                    style={{
                        width: '100%',
                        height: '100%',
                        border: 'none',
                        background: '#fff'
                    }}
                    sandbox="allow-same-origin allow-scripts"
                />
            </div>

            <Modal
                title="Replace Image"
                open={showImageUpload}
                onCancel={() => setShowImageUpload(false)}
                footer={null}
            >
                <Upload.Dragger
                    accept="image/*"
                    beforeUpload={handleImageUpload}
                    showUploadList={false}
                >
                    <p className="ant-upload-drag-icon">
                        <PictureOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
                    </p>
                    <p className="ant-upload-text">Click or drag image to upload</p>
                    <p className="ant-upload-hint">JPG, PNG, GIF, WebP</p>
                </Upload.Dragger>
            </Modal>
        </div>
    );
};

export default VisualHTMLEditor;
