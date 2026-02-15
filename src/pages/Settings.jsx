import { useState, useEffect } from 'react'
import {
    Tabs,
    Form,
    Input,
    Button,
    Table,
    Tag,
    Switch,
    Card,
    Space,
    Typography,
    Divider,
    Row,
    Col,
    message,
    Skeleton
} from 'antd'
import {
    PlusOutlined,
    EyeInvisibleOutlined,
    EyeTwoTone,
    UserOutlined,
    GlobalOutlined
} from '@ant-design/icons'
import authService from '../services/auth'

const { Title, Text } = Typography

// --- Components for each Tab ---

const GeneralSettings = () => {
    const [form] = Form.useForm()
    const [loading, setLoading] = useState(false)
    const [fetching, setFetching] = useState(true)

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await authService.getProfile();
                const data = response.user || response;
                form.setFieldsValue({
                    name: data.name,
                    email: data.email
                });
            } catch (error) {
                console.error('Failed to fetch profile settings:', error);
                message.error('Failed to load profile settings');
            } finally {
                setFetching(false);
            }
        };
        fetchProfile();
    }, [form]);

    const handleSaveProfile = async () => {
        try {
            const values = await form.validateFields();
            setLoading(true);

            await authService.updateProfile({ name: values.name });
            message.success('General settings updated successfully!');

            // Refresh local storage
            const freshProfile = await authService.getProfile();
            localStorage.setItem('user', JSON.stringify(freshProfile.user || freshProfile));
        } catch (error) {
            console.error('Update failed:', error);
            message.error(error.message || 'Failed to update settings');
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return <Skeleton active paragraph={{ rows: 6 }} />;
    }

    return (
        <div style={{ maxWidth: '600px' }}>
            <Form layout="vertical" form={form}>
                {/* Personal Information */}
                <Card
                    title={<span style={{ fontWeight: 700 }}>Personal Information</span>}
                    style={{ marginBottom: 24, borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)', border: '1px solid #F1F5F9' }}
                >
                    <Form.Item label={<span style={{ fontWeight: 600 }}>Full Name</span>} name="name" style={{ marginBottom: 20 }}>
                        <Input placeholder="Enter name" style={{ borderRadius: '10px', padding: '10px 14px' }} />
                    </Form.Item>
                    <Form.Item label={<span style={{ fontWeight: 600 }}>Email Address</span>} name="email" style={{ marginBottom: 0 }}>
                        <Input placeholder="Enter email" disabled style={{ borderRadius: '10px', padding: '10px 14px', background: '#F8FAFC' }} />
                    </Form.Item>
                </Card>

                {/* Notifications */}
                <Card
                    title={<span style={{ fontWeight: 700 }}>Communication Preferences</span>}
                    style={{ marginBottom: 24, borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)', border: '1px solid #F1F5F9' }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                        <div>
                            <div style={{ fontWeight: 600, color: '#1E293B' }}>Campaign Alerts</div>
                            <div style={{ color: '#64748B', fontSize: '12px' }}>Receive notifications for campaign updates.</div>
                        </div>
                        <Switch defaultChecked />
                    </div>
                    <Divider style={{ margin: '16px 0' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <div style={{ fontWeight: 600, color: '#1E293B' }}>Platform Updates</div>
                            <div style={{ color: '#64748B', fontSize: '13px' }}>Get notified about new feature releases.</div>
                        </div>
                        <Switch defaultChecked />
                    </div>
                </Card>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24 }}>
                    <Button
                        type="primary"
                        size="large"
                        style={{
                            borderRadius: '12px',
                            padding: '0 40px',
                            height: '48px',
                            fontWeight: 700,
                            background: 'linear-gradient(135deg, #084b8a 0%, #052c52 100%)',
                            border: 'none',
                            boxShadow: '0 8px 20px rgba(8, 75, 138, 0.25)'
                        }}
                        onClick={handleSaveProfile}
                        loading={loading}
                    >
                        Save Changes
                    </Button>
                </div>
            </Form>
        </div>
    )
}

const ClientSettings = () => (
    <div style={{ maxWidth: '800px' }}>
        <Form layout="vertical">
            <section style={{ marginBottom: 32 }}>
                <Title level={4}>Project Settings</Title>
                <Form.Item label="Project Name">
                    <Input />
                </Form.Item>
                <Form.Item label="Project ID">
                    <Input />
                </Form.Item>
                <Form.Item label="Project URL">
                    <Input />
                </Form.Item>
            </section>

            <section style={{ marginBottom: 32 }}>
                <Title level={4}>Meta Ads</Title>
                <Form.Item label="Meta Pixel ID">
                    <Input />
                </Form.Item>
                <Form.Item label="Meta Conversion API Token">
                    <Input />
                </Form.Item>
            </section>

            <section style={{ marginBottom: 32 }}>
                <Title level={4}>Google Ads</Title>
                <Form.Item label="Google Ads Conversion ID">
                    <Input />
                </Form.Item>
                <Form.Item label="Google Ads Conversion Label">
                    <Input />
                </Form.Item>
            </section>

            <section style={{ marginBottom: 32 }}>
                <Title level={4}>Telegram</Title>
                <Form.Item label="Telegram Bot Token">
                    <Input />
                </Form.Item>
                <Form.Item label="Telegram Chat ID">
                    <Input />
                </Form.Item>
            </section>

            <section style={{ marginBottom: 32 }}>
                <Title level={4}>Landing Page</Title>
                <Form.Item label="Landing Page URL">
                    <Input />
                </Form.Item>
            </section>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 40 }}>
                <Button type="primary" size="large" style={{ borderRadius: '6px' }}>Save Changes</Button>
            </div>
        </Form>
    </div>
)

