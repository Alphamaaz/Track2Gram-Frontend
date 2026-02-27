import React from 'react';
import { Typography, Layout, Breadcrumb } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Paragraph, Text } = Typography;
const { Content } = Layout;

const PrivacyPolicy = () => {
    const navigate = useNavigate();

    return (
        <Layout style={{ background: '#fff', minHeight: '100vh' }}>
            <Content style={{ padding: '80px clamp(16px, 5vw, 120px)' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <Breadcrumb style={{ marginBottom: '24px' }}>
                        <Breadcrumb.Item onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                            <HomeOutlined /> Home
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>Privacy Policy</Breadcrumb.Item>
                    </Breadcrumb>

                    <Title level={1} style={{ fontSize: '48px', fontWeight: 800, marginBottom: '32px', color: '#084b8a' }}>Privacy Policy</Title>
                    <Text type="secondary" style={{ display: 'block', marginBottom: '48px' }}>Last Updated: February 26, 2026</Text>

                    <Title level={3}>1. Information We Collect</Title>
                    <Paragraph>
                        Track2Gram ("we", "us", or "our") collects information to provide better services to our users. We collect information in the following ways:
                        <ul>
                            <li><strong>Information you give us:</strong> For example, our services require you to sign up for an Account. When you do, we’ll ask for personal information, like your name, email address, or telephone number.</li>
                            <li><strong>Information we get from your use of our services:</strong> We collect information about the services that you use and how you use them, like when you visit a website that uses our advertising services or you view and interact with our ads and content.</li>
                        </ul>
                    </Paragraph>

                    <Title level={3}>2. How We Use Information</Title>
                    <Paragraph>
                        We use the information we collect from all of our services to provide, maintain, protect and improve them, to develop new ones, and to protect Track2Gram and our users.
                    </Paragraph>

                    <Title level={3}>3. Data Security</Title>
                    <Paragraph>
                        We work hard to protect Track2Gram and our users from unauthorized access to or unauthorized alteration, disclosure or destruction of information we hold. In particular:
                        <ul>
                            <li>We encrypt many of our services using SSL.</li>
                            <li>We review our information collection, storage and processing practices, including physical security measures, to guard against unauthorized access to systems.</li>
                        </ul>
                    </Paragraph>

                    <Title level={3}>4. Contact Us</Title>
                    <Paragraph>
                        If you have any questions about this Privacy Policy, please contact us at support@track2gram.com.
                    </Paragraph>
                </div>
            </Content>
        </Layout>
    );
};

export default PrivacyPolicy;
