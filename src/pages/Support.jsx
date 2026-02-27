import React from 'react';
import { Card, Row, Col, Typography, Form, Input, Button, Space, message, Select, Upload } from 'antd';
import {
    MailOutlined,
    PhoneOutlined,
    MessageOutlined,
    SendOutlined,
    UploadOutlined,
    QuestionCircleOutlined
} from '@ant-design/icons';
import { supportService } from '../services/support';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const Support = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = React.useState(false);
    const [fileList, setFileList] = React.useState([]);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('name', values.name);
            formData.append('email', values.email);
            formData.append('category', values.category.toLowerCase());
            formData.append('message', values.message);

            if (fileList.length > 0) {
                formData.append('image', fileList[0].originFileObj);
            }

            const response = await supportService.submitTicket(formData);

            if (response.success) {
                message.success('Support request submitted successfully');
                form.resetFields();
                setFileList([]);
            }
        } catch (error) {
            console.error('Support submission error:', error);
            message.error(error?.message || 'Failed to send support request');
        } finally {
            setLoading(false);
        }
    };

    const handleUploadChange = ({ fileList: newFileList }) => setFileList(newFileList);


    return (
        <div style={{ padding: '0 clamp(12px, 3vw, 24px)', paddingBottom: '40px', maxWidth: '1600px', margin: '0 auto', background: '#F8FAFC' }}>
            <div style={{ marginBottom: '32px', paddingTop: '24px' }}>
                <Title level={2} style={{ margin: 0, fontWeight: 800, letterSpacing: '-0.02em', color: '#084b8a' }}>Help & Support</Title>
                <Paragraph style={{ color: '#64748b', fontWeight: 500 }}>We're here to help you get the most out of Track-Bridge.</Paragraph>
            </div>

            <Row gutter={[24, 24]}>
                <Col xs={24} lg={16}>
                    <Card
                        title={<Space style={{ color: '#084b8a', fontWeight: 700 }}><MessageOutlined /> Contact Support</Space>}
                        variant="borderless"
                        style={{ borderRadius: '20px', boxShadow: '0 4px 20px -5px rgba(0, 0, 0, 0.05)', background: '#fff' }}
                        styles={{ body: { padding: 'clamp(16px, 3vw, 32px)' } }}
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
                                <Upload
                                    maxCount={1}
                                    listType="picture"
                                    fileList={fileList}
                                    onChange={handleUploadChange}
                                    beforeUpload={() => false}
                                >
                                    <Button icon={<UploadOutlined />} style={{ borderRadius: '8px' }}>Click to upload screenshot</Button>
                                </Upload>
                            </Form.Item>
                            <Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    icon={<SendOutlined />}
                                    loading={loading}
                                    style={{
                                        background: '#084b8a',
                                        borderColor: '#084b8a',
                                        height: '48px',
                                        borderRadius: '12px',
                                        padding: '0 32px',
                                        fontWeight: 600,
                                        boxShadow: '0 4px 6px -1px rgba(8, 75, 138, 0.2)'
                                    }}
                                >
                                    Send Message
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>

                </Col>

                <Col xs={24} lg={8}>
                    <Space direction="vertical" size="large" style={{ width: '100%' }}>

                        <Card
                            title={<Space style={{ color: '#084b8a', fontWeight: 700 }}><QuestionCircleOutlined /> Direct Contact</Space>}
                            variant="borderless"
                            style={{ borderRadius: '20px', boxShadow: '0 4px 20px -5px rgba(0, 0, 0, 0.05)', background: '#fff' }}
                            styles={{ body: { padding: '24px' } }}
                        >
                            <Space direction="vertical" size="xlarge" style={{ width: '100%' }}>
                                <div style={{ padding: '16px', borderRadius: '12px' }}>
                                    <Text style={{ fontSize: '11px', fontWeight: 800, color: '#084b8a', display: 'block', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>EMAIL US</Text>
                                    <Space>
                                        <MailOutlined style={{ color: '#084b8a' }} />
                                        <Text strong style={{ color: '#1e293b' }}>support@track-bridge.com</Text>
                                    </Space>
                                </div>
                                <div style={{  padding: '16px', borderRadius: '12px',  }}>
                                    <Text style={{ fontSize: '11px', fontWeight: 800, color: '#084b8a', display: 'block', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>CALL US</Text>
                                    <Space>
                                        <PhoneOutlined style={{ color: '#084b8a' }} />
                                        <Text strong style={{ color: '#1e293b' }}>+971 4 123 4567</Text>
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
