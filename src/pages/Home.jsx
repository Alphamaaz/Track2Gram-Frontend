import React from 'react';
import { Typography, Button, Space, Row, Col, Card, Input } from 'antd';
import {
    PlayCircleOutlined,
    BarChartOutlined,
    ApiOutlined,
    LayoutOutlined,
    SearchOutlined,
    GlobalOutlined,
    InstagramOutlined,
    FacebookOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import LandingLayout from '../components/LandingLayout';
import LogoImg from '../assets/tyy 1.svg';

const { Title, Text } = Typography;

const Home = () => {
    const navigate = useNavigate();

    const stats = [
        { label: 'Leads Tracked', value: '10K+', description: 'Total leads captured' },
        { label: 'Active Campaigns', value: '500+', description: 'Across all platforms' },
        { label: 'Ad Spend Managed', value: '$2M+', description: 'Optimized conversion' }
    ];

    const steps = [
        {
            icon: <ApiOutlined style={{ fontSize: '28px', color: '#084b8a' }} />,
            title: 'Connect your Ads',
            description: 'Seamlessly integrate with Google Ads, Meta, and LinkedIn to pull real-time campaign data into your dashboard.'
        },
        {
            icon: <LayoutOutlined style={{ fontSize: '28px', color: '#084b8a' }} />,
            title: 'Build your Landing Page',
            description: 'Use our intuitive no-code editor to create high-converting pages in minutes. No designers or developers required.'
        },
        {
            icon: <BarChartOutlined style={{ fontSize: '28px', color: '#084b8a' }} />,
            title: 'Track & Convert',
            description: 'Monitor every conversion and lead source with our advanced analytics engine. Know exactly where your ROI comes from.'
        }
    ];

    return (
        <LandingLayout>
            {/* Hero Section */}
            <section style={{ padding: '80px clamp(16px, 5vw, 120px) 40px', textAlign: 'center', background: '#E6ECF2' }}>

                <Title style={{ fontSize: 'clamp(32px, 5vw, 64px)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.02em', color: '#0f172a', marginBottom: '24px' }}>
                    Track Every Lead.<br />
                    <span style={{ color: '#084b8a' }}>Convert Every Click.</span>
                </Title>

                <Text style={{ fontSize: 'clamp(16px, 1.8vw, 18px)', color: '#475569', maxWidth: '650px', display: 'block', margin: '0 auto 40px', lineHeight: 1.6, fontWeight: 450 }}>
                    The all-in-one platform for SaaS ad tracking and lead management. Scale your campaigns with data-driven precision and real-time insights.
                </Text>

                <Space size="large" style={{ marginBottom: '40px' }}>
                    <Button type="primary" size="large" onClick={() => navigate('/signup')} style={{ height: '54px', padding: '0 36px', borderRadius: '10px', fontSize: '16px', fontWeight: 800, background: '#084b8a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        Get Started for Free
                    </Button>
                    <Button size="large" icon={<PlayCircleOutlined />} style={{ height: '54px', padding: '0 36px', borderRadius: '10px', fontSize: '16px', fontWeight: 800, border: '1.5px solid #fff', background: '#fff' }}>
                        Watch Demo
                    </Button>
                </Space>
            </section>

            {/* Stats Section */}
            <section style={{ padding: '0 clamp(16px, 5vw, 120px) 100px', background: '#E6ECF2' }}>
                <Row gutter={[24, 24]} style={{ display: 'flex', justifyContent: 'center' }}>
                    {stats.map((stat, idx) => (
                        <Col xs={24} md={6} key={idx}>
                            <Card style={{
                                borderRadius: '16px',
                                padding: '12px',
                                border: '1.5px solid #084b8a33',
                                textAlign: 'center',
                                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                            }} bodyStyle={{ padding: '24px' }}>
                                <Title level={1} style={{ margin: 0, fontWeight: 800, color: '#084b8a', fontSize: '38px', letterSpacing: '-0.02em' }}>{stat.value}</Title>
                                <Text strong style={{ fontSize: '16px', color: '#475569', display: 'block', marginTop: '4px' }}>{stat.label}</Text>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </section>

            {/* How It Works Section */}
            <section style={{ padding: '100px clamp(16px, 5vw, 120px)', background: '#fff', textAlign: 'center' }}>
                <Title level={2} style={{ fontSize: '42px', fontWeight: 800, marginBottom: '16px', letterSpacing: '-0.02em', color: '#0f172a' }}>How It Works</Title>
                <Text style={{ fontSize: '16px', color: '#64748b', maxWidth: '600px', display: 'block', margin: '0 auto 80px', lineHeight: 1.5 }}>
                    Simplify your workflow with our streamlined three-step process to mastering ad performance.
                </Text>

                <Row gutter={[40, 40]}>
                    {steps.map((step, idx) => (
                        <Col xs={24} md={8} key={idx}>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{
                                    width: '72px',
                                    height: '72px',
                                    background: '#edf2f7',
                                    borderRadius: '16px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 24px',
                                    boxShadow: '0 8px 16px rgba(0,0,0,0.03)'
                                }}>
                                    {step.icon}
                                </div>
                                <Title level={4} style={{ fontWeight: 800, marginBottom: '12px', fontSize: '22px', color: '#0f172a' }}>{step.title}</Title>
                                <Text style={{ color: '#64748b', lineHeight: 1.6, fontSize: '15px', display: 'block', maxWidth: '300px', margin: '0 auto' }}>{step.description}</Text>
                            </div>
                        </Col>
                    ))}
                </Row>
            </section>

            <style>
                {`
                .mockup-search .ant-input { background: transparent !important; }
                `}
            </style>
        </LandingLayout>
    );
};

export default Home;
