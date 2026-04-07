import { Layout, Menu } from 'antd'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  DashboardOutlined,
  ProjectOutlined,
  FileTextOutlined,
  LinkOutlined,
  TeamOutlined,
  BarChartOutlined,
  LogoutOutlined,
  CustomerServiceOutlined,
  HistoryOutlined,
  MessageOutlined,
  CreditCardOutlined,
  TrophyOutlined
} from '@ant-design/icons'
import { API_BASE_URL } from '../config'
import { useState, useEffect } from 'react'

const { Sider } = Layout

const Sidebar = ({ collapsed, setCollapsed }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const [subscription, setSubscription] = useState(null)

  const fetchSubscription = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${API_BASE_URL}/settings/subscription/status`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) {
        setSubscription(await res.json())
      }
    } catch {
      console.warn('Failed to load subscription status')
    }
  }

  useEffect(() => {
    fetchSubscription()
  }, [])

  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const userRole = (user.role || '').toLowerCase()
  const isAdminOrOwner = userRole === 'admin' || userRole === 'owner'

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    sessionStorage.removeItem('auth_redirect_in_progress')
    navigate('/login', { replace: true })
  }

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
      label: <Link to="/landing-pages/builder">Landing Pages</Link>,
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
      ],
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
    // {
    //   key: '/retention',
    //   icon: <MessageOutlined />,
    //   label: <Link to="/retention">Retention</Link>,
    // },
    {
      key: '/billing',
      icon: <CreditCardOutlined />,
      label: <Link to="/billing">Subscription</Link>,
    },
    isAdminOrOwner && {
      key: '/role-management',
      icon: <TeamOutlined />,
      label: <Link to="/role-management">Role Management</Link>,
    },
    {
      key: '/support',
      icon: <CustomerServiceOutlined />,
      label: <Link to="/support">Support</Link>,
    },
  ].filter(Boolean)

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
        backgroundColor: '#084b8a',
        zIndex: 1002,
        boxShadow: '4px 0 24px rgba(0,0,0,0.05)',
        paddingBottom: '40px',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          defaultOpenKeys={['/integrations']}
          inlineCollapsed={collapsed}
          style={{
            flex: 1,
            borderRight: 0,
            backgroundColor: 'transparent',
            paddingTop: '16px',
          }}
          items={menuItems.map((item) => ({
            ...item,
            style: {
              color: '#cbd5e1',
              marginBottom: '4px',
              borderRadius: '8px',
              marginInline: '12px',
              width: 'calc(100% - 24px)',
            },
            ...(item.children
              ? {
                children: item.children.map((child) => ({
                  ...child,
                  style: {
                    color: '#cbd5e1',
                    borderRadius: '8px',
                  },
                })),
              }
              : {}),
          }))}
        />

        {subscription?.isTrialing && (
          <div style={{
            margin: '8px 16px',
            padding: collapsed ? '12px 0' : '16px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            textAlign: 'center',
            border: '1px dashed rgba(255, 255, 255, 0.3)'
          }}>
            {collapsed ? (
              <TrophyOutlined style={{ color: '#fbbf24', fontSize: '20px' }} />
            ) : (
              <>
                <div style={{ color: '#fbbf24', fontWeight: 700, fontSize: '12px', marginBottom: '4px' }}>
                  <TrophyOutlined style={{ marginRight: 6 }} />
                  FREE TRIAL
                </div>
                <div style={{ color: '#fff', fontSize: '11px' }}>
                  {subscription.trialDaysRemaining} days remaining
                </div>
              </>
            )}
          </div>
        )}

        <div style={{ padding: '24px 16px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <Menu
            mode="inline"
            style={{ backgroundColor: 'transparent', borderRight: 0 }}
            selectable={false}
            items={[
              {
                key: 'logout',
                icon: <LogoutOutlined />,
                label: <span onClick={handleLogout}>Logout</span>,
                style: {
                  color: '#fb7185',
                  borderRadius: '8px',
                  marginInline: '12px',
                  width: 'calc(100% - 24px)',
                },
              },
            ]}
          />
        </div>
      </div>

      <style>
        {`
          .ant-menu-item-selected {
            background-color: #084b8a !important;
            color: #fff !important;
          }
          .ant-menu-item:hover, .ant-menu-submenu-title:hover {
            color: #fff !important;
            background-color: rgba(255, 255, 255, 0.15) !important;
          }
          .ant-menu-item a, .ant-menu-submenu-title {
            color: inherit !important;
            font-weight: 500 !important;
            transition: all 0.2s;
          }
          .ant-menu-item-selected a {
            color: #ffffff !important;
            font-weight: 600 !important;
          }
          .ant-menu-item .anticon, .ant-menu-submenu-title .anticon {
            font-size: 18px !important;
            color: inherit !important;
          }
          .ant-menu-submenu-arrow {
            color: #94a3b8 !important;
          }
          .ant-menu-sub {
            background: transparent !important;
          }
          .ant-layout-sider-collapsed .ant-menu-item {
             margin-inline: 4px !important;
             width: calc(100% - 8px) !important;
          }
        `}
      </style>
    </Sider>
  )
}

export default Sidebar
