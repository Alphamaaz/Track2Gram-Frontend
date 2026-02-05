import { Layout, ConfigProvider } from 'antd'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Signup } from './pages/Signup'
import { Login } from './pages/Login'
import { ForgotPassword } from './pages/ForgotPassword'
import Dashboard from './pages/Dashboard'
import Projects from './pages/Projects'
import ProjectConfiguration from './pages/ProjectConfiguration'
import LandingPages from './pages/LandingPages'
import MetaAdsIntegration from './pages/MetaAdsIntegration'
import GoogleAdsIntegration from './pages/GoogleAdsIntegration'
import TelegramIntegration from './pages/TelegramIntegration'
import LeadManagement from './pages/LeadManagement'
import Analytics from './pages/Analytics'
import Settings from './pages/Settings'
import RoleManagement from './pages/RoleManagement'
import Buyer from './pages/Buyer'
import Support from './pages/Support'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import { useState } from 'react'

const { Content } = Layout

function App() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#3B82F6',
          borderRadius: 8,
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
        },
      }}
    >
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/signup" replace />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          <Route
            path="/*"
            element={
              <Layout style={{ minHeight: '100vh' }}>
                <Header
                  collapsed={collapsed}
                  onToggle={() => setCollapsed(!collapsed)}
                />
                <Layout style={{ marginTop: 64 }}>
                  <Sidebar
                    collapsed={collapsed}
                    setCollapsed={setCollapsed}
                  />
                  <Content
                    style={{
                      padding: 'clamp(12px, 3vw, 24px)',
                      background: '#ffffff',
                      minHeight: 280,
                      transition: 'all 0.2s cubic-bezier(0.2, 0, 0, 1)',
                    }}
                    className="main-content-area"
                  >
                    <div style={{ maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
                      <Routes>
                        <Route path="dashboard" element={<Dashboard />} />

                        <Route path="projects" element={<Projects />} />
                        <Route path="projects/new" element={<ProjectConfiguration />} />
                        <Route path="landing-pages" element={<LandingPages />} />
                        <Route path="integrations/meta-ads" element={<MetaAdsIntegration />} />
                        <Route path="integrations/google-ads" element={<GoogleAdsIntegration />} />
                        <Route path="integrations/telegram" element={<TelegramIntegration />} />
                        <Route path="lead-management" element={<LeadManagement />} />
                        <Route path="analytics" element={<Analytics />} />
                        <Route path="settings" element={<Settings />} />
                        <Route path="role-management" element={<RoleManagement />} />
                        <Route path="buyers" element={<Buyer />} />
                        <Route path="support" element={<Support />} />
                      </Routes>
                    </div>
                  </Content>
                </Layout>

                <style>
                  {`
                    @media (max-width: 991px) {
                      .main-content-area {
                        padding: 12px 12px !important;
                        margin-left: 0 !important;
                      }
                      .ant-layout-sider {
                        position: fixed !important;
                        height: 100vh !important;
                        z-index: 1003 !important;
                        left: ${collapsed ? '-260px' : '0'} !important;
                        transition: left 0.3s ease !important;
                        box-shadow: ${collapsed ? 'none' : '4px 0 10px rgba(0,0,0,0.1)'} !important;
                      }
                      .mobile-overlay {
                        position: fixed;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        background: rgba(0,0,0,0.4);
                        z-index: 1002;
                        display: ${collapsed ? 'none' : 'block'};
                      }
                    }
                  `}
                </style>
                {!collapsed && <div className="mobile-overlay" onClick={() => setCollapsed(true)} />}
              </Layout>
            }
          />
        </Routes>
      </Router>
    </ConfigProvider>
  )
}

export default App
