import React, { useState, useEffect, useCallback } from 'react';
import { Table, Tag, Space, Button, Card, Typography, Input, Select, Modal, Form, App, Popconfirm, Avatar, Switch } from 'antd';
import { UserOutlined, UserAddOutlined, SearchOutlined } from '@ant-design/icons';
import authService from '../services/auth';

const { Title } = Typography;
const { Option } = Select;

const RoleManagement = () => {
    const { message } = App.useApp();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [editingUser, setEditingUser] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);


    const fetchCurrentUser = useCallback(async () => {
        try {
            const data = await authService.getProfile();
            // Normalize: Backend might return { user: {...} } or {...}
            const normalized = data?.user || data;
            setCurrentUser(normalized);
            return normalized;
        } catch (error) {
            console.error('Failed to fetch profile:', error);
            return null;
        }
    }, []);

    const fetchUsers = useCallback(async (pUser) => {
        setLoading(true);
        try {
            const data = await authService.getUsers();
            let usersList = Array.isArray(data) ? data : (data.users || []);

            // Filter out empty or invalid user objects
            usersList = usersList.filter(u => u && (u.id || u._id));

            let mappedUsers = usersList.map(user => {
                const id = user.id || user._id;
                return {
                    ...user,
                    key: id,
                    id: id,
                    status: user.active === false || user.disabled ? 'Inactive' : 'Active'
                };
            });

            // Handle current user inclusion
            if (pUser) {
                const pId = pUser.id || pUser._id;
                const alreadyInList = mappedUsers.some(u => u.key === pId);

                if (pId && !alreadyInList) {
                    mappedUsers.unshift({
                        ...pUser,
                        key: pId,
                        id: pId,
                        status: pUser.active === false || pUser.disabled ? 'Inactive' : 'Active'
                    });
                }
            }

            setUsers(mappedUsers);
        } catch (error) {
            console.error('Failed to fetch users:', error);

            // If 403 (Insufficient role), fallback to showing only the current user
            if (pUser) {
                const pId = pUser.id || pUser._id;
                const selfUser = {
                    ...pUser,
                    key: pId || 'self',
                    id: pId,
                    status: pUser.active === false || pUser.disabled ? 'Inactive' : 'Active'
                };
                setUsers([selfUser]);
            } else {
                message.error('Unable to retrieve workspace user list. Please check your permissions.');
            }
        } finally {
            setLoading(false);
        }
    }, [message]);

    useEffect(() => {
        const init = async () => {
            const user = await fetchCurrentUser();
            fetchUsers(user);
        };
        init();
    }, [fetchCurrentUser, fetchUsers]);

    const showModal = (user = null) => {
        setEditingUser(user);
        setIsModalVisible(true);
        // Use setTimeout to ensure the Modal and Form are rendered before accessing the form instance
        setTimeout(() => {
            if (user) {
                form.setFieldsValue(user);
            } else {
                form.resetFields();
            }
        }, 0);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setEditingUser(null);
    };

    const handleSave = async () => {
        try {
            const values = await form.validateFields();
            setLoading(true);
            if (editingUser) {
                message.info('Update API not specified, using Invite pattern');
                await authService.inviteUser({
                    email: values.email,
                    role: values.role.toLowerCase()
                });
                message.success('User invite sent/updated successfully');
            } else {
                await authService.inviteUser({
                    email: values.email,
                    role: values.role.toLowerCase()
                });
                message.success('Invitation sent successfully');
            }
            setIsModalVisible(false);
            setEditingUser(null);
            fetchUsers();
        } catch (error) {
            console.error('Action failed:', error);
            message.error(error.message || 'Action failed');
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async (record) => {
        try {
            setLoading(true);
            await authService.toggleDisableUser(record.id || record._id || record.key);
            message.success('User status toggled successfully');
            fetchUsers();
        } catch (error) {
            console.error('Toggle failed:', error);
            message.error(error.message || 'Failed to toggle user status');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (key) => {
        try {
            setLoading(true);
            await authService.deleteUser(key);
            message.success('User deleted successfully');
            fetchUsers();
        } catch (error) {
            console.error('Delete failed:', error);
            message.error(error.message || 'Failed to delete user');
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            title: 'User',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => (
                <Space>
                    <Avatar size="small" icon={<UserOutlined />} style={{ backgroundColor: '#f1f5f9', color: '#3b82f6' }} />
                    <span style={{ fontWeight: 500 }}>{text || record.email}</span>
                </Space>
            ),
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
            render: (role) => role ? (
                <Tag color="blue" style={{ borderRadius: '4px', textTransform: 'uppercase', fontWeight: 600, fontSize: '10px' }}>
                    {role}
                </Tag>
            ) : null,
        },
        {
            title: 'Active',
            dataIndex: 'status',
            key: 'status',
            render: (status, record) => {
                const isOwner = record.role?.toLowerCase() === 'owner';
                const isSelf = record.key === currentUser?.id || record.key === currentUser?._id;

                // Allow toggle IF the user is currently Inactive (to activate them)
                // Disable toggle IF the user is Active AND (Owner or Self) to prevent deactivation
                const cannotDeactivate = status === 'Active' && (isOwner || isSelf);

                return (
                    <Switch
                        checked={status === 'Active'}
                        onChange={() => handleToggleStatus(record)}
                        disabled={cannotDeactivate}
                        style={{ backgroundColor: status === 'Active' ? (cannotDeactivate ? '#94a3b8' : '#52c41a') : undefined }}
                    />
                );
            }
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => {
                const isOwner = record.role?.toLowerCase() === 'owner';
                const isSelf = record.key === currentUser?.id || record.key === currentUser?._id;

                if (isOwner || isSelf) return null;

                return (
                    <Space size="middle">
                        <Popconfirm
                            title="Are you sure to delete this user?"
                            onConfirm={() => handleDelete(record.key)}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button type="link" danger style={{ padding: 0 }}>
                                Remove
                            </Button>
                        </Popconfirm>
                    </Space>
                );
            }
        },
    ];

    const filteredUsers = users.filter(user =>
        (user.name?.toLowerCase() || '').includes(searchText.toLowerCase()) ||
        (user.email?.toLowerCase() || '').includes(searchText.toLowerCase())
    );

    const userRole = currentUser?.role?.toLowerCase();
    const canAccess = userRole === 'owner' || userRole === 'admin';

    if (currentUser && !canAccess) {
        return (
            <div style={{ padding: 'clamp(8px, 3vw, 32px)', textAlign: 'center' }}>
                <Title level={3}>Access Denied</Title>
                <Typography.Text type="secondary">You do not have permission to view this page.</Typography.Text>
            </div>
        );
    }

    return (
        <div style={{ padding: 'clamp(8px, 3vw, 32px)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                    <Title level={2} style={{ margin: 0, color: '#1e293b' }}>Role Management</Title>
                    <Typography.Text type="secondary">Manage user roles and permissions</Typography.Text>
                </div>
                <Button
                    type="primary"
                    icon={<UserAddOutlined />}
                    style={{ background: '#3b82f6', borderColor: '#3b82f6', height: '40px', borderRadius: '8px' }}
                    onClick={() => showModal()}
                >
                    Add User
                </Button>
            </div>

            <Card style={{ borderRadius: '12px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 20px 0 rgba(0, 0, 0, 0.06)' }}>
                <div style={{ marginBottom: '16px' }}>
                    <Input
                        placeholder="Search users..."
                        prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
                        style={{ width: '100%', maxWidth: '300px', borderRadius: '8px' }}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                </div>
                <Table
                    columns={columns}
                    dataSource={filteredUsers}
                    pagination={false}
                    loading={loading}
                    style={{ borderRadius: '8px' }}
                    scroll={{ x: 800 }}
                />
            </Card>

            <Modal
                title={editingUser ? "Edit User" : "Add New User"}
                open={isModalVisible}
                onCancel={handleCancel}
                onOk={handleSave}
                okText={editingUser ? "Update" : "Add"}
                centered
                style={{ borderRadius: '12px' }}
                okButtonProps={{ loading }}
                forceRender
                destroyOnHidden
            >
                <Form form={form} layout="vertical" style={{ marginTop: '16px' }}>
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                            { required: true, message: 'Please enter email' },
                            { type: 'email', message: 'Please enter a valid email' }
                        ]}
                    >
                        <Input placeholder="john@example.com" />
                    </Form.Item>
                    <Form.Item
                        name="role"
                        label="Role"
                        rules={[{ required: true, message: 'Please select a role' }]}
                    >
                        <Select placeholder="Select a role">
                            <Option value="Owner">Owner</Option>
                            <Option value="Admin">Admin</Option>
                            <Option value="Editor">Editor</Option>
                            <Option value="Viewer">Viewer</Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default RoleManagement;
