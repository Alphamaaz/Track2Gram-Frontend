import { Layout, ConfigProvider } from 'antd'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Signup } from './pages/Signup'
import { Login } from './pages/Login'
import { ForgotPassword } from './pages/ForgotPassword'
import Dashboard from './pages/Dashboard'
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
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
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
                      padding: '24px',
                      background: '#ffffff',
                      minHeight: 280,
                      transition: 'all 0.2s cubic-bezier(0.2, 0, 0, 1)',
                    }}
                    className="main-content-area"
                  >
                    <div style={{ maxWidth: '1400px', margin: 0 }}>
                      <Routes>
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="dashbaord" element={<Navigate to="/dashboard" replace />} />
                      </Routes>
                    </div>
                  </Content>
                </Layout>

                <style>
                  {`
                    @media (max-width: 991px) {
                      .main-content-area {
                        margin-left: 0 !important;
                      }
                    }
                  `}
                </style>
              </Layout>
            }
          />
        </Routes>
      </Router>
    </ConfigProvider>
  )
}

export default App
