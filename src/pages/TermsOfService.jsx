import React from 'react';
import { Typography, Layout, Breadcrumb } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import LandingLayout from '../components/LandingLayout';

const { Title, Paragraph, Text } = Typography;
const { Content } = Layout;

const TermsOfService = ({ isDarkTheme, setIsDarkTheme }) => {
    const navigate = useNavigate();

    const themeColors = isDarkTheme ? {
        bg: '#0f172a',
        text: '#f1f5f9',
        mutedText: '#cbd5e1',
        primary: '#3b82f6',
        border: 'rgba(59, 130, 246, 0.2)',
        cardBg: '#1e293b'
    } : {
        bg: '#fff',
        text: '#0f172a',
        mutedText: '#64748b',
        primary: '#084b8a',
        border: 'rgba(8, 75, 138, 0.15)',
        cardBg: '#f8fafc'
    };

    return (
        <LandingLayout isDarkTheme={isDarkTheme} setIsDarkTheme={setIsDarkTheme} themeColors={themeColors}>
            <Layout style={{ background: themeColors.bg, minHeight: '100vh', transition: 'all 0.3s ease' }}>
                <Content style={{ padding: '80px clamp(16px, 5vw, 120px)' }}>
                    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                        <Breadcrumb style={{ marginBottom: '24px' }}>
                            <Breadcrumb.Item onClick={() => navigate('/')} style={{ cursor: 'pointer', color: themeColors.primary }}>
                                <HomeOutlined /> Home
                            </Breadcrumb.Item>
                            <Breadcrumb.Item style={{ color: themeColors.text }}>Terms of Service</Breadcrumb.Item>
                        </Breadcrumb>

                        <Title level={1} style={{ fontSize: '48px', fontWeight: 800, marginBottom: '32px', color: themeColors.primary }}>Terms of Service</Title>
                        <Text style={{ display: 'block', marginBottom: '48px', color: themeColors.mutedText }}>Last Updated: February 26, 2026</Text>

                        <Title level={3} style={{ color: themeColors.text }}>1. Agreement to Terms</Title>
                        <Paragraph style={{ color: themeColors.text }}>
                            By accessing or using our services, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the service.
                        </Paragraph>

                        <Title level={3} style={{ color: themeColors.text }}>2. Use of License</Title>
                        <Paragraph style={{ color: themeColors.text }}>
                            Permission is granted to temporarily download one copy of the materials on Track2Gram's website for personal, non-commercial transitory viewing only.
                            <ul style={{ color: themeColors.text }}>
                                <li>This is the grant of a license, not a transfer of title.</li>
                                <li>You may not modify or copy the materials.</li>
                                <li>You may not use the materials for any commercial purpose.</li>
                            </ul>
                        </Paragraph>

                        <Title level={3} style={{ color: themeColors.text }}>3. Disclaimer</Title>
                        <Paragraph style={{ color: themeColors.text }}>
                            The materials on Track2Gram's website are provided on an 'as is' basis. Track2Gram makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                        </Paragraph>

                        <Title level={3} style={{ color: themeColors.text }}>4. Governing Law</Title>
                        <Paragraph style={{ color: themeColors.text }}>
                            These terms and conditions are governed by and construed in accordance with the laws of the jurisdiction in which Track2Gram operates and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
                        </Paragraph>
                    </div>
                </Content>
            </Layout>
        </LandingLayout>
    );
};

export default TermsOfService;