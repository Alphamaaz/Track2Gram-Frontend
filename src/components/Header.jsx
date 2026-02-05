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
              color: '#3B82F6'
            }}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img src={logo} alt="Track Bridge" style={{ height: '42px', width: 'auto' }} />
          </div>
        </div>

        <Space size="middle">
          <Avatar
            size="small"
            icon={<UserOutlined />}
            style={{ backgroundColor: '#f5f7fa', color: '#3B82F6', cursor: 'pointer' }}
            onClick={() => setProfileVisible(true)}
          />
        </Space>
      </AntHeader>
      <ProfileModal
        visible={profileVisible}
        onCancel={() => setProfileVisible(false)}
      />
    </>
  )
}

export default Header
