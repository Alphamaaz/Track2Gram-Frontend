import React, { useCallback, useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import {
  App,
  Button,
  Card,
  Col,
  Divider,
  Modal,
  Radio,
  Row,
  Skeleton,
  Space,
  Spin,
  Tag,
  Typography,
} from 'antd';
import {
  CheckCircleFilled,
  InfoCircleOutlined,
  TrophyOutlined,
  WalletOutlined,
} from '@ant-design/icons';
import { API_BASE_URL } from '../config';
import { getApiHeaders } from '../utils/apiHeaders';

const { Title, Text, Paragraph } = Typography;

const DISPLAY_PRICES = {
  starter: 19.99,
  pro: 39.99,
};

const PLAN_FEATURES = {
  starter: [
    'Single platform tracking',
    'Direct invite link flow',
    'Core analytics and attribution',
    'Email support',
  ],
  pro: [
    'Google + Meta tracking',
    'Advanced retention bot access',
    'Lead scoring and management',
    'Priority support',
  ],
};

const toolOptions = [
  { value: 'google_tracker', label: 'Google Tracker' },
  { value: 'meta_tracker', label: 'Meta Tracker' },
];

const VALID_STARTER_TOOLS = new Set(toolOptions.map((option) => option.value));
const formatDateLabel = (value) => (value ? dayjs(value).format('MMM DD, YYYY') : 'N/A');
const formatPlanLabel = (value) => {
  if (value === 'starter') return 'Starter';
  if (value === 'pro') return 'Professional';
  return 'None';
};
const formatToolLabel = (value) => {
  if (value === 'google_tracker') return 'Google Tracker';
  if (value === 'meta_tracker') return 'Meta Tracker';
  if (value === 'both') return 'Google + Meta';
  return 'N/A';
};

const normalizeSubscriptionStatus = (payload) => {
  if (!payload || typeof payload !== 'object') return null;
  return payload.data && typeof payload.data === 'object' ? payload.data : payload;
};

const Billing = () => {
  const { message } = App.useApp();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(null);
  const [selectedTool, setSelectedTool] = useState('');
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [pendingPlanType, setPendingPlanType] = useState(null);
  const [starterToolError, setStarterToolError] = useState('');

  const token = localStorage.getItem('token');

  const buildHeaders = useCallback((contentType = 'application/json') => {
    const baseHeaders = token ? { Authorization: `Bearer ${token}` } : {};
    if (contentType) baseHeaders['Content-Type'] = contentType;
    return getApiHeaders(baseHeaders, API_BASE_URL);
  }, [token]);

  const clearBillingQuery = useCallback(() => {
    const nextUrl = `${window.location.origin}${window.location.pathname}`;
    window.history.replaceState({}, '', nextUrl);
  }, []);

  const fetchBillingData = useCallback(async () => {
    setLoading(true);
    try {
      const statusRes = await fetch(`${API_BASE_URL}/settings/subscription/status`, { headers: buildHeaders(null) });

      const statusData = await statusRes.json();

      if (!statusRes.ok) throw new Error(statusData?.message || 'Failed to load subscription status');

      const normalizedStatus = normalizeSubscriptionStatus(statusData);

      setStatus(normalizedStatus);

      if (VALID_STARTER_TOOLS.has(normalizedStatus?.activeTool)) {
        setSelectedTool(normalizedStatus.activeTool);
      } else {
        setSelectedTool('');
      }
    } catch (error) {
      message.error(error.message || 'Failed to load subscription data');
    } finally {
      setLoading(false);
    }
  }, [buildHeaders, message]);

  const verifyCryptoPayment = useCallback(async (basketId) => {
    const hideLoading = message.loading('Verifying crypto payment...', 0);
    try {
      const res = await fetch(`${API_BASE_URL}/crypto-payments/verify/${basketId}`, {
        headers: buildHeaders(null),
      });
      const data = await res.json();

      if (data?.success && data?.data?.status === 'completed') {
        message.success('Crypto payment verified. Your subscription is active.', 5);
        await fetchBillingData();
      } else if (data?.data?.status === 'failed') {
        message.error('Crypto payment failed.');
      } else {
        message.info('Crypto payment is still processing.');
      }
    } catch {
      message.warning('Could not verify crypto payment automatically.');
    } finally {
      hideLoading();
      clearBillingQuery();
    }
  }, [API_BASE_URL, buildHeaders, clearBillingQuery, fetchBillingData, message]);

  useEffect(() => {
    fetchBillingData();
  }, [fetchBillingData]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const basketId = params.get('basket_id');
    const cryptoSuccess = params.get('crypto_success') === 'true';
    const cryptoCancelled = params.get('crypto_cancelled') === 'true';

    if (basketId && cryptoSuccess) {
      verifyCryptoPayment(basketId);
      return;
    }

    if (basketId && cryptoCancelled) {
      message.info('Crypto payment was cancelled.');
      clearBillingQuery();
    }
  }, [clearBillingQuery, message, verifyCryptoPayment]);

  const resolveCryptoPlanId = useCallback((planType) => {
    if (planType === 'pro') return 'pro';
    return selectedTool === 'meta_tracker' ? 'starter_meta' : 'starter';
  }, [selectedTool]);

  const hasValidStarterTool = useCallback(() => VALID_STARTER_TOOLS.has(selectedTool), [selectedTool]);

  const startCryptoCheckout = useCallback(async (planType) => {
    if (planType === 'starter' && !hasValidStarterTool()) {
      setPaymentModalOpen(false);
      setPendingPlanType(null);
      setStarterToolError('Please select Google or Meta before continuing.');
      return;
    }

    setCheckoutLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/crypto-payments/initiate`, {
        method: 'POST',
        headers: buildHeaders(),
        body: JSON.stringify({
          planId: resolveCryptoPlanId(planType),
        }),
      });

      const payload = await response.json();
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || 'Failed to start crypto payment');
      }

      const invoiceUrl = payload?.data?.invoiceUrl;
      if (!invoiceUrl) {
        throw new Error('Crypto invoice URL not returned');
      }

      window.location.href = invoiceUrl;
    } catch (error) {
      console.error('Crypto payment start error:', error);
      message.error(error.message || 'Failed to start crypto payment');
    } finally {
      setCheckoutLoading(false);
      setPaymentModalOpen(false);
      setPendingPlanType(null);
    }
  }, [API_BASE_URL, buildHeaders, hasValidStarterTool, message, resolveCryptoPlanId]);

  const openPaymentModal = (planType) => {
    if (planType === 'starter' && !hasValidStarterTool()) {
      setPaymentModalOpen(false);
      setPendingPlanType(null);
      setStarterToolError('Please select Google or Meta before continuing.');
      return;
    }
    setStarterToolError('');
    setPendingPlanType(planType);
    setPaymentModalOpen(true);
  };

  const planCards = useMemo(() => {
    const isStarter = status?.planType === 'starter';
    const isPro = status?.planType === 'pro';

    return [
      {
        key: 'starter',
        heading: 'STARTER',
        title: 'Starter',
        description: 'Perfect for solo marketers.',
        price: DISPLAY_PRICES.starter,
        current: isStarter && !status?.isTrialing,
        badge: null,
        emphasis: false,
        buttonLabel: isStarter && !status?.isTrialing ? 'Current Plan' : 'Choose Starter',
        features: PLAN_FEATURES.starter,
      },
      {
        key: 'pro',
        heading: 'PROFESSIONAL',
        title: 'Professional',
        description: 'The best value for growing teams.',
        price: DISPLAY_PRICES.pro,
        current: isPro && !status?.isTrialing,
        badge: 'Popular',
        emphasis: true,
        buttonLabel: isPro && !status?.isTrialing ? 'Current Plan' : 'Choose Professional',
        features: PLAN_FEATURES.pro,
      },
    ];
  }, [status]);

  const hasActivePlanDetails = Boolean(
    status &&
    status.planType &&
    status.planType !== 'none' &&
    (status.startedAt || status.expiresAt || VALID_STARTER_TOOLS.has(status.activeTool) || status.activeTool === 'both')
  );

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 100 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: '0 20px 48px' }}>
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <Title level={2} style={{ marginBottom: 8 }}>Subscription</Title>
        <Paragraph type="secondary" style={{ fontSize: 16, marginBottom: 0 }}>
          Choose a plan and complete payment with BEP20 (USDTBSC).
        </Paragraph>
      </div>

      {status?.isTrialing && (
        <Card
          bordered={false}
          style={{
            marginBottom: 28,
            borderRadius: 20,
            background: '#eef6ff',
            border: '1px solid rgba(8, 75, 138, 0.15)',
          }}
        >
          <Space align="center" style={{ width: '100%', justifyContent: 'space-between' }} wrap>
            <Space>
              <TrophyOutlined style={{ color: '#084b8a', fontSize: 18 }} />
              <Text style={{ color: '#0f172a' }}>
                Your free trial is active.
              </Text>
            </Space>
            <Tag color="processing" style={{ borderRadius: 999, padding: '6px 14px', fontWeight: 700 }}>
              {status?.trialDaysRemaining} days remaining
            </Tag>
          </Space>
        </Card>
      )}

      {hasActivePlanDetails && (
        <Card
          bordered={false}
          style={{
            marginBottom: 28,
            borderRadius: 20,
            border: '1px solid #dbe7f3',
            background: '#fff',
          }}
        >
          <Row gutter={[24, 16]}>
            <Col xs={24} md={6}>
              <Text type="secondary" style={{ display: 'block', marginBottom: 6 }}>Current Plan</Text>
              <Text strong style={{ fontSize: 18, color: '#1e293b' }}>
                {formatPlanLabel(status?.planType)}
              </Text>
            </Col>
            <Col xs={24} md={6}>
              <Text type="secondary" style={{ display: 'block', marginBottom: 6 }}>Active Tool</Text>
              <Text strong style={{ fontSize: 18, color: '#1e293b' }}>
                {formatToolLabel(status?.activeTool)}
              </Text>
            </Col>
            <Col xs={24} md={6}>
              <Text type="secondary" style={{ display: 'block', marginBottom: 6 }}>Start Date</Text>
              <Text strong style={{ fontSize: 18, color: '#1e293b' }}>
                {formatDateLabel(status?.startedAt)}
              </Text>
            </Col>
            <Col xs={24} md={6}>
              <Text type="secondary" style={{ display: 'block', marginBottom: 6 }}>End Date</Text>
              <Space direction="vertical" size={2}>
                <Text strong style={{ fontSize: 18, color: '#1e293b' }}>
                  {formatDateLabel(status?.expiresAt)}
                </Text>
                {status?.isExpired && <Tag color="error" style={{ width: 'fit-content', borderRadius: 999 }}>Expired</Tag>}
              </Space>
            </Col>
          </Row>
        </Card>
      )}

      <Row gutter={[32, 32]} align="stretch">
        {planCards.map((plan) => (
          <Col xs={24} lg={12} key={plan.key}>
            <Card
              bordered={false}
              style={{
                height: '100%',
                minHeight: 630,
                borderRadius: 30,
                border: plan.emphasis ? '3px solid #0b5394' : '1px solid #dbe7f3',
                boxShadow: plan.emphasis ? '0 20px 45px rgba(8, 75, 138, 0.12)' : '0 10px 30px rgba(15, 23, 42, 0.05)',
                position: 'relative',
                overflow: 'hidden',
              }}
              styles={{ body: { padding: '34px 36px 32px' } }}
            >
              {plan.badge && (
                <div
                  style={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    background: '#0b5394',
                    color: '#fff',
                    padding: '7px 14px',
                    borderRadius: 12,
                    fontSize: 14,
                    fontWeight: 700,
                  }}
                >
                  {plan.badge}
                </div>
              )}

              <div style={{ textAlign: 'center', marginBottom: 30 }}>
                <Text
                  style={{
                    color: '#0b5394',
                    fontSize: 16,
                    fontWeight: 800,
                    letterSpacing: '0.16em',
                  }}
                >
                  {plan.heading}
                </Text>
                <Title
                  level={1}
                  style={{
                    margin: '22px 0 6px',
                    color: '#1e293b',
                    fontWeight: 800,
                    fontSize: 'clamp(46px, 5vw, 62px)',
                    lineHeight: 1,
                  }}
                >
                  {plan.price}
                  <span style={{ fontSize: '0.34em', marginLeft: 8 }}>USD</span>
                </Title>
                <Text style={{ fontSize: 15, color: '#64748b' }}>{plan.description}</Text>
              </div>

              {plan.key === 'starter' && (
                <div style={{ marginBottom: 24 }}>
                  <Text style={{ display: 'block', color: '#64748b', fontWeight: 600, marginBottom: 10, fontSize: 13 }}>
                    Select tracking tool
                  </Text>
                  <Radio.Group
                    value={selectedTool}
                    onChange={(e) => {
                      setSelectedTool(e.target.value);
                      if (starterToolError) {
                        setStarterToolError('');
                      }
                    }}
                    disabled={plan.current}
                    style={{ width: '100%' }}
                  >
                    <Row gutter={[12, 12]}>
                      {toolOptions.map((option) => (
                        <Col xs={24} sm={12} key={option.value}>
                          <Radio.Button
                            value={option.value}
                            style={{
                              width: '100%',
                              height: 42,
                              borderRadius: 12,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 700,
                              fontSize: 13,
                            }}
                          >
                            {option.label}
                          </Radio.Button>
                        </Col>
                      ))}
                    </Row>
                  </Radio.Group>
                </div>
              )}

              <Space direction="vertical" size={16} style={{ width: '100%', marginBottom: 30 }}>
                {plan.features.map((feature) => (
                  <Space key={feature} align="start" style={{ width: '100%' }}>
                    <CheckCircleFilled style={{ color: plan.emphasis ? '#0b5394' : '#cbd5e1', fontSize: 18, marginTop: 3 }} />
                    <Text style={{ fontSize: 16, color: '#1e293b' }}>{feature}</Text>
                  </Space>
                ))}
              </Space>

              <Button
                type={plan.emphasis ? 'primary' : 'default'}
                block
                size="large"
                disabled={plan.current}
                loading={checkoutLoading && pendingPlanType === plan.key}
                onClick={() => openPaymentModal(plan.key)}
                style={{
                  marginTop: 'auto',
                  height: 60,
                  borderRadius: 18,
                  fontSize: 16,
                  fontWeight: 800,
                  borderWidth: 2,
                  background: plan.emphasis ? '#0b5394' : '#fff',
                  color: plan.emphasis ? '#fff' : '#0b5394',
                  borderColor: '#0b5394',
                  boxShadow: plan.emphasis ? '0 10px 24px rgba(8, 75, 138, 0.18)' : 'none',
                }}
              >
                {plan.buttonLabel}
              </Button>
              {plan.key === 'starter' && starterToolError && (
                <Text style={{ display: 'block', marginTop: 10, color: '#ef4444', fontWeight: 600, fontSize: 13 }}>
                  {starterToolError}
                </Text>
              )}
            </Card>
          </Col>
        ))}
      </Row>

      <Card
        bordered={false}
        style={{ marginTop: 28, borderRadius: 20, background: '#f8fbff', border: '1px solid #dbe7f3' }}
      >
        <Space align="start">
          <InfoCircleOutlined style={{ color: '#0b5394', marginTop: 3 }} />
          <Text type="secondary">
            Payments are billed monthly. Frontend checkout currently accepts crypto only through NowPayments. Please use BEP20 (USDTBSC) where possible to minimize gateway charges. Starter supports one tracking tool at a time. Professional activates both tools.
          </Text>
        </Space>
      </Card>

      <Modal
        open={paymentModalOpen}
        onCancel={() => {
          if (!checkoutLoading) {
            setPaymentModalOpen(false);
            setPendingPlanType(null);
          }
        }}
        footer={null}
        centered
        width={560}
        title={null}
        closable={!checkoutLoading}
      >
        <div style={{ paddingTop: 6 }}>
          <Title level={3} style={{ marginBottom: 8 }}>Complete payment</Title>
          <Paragraph type="secondary" style={{ marginBottom: 22 }}>
            {pendingPlanType === 'starter'
              ? `Starter plan${selectedTool === 'meta_tracker' ? ' (Meta Tracker)' : ' (Google Tracker)'}`
              : 'Professional plan'}
          </Paragraph>

          <Card
            hoverable
            onClick={() => !checkoutLoading && startCryptoCheckout(pendingPlanType)}
            style={{ borderRadius: 20, border: '1px solid #dbe7f3', height: '100%' }}
            styles={{ body: { padding: 24 } }}
          >
            <Space direction="vertical" size={14} style={{ width: '100%' }}>
              <WalletOutlined style={{ fontSize: 28, color: '#16a34a' }} />
              <Text strong style={{ fontSize: 20 }}>Pay with BEP20 (USDTBSC)</Text>
              <Text type="secondary">
                Continue with NowPayments using BEP20 USDTBSC. This is the preferred option because it reduces gateway charges.
              </Text>
              <Button
                block
                type="primary"
                size="large"
                loading={checkoutLoading}
                style={{ borderRadius: 14, marginTop: 12, background: '#16a34a', borderColor: '#16a34a', fontWeight: 700 }}
              >
                Continue with Crypto
              </Button>
            </Space>
          </Card>
        </div>
      </Modal>
    </div>
  );
};

export default Billing;
