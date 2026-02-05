import { Layout, Menu } from 'antd'
import { Link, useLocation } from 'react-router-dom'
import {
  DashboardOutlined,
  ProjectOutlined,
  FileTextOutlined,
  LinkOutlined,
  TeamOutlined,
  BarChartOutlined,
  SettingOutlined,
  LogoutOutlined,
  CustomerServiceOutlined,
  HistoryOutlined
} from '@ant-design/icons'

const { Sider } = Layout

const Sidebar = ({ collapsed, setCollapsed }) => {
  const location = useLocation()

  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: <Link to="/dashboard">Dashboard</Link>,
    },
    {
      key: '/projects',
      icon: <ProjectOutlined />,
      label: <Link to="/projects">Projects</Link>,
    },
    {
      key: '/landing-pages',
      icon: <FileTextOutlined />,
      label: <Link to="/landing-pages">Landing Pages</Link>,
    },
    {
      key: '/integrations',
      icon: <LinkOutlined />,
      label: 'Integration',
      children: [
        {
          key: '/integrations/meta-ads',
          label: <Link to="/integrations/meta-ads">Meta Ads</Link>,
        },
        {
          key: '/integrations/google-ads',
          label: <Link to="/integrations/google-ads">Google Ads</Link>,
        },
        {
          key: '/integrations/telegram',
          label: <Link to="/integrations/telegram">Telegram</Link>,
        },
      ]
    },
    {
      key: '/lead-management',
      icon: <TeamOutlined />,
      label: <Link to="/lead-management">Lead Management</Link>,
    },
    {
      key: '/buyers',
      icon: <HistoryOutlined />,
      label: <Link to="/buyers">Transaction History</Link>,
    },
    {
      key: '/analytics',
      icon: <BarChartOutlined />,
      label: <Link to="/analytics">Analytics</Link>,
    },
    {
      key: '/role-management',
      icon: <TeamOutlined />,
      label: <Link to="/role-management">Role Management</Link>,
    },
    {
      key: '/support',
      icon: <CustomerServiceOutlined />,
      label: <Link to="/support">Support</Link>,
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: <Link to="/settings">Settings</Link>,
    },
  ]

  return (
    <Sider
      width={260}
      trigger={null}
      collapsible
      collapsed={collapsed}
      breakpoint="lg"
      onBreakpoint={(broken) => {
        if (broken) {
          setCollapsed(true)
        }
      }}
      theme="light"
      style={{
        overflow: 'auto',
        height: 'calc(100vh - 64px)',
        position: 'sticky',
        left: 0,
        top: 64,
        bottom: 0,
        backgroundColor: '#3B82F6',
        zIndex: 1002,
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          inlineCollapsed={collapsed}
          style={{
            flex: 1,
            borderRight: 0,
            backgroundColor: 'transparent',
            paddingTop: '16px'
          }}
          items={menuItems.map(item => ({
            ...item,
            style: {
              color: '#ffffff',
              marginBottom: '4px',
            },
            ...(item.children ? {
              children: item.children.map(child => ({
                ...child,
                style: { color: '#ffffff' }
              }))
            } : {})
          }))}
        />

        <div style={{ padding: '24px 16px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <Menu
            mode="inline"
            style={{ backgroundColor: 'transparent', borderRight: 0 }}
            selectable={false}
            items={[
              {
                key: 'logout',
                icon: <LogoutOutlined />,
                label: <Link to="/login">Logout</Link>,
                style: { color: '#ffffff' }
              }
            ]}
          />
        </div>
      </div>

      <style>
        {`
          .ant-menu-item-selected {
            background-color: rgba(255, 255, 255, 0.2) !important;
            color: #fff !important;
          }
          .ant-menu-item:hover, .ant-menu-submenu-title:hover {
            color: #fff !important;
            background-color: rgba(255, 255, 255, 0.1) !important;
          }
          .ant-menu-item a, .ant-menu-submenu-title {
            color: #ffffff !important;
          }
          .ant-menu-item .anticon, .ant-menu-submenu-title .anticon {
            font-size: 18px !important;
            color: #ffffff !important;
          }
          .ant-menu-submenu-arrow {
            color: #ffffff !important;
          }
          .ant-menu-sub {
            background: #3B82F6 !important;
          }
          .ant-layout-sider-collapsed .ant-menu-item, 
          .ant-layout-sider-collapsed .ant-menu-submenu-title {
             padding: 0 24px !important;
             text-align: center !important;
          }
        `}
      </style>
    </Sider>
  )
}

export default Sidebar
