import React from 'react';
import { Typography, Layout, Breadcrumb } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import LandingLayout from '../components/LandingLayout';

const { Title, Paragraph, Text } = Typography;
const { Content } = Layout;

const PrivacyPolicy = ({ isDarkTheme, setIsDarkTheme }) => {
    const navigate = useNavigate();

    const themeColors = isDarkTheme ? {
        bg: '#0f172a',
        heroBg: '#1e293b',
        text: '#f1f5f9',
        mutedText: '#cbd5e1',
        cardBg: '#1e293b',
        primary: '#3b82f6',
        border: 'rgba(59, 130, 246, 0.2)'
    } : {
        bg: '#fff',
        heroBg: '#E6ECF2',
        text: '#0f172a',
        mutedText: '#64748b',
        cardBg: '#fff',
        primary: '#084b8a',
        border: 'rgba(8, 75, 138, 0.15)'
    };

    return (
        <LandingLayout isDarkTheme={isDarkTheme} setIsDarkTheme={setIsDarkTheme} themeColors={themeColors}>
            <Layout style={{ background: themeColors.bg, minHeight: '100vh' }}>
                <Content style={{ padding: '80px clamp(16px, 5vw, 120px)' }}>
                    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                        <Breadcrumb style={{ marginBottom: '24px' }}>
                            <Breadcrumb.Item onClick={() => navigate('/')} style={{ cursor: 'pointer', color: themeColors.primary }}>
                                <HomeOutlined /> Home
                            </Breadcrumb.Item>
                            <Breadcrumb.Item style={{ color: themeColors.text }}>Privacy Policy</Breadcrumb.Item>
                        </Breadcrumb>

                        <Title level={1} style={{ fontSize: '48px', fontWeight: 800, marginBottom: '32px', color: themeColors.primary }}>Privacy Policy</Title>
                        <Text type="secondary" style={{ display: 'block', marginBottom: '48px', color: themeColors.mutedText }}>Last Updated: February 26, 2026</Text>

                        <Title level={3} style={{ color: themeColors.text }}>1. Information We Collect</Title>
                        <Paragraph style={{ color: themeColors.text }}>
                            Track2Gram ("we", "us", or "our") collects information to provide better services to our users. We collect information in the following ways:
                            <ul style={{ color: themeColors.text }}>
                                <li><strong>Information you give us:</strong> For example, our services require you to sign up for an Account. When you do, we’ll ask for personal information, like your name, email address, or telephone number.</li>
                                <li><strong>Information we get from your use of our services:</strong> We collect information about the services that you use and how you use them, like when you visit a website that uses our advertising services or you view and interact with our ads and content.</li>
                            </ul>
                        </Paragraph>

                        <Title level={3} style={{ color: themeColors.text }}>2. How We Use Information</Title>
                        <Paragraph style={{ color: themeColors.text }}>
                            We use the information we collect from all of our services to provide, maintain, protect and improve them, to develop new ones, and to protect Track2Gram and our users.
                        </Paragraph>

                        <Title level={3} style={{ color: themeColors.text }}>3. Data Security</Title>
                        <Paragraph style={{ color: themeColors.text }}>
                            We work hard to protect Track2Gram and our users from unauthorized access to or unauthorized alteration, disclosure or destruction of information we hold. In particular:
                            <ul style={{ color: themeColors.text }}>
                                <li>We encrypt many of our services using SSL.</li>
                                <li>We review our information collection, storage and processing practices, including physical security measures, to guard against unauthorized access to systems.</li>
                            </ul>
                        </Paragraph>

                        <Title level={3} style={{ color: themeColors.text }}>4. Contact Us</Title>
                        <Paragraph style={{ color: themeColors.text }}>
                            If you have any questions about this Privacy Policy, please contact us at support@track2gram.com.
                        </Paragraph>
                    </div>
                </Content>
            </Layout>
        </LandingLayout>
    );
};

export default PrivacyPolicy;
