import React from 'react';
import { Layout, Typography, Space, Button } from 'antd';
import {
    FacebookFilled,
    InstagramFilled,
    LinkedinFilled,
    TwitterOutlined
} from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import LogoImg from '../assets/tyy 1.svg';

const { Header, Content, Footer } = Layout;
const { Text } = Typography;

const LandingLayout = ({ children }) => {
    const navigate = useNavigate();

    return (
        <Layout className="landing-page" style={{ background: '#fff', minHeight: '100vh', overflowX: 'hidden' }}>
            {/* Shared Navbar */}
            <Header style={{
                position: 'fixed',
                zIndex: 1000,
                width: '100%',
                background: '#fff',
                padding: '0 clamp(16px, 5vw, 120px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '2px solid #084b8a',
                height: '70px'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', flexShrink: 0 }} onClick={() => navigate('/')}>
                    <img src={LogoImg} alt="Track2Gram Logo" style={{ height: '32px' }} />
                </div>

                <div className="nav-links" style={{
                    display: 'flex',
                    gap: '40px',
                    alignItems: 'center',
                    position: 'absolute',
                    left: '50%',
                    transform: 'translateX(-50%)'
                }}>
                    {[
                        { label: 'Features', path: '/features' },
                        { label: 'Pricing', path: '/pricing' },
                        { label: 'About', path: '/about' },
                        { label: 'Contact', path: '/contact' }
                    ].map(link => (
                        <Text key={link.label} onClick={() => navigate(link.path)} className="nav-item" style={{ fontSize: '14px', fontWeight: 600, cursor: 'pointer', color: '#334155' }}>
                            {link.label}
                        </Text>
                    ))}
                </div>

                <div style={{ display: 'flex', gap: '12px', flexShrink: 0 }}>
                    <Button type="primary" onClick={() => navigate('/login')} style={{ height: '38px', padding: '0 20px', borderRadius: '8px', fontSize: '14px', fontWeight: 700, background: '#084b8a', border: 'none' }}>Log In</Button>
                    <Button type="primary" onClick={() => navigate('/signup')} style={{ height: '38px', padding: '0 20px', borderRadius: '8px', fontSize: '14px', fontWeight: 700, background: '#084b8a', border: 'none' }}>Sign Up</Button>
                </div>
            </Header>

            <Content style={{ marginTop: '70px' }}>
                {children}
            </Content>

            {/* Shared Footer */}
            <Footer style={{ background: '#E6ECF2', padding: '80px clamp(16px, 5vw, 120px) 40px', textAlign: 'center' }}>
                <div style={{ marginBottom: '40px' }}>
                    <img src={LogoImg} alt="Track2Gram Logo" style={{ height: '48px', marginBottom: '36px' }} />
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', flexWrap: 'wrap' }}>
                        {[
                            { icon: <FacebookFilled />, path: 'https://facebook.com' },
                            { icon: <InstagramFilled />, path: 'https://instagram.com' },
                            { icon: <LinkedinFilled />, path: 'https://linkedin.com' },
                            { icon: <TwitterOutlined />, path: 'https://twitter.com' }
                        ].map((social, idx) => (
                            <a key={idx} href={social.path} target="_blank" rel="noopener noreferrer" style={{
                                width: '56px',
                                height: '56px',
                                borderRadius: '50%',
                                background: '#084b8a',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#fff',
                                fontSize: '22px',
                                transition: 'all 0.3s ease'
                            }} className="social-icon">
                                {social.icon}
                            </a>
                        ))}
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '32px', marginBottom: '32px', flexWrap: 'wrap', alignItems: 'center' }}>
                    <Link to="/privacy-policy" style={{ color: '#0f172a', fontWeight: 700, fontSize: '15px' }} className="footer-link">Privacy Policy</Link>
                    <div style={{ width: '1.5px', height: '18px', background: 'rgba(0,0,0,0.1)' }}></div>
                    <Link to="/terms-of-service" style={{ color: '#0f172a', fontWeight: 700, fontSize: '15px' }} className="footer-link">Terms & Conditions</Link>
                </div>

                <Text style={{ color: '#64748b', fontSize: '14px', fontWeight: 500 }}>
                    © 2025 Track2Gram
                </Text>
            </Footer>

            <style>
                {`
                @media (max-width: 991px) {
                    .nav-links { display: none !important; }
                }
                .nav-item:hover {
                    color: #084b8a !important;
                }
                .social-icon:hover {
                    background: #1890ff !important;
                    transform: translateY(-3px);
                }
                .footer-link:hover {
                    color: #084b8a !important;
                    text-decoration: underline !important;
                }
                .landing-page .ant-btn-primary:hover {
                    background: #063a6e !important;
                }
                `}
            </style>
        </Layout>
    );
};

export default LandingLayout;
