import React from 'react';
import { Typography, Row, Col, Card, Form, Input, Button } from 'antd';
import { MailOutlined, TeamOutlined } from '@ant-design/icons';
import LandingLayout from '../../components/LandingLayout';
import { SectionTitle } from './Shared';

const { Text } = Typography;

const Contact = () => {
    return (
        <LandingLayout>
            <section style={{ padding: '80px clamp(16px, 5vw, 120px)', background: '#E6ECF2' }}>
                <Row gutter={[64, 64]}>
                    <Col xs={24} lg={10}>
                        <SectionTitle
                            centered={false}
                            title="Get in Touch"
                            subtitle="Have questions about our tracking engine or enterprise plans? Our experts are here to help."
                        />

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                            <div style={{ display: 'flex', gap: '20px' }}>
                                <div style={{ minWidth: '56px', height: '56px', background: '#fff', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', color: '#084b8a' }}>
                                    <MailOutlined />
                                </div>
                                <div>
                                    <Text strong style={{ display: 'block', fontSize: '16px' }}>Email Us</Text>
                                    <Text style={{ fontSize: '16px', color: '#64748b' }}>support@track2gram.com</Text>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '20px' }}>
                                <div style={{ minWidth: '56px', height: '56px', background: '#fff', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', color: '#084b8a' }}>
                                    <TeamOutlined />
                                </div>
                                <div>
                                    <Text strong style={{ display: 'block', fontSize: '16px' }}>Office</Text>
                                    <Text style={{ fontSize: '16px', color: '#64748b' }}>Innovation Drive, Tech Hub, Suite 402</Text>
                                </div>
                            </div>
                        </div>
                    </Col>

                    <Col xs={24} lg={14}>
                        <Card style={{ borderRadius: '32px', padding: '40px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }}>
                            <Form layout="vertical" size="large">
                                <Row gutter={16}>
                                    <Col span={12}>
                                        <Form.Item label="Full Name">
                                            <Input placeholder="John Doe" style={{ borderRadius: '10px' }} />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label="Email Address">
                                            <Input placeholder="john@company.com" style={{ borderRadius: '10px' }} />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Form.Item label="Message">
                                    <Input.TextArea rows={5} placeholder="How can we help you?" style={{ borderRadius: '10px' }} />
                                </Form.Item>
                                <Button type="primary" size="large" block style={{ height: '56px', borderRadius: '12px', fontWeight: 800, background: '#084b8a' }}>
                                    Send Message
                                </Button>
                            </Form>
                        </Card>
                    </Col>
                </Row>
            </section>
        </LandingLayout>
    );
};

export default Contact;
