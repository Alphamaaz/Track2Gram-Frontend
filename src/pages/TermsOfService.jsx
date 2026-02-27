import React from 'react';
import { Typography, Layout, Breadcrumb } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Paragraph, Text } = Typography;
const { Content } = Layout;

const TermsOfService = () => {
    const navigate = useNavigate();

    return (
        <Layout style={{ background: '#fff', minHeight: '100vh' }}>
            <Content style={{ padding: '80px clamp(16px, 5vw, 120px)' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <Breadcrumb style={{ marginBottom: '24px' }}>
                        <Breadcrumb.Item onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                            <HomeOutlined /> Home
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>Terms of Service</Breadcrumb.Item>
                    </Breadcrumb>

                    <Title level={1} style={{ fontSize: '48px', fontWeight: 800, marginBottom: '32px', color: '#084b8a' }}>Terms of Service</Title>
                    <Text type="secondary" style={{ display: 'block', marginBottom: '48px' }}>Last Updated: February 26, 2026</Text>

                    <Title level={3}>1. Agreement to Terms</Title>
                    <Paragraph>
                        By accessing or using our services, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the service.
                    </Paragraph>

                    <Title level={3}>2. Use of License</Title>
                    <Paragraph>
                        Permission is granted to temporarily download one copy of the materials on Track2Gram's website for personal, non-commercial transitory viewing only.
                        <ul>
                            <li>This is the grant of a license, not a transfer of title.</li>
                            <li>You may not modify or copy the materials.</li>
                            <li>You may not use the materials for any commercial purpose.</li>
                        </ul>
                    </Paragraph>

                    <Title level={3}>3. Disclaimer</Title>
                    <Paragraph>
                        The materials on Track2Gram's website are provided on an 'as is' basis. Track2Gram makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                    </Paragraph>

                    <Title level={3}>4. Governing Law</Title>
                    <Paragraph>
                        These terms and conditions are governed by and construed in accordance with the laws of the jurisdiction in which Track2Gram operates and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
                    </Paragraph>
                </div>
            </Content>
        </Layout>
    );
};

export default TermsOfService;
