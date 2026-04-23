import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Alert, Spin } from 'antd'

const ImpersonateLogin = () => {
  const navigate = useNavigate()
  const [error, setError] = useState('')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token = params.get('token')
    const rawUser = params.get('user')

    if (!token) {
      setError('Missing impersonation token.')
      return
    }

    let user = { impersonated: true }
    if (rawUser) {
      try {
        user = JSON.parse(rawUser)
      } catch {
        setError('Invalid impersonation user payload.')
        return
      }
    }

    const impersonatedUser = {
      ...user,
      impersonated: true,
    }

    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(impersonatedUser))

    if (impersonatedUser.superAdminReturnUrl) {
      localStorage.setItem('superAdminReturnUrl', impersonatedUser.superAdminReturnUrl)
    }

    navigate('/dashboard', { replace: true })
  }, [navigate])

  if (error) {
    return (
      <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24 }}>
        <Alert type="error" showIcon message="Impersonation failed" description={error} />
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
      <Spin tip="Opening client dashboard..." />
    </div>
  )
}

export default ImpersonateLogin
