import { Layout, Avatar, Space, Button } from 'antd'
import {
  UserOutlined,
  BellOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined
} from '@ant-design/icons'
import logo from '../assets/tyy 1.svg'

const { Header: AntHeader } = Layout

const Header = ({ collapsed, onToggle }) => {
  return (
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
          <img src={logo} alt="Track Bridge" style={{ height: '28px', width: 'auto' }} />
         
        </div>
      </div>

      <Space size="middle">
        <BellOutlined style={{ fontSize: '18px', color: '#64748B', cursor: 'pointer' }} />
        <Avatar
          size="small"
          icon={<UserOutlined />}
          style={{ backgroundColor: '#f5f7fa', color: '#3B82F6', cursor: 'pointer' }}
        />
      </Space>
    </AntHeader>
  )
}

export default Header
