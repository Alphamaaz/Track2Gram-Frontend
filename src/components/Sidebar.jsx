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
  LogoutOutlined
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
      label: <Link to="/integrations">Integration</Link>,
    },
    {
      key: '/lead-management',
      icon: <TeamOutlined />,
      label: <Link to="/lead-management">Lead Management</Link>,
    },
    {
      key: '/analytics',
      icon: <BarChartOutlined />,
      label: <Link to="/analytics">Analytics</Link>,
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
        zIndex: 1001,
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          style={{
            flex: 1,
            borderRight: 0,
            backgroundColor: 'transparent',
            paddingTop: '16px'
          }}
          items={menuItems.map(item => ({
            ...item,
            style: {
              color: 'rgba(255, 255, 255, 0.8)',
              marginBottom: '4px',
            }
          }))}
        />

        <div style={{ padding: '80px 16px 24px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <Menu
            mode="inline"
            style={{ backgroundColor: 'transparent', borderRight: 0 }}
            selectable={false}
            items={[
              {
                key: 'logout',
                icon: <LogoutOutlined />,
                label: <Link to="/login">Logout</Link>,
                style: { color: 'rgba(255, 255, 255, 0.8)' }
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
          .ant-menu-item:hover {
            color: #fff !important;
            background-color: rgba(255, 255, 255, 0.1) !important;
          }
          .ant-menu-item a {
            color: inherit !important;
          }
          .ant-menu-item .anticon {
            font-size: 18px !important;
          }
          .ant-layout-sider-collapsed .ant-menu-item {
             padding: 0 24px !important;
          }
        `}
      </style>
    </Sider>
  )
}

export default Sidebar
