import React from 'react';
import { Modal, Form, Input, Button, Avatar, Upload, message, Divider } from 'antd';
import { UserOutlined, UploadOutlined, MailOutlined, PhoneOutlined, GlobalOutlined } from '@ant-design/icons';

const ProfileModal = ({ visible, onCancel }) => {
    const [form] = Form.useForm();

    const handleSave = async () => {
        try {
            const values = await form.validateFields();
            console.log('Profile updated:', values);
            message.success('Profile updated successfully!');
            onCancel();
        } catch (error) {
            console.error('Validation failed:', error);
        }
    };

    const footerContent = (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <span style={{ color: '#94a3b8', fontSize: '12px' }}>Joined January 15, 2024</span>
            <div style={{ display: 'flex', gap: '8px' }}>
                <Button key="cancel" onClick={onCancel}>
                    Cancel
                </Button>
                <Button key="save" type="primary" onClick={handleSave} style={{ background: '#3B82F6', borderColor: '#3B82F6' }}>
                    Save Changes
                </Button>
            </div>
        </div>
    );

    return (
        <Modal
            title="User Profile"
            open={visible}
            onCancel={onCancel}
            footer={footerContent}
            width={480}
            centered
            styles={{ body: { paddingBottom: 0 } }}
        >
            <div style={{ textAlign: 'center', marginBottom: '32px', marginTop: '16px' }}>
                <div style={{
                    width: '96px',
                    height: '96px',
                    borderRadius: '50%',
                    background: '#F1F5F9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto',
                    border: '4px solid #fff',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                }}>
                    <UserOutlined style={{ fontSize: '40px', color: '#3B82F6' }} />
                </div>
            </div>

            <Form
                form={form}
                layout="vertical"
                initialValues={{
                    name: 'Sabreen',
                    email: 'sabreen@example.com',
                    phone: '+1 234 567 890'
                }}
            >
                <Form.Item
                    name="name"
                    label="Full Name"
                    rules={[{ required: true, message: 'Please enter your name' }]}
                    style={{ marginBottom: '16px' }}
                >
                    <Input prefix={<UserOutlined style={{ color: '#94a3b8' }} />} placeholder="Full Name" />
                </Form.Item>

                <Form.Item
                    name="email"
                    label="Email Address"
                    rules={[
                        { required: true, message: 'Please enter your email' },
                        { type: 'email', message: 'Please enter a valid email' }
                    ]}
                    style={{ marginBottom: '16px' }}
                >
                    <Input prefix={<MailOutlined style={{ color: '#94a3b8' }} />} placeholder="Email Address" />
                </Form.Item>

                <Form.Item
                    name="phone"
                    label="Phone Number"
                    style={{ marginBottom: '16px' }}
                >
                    <Input prefix={<PhoneOutlined style={{ color: '#94a3b8' }} />} placeholder="Phone Number" />
                </Form.Item>

                <Divider style={{ margin: '16px 0', color: '#64748B', fontSize: '12px' }}>Change Password</Divider>

                <Form.Item
                    name="password"
                    label="New Password"
                    rules={[{ min: 6, message: 'Password must be at least 6 characters' }]}
                    style={{ marginBottom: '0' }}
                >
                    <Input.Password placeholder="Enter new password" />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ProfileModal;
