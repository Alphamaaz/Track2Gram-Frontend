import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Button, App, Divider, Skeleton } from 'antd';
import { UserOutlined, MailOutlined, GlobalOutlined } from '@ant-design/icons';
import authService from '../services/auth';

const ProfileModal = ({ visible, onCancel }) => {
    const { message } = App.useApp();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);
    const [profileData, setProfileData] = useState({ name: '', role: '' });

    const fetchProfile = React.useCallback(async () => {
        setFetching(true);
        try {
            const response = await authService.getProfile();
            const userData = response.user || response;

            // Update localStorage with fresh user data
            localStorage.setItem('user', JSON.stringify(userData));

            setProfileData({
                name: userData.name || '',
                role: userData.role || ''
            });

            form.setFieldsValue({
                name: userData.name,
                email: userData.email,
                role: userData.role,
                roleScope: userData.roleScope,
                workspaceId: userData.workspaceId
            });
        } catch (error) {
            console.error('Failed to fetch profile:', error);
            message.error('Failed to load profile data');
        } finally {
            setFetching(false);
        }
    }, [form, message]);

    useEffect(() => {
        if (visible) {
            fetchProfile();
        }
    }, [visible, fetchProfile]);

    const handleSave = async () => {
        try {
            const values = await form.validateFields();
            setLoading(true);

            // If password fields are filled, call changePassword
            if (values.currentPassword || values.newPassword) {
                if (!values.currentPassword || !values.newPassword) {
                    message.error('Please provide both current and new passwords');
                    setLoading(false);
                    return;
                }

                await authService.changePassword({
                    currentPassword: values.currentPassword,
                    newPassword: values.newPassword
                });
                message.success('Password updated successfully!');
            } else {
                // If only name was changed (though it's disabled now, keeping for robustness)
                // await authService.updateProfile({ name: values.name });
                message.info('No changes detected');
            }

            onCancel();
            form.resetFields(['currentPassword', 'newPassword']);

            try {
                const freshProfile = await authService.getProfile();
                localStorage.setItem('user', JSON.stringify(freshProfile.user || freshProfile));
            } catch {
                // Silently handle refresh error
            }
        } catch (error) {
            console.error('Update failed:', error);
            message.error(error.message || 'Validation failed or server error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title={null}
            open={visible}
            onCancel={onCancel}
            footer={null}
            width={620}
            style={{ top: 80 }}
            styles={{ body: { padding: 0 } }}
            closeIcon={null}
            destroyOnHidden
            forceRender
        >
            {fetching ? (
                <div style={{ padding: '30px' }}>
                    <Skeleton active avatar paragraph={{ rows: 2 }} />
                </div>
            ) : (
                <div style={{ borderRadius: '12px', overflow: 'hidden', display: 'flex' }}>
                    {/* Left Sidebar - Profile Summary */}
                    <div style={{
                        width: '140px',
                        background: 'linear-gradient(180deg, #F8FAFC 0%, rgba(8, 75, 138, 0.05) 100%)',
                        padding: '32px 12px',
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRight: '1px solid #F1F5F9',
                        flexShrink: 0
                    }}>
                        <div style={{
                            width: '64px',
                            height: '64px',
                            borderRadius: '18px',
                            background: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '16px',
                            boxShadow: '0 8px 16px rgba(8, 75, 138, 0.1)',
                        }}>
                            <UserOutlined style={{ fontSize: '28px', color: '#084b8a' }} />
                        </div>
                        <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: 700, color: '#1E293B' }}>
                            {profileData.name}
                        </h3>
                        <span style={{
                            background: '#084b8a',
                            color: '#fff',
                            padding: '2px 10px',
                            borderRadius: '8px',
                            fontSize: '10px',
                            fontWeight: 800,
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                        }}>
                            {profileData.role}
                        </span>
                    </div>

                    {/* Right Side - Form Fields */}
                    <div style={{ flex: 1, padding: '24px 32px' }}>
                        <Form
                            form={form}
                            layout="vertical"
                            autoComplete="off"
                            requiredMark={false}
                        >
                            <Form.Item
                                name="name"
                                label={<span style={{ fontWeight: 600, color: '#475569', fontSize: '13px' }}>Full Name</span>}
                                style={{ marginBottom: '16px' }}
                            >
                                <Input
                                    prefix={<UserOutlined style={{ color: '#94a3b8', fontSize: '14px', marginRight: '6px' }} />}
                                    disabled
                                    autoComplete="name"
                                    style={{ borderRadius: '8px', height: '40px', background: '#F8FAFC', color: '#475569', fontSize: '14px' }}
                                />
                            </Form.Item>

                            <Form.Item
                                name="email"
                                label={<span style={{ fontWeight: 600, color: '#475569', fontSize: '13px' }}>Email Address</span>}
                                style={{ marginBottom: '16px' }}
                            >
                                <Input
                                    prefix={<MailOutlined style={{ color: '#94a3b8', fontSize: '14px', marginRight: '6px' }} />}
                                    disabled
                                    autoComplete="email"
                                    style={{ borderRadius: '8px', background: '#F8FAFC', height: '40px', color: '#475569', fontSize: '14px' }}
                                />
                            </Form.Item>

                            <Form.Item
                                name="currentPassword"
                                label={<span style={{ fontWeight: 600, color: '#475569', fontSize: '13px' }}>Current Password</span>}
                                style={{ marginBottom: '16px' }}
                            >
                                <Input.Password
                                    placeholder="Enter current password"
                                    autoComplete="current-password"
                                    style={{ borderRadius: '8px', height: '40px', fontSize: '14px' }}
                                />
                            </Form.Item>

                            <Form.Item
                                name="newPassword"
                                label={<span style={{ fontWeight: 600, color: '#475569', fontSize: '13px' }}>New Password</span>}
                                rules={[{ min: 6, message: 'Password must be at least 6 characters' }]}
                                style={{ marginBottom: '24px' }}
                            >
                                <Input.Password
                                    placeholder="Enter new password"
                                    autoComplete="new-password"
                                    style={{ borderRadius: '8px', height: '40px', fontSize: '14px' }}
                                />
                            </Form.Item>

                            <div style={{ display: 'flex', gap: '10px' }}>
                                <Button onClick={onCancel} style={{ flex: 1, borderRadius: '8px', height: '40px', fontWeight: 600 }}>
                                    Cancel
                                </Button>
                                <Button
                                    type="primary"
                                    onClick={handleSave}
                                    loading={loading}
                                    style={{
                                        flex: 2,
                                        borderRadius: '8px',
                                        height: '40px',
                                        background: '#084b8a',
                                        borderColor: '#084b8a',
                                        fontWeight: 700,
                                        boxShadow: '0 4px 12px rgba(8, 75, 138, 0.2)'
                                    }}
                                >
                                    Update Password
                                </Button>
                            </div>
                        </Form>
                    </div>
                </div>
            )}
        </Modal>
    );
};

export default ProfileModal;
