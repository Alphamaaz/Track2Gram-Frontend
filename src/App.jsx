import { Layout, ConfigProvider, App as AntApp } from 'antd'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Signup } from './pages/Signup'
import { Login } from './pages/Login'
import { ForgotPassword } from './pages/ForgotPassword'
import { ResetPassword } from './pages/ResetPassword'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Projects from './pages/Projects'
import ProjectConfiguration from './pages/ProjectConfiguration'
import LandingPageEditor from './pages/LandingPageEditor'
import MetaAdsIntegration from './pages/MetaAdsIntegration'
import GoogleAdsIntegration from './pages/GoogleAdsIntegration'
import TelegramIntegration from './pages/TelegramIntegration'
import LeadManagement from './pages/LeadManagement'
import Analytics from './pages/Analytics'
import RoleManagement from './pages/RoleManagement'
import Buyer from './pages/Buyer'
import Support from './pages/Support'
import EmailVerification from './pages/EmailVerification'
import AcceptInvite from './pages/AcceptInvite'
import GoogleAdsAuthorize from './pages/GoogleAdsAuthorize'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsOfService from './pages/TermsOfService'
import Features from './pages/LandingPages/Features'
import Pricing from './pages/LandingPages/Pricing'
import About from './pages/LandingPages/About'
import Contact from './pages/LandingPages/Contact'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import { useState } from 'react'

const { Content } = Layout

function App() {
  const [collapsed, setCollapsed] = useState(false)
  const isAuthenticated = Boolean(localStorage.getItem('token'))

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#084b8a',
          borderRadius: 10,
          fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
          colorBgContainer: '#ffffff',
          colorBgLayout: '#f8fafc',
          colorTextBase: '#0f172a',
        },
        components: {
          Button: {
            borderRadius: 8,
            controlHeight: 38,
            fontWeight: 600,
            colorPrimaryHover: '#0a5a9e',
          },
          Card: {
            borderRadiusLG: 16,
            boxShadowCard: '0 4px 24px rgba(0, 0, 0, 0.04)',
          },
          Table: {
            borderRadiusLG: 12,
            headerBg: '#084b8a',
            headerColor: '#ffffff',
            headerBorderRadius: 10,
          }
        }
      }}
    >
      <AntApp>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/google-ads/callback" element={<GoogleAdsAuthorize />} />
            <Route path="/verify-email" element={<EmailVerification />} />
            <Route path="/accept-invite" element={<AcceptInvite />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/features" element={<Features />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />

            <Route
              path="/*"
              element={
                isAuthenticated ? (
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
                        padding: 'clamp(16px, 4vw, 32px)',
                        background: '#f8fafc',
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
                          <Route path="projects/edit/:id" element={<ProjectConfiguration />} />
                          <Route path="landing-pages" element={<Navigate to="/landing-pages/builder" replace />} />
                          <Route path="landing-pages/builder" element={<LandingPageEditor />} />
                          <Route path="landing-pages/builder/:id" element={<LandingPageEditor />} />
                          <Route path="integrations/meta-ads" element={<MetaAdsIntegration />} />
                          <Route path="integrations/google-ads" element={<GoogleAdsIntegration />} />
                          <Route path="integrations/telegram" element={<TelegramIntegration />} />
                          <Route path="lead-management" element={<LeadManagement />} />
                          <Route path="analytics" element={<Analytics />} />

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
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
          </Routes>
        </Router>
      </AntApp>
    </ConfigProvider>
  )
}

export default App
