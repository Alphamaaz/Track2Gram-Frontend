import React, { useState } from 'react';
import { Table, Tag, Space, Button, Card, Typography, Input, Select, Modal, Form, message, Popconfirm, Avatar } from 'antd';
import { UserOutlined, EditOutlined, DeleteOutlined, UserAddOutlined, SearchOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Option } = Select;

const RoleManagement = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [editingUser, setEditingUser] = useState(null);
    const [searchText, setSearchText] = useState('');

    const [users, setUsers] = useState([
        {
            key: '1',
            name: 'Sabreen',
            email: 'sabreen@example.com',
            role: 'Admin',
            status: 'Active',
        },
        {
            key: '2',
            name: 'John Doe',
            email: 'john@example.com',
            role: 'Manager',
            status: 'Active',
        },
        {
            key: '3',
            name: 'Alice Smith',
            email: 'alice@example.com',
            role: 'Editor',
            status: 'Inactive',
        },
    ]);

    const showModal = (user = null) => {
        setEditingUser(user);
        if (user) {
            form.setFieldsValue(user);
        } else {
            form.resetFields();
        }
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setEditingUser(null);
    };

    const handleSave = async () => {
        try {
            const values = await form.validateFields();
            if (editingUser) {
                setUsers(users.map(u => u.key === editingUser.key ? { ...u, ...values } : u));
                message.success('User updated successfully');
            } else {
                const newUser = {
                    key: (users.length + 1).toString(),
                    ...values,
                    status: 'Active',
                };
                setUsers([...users, newUser]);
                message.success('User added successfully');
            }
            setIsModalVisible(false);
            setEditingUser(null);
        } catch (error) {
            console.error('Validation failed:', error);
        }
    };

    const handleDelete = (key) => {
        setUsers(users.filter(u => u.key !== key));
        message.success('User deleted successfully');
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text) => (
                <Space>
                    <Avatar size="small" icon={<UserOutlined />} style={{ backgroundColor: '#f1f5f9', color: '#3b82f6' }} />
                    <span style={{ fontWeight: 500 }}>{text}</span>
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
            render: (role) => {
                let color = 'blue';
                if (role === 'Admin') color = 'gold';
                if (role === 'Editor') color = 'green';
                return (
                    <Tag color={color} style={{ borderRadius: '4px', textTransform: 'uppercase', fontWeight: 600, fontSize: '10px' }}>
                        {role}
                    </Tag>
                );
            },
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={status === 'Active' ? 'success' : 'error'} style={{ borderRadius: '12px' }}>
                    {status}
                </Tag>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        type="text"
                        icon={<EditOutlined style={{ color: '#3b82f6' }} />}
                        onClick={() => showModal(record)}
                    />
                    <Popconfirm
                        title="Are you sure to delete this user?"
                        onConfirm={() => handleDelete(record.key)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button type="text" icon={<DeleteOutlined style={{ color: '#ef4444' }} />} />
                    </Popconfirm>
                </Space>
            ),
        },
    ];


    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchText.toLowerCase()) ||
        user.email.toLowerCase().includes(searchText.toLowerCase())
    );

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
            >
                <Form form={form} layout="vertical" style={{ marginTop: '16px' }}>
                    <Form.Item
                        name="name"
                        label="Full Name"
                        rules={[{ required: true, message: 'Please enter full name' }]}
                    >
                        <Input placeholder="John Doe" />
                    </Form.Item>
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
                            <Option value="Admin">Admin</Option>
                            <Option value="Manager">Manager</Option>
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
