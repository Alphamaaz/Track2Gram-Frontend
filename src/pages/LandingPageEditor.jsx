import React, { useState } from 'react';
import { Typography, Space, Button, Radio, Input, Breadcrumb, App, Layout, Grid } from 'antd';
import {
    CopyOutlined,
    DownloadOutlined,
    ShareAltOutlined,
    LeftOutlined,
    SaveOutlined,
    EyeOutlined,
    CodeOutlined,
    GlobalOutlined,
    LayoutOutlined,
    DeleteOutlined
} from '@ant-design/icons';
import Editor from '@monaco-editor/react';
import { useParams, useNavigate } from 'react-router-dom';
import LandingBuilder from '../components/LandingBuilder/LandingBuilder';
import VisualHTMLEditor from '../components/VisualHTMLEditor/VisualHTMLEditor';
import TemplatesSidebar from '../components/LandingBuilder/TemplatesSidebar';
import landingPageService from '../services/landingPage';

const { Title, Text } = Typography;
const { Header, Content, Sider } = Layout;
const { useBreakpoint } = Grid;

const LandingPageEditor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { message, modal } = App.useApp();
    const screens = useBreakpoint();
    const isMobile = !screens.md;

    const [loading, setLoading] = useState(false);
    const [pageData, setPageData] = useState(null);
    const [activeTab, setActiveTab] = useState('visual');
    const [htmlCode, setHtmlCode] = useState('');
    const [blocks, setBlocks] = useState([]);
    const [savedPages, setSavedPages] = useState([]);

    const handleDelete = () => {
        if (!id) return;
        modal.confirm({
            title: 'Delete this Landing Page?',
            content: 'This action cannot be undone. Are you sure you want to delete this page?',
            okText: 'Yes, Delete',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk: async () => {
                setLoading(true);
                try {
                    const response = await landingPageService.deleteLandingPage(id);
                    if (response.success) {
                        message.success('Landing page deleted successfully');
                        fetchSavedPages();
                        navigate('/landing-pages/builder');
                        setPageData(null);
                        setBlocks([]);
                        setHtmlCode('');
                    }
                } catch (error) {
                    message.error('Failed to delete page');
                    console.error(error);
                } finally {
                    setLoading(false);
                }
            }
        });
    };

    const fetchSavedPages = React.useCallback(async () => {
        try {
            const response = await landingPageService.getLandingPages();
            if (response.success) {
                const uniqueByName = response.data.reduce((acc, current) => {
                    const existing = acc.find(item => item.name === current.name);
                    if (!existing) {
                        acc.push(current);
                    } else if (new Date(current.updatedAt || current.createdAt) > new Date(existing.updatedAt || existing.createdAt)) {
                        const index = acc.indexOf(existing);
                        acc[index] = current;
                    }
                    return acc;
                }, []);
                setSavedPages(uniqueByName);
            }
        } catch (error) {
            console.error('Failed to fetch pages:', error);
        }
    }, []);

    const fetchLandingPage = React.useCallback(async () => {
        if (!id) {
            const initialBlocks = [
                { id: 'img-1', type: 'image', tagName: 'AVATAR', selector: '.avatar', content: { src: '', alt: 'Profile' } },
                { id: 'txt-1', type: 'text', tagName: 'NAME', selector: '.name', content: { title: 'sabreen Ali' } },
                { id: 'txt-2', type: 'text', tagName: 'META', selector: '.meta', content: { paragraph: '820,527 subscribers' } },
                { id: 'txt-3', type: 'text', tagName: 'DESCRIPTION', selector: '.description', content: { paragraph: 'Join our official Telegram channel for verified updates and announcements.' } },
                { id: 'sub-1', type: 'subscribe', tagName: 'BUTTON', selector: '.join-button', content: { buttonText: 'Join Channel', href: '' } }
            ];
            setBlocks(initialBlocks);
            setHtmlCode(generateHtml(initialBlocks));
            setPageData({ name: 'Untitled Page' });
            fetchSavedPages();
            return;
        }
        setLoading(true);
        try {
            const response = await landingPageService.getLandingPage(id);
            if (response.success && response.data) {
                setPageData(response.data);
                setHtmlCode(response.data.html || '');
                if (response.data.config?.blocks) {
                    setBlocks(response.data.config.blocks);
                } else if (response.data.html) {
                    setActiveTab('code');
                }
            }
        } catch (error) {
            console.error('Failed to fetch landing page:', error);
            message.error('Failed to load landing page data');
        } finally {
            setLoading(false);
            fetchSavedPages();
        }
    }, [id, message, fetchSavedPages]);

    React.useEffect(() => {
        fetchLandingPage();
    }, [fetchLandingPage]);

    const handleSave = async () => {
        setLoading(true);
        try {
            const payload = {
                name: pageData?.name || 'landing page',
                html: htmlCode,
                config: { blocks }
            };

            let response;
            if (id) {
                response = await landingPageService.updateLandingPage(id, payload);
            } else {
                response = await landingPageService.createLandingPage(payload);
            }

            if (response.success) {
                message.success('Landing page saved successfully!');
                fetchSavedPages();
                if ((!id || id === 'builder') && response.data?._id) {
                    navigate(`/landing-pages/builder/${response.data._id}`, { replace: true });
                }
            }
        } catch (error) {
            console.error('Failed to save landing page:', error);
            const errorMsg = error.message || error.error || (typeof error === 'string' ? error : 'Failed to save landing page');
            message.error(String(errorMsg));
        } finally {
            setLoading(false);
        }
    };

    const handleHtmlChange = (newHtml, newBlocks) => {
        if (newBlocks) {
            setBlocks(newBlocks);
            const updatedHtml = updateHtmlFromBlocks(htmlCode, newBlocks);
            setHtmlCode(updatedHtml);
        } else if (newHtml) {
            setHtmlCode(newHtml);
        }
    };

    const handleCodeChange = (value) => {
        setHtmlCode(value);
    };

    const handleUploadAndSave = async (htmlContent, fileName = 'Uploaded Page') => {
        setLoading(true);
        try {
            const tempBlocks = parseHtmlToBlocks(htmlContent);
            const payload = {
                name: fileName.replace('.html', ''),
                html: htmlContent,
                config: { blocks: tempBlocks }
            };

            let response;
            if (id) {
                response = await landingPageService.updateLandingPage(id, payload);
            } else {
                response = await landingPageService.createLandingPage(payload);
            }

            if (response.success) {
                message.success(id ? 'Page updated successfully!' : `Page "${payload.name}" saved to library!`);
                fetchSavedPages();
                if (!id && response.data?._id) {
                    navigate(`/landing-pages/builder/${response.data._id}`);
                }
                if (id) {
                    setHtmlCode(htmlContent);
                    setBlocks(tempBlocks);
                    setPageData(prev => ({ ...prev, ...payload }));
                }
            }
        } catch (error) {
            console.error('Failed to auto-save upload:', error);
            message.error('Failed to save uploaded file to database');
        } finally {
            setLoading(false);
        }
    };

    const handleSelectTemplate = (templateBlocks, customHtml = null) => {
        if (customHtml) {
            setHtmlCode(customHtml);
            setBlocks(parseHtmlToBlocks(customHtml));
            setPageData(prev => ({ ...prev, name: 'Uploaded Template' }));
        } else {
            setBlocks(templateBlocks);
            setHtmlCode(generateHtml(templateBlocks));
        }
        message.success(customHtml ? 'Custom template loaded!' : 'Template applied!');
    };

    const handleTabChange = (tab) => {
        if (tab === 'visual' && activeTab === 'code') {
            setBlocks(parseHtmlToBlocks(htmlCode));
        }
        setActiveTab(tab);
    };

    const renderHeader = () => (
        <Header style={{
            background: '#1e1e2d',
            padding: isMobile ? '0 12px' : '0 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: isMobile ? 'auto' : '64px',
            minHeight: '64px',
            borderBottom: 'none',
            flexWrap: 'wrap'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: isMobile ? '8px 0' : 0 }}>
                <Radio.Group
                    value={activeTab}
                    onChange={e => handleTabChange(e.target.value)}
                    buttonStyle="solid"
                    className="custom-mode-toggle"
                >
                    <Radio.Button value="live" style={{
                        background: activeTab === 'live' ? '#084b8a' : '#2b2b3d',
                        borderColor: 'transparent',
                        color: activeTab === 'live' ? '#fff' : '#8c8c9e',
                        width: isMobile ? '80px' : '110px',
                        textAlign: 'center',
                        fontSize: '12px',
                        height: '32px',
                        lineHeight: '30px',
                        borderRadius: '6px 0 0 6px'
                    }}>
                        <EyeOutlined /> {isMobile ? '' : 'Preview'}
                    </Radio.Button>
                    <Radio.Button value="code" style={{
                        background: activeTab === 'code' ? '#084b8a' : '#2b2b3d',
                        borderColor: 'transparent',
                        color: activeTab === 'code' ? '#fff' : '#8c8c9e',
                        width: isMobile ? '70px' : '100px',
                        textAlign: 'center',
                        fontSize: '12px',
                        height: '32px',
                        lineHeight: '30px'
                    }}>
                        <CodeOutlined /> {isMobile ? '' : 'Code'}
                    </Radio.Button>
                    <Radio.Button value="visual" style={{
                        background: activeTab === 'visual' ? '#084b8a' : '#2b2b3d',
                        borderColor: 'transparent',
                        color: activeTab === 'visual' ? '#fff' : '#8c8c9e',
                        width: isMobile ? '80px' : '100px',
                        textAlign: 'center',
                        fontSize: '12px',
                        height: '32px',
                        lineHeight: '30px',
                        borderRadius: '0 6px 6px 0'
                    }}>
                        <LayoutOutlined /> {isMobile ? '' : 'Visual'}
                    </Radio.Button>
                </Radio.Group>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '12px' : '20px', padding: isMobile ? '8px 0' : 0 }}>
                {!isMobile && (
                    <Text style={{ color: '#8c8c9e', fontSize: '13px' }}>
                        {pageData?.name || 'New Landing Page'}
                    </Text>
                )}

                <Space size={isMobile ? "small" : "middle"}>
                    {id && (
                        <Button
                            danger
                            type="text"
                            icon={<DeleteOutlined />}
                            onClick={handleDelete}
                            loading={loading}
                            size={isMobile ? 'small' : 'middle'}
                        >
                            {isMobile ? '' : 'Delete'}
                        </Button>
                    )}
                    <Button
                        type="primary"
                        icon={<SaveOutlined />}
                        onClick={handleSave}
                        loading={loading}
                        style={{
                            background: '#084b8a',
                            borderColor: 'transparent',
                            borderRadius: '4px',
                            fontWeight: 600,
                            padding: isMobile ? '0 12px' : '0 24px',
                            height: '32px',
                            fontSize: '13px',
                            boxShadow: '0 4px 10px rgba(8, 75, 138, 0.2)'
                        }}
                    >
                        Save Page
                    </Button>
                </Space>
            </div>
        </Header>
    );

    const generateHtml = (currentBlocks) => {
        const bodyContent = currentBlocks.map(block => {
            if (block.type === 'image') {
                return `<div class="image-container" style="text-align: center; background: #1a1a2e; padding: 40px 0 20px 0;">
                    <img class="avatar" src="${block.content.src || 'https://via.placeholder.com/100'}" alt="${block.content.alt || 'Profile'}" style="width: 100px; height: 100px; border-radius: 50%; border: 3px solid #3b82f6; object-fit: cover; box-shadow: 0 4px 15px rgba(0,0,0,0.3);">
                </div>`;
            }
            if (block.type === 'text') {
                let tagName = 'div';
                let className = 'text-block';
                if (block.tagName === 'NAME') { tagName = 'h1'; className = 'name'; }
                else if (block.tagName === 'META') { tagName = 'p'; className = 'meta'; }
                else if (block.tagName === 'DESCRIPTION') { tagName = 'p'; className = 'description'; }
                const content = block.content.title || block.content.paragraph || block.content.description || '';
                return `<div style="text-align: center; background: #1a1a2e; padding: 0 40px 20px 40px; color: #fff;">
                    <${tagName} class="${className}" style="color: #fff; margin: 0;">${content.replace(/\n/g, '<br/>')}</${tagName}>
                </div>`;
            }
            if (block.type === 'subscribe') {
                return `<div style="text-align: center; background: #1a1a2e; padding: 0 40px 40px 40px;">
                    <a href="${block.content.href || '#'}" class="join-button" style="display: inline-block; background: #3b82f6; color: #fff; padding: 12px 32px; border-radius: 50px; text-decoration: none; font-weight: 700; box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4); transition: transform 0.2s;">
                        ${block.content.buttonText || 'Join Now'}
                    </a>
                </div>`;
            }
            return '';
        }).join('\n');

        return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Professional Landing Page</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:weight@400;600;700;800&display=swap" rel="stylesheet">
  <style>
      body { font-family: 'Inter', -apple-system, sans-serif; margin: 0; padding: 0; background-color: #16213e; }
      * { box-sizing: border-box; }
      @media (max-width: 768px) {
          h1 { font-size: 28px !important; }
      }
  </style>
</head>
<body>
    <div style="min-height: 100vh;">
        ${bodyContent}
    </div>
</body>
</html>`;
    };

    const updateHtmlFromBlocks = (currentHtml, currentBlocks) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(currentHtml, 'text/html');
        currentBlocks.forEach(block => {
            if (!block.selector) return;
            const el = doc.querySelector(block.selector);
            if (!el) return;
            if (block.className !== undefined) el.className = block.className;
            if (block.type === 'image') {
                if (block.content.src) el.setAttribute('src', block.content.src);
                if (block.content.alt) el.setAttribute('alt', block.content.alt);
            } else if (block.type === 'subscribe') {
                el.textContent = block.content.buttonText;
                if (el.tagName === 'A' && block.content.href) el.setAttribute('href', block.content.href);
            } else if (block.type === 'text') {
                const content = block.content.title !== undefined ? block.content.title :
                    (block.content.paragraph !== undefined ? block.content.paragraph :
                        (block.content.description !== undefined ? block.content.description : ''));
                el.innerHTML = content.replace(/\n/g, '<br/>');
            }
        });
        return '<!DOCTYPE html>\n' + doc.documentElement.outerHTML;
    };

    const parseHtmlToBlocks = (html) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const extractedBlocks = [];
        doc.querySelectorAll('img, .avatar').forEach((img, index) => {
            const src = img.getAttribute('src');
            const selector = img.id ? `#${img.id}` :
                img.className ? `img.${img.className.split(' ')[0]}` :
                    `img:nth-of-type(${index + 1})`;
            extractedBlocks.push({
                id: `img-${Date.now()}-${index}`,
                type: 'image',
                tagName: img.classList.contains('avatar') ? 'AVATAR' : 'IMAGE',
                selector: selector,
                className: img.className || '',
                content: { src: src || '', alt: img.alt || '' }
            });
        });
        doc.querySelectorAll('h1, h2, h3, h4, h5, h6, p, a, button, div, span, .join-button').forEach((el, index) => {
            const text = el.textContent.trim();
            if (!text) return;
            const containsImageOrSvg = el.querySelector('img, svg') !== null;
            const isStructuralOnlyClass = el.classList.contains('image-container') || el.classList.contains('avatar');
            if ((isStructuralOnlyClass || containsImageOrSvg) && !text) return;
            const hasBlockChildren = Array.from(el.children).some(child =>
                ['DIV', 'P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'UL', 'OL', 'LI', 'TABLE', 'FORM', 'BLOCKQUOTE', 'SECTION', 'ARTICLE', 'HEADER', 'FOOTER', 'NAV'].includes(child.tagName)
            );
            const isKnownClass = el.classList.contains('name') || el.classList.contains('meta') || el.classList.contains('profile-description') || el.classList.contains('subscriber-count') || el.classList.contains('description') || el.classList.contains('desc');
            if (hasBlockChildren && !isKnownClass) return;
            const type = (el.tagName === 'A' || el.tagName === 'BUTTON' || el.id === 'telegram_join_btn' || el.classList.contains('join-button')) ? 'subscribe' : 'text';
            let displayTagName = el.tagName;
            if (el.classList.contains('name') || el.tagName === 'H1') displayTagName = 'NAME';
            else if (el.classList.contains('meta') || el.classList.contains('subscriber-count')) displayTagName = 'META';
            else if (el.classList.contains('profile-description') || el.classList.contains('description') || el.classList.contains('desc')) displayTagName = 'DESCRIPTION';
            else if (el.classList.contains('join-button') || el.id === 'telegram_join_btn') displayTagName = 'BUTTON';
            let selector = '';
            if (el.id) selector = `#${el.id}`;
            else if (el.className && typeof el.className === 'string' && el.className.split(' ')[0]) {
                const firstClass = el.className.split(' ')[0];
                selector = `.${firstClass}:nth-of-type(${Array.from(doc.querySelectorAll(`.${firstClass}`)).indexOf(el) + 1})`;
            } else {
                selector = `${el.tagName.toLowerCase()}:nth-of-type(${Array.from(doc.querySelectorAll(el.tagName)).indexOf(el) + 1})`;
            }
            extractedBlocks.push({
                id: `${type}-${Date.now()}-${index}`,
                type: type,
                tagName: displayTagName,
                selector: selector,
                className: el.className || '',
                content: {
                    title: (displayTagName === 'NAME') ? text : undefined,
                    paragraph: (displayTagName === 'META' || (displayTagName !== 'NAME' && displayTagName !== 'DESCRIPTION' && type === 'text')) ? text : undefined,
                    description: (displayTagName === 'DESCRIPTION') ? text : undefined,
                    buttonText: type === 'subscribe' ? text : undefined,
                    href: (el.tagName === 'A' || el.classList.contains('join-button')) ? el.getAttribute('href') : undefined
                }
            });
        });
        if (extractedBlocks.length === 0) {
            extractedBlocks.push({
                id: 'custom-1',
                type: 'text',
                tagName: 'H1',
                content: { title: 'Custom HTML Loaded', paragraph: 'Edit in Code mode for full control.' }
            });
        }
        return extractedBlocks;
    };

    const injectErrorSuppression = (html) => {
        if (!html) return '';
        if (html.includes('Extremely robust console error suppression')) return html;
        const script = `
    <script>
    (function() {
        const originalError = console.error;
        const originalLog = console.log;
        console.error = function() {
            if (arguments[0] && typeof arguments[0] === 'string' && (arguments[0].includes('JSON') || arguments[0].includes('SyntaxError') || arguments[0].includes('Link generation failed'))) return;
            originalError.apply(console, arguments);
        };
        console.log = function() {
            if (arguments[0] && typeof arguments[0] === 'string' && (arguments[0].includes('Link generation failed') || arguments[0].includes('SyntaxError'))) return;
            originalLog.apply(console, arguments);
        };
        window.addEventListener('error', function(e) {
            if (e.message && (e.message.includes('JSON') || e.message.includes('SyntaxError') || e.message.includes('Link generation failed'))) {
                e.preventDefault();
                return true;
            }
        }, true);
    })();
    </script>`;
        if (html.includes('<head>')) return html.replace('<head>', '<head>' + script);
        return script + html;
    };

    const renderVisualMode = () => (
        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', height: '100%' }}>
            <div style={{
                width: isMobile ? '100%' : '380px',
                height: isMobile ? '45%' : '100%',
                borderRight: isMobile ? 'none' : '1px solid #2b2b3d',
                borderBottom: isMobile ? '1px solid #2b2b3d' : 'none',
                overflowY: 'auto',
                background: '#1e1e2d'
            }}>
                <LandingBuilder
                    key={id || 'new'}
                    onHtmlChange={handleHtmlChange}
                    initialBlocks={blocks}
                />
            </div>
            <div style={{ flex: 1, padding: '0', background: '#161625', overflowY: 'auto', display: 'flex', justifyContent: 'center', minHeight: isMobile ? '55%' : 'auto' }}>
                <div style={{ width: '100%', height: '100%', background: '#fff', overflow: 'hidden', position: 'relative' }}>
                    <iframe
                        title="Internal Preview"
                        srcDoc={injectErrorSuppression(htmlCode)}
                        style={{ width: '100%', height: '100%', border: 'none' }}
                        sandbox="allow-same-origin allow-scripts"
                    />
                </div>
            </div>
        </div>
    );

    const renderCodeMode = () => (
        <div style={{ padding: '0', height: '100%', background: '#1e1e2d' }}>
            <div style={{ background: '#1e1e2d', padding: '0', borderRadius: '0', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '16px 24px', borderBottom: '1px solid #2b2b3d', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Title level={4} style={{ margin: 0, color: '#fff' }}>Code Editor</Title>
                    <Button
                        icon={<CopyOutlined />}
                        style={{ background: '#2b2b3d', borderColor: 'transparent', color: '#fff' }}
                        onClick={() => {
                            navigator.clipboard.writeText(htmlCode);
                            message.success('Code copied to clipboard!');
                        }}
                    >
                        Copy Code
                    </Button>
                </div>
                <div style={{ flex: 1, padding: '12px' }}>
                    <Editor
                        height="100%"
                        defaultLanguage="html"
                        theme="vs-dark"
                        value={htmlCode}
                        onChange={handleCodeChange}
                        options={{
                            minimap: { enabled: true },
                            fontSize: 14,
                            automaticLayout: true,
                            wordWrap: 'on'
                        }}
                    />
                </div>
            </div>
        </div>
    );

    const renderLivePreview = () => (
        <div style={{ padding: '0', height: '100%', background: '#161625', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: '100%', height: '100%', background: '#fff', overflow: 'hidden' }}>
                <iframe
                    title="External Preview"
                    srcDoc={injectErrorSuppression(htmlCode)}
                    style={{ width: '100%', height: '100%', border: 'none' }}
                    sandbox="allow-same-origin allow-scripts"
                />
            </div>
        </div>
    );

    return (
        <Layout style={{ height: '100vh', overflow: 'hidden' }}>
            {renderHeader()}
            <Layout>
                {!isMobile && (
                    <Sider width={280} trigger={null} collapsible style={{ background: '#1e1e2d', borderRight: '1px solid #2b2b3d' }}>
                        <TemplatesSidebar
                            onSelectTemplate={handleSelectTemplate}
                            onUpload={handleUploadAndSave}
                            myPages={savedPages}
                        />
                    </Sider>
                )}
                <Content style={{ background: '#1e1e2d', position: 'relative' }}>
                    {activeTab === 'visual' && renderVisualMode()}
                    {activeTab === 'code' && renderCodeMode()}
                    {activeTab === 'live' && renderLivePreview()}
                </Content>
            </Layout>
        </Layout>
    );
};

export default LandingPageEditor;
