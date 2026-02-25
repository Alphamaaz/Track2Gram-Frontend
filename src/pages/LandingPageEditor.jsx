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
    LayoutOutlined
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
    const { message } = App.useApp();
    const screens = useBreakpoint();
    const isMobile = !screens.md;

    const [loading, setLoading] = useState(false);
    const [pageData, setPageData] = useState(null);
    const [activeTab, setActiveTab] = useState('visual');
    const [htmlCode, setHtmlCode] = useState('');
    const [blocks, setBlocks] = useState([]);
    const [savedPages, setSavedPages] = useState([]);


    const fetchSavedPages = React.useCallback(async () => {
        try {
            const response = await landingPageService.getLandingPages();
            if (response.success) {
                setSavedPages(response.data || []);
            }
        } catch (error) {
            console.error('Failed to fetch pages:', error);
        }
    }, []);

    const fetchLandingPage = React.useCallback(async () => {
        if (!id) {
            const initialBlocks = [];
            setBlocks(initialBlocks);
            setHtmlCode('');
            setPageData({ name: 'New Page' });
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
                name: pageData?.name || 'New Page',
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

    const handleDownload = () => {
        try {
            const blob = new Blob([htmlCode], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'index.html';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            message.success('index.html downloaded successfully!');
        } catch (error) {
            console.error('Download failed:', error);
            message.error('Failed to download index.html');
        }
    };

    const handleHtmlChange = (newHtml, newBlocks) => {
        if (newBlocks) {
            setBlocks(newBlocks);
            const updatedHtml = updateHtmlFromBlocks(htmlCode, newBlocks);
            setHtmlCode(updatedHtml);
        } else if (newHtml !== null && newHtml !== undefined) {
            setHtmlCode(newHtml);
        }
    };

    const handleCodeChange = (value) => {
        setHtmlCode(value);
    };

    const handleUploadAndSave = async (htmlContent, fileName = 'Uploaded Page') => {
        setLoading(true);
        try {
            const { blocks: tempBlocks, stampedHtml } = parseHtmlToBlocks(htmlContent);
            const payload = {
                name: fileName,
                html: stampedHtml,
                config: { blocks: tempBlocks }
            };

            // Always create a new page when uploading a file to add it to the library
            const response = await landingPageService.createLandingPage(payload);

            if (response.success) {
                message.success(`Page "${payload.name}" saved to library!`);
                await fetchSavedPages(); // Ensure the list is refreshed
                if (response.data?._id) {
                    navigate(`/landing-pages/builder/${response.data._id}`);
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
            const { blocks: parsedBlocks, stampedHtml } = parseHtmlToBlocks(customHtml);
            setHtmlCode(stampedHtml);
            setBlocks(parsedBlocks);
            setPageData(prev => ({ ...prev, name: 'Uploaded Template' }));
        } else {
            setBlocks(templateBlocks);
            setHtmlCode(generateHtml(templateBlocks));
        }
        message.success(customHtml ? 'Custom template loaded!' : 'Template applied!');
    };

    const handleTabChange = (tab) => {
        if (tab === 'visual' && activeTab === 'code') {
            const { blocks: parsedBlocks, stampedHtml } = parseHtmlToBlocks(htmlCode);
            setBlocks(parsedBlocks);
            setHtmlCode(stampedHtml);
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
                    <Button
                        icon={<DownloadOutlined />}
                        onClick={handleDownload}
                        style={{
                            background: '#2b2b3d',
                            borderColor: 'transparent',
                            color: '#fff',
                            borderRadius: '4px',
                            height: '32px'
                        }}
                    >
                        {isMobile ? '' : 'Download HTML'}
                    </Button>
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
            // Use querySelectorAll for safety; data-veid selectors are unique so only one match expected
            const elements = doc.querySelectorAll(block.selector);
            elements.forEach(el => {
                if (block.type === 'image') {
                    if (block.content.src !== undefined) el.setAttribute('src', block.content.src);
                    if (block.content.alt !== undefined) el.setAttribute('alt', block.content.alt);
                } else if (block.type === 'subscribe') {
                    // Buttons and links
                    if (el.tagName === 'A') {
                        // Always update href when provided
                        if (block.content.href !== undefined) {
                            el.setAttribute('href', block.content.href || '#');
                        }
                        // If this anchor uses icon-only content (e.g. <i>), don't touch its inner HTML
                        const hasIconChild = el.querySelector('i, svg');
                        if (!hasIconChild && block.content.buttonText !== undefined) {
                            el.textContent = block.content.buttonText || '';
                        }
                    } else {
                        // Regular button element
                        if (block.content.buttonText !== undefined) {
                            el.textContent = block.content.buttonText || '';
                        }
                    }
                } else if (block.type === 'text') {
                    const content = block.content.title !== undefined ? block.content.title :
                        (block.content.paragraph !== undefined ? block.content.paragraph :
                            (block.content.description !== undefined ? block.content.description : ''));
                    el.innerHTML = content.replace(/\n/g, '<br/>');
                }
            });
        });
        return '<!DOCTYPE html>\n' + doc.documentElement.outerHTML;
    };

    const parseHtmlToBlocks = (html) => {
        if (!html) return { blocks: [], stampedHtml: html };
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const extractedBlocks = [];
        let veIdCounter = 0;

        // Helper: assign a unique data-veid to an element and return its selector
        const stamp = (el) => {
            const existingId = el.getAttribute('data-veid');
            if (existingId) return `[data-veid="${existingId}"]`;
            const veid = `ve-${veIdCounter++}`;
            el.setAttribute('data-veid', veid);
            return `[data-veid="${veid}"]`;
        };

        // --- Images ---
        doc.querySelectorAll('img').forEach((img, index) => {
            const selector = stamp(img);
            extractedBlocks.push({
                id: `img-${Date.now()}-${index}`,
                type: 'image',
                tagName: img.classList.contains('avatar') ? 'AVATAR' : 'IMAGE',
                selector,
                className: img.className || '',
                content: { src: img.getAttribute('src') || '', alt: img.alt || '' }
            });
        });

        // --- Text / Button / Link elements ---
        // Broad selector to catch all meaningful leaf-level elements
        const TEXT_TAGS = 'h1,h2,h3,h4,h5,h6,p,a,button,span,div,li';
        const BLOCK_CHILD_TAGS = new Set(['DIV', 'P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'UL', 'OL', 'LI', 'TABLE', 'FORM', 'BLOCKQUOTE', 'SECTION', 'ARTICLE', 'HEADER', 'FOOTER', 'NAV']);

        doc.querySelectorAll(TEXT_TAGS).forEach((el, index) => {
            // Skip elements already stamped as images
            if (el.tagName === 'IMG') return;
            // Skip elements that are purely structural wrappers (contain block-level children)
            // UNLESS they have a known content class
            const isKnownContentClass =
                el.classList.contains('profile-name') ||
                el.classList.contains('profile-subscribers') ||
                el.classList.contains('profile-description') ||
                el.classList.contains('name') ||
                el.classList.contains('meta') ||
                el.classList.contains('subscriber-count') ||
                el.classList.contains('description') ||
                el.classList.contains('desc') ||
                el.classList.contains('join-button') ||
                el.id === 'telegram_join_btn';

            const hasBlockChildren = Array.from(el.children).some(child =>
                BLOCK_CHILD_TAGS.has(child.tagName)
            );
            if (hasBlockChildren && !isKnownContentClass) return;

            // Skip image containers
            if (el.classList.contains('image-container')) return;
            // Skip elements containing images/SVGs (unless known content class)
            if (!isKnownContentClass && el.querySelector('img, svg')) return;

            const text = el.textContent.trim();
            const isAnchor = el.tagName === 'A';
            // For normal text elements, require visible text.
            // For anchors, allow even if there's no text (e.g. icon-only social links).
            if (!text && !isAnchor) return;

            // Determine block type
            const isButton = el.tagName === 'A' || el.tagName === 'BUTTON' ||
                el.id === 'telegram_join_btn' || el.classList.contains('join-button');
            const type = isButton ? 'subscribe' : 'text';

            // Determine display tag name for labelling in the editor
            let displayTagName = el.tagName;
            if (el.classList.contains('profile-name') || el.classList.contains('name') || el.tagName === 'H1') {
                displayTagName = 'NAME';
            } else if (el.classList.contains('profile-subscribers') || el.classList.contains('meta') || el.classList.contains('subscriber-count')) {
                displayTagName = 'META';
            } else if (el.classList.contains('profile-description') || el.classList.contains('description') || el.classList.contains('desc')) {
                displayTagName = 'DESCRIPTION';
            } else if (isButton) {
                // Distinguish icon-only links from regular buttons
                if (el.tagName === 'A' && !text) {
                    displayTagName = 'LINK';
                } else {
                    displayTagName = 'BUTTON';
                }
            }

            const selector = stamp(el);

            extractedBlocks.push({
                id: `${type}-${Date.now()}-${index}`,
                type,
                tagName: displayTagName,
                selector,
                className: (typeof el.className === 'string' ? el.className : '') || '',
                content: {
                    title: displayTagName === 'NAME' ? text : undefined,
                    paragraph: (displayTagName !== 'NAME' && displayTagName !== 'DESCRIPTION' && type === 'text') ? text : undefined,
                    description: displayTagName === 'DESCRIPTION' ? text : undefined,
                    buttonText: type === 'subscribe' ? text : undefined,
                    href: (el.tagName === 'A' || el.classList.contains('join-button')) ? el.getAttribute('href') : undefined
                }
            });
        });

        if (extractedBlocks.length === 0) {
            return {
                blocks: [{
                    id: 'custom-1',
                    type: 'text',
                    tagName: 'H1',
                    content: { title: 'Custom HTML Loaded', paragraph: 'Edit in Code mode for full control.' }
                }],
                stampedHtml: html
            };
        }

        // Serialize the stamped DOM back to HTML so selectors are embedded
        const stampedHtml = '<!DOCTYPE html>\n' + doc.documentElement.outerHTML;
        return { blocks: extractedBlocks, stampedHtml };
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
                            onSelectPage={(pageId) => navigate(`/landing-pages/builder/${pageId}`)}
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
