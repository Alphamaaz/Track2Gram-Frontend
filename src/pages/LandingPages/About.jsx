import React from 'react';
import { Typography, Row, Col, Space } from 'antd';
import { GlobalOutlined } from '@ant-design/icons';
import LandingLayout from '../../components/LandingLayout';
import { SectionTitle } from './Shared';

const { Title, Text, Paragraph } = Typography;

const About = () => {
    return (
        <LandingLayout>
            <section style={{ padding: '80px clamp(16px, 5vw, 120px)' }}>
                <SectionTitle
                    title="Our Mission"
                    subtitle="Track2Gram was born out of a simple frustration: knowing exactly which dollar spent on ads resulted in a dollar earned in revenue."
                />

                <Row gutter={[48, 48]} align="middle">
                    <Col xs={24} md={12}>
                        <div style={{ borderRadius: '32px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
                            <div style={{ background: '#084b8a', padding: '60px', textAlign: 'center' }}>
                                <GlobalOutlined style={{ fontSize: '120px', color: '#fff', opacity: 0.2 }} />
                                <Title style={{ color: '#fff', margin: '20px 0 0' }}>Transparency First.</Title>
                            </div>
                        </div>
                    </Col>
                    <Col xs={24} md={12}>
                        <Title level={2} style={{ fontWeight: 800, marginBottom: '24px' }}>The Marketer's Operating System</Title>
                        <Paragraph style={{ fontSize: '18px', lineHeight: 1.8, color: '#475569' }}>
                            We believe that attribution shouldn't be a black box. Our team of engineering and marketing experts built Track2Gram to provide SaaS companies with a seamless, precise, and actionable view of their sales funnel.
                        </Paragraph>
                        <Paragraph style={{ fontSize: '18px', lineHeight: 1.8, color: '#475569' }}>
                            By combining world-class ad integration with an intuitive no-code landing page ecosystem, we empower businesses to stop guessing and start scaling.
                        </Paragraph>

                        <Space size="large" style={{ marginTop: '24px' }}>
                            <div style={{ textAlign: 'center' }}>
                                <Title level={2} style={{ margin: 0, color: '#084b8a' }}>99%</Title>
                                <Text strong>Accuracy</Text>
                            </div>
                            <div style={{ width: '1px', height: '40px', background: '#e2e8f0' }}></div>
                            <div style={{ textAlign: 'center' }}>
                                <Title level={2} style={{ margin: 0, color: '#084b8a' }}>24/7</Title>
                                <Text strong>Support</Text>
                            </div>
                        </Space>
                    </Col>
                </Row>
            </section>
        </LandingLayout>
    );
};

export default About;
