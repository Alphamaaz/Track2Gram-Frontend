import React, { useState, useEffect, useRef } from 'react';
import { Typography, Button, Space, Row, Col, Card, Input, Collapse, Divider, Avatar, Rate, Tag, Modal, Form, message, Switch } from 'antd';
import {
    PlayCircleOutlined,
    BarChartOutlined,
    ApiOutlined,
    LayoutOutlined,
    SearchOutlined,
    GlobalOutlined,
    InstagramOutlined,
    FacebookOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    ArrowRightOutlined,
    StarOutlined,
    TrophyOutlined,
    RocketOutlined,
    LockOutlined,
    DashboardOutlined,
    LineChartOutlined,
    CheckOutlined,
    ZoomInOutlined,
    ThunderboltOutlined,
    SecurityScanOutlined,
    CalendarOutlined,
    UserOutlined,
    FileTextOutlined,
    CloudOutlined,
    BgColorsOutlined,
    ShrinkOutlined,
    CopyOutlined,
    PlusOutlined,
    ShakeOutlined,
    LinkedinFilled,
    FallOutlined,
    UsergroupAddOutlined,
    WhatsAppOutlined,
    SunOutlined,
    BulbOutlined,
    MailOutlined,
    PhoneOutlined,
    PlaySquareOutlined,
    SettingOutlined,
    SendOutlined,
    LinkOutlined,
    TeamOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import LandingLayout from '../components/LandingLayout';
import LogoImg from '../assets/tyy 1.svg';
import VideoAsset from '../assets/Track2Gram_7.mp4';
import SEO from '../components/SEO';
import TikTokIcon from '../components/TikTokIcon';
import { settingsService } from '../services/settings';
import { supportService } from '../services/support';

const { Title, Text } = Typography;

const Home = ({ isDarkTheme, setIsDarkTheme }) => {
    const navigate = useNavigate();
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Pricing data state
    const [pricingData, setPricingData] = useState({ starter: 49, pro: 129 });
    const [loadingPricing, setLoadingPricing] = useState(false);

    // Hero animation states
    const [typedText, setTypedText] = useState('');
    const [showCursor, setShowCursor] = useState(true);
    const [rotatingWordIndex, setRotatingWordIndex] = useState(0);
    const [rotatingWordVisible, setRotatingWordVisible] = useState(true);
    const [heroVisible, setHeroVisible] = useState(false);
    const [statsVisible, setStatsVisible] = useState(false);
    const [howItWorksVisible, setHowItWorksVisible] = useState(false);
    const [featuresVisible, setFeaturesVisible] = useState(false);
    const [whyUseVisible, setWhyUseVisible] = useState(false);
    const [pricingVisible, setPricingVisible] = useState(false);
    const [testimonialsVisible, setTestimonialsVisible] = useState(false);
    const [faqVisible, setFaqVisible] = useState(false);
    const [blogVisible, setBlogVisible] = useState(false);
    const [countersStarted, setCountersStarted] = useState(false);
    const [counterValues, setCounterValues] = useState({ leads: 0, campaigns: 0, adSpend: 0 });
    const [videoVisible, setVideoVisible] = useState(false);

    const fullText = 'Track2Gram';
    const rotatingWords = ['Every Lead', 'Every Click', 'Every Conversion', 'Every Campaign', 'Every Dollar'];

    // Fetch pricing data
    useEffect(() => {
        const fetchPricing = async () => {
            setLoadingPricing(true);
            try {
                const data = await settingsService.getPricing();
                if (data) {
                    setPricingData(data);
                }
            } catch (error) {
                console.error('Error fetching pricing:', error);
            } finally {
                setLoadingPricing(false);
            }
        };
        fetchPricing();
    }, []);

    // Typewriter effect
    useEffect(() => {
        setHeroVisible(true);
        let currentIndex = 0;
        const typeInterval = setInterval(() => {
            if (currentIndex <= fullText.length) {
                setTypedText(fullText.slice(0, currentIndex));
                currentIndex++;
            } else {
                clearInterval(typeInterval);
            }
        }, 120);
        return () => clearInterval(typeInterval);
    }, []);

    // Blinking cursor
    useEffect(() => {
        const cursorInterval = setInterval(() => {
            setShowCursor(prev => !prev);
        }, 530);
        return () => clearInterval(cursorInterval);
    }, []);

    // Observer for scroll animations
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.scroll-animate').forEach(el => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    // Rotating words carousel
    useEffect(() => {
        const wordInterval = setInterval(() => {
            setRotatingWordVisible(false);
            setTimeout(() => {
                setRotatingWordIndex(prev => (prev + 1) % rotatingWords.length);
                setRotatingWordVisible(true);
            }, 400);
        }, 2800);
        return () => clearInterval(wordInterval);
    }, []);

    // Counter animation - triggered when stats become visible
    useEffect(() => {
        if (!statsVisible) return;
        setCountersStarted(true);
        const targets = { leads: 10, campaigns: 500, adSpend: 2 };
        const duration = 2000;
        const steps = 60;
        const stepTime = duration / steps;
        let step = 0;
        const counterInterval = setInterval(() => {
            step++;
            const progress = Math.min(step / steps, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCounterValues({
                leads: Math.round(targets.leads * eased),
                campaigns: Math.round(targets.campaigns * eased),
                adSpend: Math.round(targets.adSpend * eased * 10) / 10
            });
            if (step >= steps) clearInterval(counterInterval);
        }, stepTime);
        return () => clearInterval(counterInterval);
    }, [countersStarted]);

    // Intersection Observers for Scroll Animations
    useEffect(() => {
        const observerOptions = { threshold: 0.2 };

        const createObserver = (setVisible) => new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) setVisible(true);
        }, observerOptions);

        const statsObs = createObserver(setStatsVisible);
        const howItWorksObs = createObserver(setHowItWorksVisible);
        const featuresObs = createObserver(setFeaturesVisible);
        const whyUseObs = createObserver(setWhyUseVisible);
        const pricingObs = createObserver(setPricingVisible);
        const testimonialsObs = createObserver(setTestimonialsVisible);
        const faqObs = createObserver(setFaqVisible);
        const blogObs = createObserver(setBlogVisible);
        const videoObs = createObserver(setVideoVisible);

        const statsSection = document.getElementById('stats');
        const howItWorksSection = document.getElementById('how-it-works');
        const featuresSection = document.getElementById('features');
        const whyUseSection = document.getElementById('why-use');
        const pricingSection = document.getElementById('pricing');
        const testimonialsSection = document.getElementById('testimonials');
        const faqSection = document.getElementById('faq');
        const blogSection = document.getElementById('blog');
        const videoSection = document.getElementById('video-showcase');

        if (statsSection) statsObs.observe(statsSection);
        if (howItWorksSection) howItWorksObs.observe(howItWorksSection);
        if (featuresSection) featuresObs.observe(featuresSection);
        if (whyUseSection) whyUseObs.observe(whyUseSection);
        if (pricingSection) pricingObs.observe(pricingSection);
        if (testimonialsSection) testimonialsObs.observe(testimonialsSection);
        if (faqSection) faqObs.observe(faqSection);
        if (blogSection) blogObs.observe(blogSection);
        if (videoSection) videoObs.observe(videoSection);

        return () => {
            statsObs.disconnect();
            howItWorksObs.disconnect();
            featuresObs.disconnect();
            whyUseObs.disconnect();
            pricingObs.disconnect();
            testimonialsObs.disconnect();
            faqObs.disconnect();
            blogObs.disconnect();
            videoObs.disconnect();
        };
    }, []);

    // Theme colors
    const themeColors = isDarkTheme ? {
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

    // Handle contact form submission
    const handleContactSubmit = async (values) => {
        setIsSubmitting(true);
        try {
            await supportService.contactUs({
                name: values.name,
                email: values.email,
                message: values.message
            });
            message.success('Message sent successfully! Our team will get back to you soon.');
            setIsContactModalOpen(false);
            form.resetFields();
        } catch (error) {
            console.error('Error sending message:', error);
            message.error(error.message || 'Failed to send message. Please try again later.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const stats = [
        { label: 'Leads Tracked', value: '10K+', description: 'Total leads captured' },
        { label: 'Active Campaigns', value: '500+', description: 'Across all platforms' },
        { label: 'Ad Spend Managed', value: '$2M+', description: 'Optimized conversion' }
    ];

    const steps = [
        {
            icon: <GlobalOutlined style={{ fontSize: '28px', color: '#fff' }} />,
            title: '1. Connect Your Ad Account',
            description: 'Connect your Google Ads or Meta Ads account from the Integration section.'
        },
        {
            icon: <SendOutlined style={{ fontSize: '28px', color: '#fff' }} />,
            title: '2. Connect Your Telegram Channel',
            description: 'Add your Telegram bot and channel with admin permissions.'
        },
        {
            icon: <SettingOutlined style={{ fontSize: '28px', color: '#fff' }} />,
            title: '3. Create Your Project',
            description: 'Create a new project and select your ad account, channel, and landing page.'
        },
        {
            icon: <LinkOutlined style={{ fontSize: '28px', color: '#fff' }} />,
            title: '4. Add The Tracking Link To Your Ads',
            description: 'Use your project tracking URL in your ad campaign for automatic attribution.'
        },
        {
            icon: <TeamOutlined style={{ fontSize: '28px', color: '#fff' }} />,
            title: '5. User Joins Telegram',
            description: 'When a visitor joins, Track2Gram generates a unique invite link to identify them.'
        },
        {
            icon: <CheckCircleOutlined style={{ fontSize: '28px', color: '#fff' }} />,
            title: '6. Conversion Is Sent Back',
            description: 'Real join events are uploaded to Google Ads and Meta CAPI for optimization.'
        }
    ];

    const features = [
        {
            icon: <BarChartOutlined />,
            title: 'Monitor Analytics',
            description: 'Inside the dashboard, view total visits, clicks, subscribers, unsubscribers, conversion rate, ad spend, and project-wise performance.'
        },
        {
            icon: <DashboardOutlined />,
            title: 'Project-Level Tracking',
            description: 'Each project keeps its own tracking setup, so multiple clients, accounts, and channels do not mix.'
        },
        {
            icon: <ApiOutlined />,
            title: 'Ad Platform Optimization',
            description: 'Upload real join events to Google Ads and Meta CAPI so the platforms learn from actual subscribers.'
        },
        {
            icon: <SecurityScanOutlined />,
            title: 'Enterprise Security',
            description: 'Bank-level encryption, GDPR compliance, and SOC 2 certified. Your data stays yours.'
        },
        {
            icon: <ApiOutlined />,
            title: 'API Integration',
            description: 'Connect with your favorite tools via REST API, webhooks, and Zapier integrations.'
        },
        {
            icon: <ThunderboltOutlined />,
            title: 'Proven Results',
            description: 'Customers report 40-60% improvement in ROAS. Some see 3x faster lead generation.'
        }
    ];

    const comparison = [
        { feature: 'Setup Time', diy: '4-8 weeks', ours: '5 minutes' },
        { feature: 'Technical Expertise', diy: 'Senior Developer Required', ours: 'Anyone Can Use' },
        { feature: 'Ongoing Maintenance', diy: 'High (Constant Fixes)', ours: 'Fully Managed' },
        { feature: 'Cost', diy: '$500+/month', ours: 'From $49/month' },
        { feature: 'Data Accuracy', diy: '70-80%', ours: '99%+' },
        { feature: 'Real-Time Support', diy: 'Limited', ours: '24/7 Available' }
    ];

    const whyUseWith = [
        "Track real Telegram subscribers",
        "Send conversions back to Google and Meta",
        "Multi-account support",
        "Project-level tracking",
        "No manual token handling",
        "Unique invite links",
        "Subscriber and unsubscriber tracking",
        "Better ad optimization",
        "Central analytics dashboard",
        "Faster setup"
    ];

    const whyUseWithout = [
        "You only see clicks, not real joins",
        "Ad platforms optimize for the wrong action",
        "Manual tracking becomes messy",
        "Hard to manage multiple clients or projects",
        "No clear subscriber attribution",
        "Unsubscribe tracking is missed",
        "Conversion uploads can fail silently",
        "Scaling requires developers",
        "Analytics stay incomplete",
        "Wasted ad budget"
    ];

    const testimonials = [
        {
            name: 'Rahman Ullah',
            role: 'Growth Manager',
            company: 'TechVenture',
            initials: 'SJ',
            color: '#084b8a',
            text: 'Track2Gram transformed how we manage leads. The unified dashboard saved our team 10 hours per week.',
            rating: 5
        },
        {
            name: 'Mike Chen',
            role: 'Founder',
            company: 'Digital Agency',
            initials: 'MC',
            color: '#2563eb',
            text: 'We switched from a custom setup. Setup took 5 minutes instead of 2 months. This is a game-changer.',
            rating: 5
        },
        {
            name: 'Lisa Rodriguez',
            role: 'Marketing Director',
            company: 'StartupXYZ',
            initials: 'LR',
            color: '#7c3aed',
            text: 'Our ROAS improved by 45% after using Track2Gram. The real-time analytics are incredibly accurate.',
            rating: 5
        }
    ];

    const faqItems = [
        {
            key: '1',
            label: 'How long does it take to set up?',
            children: 'Most users are up and running in under 5 minutes. Just connect your ad accounts, optionally set up landing pages, and start tracking. We handle all technical complexity.'
        },
        {
            key: '2',
            label: 'Do I need technical skills to use it?',
            children: 'Not at all! Our platform is designed for everyone - marketers, founders, and agencies. Our no-code builder and dashboard require zero coding knowledge.'
        },
        {
            key: '3',
            label: 'What platforms can I integrate with?',
            children: 'We support Google Ads, Meta (Facebook/Instagram), If your platform has an API, we can integrate with it.'
        },
        {
            key: '4',
            label: 'Is my data secure?',
            children: 'Yes. We use military-grade encryption, are fully GDPR compliant, and never share your data with third parties. Your data is your data.'
        },
        {
            key: '5',
            label: 'What happens if I exceed my limit?',
            children: 'We\'ll notify you before you hit your limit. You can upgrade anytime with no surprises. We never charge overage fees.'
        },
        {
            key: '6',
            label: 'Do you offer a free trial?',
            children: 'Yes! Start with a 7-day free trial on any plan. No credit card required. Full access to all features.'
        }
    ];

    const blogPosts = [
        {
            id: 1,
            title: 'Telegram DM Conversion Tracking: The Complete Guide (2026)',
            excerpt: 'Track when Telegram leads send direct messages and attribute DM conversions back to your ad campaigns.',
            category: 'Tracking',
            author: 'AdTarget Team',
            date: '10 min read',
            icon: <DashboardOutlined />,
            slug: 'telegram-dm-conversion-tracking'
        },
        {
            id: 2,
            title: 'Multi-Platform Telegram Ad Tracking: Meta, TikTok & Snapchat',
            excerpt: 'Track Telegram channel joins from Meta, TikTok, and Snapchat with one script.',
            category: 'Integration',
            author: 'AdTarget Team',
            date: '8 min read',
            icon: <GlobalOutlined />,
            slug: 'multi-platform-telegram-tracking'
        },
        {
            id: 3,
            title: 'How to Reduce CPA on Telegram Ad Campaigns (Proven Strategies)',
            excerpt: 'Proven strategies to reduce CPA on Telegram ad campaigns with optimized tracking.',
            category: 'Strategy',
            author: 'AdTarget Team',
            date: '9 min read',
            icon: <FallOutlined />,
            slug: 'reduce-cpa-telegram'
        },
        {
            id: 4,
            title: 'Telegram Attribution for Media Buying Agencies: A Complete Guide',
            excerpt: 'How media buying agencies track Telegram attribution across clients effectively.',
            category: 'Agency',
            author: 'AdTarget Team',
            date: '11 min read',
            icon: <UsergroupAddOutlined />,
            slug: 'telegram-attribution-agencies'
        },
        {
            id: 5,
            title: 'Telegram Business API vs MTProto for DM Tracking: Safety & Compliance',
            excerpt: 'Compare the official Telegram Business API and MTProto client automation safely.',
            category: 'Integration',
            author: 'AdTarget Team',
            date: '12 min read',
            icon: <SecurityScanOutlined />,
            slug: 'telegram-business-api-vs-mtproto'
        }
    ];

    const integrations = [
        { name: 'Google Ads', icon: <GlobalOutlined /> },
        { name: 'Meta', icon: <FacebookOutlined /> }
    ];

    return (
        <LandingLayout isDarkTheme={isDarkTheme} setIsDarkTheme={setIsDarkTheme} themeColors={themeColors}>
            <SEO
                title="SaaS Ad Tracking & Lead Management"
                description="The all-in-one platform for SaaS ad tracking. Track every lead, click, and conversion with Track2Gram. Start your 7-day free trial today."
                keywords="ads tracking, lead management, saas attribution, telegram ads, conversion tracking"
            />
            <main>
                {/* Hero Section with Professional Animations */}
                <section id="hero" style={{
                    padding: '120px clamp(16px, 5vw, 120px) 80px',
                    textAlign: 'center',
                    background: themeColors.heroBg,
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    minHeight: '90vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    {/* Animated Gradient Orbs */}
                    <div style={{
                        position: 'absolute',
                        top: '-10%',
                        left: '-5%',
                        width: '500px',
                        height: '500px',
                        background: isDarkTheme
                            ? 'radial-gradient(circle, rgba(59, 130, 246, 0.25) 0%, transparent 70%)'
                            : 'radial-gradient(circle, rgba(8, 75, 138, 0.12) 0%, transparent 70%)',
                        borderRadius: '50%',
                        animation: 'heroOrb1 8s ease-in-out infinite',
                        zIndex: 0,
                        filter: 'blur(60px)'
                    }}></div>
                    <div style={{
                        position: 'absolute',
                        bottom: '-15%',
                        right: '-10%',
                        width: '600px',
                        height: '600px',
                        background: isDarkTheme
                            ? 'radial-gradient(circle, rgba(99, 102, 241, 0.12) 0%, transparent 70%)'
                            : 'radial-gradient(circle, rgba(3, 105, 161, 0.1) 0%, transparent 70%)',
                        borderRadius: '50%',
                        animation: 'heroOrb2 10s ease-in-out infinite',
                        zIndex: 0,
                        filter: 'blur(60px)'
                    }}></div>
                    <div style={{
                        position: 'absolute',
                        top: '40%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '400px',
                        height: '400px',
                        background: isDarkTheme
                            ? 'radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%)'
                            : 'radial-gradient(circle, rgba(8, 75, 138, 0.06) 0%, transparent 70%)',
                        borderRadius: '50%',
                        animation: 'heroOrb3 12s ease-in-out infinite',
                        zIndex: 0,
                        filter: 'blur(50px)'
                    }}></div>

                    {/* Floating Particles */}
                    {[...Array(6)].map((_, i) => (
                        <div key={`particle-${i}`} style={{
                            position: 'absolute',
                            width: `${4 + i * 2}px`,
                            height: `${4 + i * 2}px`,
                            background: themeColors.primary,
                            borderRadius: '50%',
                            opacity: 0.3,
                            top: `${15 + i * 14}%`,
                            left: `${10 + i * 15}%`,
                            animation: `floatParticle ${4 + i * 1.5}s ease-in-out infinite`,
                            animationDelay: `${i * 0.5}s`,
                            zIndex: 0
                        }}></div>
                    ))}

                    {/* Grid Pattern Overlay */}
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundImage: isDarkTheme
                            ? 'radial-gradient(circle at 1px 1px, rgba(59, 130, 246, 0.06) 1px, transparent 0)'
                            : 'radial-gradient(circle at 1px 1px, rgba(8, 75, 138, 0.04) 1px, transparent 0)',
                        backgroundSize: '40px 40px',
                        zIndex: 0
                    }}></div>

                    {/* Main Hero Content */}
                    <div style={{
                        position: 'relative',
                        zIndex: 1,
                        maxWidth: '900px',
                        margin: '0 auto',
                        opacity: heroVisible ? 1 : 0,
                        transform: heroVisible ? 'translateY(0)' : 'translateY(40px)',
                        transition: 'all 1s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}>



                        {/* Typewriter Brand Name */}
                        <div style={{ marginBottom: '24px', minHeight: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <span style={{
                                fontSize: 'clamp(42px, 7vw, 84px)',
                                fontWeight: 900,
                                letterSpacing: '-0.04em',
                                lineHeight: 1,
                                display: 'inline-block',
                                transition: 'all 0.3s ease',
                                color: isDarkTheme ? '#60a5fa' : themeColors.primary,
                                textShadow: isDarkTheme ? '0 0 20px rgba(96, 165, 250, 0.3)' : 'none',
                            }}>
                                {typedText || ' '}
                            </span>
                            <span style={{
                                display: 'inline-block',
                                width: '4px',
                                height: 'clamp(40px, 6vw, 70px)',
                                background: themeColors.primary,
                                marginLeft: '12px',
                                opacity: showCursor ? 1 : 0,
                                transition: 'opacity 0.1s',
                                borderRadius: '2px',
                                boxShadow: `0 0 15px ${themeColors.primary}`
                            }}></span>
                        </div>

                        {/* Rotating Words Title */}
                        <Title style={{
                            fontSize: 'clamp(28px, 5vw, 56px)',
                            fontWeight: 800,
                            lineHeight: 1.15,
                            letterSpacing: '-0.03em',
                            color: themeColors.text,
                            marginBottom: '12px',
                            animation: 'fadeInUp 0.8s ease-out 1.5s both'
                        }}>
                            Track{' '}
                            <span style={{
                                display: 'inline-block',
                                minWidth: 'clamp(160px, 30vw, 340px)',
                                position: 'relative',
                                color: themeColors.primary,
                                opacity: rotatingWordVisible ? 1 : 0,
                                transform: rotatingWordVisible ? 'translateY(0) rotateX(0deg)' : 'translateY(-20px) rotateX(-90deg)',
                                transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                                textDecoration: 'none',
                                borderBottom: `3px solid ${themeColors.primary}`,
                                paddingBottom: '4px'
                            }}>
                                {rotatingWords[rotatingWordIndex]}
                            </span>
                            .
                        </Title>

                        {/* Subtitle with stagger */}
                        <Title level={3} style={{
                            fontSize: 'clamp(20px, 3vw, 32px)',
                            fontWeight: 700,
                            color: themeColors.mutedText,
                            marginBottom: '28px',
                            animation: 'fadeInUp 0.8s ease-out 1.8s both',
                            letterSpacing: '-0.01em'
                        }}>
                            Convert{' '}
                            <span style={{
                                color: themeColors.primary,
                                position: 'relative'
                            }}>
                                Every Click
                                <span style={{
                                    position: 'absolute',
                                    bottom: '-2px',
                                    left: 0,
                                    width: '100%',
                                    height: '3px',
                                    background: `linear-gradient(90deg, ${themeColors.primary}, transparent)`,
                                    borderRadius: '2px',
                                    animation: 'expandWidth 1s ease-out 2.5s both'
                                }}></span>
                            </span>
                            .
                        </Title>

                        {/* Description */}
                        <Text style={{
                            fontSize: 'clamp(15px, 1.8vw, 18px)',
                            color: themeColors.mutedText,
                            maxWidth: '680px',
                            display: 'block',
                            margin: '0 auto 40px',
                            lineHeight: 1.8,
                            fontWeight: 400,
                            animation: 'fadeInUp 0.8s ease-out 2s both'
                        }}>
                            The all-in-one platform for SaaS ad tracking and lead management. Get real-time insights, beautiful landing pages, and accurate attribution all in one place.
                        </Text>

                        {/* CTA Buttons */}
                        <div style={{
                            display: 'flex',
                            gap: '16px',
                            justifyContent: 'center',
                            flexWrap: 'wrap',
                            marginBottom: '40px',
                            animation: 'fadeInUp 0.8s ease-out 2.3s both'
                        }}>
                            <Button
                                type="primary"
                                size="large"
                                onClick={() => navigate('/signup')}
                                style={{
                                    height: '58px',
                                    padding: '0 44px',
                                    borderRadius: '12px',
                                    fontSize: '16px',
                                    fontWeight: 700,
                                    background: `linear-gradient(135deg, ${themeColors.primary}, ${isDarkTheme ? '#6366f1' : '#0369a1'})`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    border: 'none',
                                    transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                                    boxShadow: `0 8px 32px ${isDarkTheme ? 'rgba(59, 130, 246, 0.35)' : 'rgba(8, 75, 138, 0.3)'}`,
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)'; e.currentTarget.style.boxShadow = `0 12px 40px ${isDarkTheme ? 'rgba(59, 130, 246, 0.5)' : 'rgba(8, 75, 138, 0.4)'}` }}
                                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0) scale(1)'; e.currentTarget.style.boxShadow = `0 8px 32px ${isDarkTheme ? 'rgba(59, 130, 246, 0.35)' : 'rgba(8, 75, 138, 0.3)'}` }}
                            >
                                Start Free Trial <ArrowRightOutlined />
                            </Button>

                        </div>

                        {/* Trust Badges */}
                        <div style={{
                            display: 'flex',
                            gap: '24px',
                            justifyContent: 'center',
                            flexWrap: 'wrap',
                            animation: 'fadeInUp 0.8s ease-out 2.6s both'
                        }}>
                            {[
                                { icon: <CheckCircleOutlined />, text: '7 Days Free Trial' },
                                { icon: <LockOutlined />, text: 'No Credit Card Required' },
                                { icon: <ThunderboltOutlined />, text: 'Full Access' }
                            ].map((badge, i) => (
                                <div key={i} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    color: themeColors.mutedText,
                                    fontSize: '13px',
                                    fontWeight: 500
                                }}>
                                    <span style={{ color: '#22c55e', fontSize: '14px' }}>{badge.icon}</span>
                                    {badge.text}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>



                <Modal
                    title={<span style={{ color: isDarkTheme ? '#fff' : '#0f172a', fontSize: '18px', fontWeight: 700 }}>Get in Touch</span>}
                    open={isContactModalOpen}
                    onCancel={() => setIsContactModalOpen(false)}
                    footer={null}
                    width={450}
                    styles={{
                        mask: {
                            backdropFilter: 'blur(4px)',
                            backgroundColor: 'rgba(0, 0, 0, 0.45)'
                        }
                    }}
                    style={{
                        top: 100
                    }}
                >
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleContactSubmit}
                    >
                        <Form.Item
                            name="name"
                            label={<span style={{ color: themeColors.text }}>Your Name</span>}
                            rules={[{ required: true, message: 'Please enter your name' }]}
                        >
                            <Input
                                placeholder="John Doe"
                                prefix={<UserOutlined />}
                                style={{
                                    backgroundColor: isDarkTheme ? '#0f172a' : '#fff',
                                    color: themeColors.text,
                                    borderColor: themeColors.border
                                }}
                            />
                        </Form.Item>

                        <Form.Item
                            name="email"
                            label={<span style={{ color: themeColors.text }}>Email Address</span>}
                            rules={[
                                { required: true, message: 'Please enter your email' },
                                { type: 'email', message: 'Please enter a valid email' }
                            ]}
                        >
                            <Input
                                placeholder="john@example.com"
                                prefix={<MailOutlined />}
                                style={{
                                    backgroundColor: isDarkTheme ? '#0f172a' : '#fff',
                                    color: themeColors.text,
                                    borderColor: themeColors.border
                                }}
                            />
                        </Form.Item>

                        <Form.Item
                            name="message"
                            label={<span style={{ color: themeColors.text }}>Message</span>}
                            rules={[{ required: true, message: 'Please enter your message' }]}
                        >
                            <Input.TextArea
                                rows={4}
                                placeholder="Tell us about your needs, questions, or feedback..."
                                style={{
                                    backgroundColor: isDarkTheme ? '#0f172a' : '#fff',
                                    color: themeColors.text,
                                    borderColor: themeColors.border
                                }}
                            />
                        </Form.Item>

                        <Button
                            type="primary"
                            block
                            htmlType="submit"
                            style={{
                                background: themeColors.primary,
                                border: 'none',
                                height: '44px',
                                fontSize: '15px',
                                fontWeight: 600,
                                transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            Send Message
                        </Button>
                    </Form>
                </Modal>

                {/* Stats Section */}
                <section id="stats" style={{
                    padding: '0 clamp(16px, 5vw, 120px) 100px',
                    background: themeColors.heroBg,
                    transition: 'all 0.3s ease',
                    opacity: statsVisible ? 1 : 0,
                    transform: statsVisible ? 'translateY(0)' : 'translateY(40px)',
                    transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
                }}>
                    <Row gutter={[24, 24]} style={{ display: 'flex', justifyContent: 'center' }}>
                        {stats.map((stat, idx) => (
                            <Col xs={24} md={8} key={idx}>
                                <Card style={{
                                    borderRadius: '12px',
                                    padding: '12px',
                                    border: `1px solid ${themeColors.border}`,
                                    textAlign: 'center',
                                    boxShadow: isDarkTheme ? '0 4px 12px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0, 0, 0, 0.06)',
                                    background: themeColors.cardBg,
                                    transition: 'all 0.3s ease',
                                    animation: statsVisible ? `slideInUp 0.8s ease-out ${idx * 0.2}s both` : 'none'
                                }} styles={{ body: { padding: '32px 24px' } }} hoverable>
                                    <Title level={1} style={{ margin: 0, fontWeight: 800, color: themeColors.primary, fontSize: '44px', letterSpacing: '-0.02em' }}>{stat.value}</Title>
                                    <Text strong style={{ fontSize: '15px', color: themeColors.text, display: 'block', marginTop: '8px', fontWeight: 700 }}>{stat.label}</Text>
                                    <Text style={{ fontSize: '13px', color: themeColors.mutedText, display: 'block', marginTop: '4px' }}>{stat.description}</Text>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </section>



                {/* Premium Video Showcase Section */}
                <section id="video-showcase" style={{
                    padding: '100px clamp(16px, 5vw, 120px)',
                    background: isDarkTheme
                        ? `linear-gradient(135deg, #0f172a 0%, #1e293b 100%)`
                        : `linear-gradient(135deg, #f8fafc 0%, #E6ECF2 100%)`,
                    textAlign: 'center',
                    transition: 'all 0.3s ease',
                    opacity: videoVisible ? 1 : 0,
                    transform: videoVisible ? 'translateY(0)' : 'translateY(40px)',
                    transitionDuration: '0.8s',
                    transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    {/* Decorative Background Elements */}
                    <div style={{
                        position: 'absolute',
                        top: '-50%',
                        right: '-10%',
                        width: '600px',
                        height: '600px',
                        background: isDarkTheme
                            ? 'radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%)'
                            : 'radial-gradient(circle, rgba(8, 75, 138, 0.05) 0%, transparent 70%)',
                        borderRadius: '50%',
                        filter: 'blur(60px)',
                        zIndex: 0
                    }}></div>

                    <div style={{
                        position: 'relative',
                        zIndex: 1,
                        maxWidth: '1000px',
                        margin: '0 auto'
                    }}>
                        {/* Section Title */}
                        <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>
                   
                        </div>

                        <Title level={2} style={{
                            fontSize: 'clamp(32px, 5vw, 48px)',
                            fontWeight: 800,
                            marginBottom: '16px',
                            letterSpacing: '-0.02em',
                            color: themeColors.text,
                            lineHeight: 1.2
                        }}>
                            Experience{' '}
                            <span style={{ color: themeColors.primary }}>Track2Gram</span> In Action
                        </Title>

                        <Text style={{
                            fontSize: 'clamp(15px, 2vw, 18px)',
                            color: themeColors.mutedText,
                            maxWidth: '700px',
                            display: 'block',
                            margin: '0 auto 60px',
                            lineHeight: 1.8,
                            fontWeight: 400
                        }}>
                            Watch how our platform simplifies lead tracking and conversion management. See the complete workflow from setup to real-time analytics.
                        </Text>

                        {/* Video Player Container */}
                        <div style={{
                            position: 'relative',
                            width: '100%',
                            maxWidth: '900px',
                            margin: '0 auto',
                            borderRadius: '16px',
                            overflow: 'hidden',
                            boxShadow: isDarkTheme
                                ? '0 20px 60px rgba(59, 130, 246, 0.15), 0 0 1px rgba(59, 130, 246, 0.3)'
                                : '0 20px 60px rgba(8, 75, 138, 0.12), 0 0 1px rgba(8, 75, 138, 0.2)',
                            border: `1px solid ${themeColors.border}`,
                            animation: videoVisible ? 'scaleIn 0.8s cubic-bezier(0.16, 1, 0.3, 1)' : 'none',
                            background: isDarkTheme ? '#0f172a' : '#f8fafc'
                        }}>
                            {/* Video Wrapper */}
                            <div style={{
                                position: 'relative',
                                width: '100%',
                                paddingBottom: '56.25%', // 16:9 aspect ratio
                                background: isDarkTheme ? '#000' : '#f0f0f0'
                            }}>
                                <video
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        display: 'block'
                                    }}
                                    controls
                                    controlsList="nodownload"
                                    poster=""
                                    preload="metadata"
                                    title="Track2Gram - Platform Demo"
                                >
                                    <source src={VideoAsset} type="video/mp4" />
                                    Your browser does not support the video tag. Please use a modern browser to view this video.
                                </video>
                            </div>

                            {/* Gradient Overlay on Hover */}
                            <div style={{
                                position: 'absolute',
                                inset: 0,
                                background: 'none',
                                pointerEvents: 'none',
                                borderRadius: '16px',
                                border: `1px solid ${themeColors.border}`,
                                boxShadow: videoVisible ? `inset 0 0 30px rgba(${isDarkTheme ? '59, 130, 246' : '8, 75, 138'}, 0.1)` : 'none',
                                transition: 'all 0.3s ease'
                            }}></div>
                        </div>

                        {/* Video Features */}
                        <Row gutter={[32, 32]} style={{ marginTop: '60px', maxWidth: '900px', margin: '60px auto 0' }}>
                            <Col xs={24} sm={8}>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{
                                        fontSize: '40px',
                                        marginBottom: '16px',
                                        color: themeColors.primary,
                                        animation: 'pulse 2s ease-in-out infinite'
                                    }}>
                                        <PlayCircleOutlined />
                                    </div>
                                    <Title level={4} style={{
                                        fontWeight: 700,
                                        marginBottom: '8px',
                                        fontSize: '16px',
                                        color: themeColors.text
                                    }}>
                                        Complete Setup
                                    </Title>
                                    <Text style={{
                                        color: themeColors.mutedText,
                                        fontSize: '14px',
                                        lineHeight: 1.6
                                    }}>
                                        Watch the full setup process from start to finish
                                    </Text>
                                </div>
                            </Col>

                            <Col xs={24} sm={8}>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{
                                        fontSize: '40px',
                                        marginBottom: '16px',
                                        color: themeColors.primary,
                                        animation: 'pulse 2s ease-in-out infinite 0.2s'
                                    }}>
                                        <BarChartOutlined />
                                    </div>
                                    <Title level={4} style={{
                                        fontWeight: 700,
                                        marginBottom: '8px',
                                        fontSize: '16px',
                                        color: themeColors.text
                                    }}>
                                        Real Analytics
                                    </Title>
                                    <Text style={{
                                        color: themeColors.mutedText,
                                        fontSize: '14px',
                                        lineHeight: 1.6
                                    }}>
                                        Explore the intuitive analytics dashboard
                                    </Text>
                                </div>
                            </Col>

                            <Col xs={24} sm={8}>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{
                                        fontSize: '40px',
                                        marginBottom: '16px',
                                        color: themeColors.primary,
                                        animation: 'pulse 2s ease-in-out infinite 0.4s'
                                    }}>
                                        <RocketOutlined />
                                    </div>
                                    <Title level={4} style={{
                                        fontWeight: 700,
                                        marginBottom: '8px',
                                        fontSize: '16px',
                                        color: themeColors.text
                                    }}>
                                        Quick Launch
                                    </Title>
                                    <Text style={{
                                        color: themeColors.mutedText,
                                        fontSize: '14px',
                                        lineHeight: 1.6
                                    }}>
                                        Get up and running in just 5 minutes
                                    </Text>
                                </div>
                            </Col>
                        </Row>

                       
                    </div>
                </section>


                
                <section id="how-it-works" style={{
                    padding: '100px clamp(16px, 5vw, 120px)',
                    background: themeColors.bg,
                    textAlign: 'center',
                    transition: 'all 0.3s ease',
                    opacity: howItWorksVisible ? 1 : 0,
                    transform: howItWorksVisible ? 'translateY(0)' : 'translateY(40px)',
                    transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
                }}>
                    <Title level={2} style={{ fontSize: '42px', fontWeight: 800, marginBottom: '16px', letterSpacing: '-0.02em', color: themeColors.text }}>How It Works</Title>
                    <Text style={{ fontSize: '16px', color: themeColors.mutedText, maxWidth: '800px', display: 'block', margin: '0 auto 80px', lineHeight: 1.5 }}>
                        Set up Track2Gram in a few simple steps. Connect your ad account, Telegram channel, and landing page so every real subscriber can be tracked back to the correct campaign.
                    </Text>

                    <Row gutter={[40, 40]}>
                        {steps.map((step, idx) => (
                            <Col xs={24} md={8} key={idx}>
                                <div style={{
                                    textAlign: 'center',
                                    position: 'relative',
                                    animation: howItWorksVisible ? `slideInUp 0.8s ease-out ${idx * 0.2}s both` : 'none'
                                }}>
                                    <div style={{
                                        width: '80px',
                                        height: '80px',
                                        background: isDarkTheme ? 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)' : 'linear-gradient(135deg, #084b8a 0%, #0369a1 100%)',
                                        borderRadius: '12px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        margin: '0 auto 24px',
                                        boxShadow: isDarkTheme ? '0 8px 24px rgba(59, 130, 246, 0.3)' : '0 8px 24px rgba(8, 75, 138, 0.25)',
                                        color: '#fff',
                                        fontSize: '28px',
                                        transition: 'all 0.3s ease'
                                    }}>
                                        {step.icon}
                                    </div>
                                    <div style={{
                                        position: 'absolute',
                                        top: '-12px',
                                        right: '-12px',
                                        width: '40px',
                                        height: '40px',
                                        background: themeColors.primary,
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#fff',
                                        fontWeight: 800,
                                        fontSize: '18px'
                                    }}>
                                        {idx + 1}
                                    </div>
                                    <Title level={4} style={{ fontWeight: 700, marginBottom: '12px', fontSize: '20px', color: themeColors.text }}>{step.title}</Title>
                                    <Text style={{ color: themeColors.mutedText, lineHeight: 1.6, fontSize: '15px', display: 'block', maxWidth: '280px', margin: '0 auto' }}>{step.description}</Text>
                                </div>
                            </Col>
                        ))}
                    </Row>
                </section>

                {/* Features Section */}
                <section id="features" style={{
                    padding: '100px clamp(16px, 5vw, 120px)',
                    background: themeColors.heroBg,
                    textAlign: 'center',
                    transition: 'all 0.3s ease',
                    opacity: featuresVisible ? 1 : 0,
                    transform: featuresVisible ? 'translateY(0)' : 'translateY(40px)',
                    transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
                        <RocketOutlined style={{ fontSize: '40px', color: themeColors.primary }} />
                    </div>
                    <Title level={2} style={{ fontSize: '42px', fontWeight: 800, marginBottom: '16px', letterSpacing: '-0.02em', color: themeColors.text }}>Powerful Features Built for Scale</Title>
                    <Text style={{ fontSize: '16px', color: themeColors.mutedText, maxWidth: '600px', display: 'block', margin: '0 auto 80px', lineHeight: 1.5 }}>
                        Everything you need to manage leads, build landing pages, and grow your business.
                    </Text>

                    <Row gutter={[32, 32]}>
                        {features.map((feature, idx) => (
                            <Col xs={24} sm={12} md={8} key={idx}>
                                <Card style={{
                                    borderRadius: '12px',
                                    border: `1px solid ${themeColors.border}`,
                                    height: '100%',
                                    boxShadow: isDarkTheme ? '0 4px 12px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0, 0, 0, 0.06)',
                                    background: themeColors.cardBg,
                                    transition: 'all 0.3s ease',
                                    animation: featuresVisible ? `slideInUp 0.8s ease-out ${idx * 0.1}s both` : 'none'
                                }} styles={{ body: { padding: '32px 24px' } }} hoverable>
                                    <div style={{ fontSize: '40px', color: themeColors.primary, marginBottom: '20px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {feature.icon}
                                    </div>
                                    <Title level={4} style={{ fontWeight: 700, marginBottom: '12px', fontSize: '18px', color: themeColors.text }}>
                                        {feature.title}
                                    </Title>
                                    <Text style={{ color: themeColors.mutedText, lineHeight: 1.6, fontSize: '14px' }}>
                                        {feature.description}
                                    </Text>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </section>

                {/* Why Use Track2Gram Section */}
                <section id="why-use" style={{
                    padding: '100px clamp(16px, 5vw, 120px)',
                    background: themeColors.bg,
                    textAlign: 'center',
                    transition: 'all 0.3s ease',
                    opacity: whyUseVisible ? 1 : 0,
                    transform: whyUseVisible ? 'translateY(0)' : 'translateY(40px)',
                    transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
                }}>
                    <Title level={2} style={{ fontSize: '42px', fontWeight: 800, marginBottom: '16px', letterSpacing: '-0.02em', color: themeColors.text }}>Why Use Track2Gram</Title>
                    <Text style={{ fontSize: '16px', color: themeColors.mutedText, maxWidth: '800px', display: 'block', margin: '0 auto 80px', lineHeight: 1.5 }}>
                        Track2Gram helps advertisers track real Telegram joins, not just landing page clicks. It connects your ad campaigns, landing pages, and Telegram channels so Google Ads and Meta can optimize for people who actually join.
                    </Text>

                    <Row gutter={[48, 48]} style={{ maxWidth: '1200px', margin: '0 auto' }}>
                        <Col xs={24} lg={12}>
                            <Card style={{
                                borderRadius: '16px',
                                border: isDarkTheme ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid rgba(34, 197, 94, 0.2)',
                                background: isDarkTheme ? 'rgba(34, 197, 94, 0.03)' : 'rgba(34, 197, 94, 0.02)',
                                height: '100%',
                                textAlign: 'left'
                            }} styles={{ body: { padding: '40px' } }}>
                                <Title level={3} style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#084b8a', marginBottom: '32px' }}>
                                    <CheckCircleOutlined /> With Track2Gram
                                </Title>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    {whyUseWith.map((item, idx) => (
                                        <div key={idx} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                                            <CheckOutlined style={{ color: '#084b8a', marginTop: '4px', fontWeight: 900 }} />
                                            <div>
                                                <Text strong style={{ color: themeColors.text, display: 'block', fontSize: '15px' }}>{item}</Text>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </Col>

                        <Col xs={24} lg={12}>
                            <Card style={{
                                borderRadius: '16px',
                                border: isDarkTheme ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(239, 68, 68, 0.2)',
                                background: isDarkTheme ? 'rgba(239, 68, 68, 0.03)' : 'rgba(239, 68, 68, 0.02)',
                                height: '100%',
                                textAlign: 'left'
                            }} styles={{ body: { padding: '40px' } }}>
                                <Title level={3} style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#ef4444', marginBottom: '32px' }}>
                                    <CloseCircleOutlined /> Without Track2Gram
                                </Title>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    {whyUseWithout.map((item, idx) => (
                                        <div key={idx} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                                            <CloseCircleOutlined style={{ color: '#ef4444', marginTop: '4px' }} />
                                            <Text style={{ color: themeColors.mutedText, fontSize: '15px' }}>{item}</Text>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </Col>
                    </Row>
                </section>

                {/* Integrations Section */}
                <section style={{ padding: '100px clamp(16px, 5vw, 120px)', background: themeColors.bg, textAlign: 'center', transition: 'all 0.3s ease' }}>
                    <Title level={2} style={{ fontSize: '42px', fontWeight: 800, marginBottom: '16px', letterSpacing: '-0.02em', color: themeColors.text }}>Works With Your Favorite Tools</Title>
                    <Text style={{ fontSize: '16px', color: themeColors.mutedText, maxWidth: '600px', display: 'block', margin: '0 auto 80px', lineHeight: 1.5 }}>
                        Seamlessly integrate with the platforms you already use. One click setup.
                    </Text>

                    <Row gutter={[32, 32]} style={{ maxWidth: '600px', margin: '0 auto', justifyContent: 'center', display: 'flex' }}>
                        {integrations.map((integration, idx) => (
                            <Col xs={24} sm={12} md={12} key={idx} style={{ display: 'flex', justifyContent: 'center' }}>
                                <Card
                                    onClick={() => setIsContactModalOpen(true)}
                                    style={{
                                        borderRadius: '12px',
                                        border: `1px solid ${themeColors.border}`,
                                        height: '140px',
                                        width: '200px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxShadow: isDarkTheme ? '0 4px 12px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0, 0, 0, 0.06)',
                                        background: themeColors.cardBg,
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        animation: `slideInUp 0.8s ease-out ${idx * 0.2}s both`
                                    }}
                                    styles={{ body: { padding: 0 } }}
                                    hoverable
                                >
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ fontSize: '48px', marginBottom: '16px', color: themeColors.primary, transition: 'all 0.3s ease' }}>
                                            {integration.icon}
                                        </div>
                                        <Text style={{ color: themeColors.text, fontWeight: 600, fontSize: '16px' }}>{integration.name}</Text>
                                    </div>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </section>



                {/* Testimonials Section */}
                <section style={{ padding: '100px clamp(16px, 5vw, 120px)', background: themeColors.bg, textAlign: 'center', transition: 'all 0.3s ease' }}>
                    <Title level={2} style={{ fontSize: '42px', fontWeight: 800, marginBottom: '16px', letterSpacing: '-0.02em', color: themeColors.text }}>Loved by Our Users</Title>
                    <Text style={{ fontSize: '16px', color: themeColors.mutedText, maxWidth: '600px', display: 'block', margin: '0 auto 80px', lineHeight: 1.5 }}>
                        See what growth leaders are saying about Track2Gram.
                    </Text>

                    <Row gutter={[32, 32]}>
                        {testimonials.map((testimonial, idx) => (
                            <Col xs={24} md={8} key={idx}>
                                <Card style={{
                                    borderRadius: '12px',
                                    border: `1px solid ${themeColors.border}`,
                                    height: '100%',
                                    boxShadow: isDarkTheme ? '0 4px 12px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0, 0, 0, 0.06)',
                                    background: themeColors.cardBg,
                                    position: 'relative',
                                    overflow: 'hidden',
                                    transition: 'all 0.3s ease',
                                    animation: `slideInUp 0.8s ease-out ${idx * 0.2}s both`
                                }} styles={{ body: { padding: '32px 28px' } }}>
                                    <div style={{ marginBottom: '24px', display: 'flex', gap: '2px' }}>
                                        {[...Array(5)].map((_, i) => (
                                            <StarOutlined key={i} style={{ color: '#fbbf24', fontSize: '16px', fillOpacity: 1 }} />
                                        ))}
                                    </div>
                                    <Text style={{ color: themeColors.text, lineHeight: 1.8, fontSize: '15px', display: 'block', marginBottom: '28px', fontStyle: 'italic', fontWeight: 500 }}>
                                        "{testimonial.text}"
                                    </Text>
                                    <Divider style={{ margin: '24px 0', borderColor: themeColors.border }} />
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'flex-start' }}>
                                        <Avatar size={48} style={{ background: testimonial.color, fontSize: '16px', fontWeight: 700 }}>
                                            {testimonial.initials}
                                        </Avatar>
                                        <div style={{ textAlign: 'left' }}>
                                            <Text strong style={{ display: 'block', color: themeColors.text, fontSize: '14px', fontWeight: 700 }}>{testimonial.name}</Text>
                                            <Text style={{ color: themeColors.mutedText, fontSize: '13px', display: 'block' }}>{testimonial.role}</Text>
                                            <Text style={{ color: themeColors.mutedText, fontSize: '12px' }}>{testimonial.company}</Text>
                                        </div>
                                    </div>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </section>

                {/* Blog Section */}
                <section id="blog" style={{
                    padding: 'clamp(60px, 10vw, 100px) clamp(16px, 5vw, 120px)',
                    background: themeColors.bg,
                    textAlign: 'center',
                    transition: 'all 0.3s ease',
                    opacity: blogVisible ? 1 : 0,
                    transform: blogVisible ? 'translateY(0)' : 'translateY(40px)',
                    transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
                        <FileTextOutlined style={{ fontSize: 'clamp(32px, 6vw, 40px)', color: themeColors.primary }} />
                    </div>
                    <Title level={2} style={{ fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: 800, marginBottom: '16px', letterSpacing: '-0.02em', color: themeColors.text }}>Latest from Our Blog</Title>
                    <Text style={{ fontSize: 'clamp(14px, 2vw, 16px)', color: themeColors.mutedText, maxWidth: '600px', display: 'block', margin: '0 auto clamp(40px, 8vw, 80px)', lineHeight: 1.5 }}>
                        Learn growth strategies, best practices, and industry insights from our expert team.
                    </Text>

                    <Row gutter={[24, 24]}>
                        {blogPosts.map((post, idx) => (
                            <Col xs={24} sm={24} md={12} lg={8} key={idx}>
                                <Card
                                    style={{
                                        borderRadius: '12px',
                                        border: `1px solid ${themeColors.border}`,
                                        height: '580px',
                                        minHeight: '580px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        boxShadow: isDarkTheme ? '0 12px 40px rgba(0,0,0,0.3)' : '0 12px 40px rgba(8, 75, 138, 0.08)',
                                        background: themeColors.cardBg,
                                        overflow: 'hidden',
                                        transition: 'all 0.3s ease',
                                        animation: blogVisible ? `slideInUp 0.8s ease-out ${idx * 0.1}s both` : 'none'
                                    }}
                                    styles={{ body: { padding: 0, display: 'flex', flexDirection: 'column', flex: 1 } }}
                                    hoverable
                                >
                                    <div style={{
                                        height: '160px',
                                        background: `linear-gradient(135deg, ${isDarkTheme ? 'rgba(59, 130, 246, 0.15)' : 'rgba(8, 75, 138, 0.1)'}, ${isDarkTheme ? 'rgba(3, 105, 161, 0.15)' : 'rgba(3, 105, 161, 0.1)'})`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '48px',
                                        borderBottom: `1px solid ${themeColors.border}`,
                                        color: themeColors.primary,
                                        flexShrink: 0
                                    }}>
                                        {post.icon}
                                    </div>
                                    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                                        <Tag color="blue" style={{ marginBottom: '12px', fontSize: '14px', width: 'fit-content' }}>{post.category}</Tag>
                                        <Title level={4} style={{ fontWeight: 700, marginBottom: '12px', fontSize: '18px', color: themeColors.text, textAlign: 'left', lineHeight: 1.4 }}>
                                            {post.title}
                                        </Title>
                                        <Text style={{ color: themeColors.mutedText, lineHeight: 1.6, fontSize: '14px', display: 'block', marginBottom: '16px', textAlign: 'left', flex: 1 }}>
                                            {post.excerpt}
                                        </Text>
                                        <Divider style={{ margin: '16px 0', borderColor: themeColors.border }} />
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', marginBottom: '16px' }}>
                                            <div style={{ textAlign: 'left' }}>
                                                <Text style={{ color: themeColors.mutedText, display: 'block', fontSize: '12px' }}>{post.author}</Text>
                                                <Text style={{ color: themeColors.mutedText, fontSize: '11px' }}>{post.date}</Text>
                                            </div>
                                        </div>
                                        {post.slug && (
                                            <Space direction="vertical" style={{ width: '100%', marginTop: 'auto' }}>
                                                <Button
                                                    type="primary"
                                                    block
                                                    onClick={() => navigate(`/blog/${post.slug}`)}
                                                    style={{
                                                        background: themeColors.primary,
                                                        border: 'none',
                                                        fontWeight: 600,
                                                        height: '40px',
                                                        fontSize: '15px'
                                                    }}
                                                >
                                                    Read More <ArrowRightOutlined />
                                                </Button>
                                                <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '8px' }}>
                                                    <a href="https://www.facebook.com/share/18kqy6nfkp/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" style={{ color: themeColors.mutedText }} aria-label="Facebook"><FacebookOutlined /></a>
                                                    <a href="https://www.instagram.com/track2gram?igsh=MTR6ODFicGtleXAybg%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer" style={{ color: themeColors.mutedText }} aria-label="Instagram"><InstagramOutlined /></a>
                                                    <a href="https://www.linkedin.com/in/track2-gram-63880a404?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank" rel="noopener noreferrer" style={{ color: themeColors.mutedText }} aria-label="LinkedIn"><LinkedinFilled /></a>
                                                    <a href="https://www.tiktok.com/@track2garm" target="_blank" rel="noopener noreferrer" style={{ color: themeColors.mutedText }} aria-label="TikTok"><TikTokIcon size={14} color={themeColors.mutedText} /></a>
                                                </div>
                                            </Space>
                                        )}
                                    </div>
                                </Card>
                            </Col>
                        ))}
                    </Row>

                    <div style={{ marginTop: '60px' }}>
                        <Button type="default" size="large" style={{
                            height: '48px',
                            padding: '0 32px',
                            borderRadius: '8px',
                            fontSize: '16px',
                            fontWeight: 600,
                            border: `2px solid ${themeColors.primary}`,
                            color: themeColors.primary,
                            background: themeColors.bg,
                            transition: 'all 0.3s ease'
                        }}>
                            View All Articles <ArrowRightOutlined />
                        </Button>
                    </div>
                </section>

                {/* Pricing Section */}
                <section id="pricing" style={{
                    padding: '100px clamp(16px, 5vw, 120px)',
                    background: themeColors.heroBg,
                    textAlign: 'center',
                    transition: 'all 0.3s ease',
                    opacity: pricingVisible ? 1 : 0,
                    transform: pricingVisible ? 'translateY(0)' : 'translateY(40px)',
                    transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
                        <TrophyOutlined style={{ fontSize: '40px', color: themeColors.primary }} />
                    </div>
                    <Title level={2} style={{ fontSize: '42px', fontWeight: 800, marginBottom: '16px', letterSpacing: '-0.02em', color: themeColors.text }}>Simple, Transparent Pricing</Title>
                    <Text style={{ fontSize: '16px', color: themeColors.mutedText, maxWidth: '600px', display: 'block', margin: '0 auto 80px', lineHeight: 1.5 }}>
                        Choose the plan that fits your needs. All plans include a 7-day free trial.
                    </Text>

                    <Row gutter={[32, 32]} style={{ maxWidth: '900px', margin: '0 auto' }} justify="center">
                        <Col xs={24} md={10}>
                            <Card style={{
                                borderRadius: '12px',
                                border: `1px solid ${themeColors.border}`,
                                height: '100%',
                                boxShadow: isDarkTheme ? '0 4px 12px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0, 0, 0, 0.06)',
                                background: themeColors.cardBg,
                                transition: 'all 0.3s ease',
                                animation: pricingVisible ? 'slideInUp 0.8s ease-out 0.1s both' : 'none'
                            }} styles={{ body: { padding: '32px 28px' } }}>
                                <Title level={3} style={{ fontWeight: 700, marginBottom: '8px', color: themeColors.text, fontSize: '20px' }}>Starter</Title>
                                <Title level={1} style={{ color: themeColors.primary, marginBottom: '4px', fontSize: '44px', fontWeight: 800 }}>
                                    {loadingPricing ? '...' : `$${pricingData.starter || 49}`}
                                </Title>
                                <Button type="primary" style={{ height: '48px', borderRadius: '8px', fontSize: '15px', fontWeight: 600, background: themeColors.primary, width: '100%', marginBottom: '32px', border: 'none' }} onClick={() => navigate('/signup')}>
                                    Get Started
                                </Button>
                                <div style={{ textAlign: 'left', fontSize: '14px' }}>
                                    <div style={{ marginBottom: '14px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                                        <CheckOutlined style={{ color: themeColors.primary, fontWeight: 700, marginTop: '2px', flexShrink: 0 }} />
                                        <Text style={{ color: themeColors.text }}>Up to 5,000 leads/month</Text>
                                    </div>
                                    <div style={{ marginBottom: '14px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                                        <CheckOutlined style={{ color: themeColors.primary, fontWeight: 700, marginTop: '2px', flexShrink: 0 }} />
                                        <Text style={{ color: themeColors.text }}>2 Ad Accounts</Text>
                                    </div>
                                    <div style={{ marginBottom: '14px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                                        <CheckOutlined style={{ color: themeColors.primary, fontWeight: 700, marginTop: '2px', flexShrink: 0 }} />
                                        <Text style={{ color: themeColors.text }}>Email Support</Text>
                                    </div>
                                </div>
                            </Card>
                        </Col>

                        <Col xs={24} md={10}>
                            <Card style={{
                                borderRadius: '12px',
                                border: `2px solid ${themeColors.primary}`,
                                height: '100%',
                                boxShadow: isDarkTheme ? '0 8px 24px rgba(59, 130, 246, 0.2)' : '0 8px 24px rgba(8, 75, 138, 0.2)',
                                background: themeColors.cardBg,
                                position: 'relative',
                                transition: 'all 0.3s ease',
                                animation: 'slideInUp 0.8s ease-out 0.2s both'
                            }} styles={{ body: { padding: '32px 28px' } }}>
                                <div style={{
                                    position: 'absolute',
                                    top: '-14px',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    background: themeColors.primary,
                                    color: '#fff',
                                    padding: '6px 18px',
                                    borderRadius: '20px',
                                    fontSize: '12px',
                                    fontWeight: 700,
                                    letterSpacing: '0.5px'
                                }}>MOST POPULAR</div>
                                <Title level={3} style={{ fontWeight: 700, marginBottom: '8px', color: themeColors.text, fontSize: '20px' }}>Professional</Title>
                                <Title level={1} style={{ color: themeColors.primary, marginBottom: '4px', fontSize: '44px', fontWeight: 800 }}>
                                    {loadingPricing ? '...' : `$${pricingData.pro || 129}`}
                                </Title>
                                <Button type="primary" style={{ height: '48px', borderRadius: '8px', fontSize: '15px', fontWeight: 600, background: themeColors.primary, width: '100%', marginBottom: '32px', border: 'none' }} onClick={() => navigate('/signup')}>
                                    Get Started
                                </Button>
                                <div style={{ textAlign: 'left', fontSize: '14px' }}>
                                    <div style={{ marginBottom: '14px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                                        <CheckOutlined style={{ color: themeColors.primary, fontWeight: 700, marginTop: '2px', flexShrink: 0 }} />
                                        <Text style={{ color: themeColors.text }}>Up to 25,000 leads/month</Text>
                                    </div>
                                    <div style={{ marginBottom: '14px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                                        <CheckOutlined style={{ color: themeColors.primary, fontWeight: 700, marginTop: '2px', flexShrink: 0 }} />
                                        <Text style={{ color: themeColors.text }}>Unlimited Ad Accounts</Text>
                                    </div>
                                    <div style={{ marginBottom: '14px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                                        <CheckOutlined style={{ color: themeColors.primary, fontWeight: 700, marginTop: '2px', flexShrink: 0 }} />
                                        <Text style={{ color: themeColors.text }}>Landing Pages</Text>
                                    </div>
                                    <div style={{ marginBottom: '14px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                                        <CheckOutlined style={{ color: themeColors.primary, fontWeight: 700, marginTop: '2px', flexShrink: 0 }} />
                                        <Text style={{ color: themeColors.text }}>Priority Support</Text>
                                    </div>
                                </div>
                            </Card>
                        </Col>

                    </Row>
                </section>

                {/* FAQ Section */}
                <section id="faq" style={{
                    padding: '100px clamp(16px, 5vw, 120px)',
                    background: themeColors.heroBg,
                    textAlign: 'center',
                    transition: 'all 0.3s ease',
                    opacity: faqVisible ? 1 : 0,
                    transform: faqVisible ? 'translateY(0)' : 'translateY(40px)',
                    transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
                        <GlobalOutlined style={{ fontSize: '40px', color: themeColors.primary }} />
                    </div>
                    <Title level={2} style={{ fontSize: '42px', fontWeight: 800, marginBottom: '16px', letterSpacing: '-0.02em', color: themeColors.text }}>Frequently Asked Questions</Title>
                    <Text style={{ fontSize: '16px', color: themeColors.mutedText, maxWidth: '600px', display: 'block', margin: '0 auto 80px', lineHeight: 1.5 }}>
                        Everything you need to know about Track2Gram.
                    </Text>

                    <div style={{ maxWidth: '800px', margin: '0 auto', animation: faqVisible ? 'fadeInUp 0.8s ease-out' : 'none' }}>
                        <Collapse
                            items={faqItems.map(item => ({
                                key: item.key,
                                label: <span style={{ fontWeight: 600, fontSize: '16px', color: themeColors.text }}>{item.label}</span>,
                                children: <div style={{ color: themeColors.mutedText, fontSize: '15px', lineHeight: 1.7, padding: '16px 0' }}>{item.children}</div>,
                            }))}
                            style={{ background: 'transparent', border: `1px solid ${themeColors.border}`, borderRadius: '12px', overflow: 'hidden' }}
                            accordion
                        />
                    </div>

                    <Divider style={{ margin: '60px 0', borderColor: themeColors.border }} />

                    <Text style={{ color: themeColors.mutedText, fontSize: '16px', display: 'block' }}>
                        Still have questions? <a onClick={() => setIsContactModalOpen(true)} style={{ color: themeColors.primary, fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}>Contact our team</a>
                    </Text>
                </section>

                {/* Contact Us Section */}
                <section style={{ padding: '100px clamp(16px, 5vw, 120px)', background: themeColors.bg, textAlign: 'center', transition: 'all 0.3s ease' }}>
                    <Title level={2} style={{ fontSize: '42px', fontWeight: 800, marginBottom: '16px', letterSpacing: '-0.02em', color: themeColors.text }}>Get in Touch</Title>
                    <Text style={{ fontSize: '16px', color: themeColors.mutedText, maxWidth: '600px', display: 'block', margin: '0 auto 80px', lineHeight: 1.5 }}>
                        Have questions? We're here to help. Choose your preferred way to contact us.
                    </Text>

                    <Row gutter={[32, 32]} style={{ maxWidth: '800px', margin: '0 auto' }}>
                        {/* Contact Form Card */}
                        <Col xs={24} md={12}>
                            <Card style={{
                                borderRadius: '12px',
                                border: `1px solid ${themeColors.border}`,
                                height: '100%',
                                boxShadow: isDarkTheme ? '0 4px 12px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0, 0, 0, 0.06)',
                                background: themeColors.cardBg,
                                transition: 'all 0.3s ease',
                                animation: 'slideInUp 0.8s ease-out 0.2s both'
                            }} styles={{ body: { padding: '40px 32px', textAlign: 'center' } }} hoverable>
                                <div style={{ fontSize: '48px', marginBottom: '16px', color: themeColors.primary }}>
                                    <MailOutlined />
                                </div>
                                <Title level={4} style={{ fontWeight: 700, marginBottom: '12px', fontSize: '20px', color: themeColors.text }}>
                                    Contact Form
                                </Title>
                                <Text style={{ color: themeColors.mutedText, lineHeight: 1.6, fontSize: '14px', marginBottom: '32px', display: 'block' }}>
                                    Send us a message and we'll get back to you within 24 hours.
                                </Text>
                                <Button
                                    type="primary"
                                    size="large"
                                    onClick={() => setIsContactModalOpen(true)}
                                    style={{
                                        height: '48px',
                                        padding: '0 32px',
                                        borderRadius: '8px',
                                        fontSize: '16px',
                                        fontWeight: 600,
                                        background: themeColors.primary,
                                        border: 'none',
                                        width: '100%',
                                        transition: 'all 0.3s ease'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                                >
                                    Open Contact Form
                                </Button>
                            </Card>
                        </Col>

                        {/* WhatsApp Card */}
                        <Col xs={24} md={12}>
                            <Card style={{
                                borderRadius: '12px',
                                border: '2px solid #25D366',
                                height: '100%',
                                boxShadow: isDarkTheme ? '0 4px 16px rgba(37, 211, 102, 0.2)' : '0 4px 16px rgba(37, 211, 102, 0.15)',
                                background: themeColors.cardBg,
                                transition: 'all 0.3s ease',
                                animation: 'slideInUp 0.8s ease-out 0.4s both'
                            }} styles={{ body: { padding: '40px 32px', textAlign: 'center' } }} hoverable>
                                <div style={{ fontSize: '48px', marginBottom: '16px', color: '#25D366' }}>
                                    <WhatsAppOutlined />
                                </div>
                                <Title level={4} style={{ fontWeight: 700, marginBottom: '12px', fontSize: '20px', color: themeColors.text }}>
                                    WhatsApp Chat
                                </Title>
                                <Text style={{ color: themeColors.mutedText, lineHeight: 1.6, fontSize: '14px', marginBottom: '32px', display: 'block' }}>
                                    Chat with us instantly on WhatsApp for quick support.
                                </Text>
                                <Button
                                    type="primary"
                                    size="large"
                                    icon={<WhatsAppOutlined />}
                                    onClick={() => {
                                        const msgText = 'Hello Track2Gram! I have a question.';
                                        const encodedMessage = encodeURIComponent(msgText);
                                        const whatsappNumber = '923339359880';
                                        const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
                                        window.open(whatsappLink, '_blank');
                                    }}
                                    style={{
                                        height: '48px',
                                        padding: '0 32px',
                                        borderRadius: '8px',
                                        fontSize: '16px',
                                        fontWeight: 600,
                                        background: '#25D366',
                                        border: 'none',
                                        width: '100%',
                                        transition: 'all 0.3s ease'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                                >
                                    Chat on WhatsApp
                                </Button>
                            </Card>
                        </Col>
                    </Row>
                </section>

                {/* Final CTA Section */}
                <section style={{ padding: '80px clamp(16px, 5vw, 120px)', textAlign: 'center', background: themeColors.primary, borderTop: `1px solid ${themeColors.primary}` }}>
                    <Title style={{ fontSize: '42px', fontWeight: 800, color: '#fff', marginBottom: '24px', letterSpacing: '-0.02em', animation: 'slideInDown 0.8s ease-out' }}>
                        Ready to Scale Your Lead Generation?
                    </Title>

                    <Text style={{ fontSize: '18px', color: 'rgba(255,255,255,0.8)', maxWidth: '600px', display: 'block', margin: '0 auto 48px', lineHeight: 1.7, animation: 'fadeInUp 0.8s ease-out 0.2s both' }}>
                        Join hundreds of companies transforming their ad campaigns with Track2Gram.
                    </Text>

                    <Space size="large" style={{ marginBottom: '48px', justifyContent: 'center' }}>
                        <Button size="large" onClick={() => navigate('/signup')} style={{ height: '56px', padding: '0 40px', borderRadius: '8px', fontSize: '16px', fontWeight: 700, background: '#fff', color: themeColors.primary, display: 'flex', alignItems: 'center', gap: '8px', border: 'none', animation: 'fadeInUp 0.8s ease-out 0.4s both' }}>
                            Start Your Free Trial <ArrowRightOutlined />
                        </Button>
                    </Space>
                </section>

                <style>
                    {`
                @keyframes heroOrb1 {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                }

                @keyframes heroOrb2 {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    33% { transform: translate(-40px, 30px) scale(1.15); }
                    66% { transform: translate(30px, -20px) scale(0.95); }
                }

                @keyframes heroOrb3 {
                    0%, 100% { transform: translate(-50%, -50%) scale(1); }
                    50% { transform: translate(-45%, -55%) scale(1.2); }
                }

                @keyframes floatParticle {
                    0%, 100% { transform: translateY(0) translateX(0); opacity: 0.3; }
                    50% { transform: translateY(-40px) translateX(20px); opacity: 0.6; }
                }

                @keyframes gradientShimmer {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }

                @keyframes pulse {
                    0% { transform: scale(1); opacity: 1; box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4); }
                    70% { transform: scale(1.2); opacity: 0.8; box-shadow: 0 0 0 10px rgba(34, 197, 94, 0); }
                    100% { transform: scale(1); opacity: 1; box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
                }

                @keyframes expandWidth {
                    from { width: 0; opacity: 0; }
                    to { width: 100%; opacity: 1; }
                }

                @keyframes slideInDown {
                    from {
                        opacity: 0;
                        transform: translateY(-30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes slideInUp {
                    from {
                        opacity: 0;
                        transform: translateY(40px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes scaleIn {
                    from {
                        opacity: 0;
                        transform: scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }

                @keyframes float {
                    0%, 100% {
                        transform: translateY(0px);
                    }
                    50% {
                        transform: translateY(30px);
                    }
                }

                .mockup-search .ant-input { background: transparent !important; }
                .ant-collapse { background: transparent !important; }
                
                .ant-collapse-item-active .ant-collapse-header { border-radius: 8px 8px 0 0 !important; }
                
                .gradient-text {
                    background-clip: text !important;
                    -webkit-background-clip: text !important;
                    color: transparent !important;
                    -webkit-text-fill-color: transparent !important;
                }
                `}
                </style>
            </main>
        </LandingLayout>
    );
};

export default Home;
