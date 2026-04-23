import React, { useState } from 'react';
import { Layout, Typography, Space, Button, Drawer, Menu, Switch, ConfigProvider, theme } from 'antd';
import {
    FacebookFilled,
    InstagramFilled,
    LinkedinFilled,
    YoutubeFilled,
    PlaySquareOutlined,
    TwitterOutlined,
    MenuOutlined,
    CloseOutlined,
    SunOutlined,
    BulbOutlined,
    WhatsAppOutlined
} from '@ant-design/icons';
import TikTokIcon from './TikTokIcon';
import { useNavigate, Link } from 'react-router-dom';
import LogoImg from '../assets/tyy 1.svg';

const { Header, Content, Footer } = Layout;
const { Text } = Typography;

const LandingLayout = ({ children, isDarkTheme = false, setIsDarkTheme = null, themeColors = null }) => {
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    React.useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Default theme colors if not provided
    const defaultThemeColors = isDarkTheme ? {
        bg: '#0f172a',
        heroBg: '#1e293b',
        text: '#f1f5f9',
        mutedText: '#cbd5e1',
        cardBg: '#1e293b',
        primary: '#3b82f6',
        border: 'rgba(59, 130, 246, 0.2)'
    } : {
        bg: '#fff',
        heroBg: '#E6ECF2',
        text: '#0f172a',
        mutedText: '#64748b',
        cardBg: '#fff',
        primary: '#084b8a',
        border: 'rgba(8, 75, 138, 0.15)'
    };

    const colors = themeColors || defaultThemeColors;

    const scrollToSection = (sectionId) => {
        setMobileMenuOpen(false);
        setTimeout(() => {
            const element = document.getElementById(sectionId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }, 100);
    };

    const navItems = [
        { label: 'Features', key: 'features' },
        { label: 'Pricing', key: 'pricing' },
        { label: 'Blog', key: 'blog' },
        { label: 'FAQ', key: 'faq' }
    ];

    return (
        <ConfigProvider
            theme={{
                algorithm: isDarkTheme ? theme.darkAlgorithm : theme.defaultAlgorithm,
                token: {
                    colorPrimary: isDarkTheme ? '#3b82f6' : '#084b8a',
                    colorBgContainer: isDarkTheme ? '#1e293b' : '#ffffff',
                    colorBgLayout: isDarkTheme ? '#0f172a' : '#f8fafc',
                    colorTextBase: isDarkTheme ? '#f1f5f9' : '#0f172a',
                },
                components: {
                    Card: {
                        boxShadowCard: isDarkTheme ? '0 4px 24px rgba(0, 0, 0, 0.4)' : '0 4px 24px rgba(0, 0, 0, 0.04)',
                    }
                }
            }}
        >
        <Layout className="landing-page" style={{ background: colors.bg, minHeight: '100vh', overflowX: 'hidden', transition: 'all 0.3s ease' }}>
            {/* Shared Navbar */}
            <Header 
                id="main-header"
                style={{
                    position: 'fixed',
                    zIndex: 1000,
                    width: '100%',
                    background: colors.cardBg,
                    padding: '0 clamp(16px, 5vw, 120px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: `2px solid ${colors.primary}`,
                    height: '70px',
                    transition: 'all 0.3s ease'
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', flexShrink: 0 }} onClick={() => navigate('/')}>
                    <img src={LogoImg} alt="Track2Gram Logo" style={{ height: '32px' }} />
                </div>

                {/* Desktop Navigation */}
                <div style={{ 
                    display: 'flex', 
                    gap: '32px', 
                    alignItems: 'center',
                    flexGrow: 1,
                    marginLeft: '60px'
                }} className="desktop-nav">
                    {navItems.map(item => (
                        <button
                            key={item.key}
                            onClick={() => scrollToSection(item.key)}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: colors.text,
                                fontSize: '14px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                padding: '8px 0',
                                borderBottom: '2px solid transparent'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.color = colors.primary;
                                e.currentTarget.style.borderBottomColor = colors.primary;
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.color = colors.text;
                                e.currentTarget.style.borderBottomColor = 'transparent';
                            }}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>

                <div style={{ display: 'flex', gap: '12px', flexShrink: 0, alignItems: 'center' }}>
                    {/* Theme Toggle */}
                    {setIsDarkTheme && (
                        <div className="theme-toggle-navbar" style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '6px 12px',
                            borderRadius: '8px',
                            background: isDarkTheme ? 'rgba(255, 255, 255, 0.05)' : 'rgba(8, 75, 138, 0.05)',
                            border: `1px solid ${colors.border}`,
                            transition: 'all 0.3s ease'
                        }}>
                            <SunOutlined style={{ color: colors.primary, fontSize: '14px' }} />
                            <Switch 
                                checked={isDarkTheme} 
                                onChange={setIsDarkTheme}
                                size="small"
                                style={{ 
                                    background: isDarkTheme ? colors.primary : 'rgba(8, 75, 138, 0.3)'
                                }}
                            />
                            <BulbOutlined style={{ color: colors.primary, fontSize: '14px' }} />
                        </div>
                    )}
                    {/* Mobile Menu Button */}
                    <Button 
                        type="text" 
                        icon={<MenuOutlined />}
                        onClick={() => setMobileMenuOpen(true)}
                        style={{
                            fontSize: '18px',
                            color: colors.text,
                            border: 'none',
                            background: 'none',
                            display: 'none'
                        }}
                        className="mobile-menu-btn"
                    />
                    
                    <Button 
                        onClick={() => navigate('/login')} 
                        className="auth-btn-login"
                        style={{ 
                            height: '40px', 
                            padding: '0 20px', 
                            borderRadius: '8px', 
                            fontSize: '14px', 
                            fontWeight: 700, 
                            background: 'transparent',
                            border: `2px solid ${colors.primary}`,
                            color: colors.primary,
                            transition: 'all 0.3s ease',
                            cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = colors.primary;
                            e.currentTarget.style.color = '#fff';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.color = colors.primary;
                        }}
                    >
                        Log In
                    </Button>
                    
                    <Button 
                        onClick={() => navigate('/signup')} 
                        className="auth-btn-signup"
                        style={{ 
                            height: '40px', 
                            padding: '0 20px', 
                            borderRadius: '8px', 
                            fontSize: '14px', 
                            fontWeight: 700, 
                            background: colors.primary, 
                            border: 'none',
                            color: '#fff',
                            transition: 'all 0.3s ease',
                            cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        Sign Up
                    </Button>
                </div>

                {/* Mobile Menu Drawer */}
                <Drawer
                    title="Navigation"
                    placement="right"
                    onClose={() => setMobileMenuOpen(false)}
                    open={mobileMenuOpen}
                    styles={{
                        body: {
                            backgroundColor: colors.bg,
                            padding: '24px'
                        },
                        header: {
                            backgroundColor: colors.cardBg,
                            borderBottom: `2px solid ${colors.primary}`
                        },
                        mask: {
                            backgroundColor: 'rgba(0, 0, 0, 0.45)'
                        }
                    }}
                >
                    <Menu
                        mode="vertical"
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: colors.text
                        }}
                        itemLabelStyle={{
                            color: colors.text
                        }}
                        items={navItems.map(item => ({
                            key: item.key,
                            label: <span style={{ color: colors.text, fontWeight: 500 }}>{item.label}</span>,
                            onClick: () => scrollToSection(item.key)
                        }))}
                    />
                    
                    {/* Mobile Auth Buttons */}
                    <div style={{ marginTop: '32px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <Button 
                            onClick={() => {
                                navigate('/login');
                                setMobileMenuOpen(false);
                            }} 
                            style={{ 
                                height: '44px', 
                                padding: '0 20px', 
                                borderRadius: '8px', 
                                fontSize: '14px', 
                                fontWeight: 700, 
                                background: 'transparent',
                                border: `2px solid ${colors.primary}`,
                                color: colors.primary,
                                transition: 'all 0.3s ease',
                                cursor: 'pointer',
                                width: '100%'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = colors.primary;
                                e.currentTarget.style.color = '#fff';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'transparent';
                                e.currentTarget.style.color = colors.primary;
                            }}
                        >
                            Log In
                        </Button>
                        
                        <Button 
                            onClick={() => {
                                navigate('/signup');
                                setMobileMenuOpen(false);
                            }} 
                            style={{ 
                                height: '44px', 
                                padding: '0 20px', 
                                borderRadius: '8px', 
                                fontSize: '14px', 
                                fontWeight: 700, 
                                background: colors.primary, 
                                border: 'none',
                                color: '#fff',
                                transition: 'all 0.3s ease',
                                cursor: 'pointer',
                                width: '100%'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            Sign Up
                        </Button>
                    </div>
                </Drawer>
            </Header>

            <Content style={{ marginTop: '70px' }}>
                {children}
            </Content>

            {/* Shared Footer */}
            <Footer id="main-footer" style={{ background: colors.heroBg, padding: '80px clamp(16px, 5vw, 120px) 40px', textAlign: 'center', transition: 'all 0.3s ease' }}>
                <div style={{ marginBottom: '40px' }}>
                    <img src={LogoImg} alt="Track2Gram Logo" style={{ height: '48px', marginBottom: '36px' }} />
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', flexWrap: 'wrap' }}>
                        {[
                            { icon: <FacebookFilled />, path: 'https://www.facebook.com/share/18kqy6nfkp/?mibextid=wwXIfr', label: 'Facebook' },
                            { icon: <InstagramFilled />, path: 'https://www.instagram.com/track2gram?igsh=MTR6ODFicGtleXAybg%3D%3D&utm_source=qr', label: 'Instagram' },
                            { icon: <LinkedinFilled />, path: 'https://www.linkedin.com/in/track2-gram-63880a404?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app', label: 'LinkedIn' },
                            { icon: <YoutubeFilled />, path: 'https://youtube.com/@track2gram?si=LKk-3FDz6ZTZx2US', label: 'YouTube' },
                            { icon: <TikTokIcon size={22} color="#fff" />, path: 'https://www.tiktok.com/@track2garm', label: 'TikTok' }
                        ].map((social, idx) => (
                            <a key={idx} href={social.path} target="_blank" rel="noopener noreferrer" aria-label={social.label} style={{
                                width: '56px',
                                height: '56px',
                                borderRadius: '50%',
                                background: colors.primary,
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
                    <Link to="/privacy-policy" style={{ color: colors.text, fontWeight: 700, fontSize: '15px', transition: 'all 0.3s ease' }} className="footer-link">Privacy Policy</Link>
                    <div style={{ width: '1.5px', height: '18px', background: colors.border }}></div>
                    <Link to="/terms-of-service" style={{ color: colors.text, fontWeight: 700, fontSize: '15px', transition: 'all 0.3s ease' }} className="footer-link">Terms & Conditions</Link>
                </div>

                <Text style={{ color: colors.mutedText, fontSize: '14px', fontWeight: 500 }}>
                    © 2025 Track2Gram
                </Text>
            </Footer>

            <style>
                {`
                @media (max-width: 991px) {
                    .desktop-nav { display: none !important; }
                    .auth-btn-login, .auth-btn-signup { display: none !important; }
                    .mobile-menu-btn { display: inline-block !important; }
                    .theme-toggle-navbar { 
                        display: none !important; 
                    }
                }
                
                @media (min-width: 992px) {
                    .mobile-menu-btn { display: none !important; }
                }
                
                .nav-item:hover {
                    color: ${colors.primary} !important;
                }
                .social-icon:hover {
                    background: ${isDarkTheme ? 'rgba(59, 130, 246, 0.8)' : 'rgba(8, 75, 138, 0.8)'} !important;
                    transform: translateY(-3px);
                }
                .footer-link:hover {
                    color: ${colors.primary} !important;
                    text-decoration: underline !important;
                }
                .landing-page .ant-btn-primary:hover {
                    background: ${isDarkTheme ? '#1e40af' : '#063a6e'} !important;
                }
                .whatsapp-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(8, 75, 138, 0.15);
                }
                `}
            </style>
        </Layout>
        </ConfigProvider>
    );
};

export default LandingLayout;

