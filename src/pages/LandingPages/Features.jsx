import React from 'react';
import { Typography, Row, Col, Card } from 'antd';
import {
    ApiOutlined,
    LayoutOutlined,
    BarChartOutlined,
    SafetyCertificateOutlined,
    CheckCircleFilled
} from '@ant-design/icons';
import LandingLayout from '../../components/LandingLayout';
import { SectionTitle } from './Shared';

const { Title, Text, Paragraph } = Typography;

const Features = () => {
    const featuresList = [
        {
            icon: <ApiOutlined />,
            title: 'Unified Ad Integration',
            desc: 'Connect Google, Meta, and more in one click. Watch your data flow into a single source of truth.'
        },
        {
            icon: <LayoutOutlined />,
            title: 'No-Code Page Builder',
            desc: 'Create high-converting landing pages tailored for lead generation. No designers needed.'
        },
        {
            icon: <BarChartOutlined />,
            title: 'ROI-Focused Analytics',
            desc: 'Stop guessing. Know exactly which ad campaign drove which specific conversion.'
        },
        {
            icon: <SafetyCertificateOutlined />,
            title: 'Fraud Detection',
            desc: 'Protect your budget. Identify and eliminate bot traffic before it drains your ad spend.'
        }
    ];

    return (
        <LandingLayout>
            <section style={{ padding: '100px clamp(16px, 5vw, 120px)', background: '#f8fafc' }}>
                <SectionTitle
                    title="Platform Capabilities"
                    subtitle="Track2Gram provides everything performance marketers need to scale their lead generation efforts with surgical precision."
                />

                <Row gutter={[40, 40]}>
                    {featuresList.map((f, i) => (
                        <Col xs={24} md={12} key={i}>
                            <Card
                                style={{
                                    borderRadius: '24px',
                                    border: '1px solid #e2e8f0',
                                    height: '100%',
                                    padding: '24px',
                                    transition: 'all 0.3s ease',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)'
                                }}
                                className="feature-card"
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-5px)';
                                    e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02)';
                                    e.currentTarget.style.borderColor = '#084b8a';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)';
                                    e.currentTarget.style.borderColor = '#e2e8f0';
                                }}
                            >
                                <div style={{ width: '72px', height: '72px', background: 'rgba(8, 75, 138, 0.08)', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', color: '#084b8a', marginBottom: '28px' }}>
                                    {f.icon}
                                </div>
                                <Title level={3} style={{ fontWeight: 800, marginBottom: '16px' }}>{f.title}</Title>
                                <Paragraph style={{ fontSize: '16px', color: '#64748b', marginBottom: '8px', lineHeight: '1.6' }}>{f.desc}</Paragraph>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </section>
        </LandingLayout>
    );
};

export default Features;
