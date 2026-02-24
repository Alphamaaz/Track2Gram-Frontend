import { Layout, Avatar, Space, Button } from 'antd'
import { useState } from 'react'
import ProfileModal from './ProfileModal'
import {
  UserOutlined,
  BellOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined
} from '@ant-design/icons'
import logo from '../assets/tyy 1.svg'

const { Header: AntHeader } = Layout

const Header = ({ collapsed, onToggle }) => {
  const [profileVisible, setProfileVisible] = useState(false)
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <>
      <AntHeader
        style={{
          background: '#fff',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'fixed',
          zIndex: 1002,
          width: '100%',
          height: '64px',
          borderBottom: '1px solid #f0f0f0'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={onToggle}
            style={{
              fontSize: '16px',
              width: 40,
              height: 40,
              color: '#084b8a',
              transition: 'all 0.3s'
            }}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img src={logo} alt="Track2Gram" className="track-bridge-logo" style={{ height: '44px', width: 'auto' }} />
          </div>
        </div>

        <Space size="large" onClick={() => setProfileVisible(true)} style={{ cursor: 'pointer', transition: 'all 0.3s' }}>
          {user.name && (
            <span className="user-name-desktop" style={{
              fontWeight: 700,
              color: '#1e293b',
              fontSize: '16px',
              marginRight: '6px'
            }}>
              {user.name}
            </span>
          )}
          <Avatar
            size="default"
            icon={<UserOutlined />}
            style={{ backgroundColor: '#f1f5f9', color: '#084b8a', fontSize: '18px' }}
          />
        </Space>
      </AntHeader>
      <ProfileModal
        visible={profileVisible}
        onCancel={() => setProfileVisible(false)}
      />
      <style>
        {`
          @media (max-width: 576px) {
            .user-name-desktop {
              display: none !important;
            }
            .track-bridge-logo {
              height: 32px !important;
            }
          }
        `}
      </style>
    </>
  )
}

export default Header
