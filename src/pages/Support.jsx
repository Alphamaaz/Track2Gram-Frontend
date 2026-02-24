import React from 'react';
import { Card, Row, Col, Typography, Form, Input, Button, Space, message, Select, Upload } from 'antd';
import {
    MailOutlined,
    PhoneOutlined,
    MessageOutlined,
    SendOutlined,
    UploadOutlined
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const Support = () => {
    const [form] = Form.useForm();

    const onFinish = (values) => {
        console.log('Support request:', values);
        message.success('Your message has been sent. We will get back to you soon!');
        form.resetFields();
    };


    return (
        <div style={{ padding: '0px' }}>
            <div style={{ marginBottom: '32px' }}>
                <Title level={2} style={{ margin: 0, color: '#1e293b' }}>Help & Support</Title>
                <Paragraph type="secondary">We're here to help you get the most out of Track2Gram.</Paragraph>
            </div>

            <Row gutter={[24, 24]}>
                <Col xs={24} lg={16}>
                    <Card
                        title={<Space><MessageOutlined /> Contact Support</Space>}
                        style={{ borderRadius: '12px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}
                    >
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={onFinish}
                        >
                            <Row gutter={16}>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        name="name"
                                        label="Name"
                                        rules={[{ required: true, message: 'Please enter your name' }]}
                                    >
                                        <Input placeholder="Your Name" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        name="email"
                                        label="Email"
                                        rules={[
                                            { required: true, message: 'Please enter your email' },
                                            { type: 'email', message: 'Please enter a valid email' }
                                        ]}
                                    >
                                        <Input placeholder="your@email.com" />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Form.Item
                                name="category"
                                label="Category"
                                rules={[{ required: true, message: 'Please select a category' }]}
                            >
                                <Select placeholder="Select a category">
                                    <Option value="Technical Issue">Technical Issue</Option>
                                    <Option value="Billing">Billing</Option>
                                    <Option value="General Inquiry">General Inquiry</Option>
                                    <Option value="Other">Other</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item
                                name="message"
                                label="Message"
                                rules={[{ required: true, message: 'Please enter your message' }]}
                            >
                                <TextArea rows={4} placeholder="Describe your issue or question in detail..." />
                            </Form.Item>
                            <Form.Item
                                name="image"
                                label="Upload Image"
                            >
                                <Upload maxCount={1} listType="picture">
                                    <Button icon={<UploadOutlined />}>Click to upload</Button>
                                </Upload>
                            </Form.Item>
                            <Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    icon={<SendOutlined />}
                                    style={{ background: '#084b8a', borderColor: '#084b8a', height: '40px' }}
                                >
                                    Send Message
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>

                </Col>

                <Col xs={24} lg={8}>
                    <Space direction="vertical" size="large" style={{ width: '100%' }}>

                        <Card title="Direct Contact" style={{ borderRadius: '12px' }}>
                            <Space direction="vertical" size="middle">
                                <div>
                                    <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>EMAIL US</Text>
                                    <Space>
                                        <MailOutlined style={{ color: '#084b8a' }} />
                                        <Text strong>support@track2gram.com</Text>
                                    </Space>
                                </div>
                                <div>
                                    <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>CALL US</Text>
                                    <Space>
                                        <PhoneOutlined style={{ color: '#084b8a' }} />
                                        <Text strong>+971 4 123 4567</Text>
                                    </Space>
                                </div>
                            </Space>
                        </Card>

                    </Space>
                </Col>
            </Row>


        </div >
    );
};

export default Support;