const ApiKeySettings = () => (
    <div style={{ maxWidth: '800px' }}>
        <div style={{ marginBottom: 8, color: '#888' }}>
            These keys are sensitive and should be kept confidential. Do not share them with anyone.
        </div>

        <Form layout="vertical">
            {/* Meta Ads API */}
            <section style={{ marginBottom: 40, marginTop: 24 }}>
                <div style={{ fontWeight: 600, fontSize: '16px', marginBottom: 4 }}>Meta Ads API</div>
                <div style={{ color: '#888', marginBottom: 16 }}>Connect your Meta Ads account to Track Bridge</div>
                <Button type="primary" style={{ marginBottom: 24, borderRadius: '6px' }}>Connect</Button>

                <Form.Item label="App ID">
                    <Input />
                </Form.Item>
                <Form.Item label="App Secret">
                    <Input.Password
                        iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                    />
                </Form.Item>

                <Space>
                    <Button>Copy</Button>
                    <Button type="primary">Save</Button>
                </Space>
            </section>

            {/* Google Ads Credentials */}
            <section style={{ marginBottom: 40 }}>
                <div style={{ fontWeight: 600, fontSize: '16px', marginBottom: 4 }}>Google Ads Credentials</div>
                <div style={{ color: '#888', marginBottom: 16 }}>Connect your Google Ads account to Track Bridge.</div>
                <Button type="primary" style={{ marginBottom: 24, borderRadius: '6px' }}>Connect</Button>

                <Form.Item label="OAuth Client ID">
                    <Input />
                </Form.Item>
                <Form.Item label="OAuth Client Secret">
                    <Input.Password
                        iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                    />
                </Form.Item>

                <Space style={{ marginBottom: 24 }}>
                    <Button>Copy</Button>
                    <Button type="primary">Save</Button>
                </Space>

                <div>
                    <Button type="primary" style={{ borderRadius: '6px' }}>Generate New Key</Button>
                </div>
            </section>

        </Form>
    </div>
)

const Settings = () => {
    const [activeTab, setActiveTab] = useState('1')

    const items = [
        {
            key: '1',
            label: 'General',
            children: <GeneralSettings />,
        },
        {
            key: '2',
            label: 'Client',
            children: <ClientSettings />,
        },
        {
            key: '3',
            label: 'API Keys',
            children: <ApiKeySettings />,
        },
    ]

    return (
        <div style={{ padding: '0 0 24px 0' }}>
            <Title level={2} style={{ marginBottom: 24 }}>Settings</Title>

            <Tabs
                defaultActiveKey="1"
                activeKey={activeTab}
                onChange={setActiveTab}
                items={items}
                size="large"
                tabBarStyle={{ marginBottom: 32 }}
            />
        </div>
    )
}

export default Settings
