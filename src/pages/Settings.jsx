import { useState } from 'react'
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
    Col
} from 'antd'
import { PlusOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons'

const { Title, Text } = Typography

// --- Mock Data ---
const usersData = [
    {
        key: '1',
        name: 'Liam Carter',
        email: 'liam.carter@example.com',
        role: 'Admin',
        status: 'Active',
    },
    {
        key: '2',
        name: 'Olivia Bennet',
        email: 'olivia.bennet@example.com',
        role: 'Client',
        status: 'Active',
    },
    {
        key: '3',
        name: 'Ethan Walker',
        email: 'ethan.walker@example.com',
        role: 'Client',
        status: 'Inactive',
    },
]

// --- Components for each Tab ---

const GeneralSettings = () => {
    const [form] = Form.useForm()
    return (
        <div style={{ maxWidth: '800px' }}>
            <Form layout="vertical" form={form}>
                {/* Personal Sections */}
                <section style={{ marginBottom: 32 }}>
                    <Form.Item label="Name" name="name">
                        <Input placeholder="Enter name" />
                    </Form.Item>
                    <Form.Item label="Email" name="email">
                        <Input placeholder="Enter email" />
                    </Form.Item>
                    <Form.Item label="Timezone" name="timezone">
                        <Input placeholder="Timezone" />
                    </Form.Item>
                </section>

                {/* Ads Platform */}
                <section style={{ marginBottom: 32 }}>
                    <Title level={4}>Ads Platform</Title>
                    <Form.Item label="Meta Business ID" name="metaBusinessId">
                        <Input />
                    </Form.Item>
                    <Form.Item label="Meta Pixel ID" name="metaPixelId">
                        <Input />
                    </Form.Item>
                    <Form.Item label="Meta Access Token" name="metaAccessToken">
                        <Input />
                    </Form.Item>
                    <Form.Item label="Google Ads ID" name="googleAdsId">
                        <Input />
                    </Form.Item>
                    <Form.Item label="Google Conversion ID" name="googleConversionId">
                        <Input />
                    </Form.Item>
                    <Form.Item label="Google Conversion Label" name="googleConversionLabel">
                        <Input />
                    </Form.Item>
                    <Form.Item label="Global App ID" name="globalAppId">
                        <Input />
                    </Form.Item>
                    <Form.Item label="Global App Secret" name="globalAppSecret">
                        <Input />
                    </Form.Item>
                </section>

                {/* Telegram */}
                <section style={{ marginBottom: 32 }}>
                    <Title level={4}>Telegram</Title>
                    <Form.Item label="Bot Token" name="telegramBotToken">
                        <Input />
                    </Form.Item>
                    <Button style={{ marginBottom: 24 }}>Verify</Button>

                    <Form.Item label="Channel" name="telegramChannel">
                        <Input />
                    </Form.Item>
                </section>

                {/* Landing Page */}
                <section style={{ marginBottom: 32 }}>
                    <Title level={4}>Landing Page</Title>
                    <Form.Item label="Template" name="landingTemplate">
                        <Input />
                    </Form.Item>
                    <Form.Item label="Domain" name="landingDomain">
                        <Input />
                    </Form.Item>
                    <Form.Item label="Redirect URL" name="landingRedirectUrl">
                        <Input />
                    </Form.Item>
                </section>

                {/* User Management */}
                <section style={{ marginBottom: 32 }}>
                    <Title level={4}>Platform & User Management</Title>
                    <Table
                        dataSource={usersData}
                        pagination={false}
                        columns={[
                            { title: 'Name', dataIndex: 'name', key: 'name' },
                            { title: 'Email', dataIndex: 'email', key: 'email' },
                            {
                                title: 'Role',
                                dataIndex: 'role',
                                key: 'role',
                                render: (role) => (
                                    <Tag style={{ border: 'none', background: '#e6f4ff', color: '#1677ff', padding: '4px 12px', borderRadius: '12px', fontWeight: 500 }}>
                                        {role}
                                    </Tag>
                                )
                            },
                            {
                                title: 'Status',
                                dataIndex: 'status',
                                key: 'status',
                                render: (status) => (
                                    <Tag style={{ border: 'none', background: status === 'Active' ? '#f6ffed' : '#f5f5f5', color: status === 'Active' ? '#52c41a' : 'rgba(0,0,0,0.25)', padding: '4px 12px', borderRadius: '12px', fontWeight: 500 }}>
                                        {status}
                                    </Tag>
                                )
                            },
                        ]}
                    />
                    <Button style={{ marginTop: 16 }}>Invite User</Button>
                </section>

                {/* Notifications */}
                <section style={{ marginBottom: 32 }}>
                    <Title level={4}>Notifications</Title>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                        <div>
                            <div style={{ fontWeight: 500 }}>Campaign Alerts</div>
                            <div style={{ color: '#888', fontSize: '13px' }}>Receive alerts for campaign performance updates</div>
                        </div>
                        <Switch />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <div style={{ fontWeight: 500 }}>Platform Updates</div>
                            <div style={{ color: '#888', fontSize: '13px' }}>Get notified about new feature releases and updates.</div>
                        </div>
                        <Switch />
                    </div>
                </section>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 40 }}>
                    <Button type="primary" size="large" style={{ borderRadius: '6px' }}>Save Changes</Button>
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
