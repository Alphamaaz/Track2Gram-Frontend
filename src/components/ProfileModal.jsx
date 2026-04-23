import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Button, App, Divider, Skeleton, Tag } from 'antd';
import { UserOutlined, MailOutlined, LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import authService from '../services/auth';
import settingsService from '../services/settings';

const formatPlanLabel = (value) => {
    if (value === 'starter') return 'Starter';
    if (value === 'pro') return 'Professional';
    if (value === 'yearly') return 'Yearly';
    return 'No Active Plan';
};

const getPlanTagColor = (value) => {
    if (value === 'yearly') return 'gold';
    if (value === 'pro') return 'processing';
    if (value === 'starter') return 'blue';
    return 'default';
};

const ProfileModal = ({ visible, onCancel }) => {
    const navigate = useNavigate();
    const { message } = App.useApp();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);
    const [profileData, setProfileData] = useState({ name: '', role: '' });
    const [subscriptionStatus, setSubscriptionStatus] = useState(null);

    const fetchProfile = React.useCallback(async () => {
        setFetching(true);
        try {
            const [response, subscriptionResponse] = await Promise.all([
                authService.getProfile(),
                settingsService.getSubscriptionStatus().catch(() => null),
            ]);
            const userData = response.user || response;
            const subscriptionData =
                subscriptionResponse?.data && typeof subscriptionResponse.data === 'object'
                    ? subscriptionResponse.data
                    : subscriptionResponse;

            // Update localStorage with fresh user data
            localStorage.setItem('user', JSON.stringify(userData));

            setProfileData({
                name: userData.name || '',
                role: userData.role || ''
            });
            setSubscriptionStatus(subscriptionData || null);

            form.setFieldsValue({
                name: userData.name,
                email: userData.email,
                role: userData.role,
                roleScope: userData.roleScope,
                workspaceId: userData.workspaceId,
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

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        onCancel();
        navigate('/login');
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
                <div className="profile-modal-container" style={{ borderRadius: '12px', overflow: 'hidden', display: 'flex' }}>
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

                        <Divider style={{ margin: '16px 0', borderColor: 'rgba(8, 75, 138, 0.1)' }} />

                        <Button
                            danger
                            type="text"
                            icon={<LogoutOutlined />}
                            onClick={handleLogout}
                            style={{
                                fontWeight: 700,
                                fontSize: '13px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                        >
                            Logout
                        </Button>
                    </div>

                    {/* Right Side - Form Fields */}
                    <div style={{ flex: 1, padding: '24px 32px' }}>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: '12px',
                                padding: '12px 14px',
                                marginBottom: '18px',
                                borderRadius: '12px',
                                background: '#F8FAFC',
                                border: '1px solid #E2E8F0'
                            }}
                        >
                            <div>
                                <div style={{ fontSize: '12px', fontWeight: 600, color: '#64748B', marginBottom: '4px' }}>
                                    Current Plan
                                </div>
                                <div style={{ fontSize: '16px', fontWeight: 800, color: '#1E293B' }}>
                                    {subscriptionStatus?.planType ? formatPlanLabel(subscriptionStatus.planType) : 'No Active Plan'}
                                </div>
                            </div>
                            <Tag
                                color={getPlanTagColor(subscriptionStatus?.planType)}
                                style={{
                                    margin: 0,
                                    borderRadius: '999px',
                                    padding: '4px 10px',
                                    fontWeight: 700,
                                    textTransform: 'uppercase',
                                    fontSize: '11px',
                                    letterSpacing: '0.04em'
                                }}
                            >
                                {subscriptionStatus?.planType ? formatPlanLabel(subscriptionStatus.planType) : 'None'}
                            </Tag>
                        </div>

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
            <style>
                {`
                    @media (max-width: 576px) {
                        .profile-modal-container {
                            flex-direction: column !important;
                        }
                        .profile-modal-container > div:first-child {
                            width: 100% !important;
                            padding: 24px 12px !important;
                            border-right: none !important;
                            border-bottom: 1px solid #F1F5F9 !important;
                        }
                        .mobile-logout-btn {
                            display: flex !important;
                            justify-content: center !important;
                        }
                    }
                `}
            </style>
        </Modal>
    );
};

export default ProfileModal;
