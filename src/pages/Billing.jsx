import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Typography, Button, Tag, Space, Radio, Divider, message, Alert, Spin, Statistic } from 'antd';
import { InfoCircleOutlined, ThunderboltOutlined, RocketOutlined, CheckCircleFilled, TrophyOutlined } from '@ant-design/icons';
import { API_BASE_URL } from '../config';

const { Title, Text, Paragraph } = Typography;

const Billing = () => {
  const [loading, setLoading] = useState(true);
  const [pricing, setPricing] = useState({ starter: 0, pro: 0 });
  const [status, setStatus] = useState(null);
  const [selectedTool, setSelectedTool] = useState('google_tracker');
  const [upgrading, setUpgrading] = useState(false);

  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [pricingRes, statusRes] = await Promise.all([
        fetch(`${API_BASE_URL}/settings/subscription/pricing`, { headers }),
        fetch(`${API_BASE_URL}/settings/subscription/status`, { headers })
      ]);

      const pricingData = await pricingRes.json();
      const statusData = await statusRes.json();

      setPricing(pricingData);
      setStatus(statusData);
      if (statusData.activeTool && statusData.activeTool !== 'both') {
        setSelectedTool(statusData.activeTool);
      }
    } catch (err) {
      message.error('Failed to load subscription data');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPlan = async (planType) => {
    // Note: In a real production app, this would redirect to PayFast checkout.
    // For now, we'll simulate the "Upgrade intent" or handle the selection.
    message.info(`Redirecting to PayFast for ${planType.toUpperCase()} plan...`);
    // Example: window.location.href = `https://gopayfast.com/checkout?amount=${pricing[planType]}&...`;
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 100 }}><Spin size="large" /></div>;

  const isActive = status?.subscriptionStatus === 'active';
  const isStarter = status?.planType === 'starter';
  const isPro = status?.planType === 'pro';

  return (
    <div style={{ padding: '0 20px 40px' }}>
      <Row justify="center" style={{ marginBottom: 40 }}>
        <Col span={24} style={{ textAlign: 'center' }}>
          <Title level={2}>Subscription & Billing</Title>
          <Paragraph type="secondary" style={{ fontSize: 16 }}>
            Manage your plan, track your trial, and upgrade your tracking capabilities.
          </Paragraph>
        </Col>
      </Row>

      {status?.isTrialing && (
        <Alert
          message={
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>
                <TrophyOutlined style={{ marginRight: 8, color: '#084b8a' }} />
                Your <strong>7-Day Free Trial</strong> is currently active.
              </span>
              <Tag color="processing" style={{ borderRadius: 12, padding: '2px 12px' }}>
                {status?.trialDaysRemaining} days remaining
              </Tag>
            </div>
          }
          type="info"
          showIcon={false}
          style={{ marginBottom: 32, borderRadius: 12, border: '1px solid #084b8a' }}
        />
      )}

      <Row gutter={[24, 24]}>
        {/* Starter Plan */}
        <Col xs={24} md={12}>
          <Card
            hoverable
            className={isStarter ? 'active-plan-card' : ''}
            style={{ 
              borderRadius: 20, 
              border: isStarter ? '2px solid #084b8a' : '1px solid #f1f5f9',
              height: '100%'
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <RocketOutlined style={{ fontSize: 40, color: '#084b8a', marginBottom: 16 }} />
              <Title level={3} style={{ margin: 0 }}>Starter Plan</Title>
              <Title level={2} style={{ margin: '16px 0 8px' }}>
                PKR {pricing.starter}
                <Text type="secondary" style={{ fontSize: 14, fontWeight: 400 }}> / month</Text>
              </Title>
              <Text type="secondary">Perfect for single platform tracking.</Text>
            </div>

            <Divider />
            
            <Space direction="vertical" size="middle" style={{ width: '100%', marginBottom: 32 }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <CheckCircleFilled style={{ color: '#10b981', marginRight: 10 }} />
                <Text>Choose ONE Platform (Google or Meta)</Text>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <CheckCircleFilled style={{ color: '#10b981', marginRight: 10 }} />
                <Text>Direct Invite Links (By-pass Flow)</Text>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <CheckCircleFilled style={{ color: '#10b981', marginRight: 10 }} />
                <Text>Basic Analytics & Attribution</Text>
              </div>
            </Space>

            <Divider orientation="left">Select Feature</Divider>
            <Radio.Group 
              value={selectedTool} 
              onChange={(e) => setSelectedTool(e.target.value)}
              disabled={isStarter && !status?.isTrialing}
              style={{ width: '100%', marginBottom: 32 }}
            >
              <Space direction="vertical" style={{ width: '100%' }}>
                <Radio.Button value="google_tracker" style={{ width: '100%', borderRadius: 8 }}>Google Ads Tracker</Radio.Button>
                <Radio.Button value="meta_tracker" style={{ width: '100%', borderRadius: 8 }}>Meta Ads Tracker</Radio.Button>
              </Space>
            </Radio.Group>

            <Button 
              type={isStarter ? "default" : "primary"} 
              block 
              size="large" 
              style={{ borderRadius: 12, height: 48, fontWeight: 700 }}
              disabled={isStarter && !status?.isTrialing}
              onClick={() => handleSelectPlan('starter')}
            >
              {isStarter ? "Current Plan" : "Get Starter"}
            </Button>
          </Card>
        </Col>

        {/* Pro Plan */}
        <Col xs={24} md={12}>
          <Card
            hoverable
            className={isPro ? 'active-plan-card' : ''}
            style={{ 
              borderRadius: 20, 
              border: isPro ? '2px solid #084b8a' : '1px solid #f1f5f9',
              height: '100%',
              backgroundColor: '#f8fafc'
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <ThunderboltOutlined style={{ fontSize: 40, color: '#f59e0b', marginBottom: 16 }} />
              <div style={{ position: 'absolute', top: 16, right: 16 }}>
                <Tag color="gold" style={{ borderRadius: 8 }}>POPULAR</Tag>
              </div>
              <Title level={3} style={{ margin: 0 }}>Pro Plan</Title>
              <Title level={2} style={{ margin: '16px 0 8px' }}>
                PKR {pricing.pro}
                <Text type="secondary" style={{ fontSize: 14, fontWeight: 400 }}> / month</Text>
              </Title>
              <Text type="secondary">Full scale tracking for data-driven teams.</Text>
            </div>

            <Divider />
            
            <Space direction="vertical" size="middle" style={{ width: '100%', marginBottom: 32 }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <CheckCircleFilled style={{ color: '#10b981', marginRight: 10 }} />
                <Text strong>Both Google & Meta Tracking</Text>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <CheckCircleFilled style={{ color: '#10b981', marginRight: 10 }} />
                <Text>Advanced Retention Bot Access</Text>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <CheckCircleFilled style={{ color: '#10b981', marginRight: 10 }} />
                <Text>Lead Scoring & Management</Text>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <CheckCircleFilled style={{ color: '#10b981', marginRight: 10 }} />
                <Text>Priority Support</Text>
              </div>
            </Space>

            <div style={{ height: 62 }}></div> {/* Spacer to match Radio height */}

            <Button 
              type={isPro ? "default" : "primary"} 
              block 
              size="large" 
              style={{ borderRadius: 12, height: 48, fontWeight: 700, backgroundColor: isPro ? undefined : '#084b8a' }}
              disabled={isPro && !status?.isTrialing}
              onClick={() => handleSelectPlan('pro')}
            >
              {isPro ? "Current Plan" : "Upgrade to Pro"}
            </Button>
          </Card>
        </Col>
      </Row>

      <Card style={{ marginTop: 40, borderRadius: 16, border: 'none', backgroundColor: '#eff6ff' }}>
        <Space>
          <InfoCircleOutlined style={{ color: '#084b8a' }} />
          <Text type="secondary">
            Subscriptions are billed monthly. You can upgrade from Starter to Pro at any time. Prices are subject to change based on Super Admin updates.
          </Text>
        </Space>
      </Card>
    </div>
  );
};

export default Billing;
