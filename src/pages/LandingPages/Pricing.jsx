import React from 'react';
import { Typography, Row, Col, Card, Button, Badge } from 'antd';
import { CheckCircleFilled } from '@ant-design/icons';
import LandingLayout from '../../components/LandingLayout';
import { SectionTitle } from './Shared';

const { Title, Text } = Typography;

const Pricing = () => {
    const plans = [
        {
            name: 'Starter',
            price: '$49',
            desc: 'Perfect for solo marketers.',
            features: ['1 Project', '1,000 Leads/mo', 'Basic Analytics', 'Email Support'],
            button: 'Start for Free'
        },
        {
            name: 'Professional',
            price: '$149',
            desc: 'The best value for growing teams.',
            features: ['10 Projects', '10,000 Leads/mo', 'Advanced Attribution', 'Priority Support', 'Full API Access'],
            popular: true,
            button: 'Choose Professional'
        },
        {
            name: 'Enterprise',
            price: 'Custom',
            desc: 'Scalability for large agencies.',
            features: ['Unlimited Projects', 'Unlimited Leads', 'Custom Integrations', 'Dedicated Account Manager', 'White Label Options'],
            button: 'Contact Sales'
        }
    ];

    return (
        <LandingLayout>
            <section style={{ padding: '80px clamp(16px, 5vw, 120px)', background: '#f8fafc' }}>
                <SectionTitle
                    title="Flexible Pricing"
                    subtitle="Choose the plan that fits your current scale and upgrade as you grow."
                />

                <Row gutter={[32, 32]} justify="center">
                    {plans.map((p, i) => (
                        <Col xs={24} lg={8} key={i}>
                            <Badge.Ribbon text="Popular" color="#084b8a" style={{ display: p.popular ? 'block' : 'none' }}>
                                <Card style={{
                                    borderRadius: '24px',
                                    textAlign: 'center',
                                    padding: '40px 20px',
                                    border: p.popular ? '2px solid #084b8a' : '1px solid #f1f5f9',
                                    boxShadow: p.popular ? '0 20px 40px rgba(8, 75, 138, 0.1)' : 'none'
                                }}>
                                    <Text strong style={{ color: '#084b8a', fontSize: '16px', letterSpacing: '0.1em' }}>{p.name.toUpperCase()}</Text>
                                    <Title style={{ fontSize: '48px', fontWeight: 800, margin: '16px 0 8px' }}>{p.price}</Title>
                                    <Text style={{ color: '#64748b', display: 'block', marginBottom: '32px' }}>{p.desc}</Text>

                                    <div style={{ textAlign: 'left', marginBottom: '40px', padding: '0 20px' }}>
                                        {p.features.map((f, idx) => (
                                            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                                                <CheckCircleFilled style={{ color: p.popular ? '#084b8a' : '#cbd5e1' }} />
                                                <Text style={{ fontSize: '15px' }}>{f}</Text>
                                            </div>
                                        ))}
                                    </div>

                                    <Button type={p.popular ? 'primary' : 'default'} size="large" block style={{
                                        height: '56px',
                                        borderRadius: '12px',
                                        fontWeight: 800,
                                        background: p.popular ? '#084b8a' : '#fff',
                                        borderColor: '#084b8a',
                                        color: p.popular ? '#fff' : '#084b8a'
                                    }}>
                                        {p.button}
                                    </Button>
                                </Card>
                            </Badge.Ribbon>
                        </Col>
                    ))}
                </Row>
            </section>
        </LandingLayout>
    );
};

export default Pricing;
