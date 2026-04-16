import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { App, Card, Table, Tag, Space, Button, Input, Typography, Avatar } from 'antd';
import {
  SearchOutlined,
  DownloadOutlined,
  UserOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { API_BASE_URL } from '../config';
import { getApiHeaders } from '../utils/apiHeaders';

const { Title, Text } = Typography;

const STATUS_META = {
  completed: {
    color: 'success',
    bg: '#DCFCE7',
    textColor: '#16A34A',
    icon: <CheckCircleOutlined />,
    label: 'COMPLETED',
  },
  pending: {
    color: 'warning',
    bg: '#FEF9C3',
    textColor: '#CA8A04',
    icon: <ClockCircleOutlined />,
    label: 'PENDING',
  },
  failed: {
    color: 'error',
    bg: '#FEE2E2',
    textColor: '#DC2626',
    icon: <CloseCircleOutlined />,
    label: 'FAILED',
  },
  cancelled: {
    color: 'default',
    bg: '#F1F5F9',
    textColor: '#64748B',
    icon: <CloseCircleOutlined />,
    label: 'CANCELLED',
  },
};

const formatAmount = (amount, currency = 'PKR') =>
  `${String(currency || 'PKR').toUpperCase()} ${Number(amount || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const buildCsv = (rows) => {
  const headers = ['Transaction ID', 'Buyer', 'Email', 'Amount', 'Status', 'Payment Method', 'Date'];
  const lines = rows.map((row) => [
    row.transactionId,
    row.buyer?.name || '',
    row.buyer?.email || '',
    formatAmount(row.amount, row.currency),
    row.status,
    `${row.paymentGateway}${row.paymentMethod ? ` / ${row.paymentMethod}` : ''}`,
    dayjs(row.createdAt).format('MMM DD, YYYY'),
  ]);

  return [headers, ...lines]
    .map((line) =>
      line
        .map((value) => `"${String(value ?? '').replace(/"/g, '""')}"`)
        .join(','))
    .join('\n');
};

const TransactionHistory = () => {
  const { message } = App.useApp();
  const [searchText, setSearchText] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const token = localStorage.getItem('token');

  const fetchTransactions = useCallback(async (page = 1, limit = 10, search = '') => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });
      if (search.trim()) query.append('search', search.trim());

      const url = `${API_BASE_URL}/payments/transactions?${query.toString()}`;
      const response = await fetch(url, {
        headers: getApiHeaders({
          Authorization: `Bearer ${token}`,
        }, url),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || 'Failed to load transactions');
      }

      const items = data?.data?.items || [];
      const pageInfo = data?.data?.pagination || {};

      setTransactions(items);
      setPagination({
        current: Number(pageInfo.page || page),
        pageSize: Number(pageInfo.limit || limit),
        total: Number(pageInfo.total || items.length),
      });
    } catch (error) {
      console.error('Transaction history fetch error:', error);
      message.error(error.message || 'Failed to load transactions');
    } finally {
      setLoading(false);
    }
  }, [message, token]);

  useEffect(() => {
    fetchTransactions(1, pagination.pageSize, searchText);
  }, [fetchTransactions, pagination.pageSize, searchText]);

  const handleSearch = () => {
    setSearchText(inputValue);
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const handleExport = () => {
    if (!transactions.length) {
      message.info('No transactions available to export');
      return;
    }

    const csv = buildCsv(transactions);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `transactions-${dayjs().format('YYYY-MM-DD')}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const columns = useMemo(() => [
    {
      title: 'TRANSACTION ID',
      dataIndex: 'transactionId',
      key: 'transactionId',
      render: (text) => <Text strong style={{ color: '#1e293b' }}>{text || '-'}</Text>,
    },
    {
      title: 'BUYER',
      dataIndex: 'buyer',
      key: 'buyer',
      render: (buyer) => (
        <Space>
          <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#E0F2FE', color: '#084b8a' }} />
          <div>
            <Text strong style={{ color: '#1e293b', display: 'block' }}>{buyer?.name || 'Unknown Buyer'}</Text>
            <Text style={{ color: '#64748B', fontSize: 12 }}>{buyer?.email || '-'}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'AMOUNT',
      dataIndex: 'amount',
      key: 'amount',
      render: (_, record) => (
        <Text strong style={{ color: '#059669' }}>
          {formatAmount(record.amount, record.currency)}
        </Text>
      ),
    },
    {
      title: 'STATUS',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const meta = STATUS_META[String(status || '').toLowerCase()] || {
          color: 'default',
          bg: '#F1F5F9',
          textColor: '#64748B',
          icon: <ClockCircleOutlined />,
          label: String(status || 'UNKNOWN').toUpperCase(),
        };

        return (
          <Tag
            color={meta.color}
            style={{
              borderRadius: '12px',
              fontWeight: 600,
              border: 'none',
              background: meta.bg,
              color: meta.textColor,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            {meta.icon}
            {meta.label}
          </Tag>
        );
      },
    },
    {
      title: 'PAYMENT METHOD',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      render: (_, record) => (
        <div>
          <Text style={{ color: '#1e293b', display: 'block' }}>{record.paymentGateway || '-'}</Text>
          <Text style={{ color: '#64748B', fontSize: 12 }}>{record.paymentMethod || '-'}</Text>
        </div>
      ),
    },
    {
      title: 'DATE',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text) => <Text style={{ color: '#64748B' }}>{text ? dayjs(text).format('MMM DD, YYYY') : '-'}</Text>,
    },
  ], []);

  return (
    <div style={{ padding: 'clamp(8px, 3vw, 32px)' }}>
      <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <Title level={2} style={{ margin: 0, fontWeight: 800, color: '#1e293b' }}>Transaction History</Title>
          <Text style={{ color: '#1e293b' }}>View and track all your recent transactions</Text>
        </div>
        <Button
          type="primary"
          icon={<DownloadOutlined />}
          size="large"
          onClick={handleExport}
          style={{ background: '#084b8a', borderColor: '#084b8a', borderRadius: '8px', height: '44px', fontWeight: 600 }}
        >
          Export History
        </Button>
      </div>

      <Card
        variant="borderless"
        style={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}
        styles={{ body: { padding: '0' } }}
      >
        <div style={{ padding: '24px', borderBottom: '1px solid #f0f0f0' }}>
          <Input.Search
            placeholder="Search transactions..."
            prefix={<SearchOutlined style={{ color: '#BFBFBF' }} />}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onSearch={handleSearch}
            enterButton={false}
            allowClear
            style={{ width: '100%', maxWidth: '320px', borderRadius: '8px', background: '#F8FAFC', border: '1px solid #E2E8F0' }}
            size="large"
          />
        </div>
        <Table
          columns={columns}
          dataSource={transactions.map((item) => ({ ...item, key: item.id || item.transactionId }))}
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            onChange: (page, pageSize) => fetchTransactions(page, pageSize, searchText),
          }}
          locale={{ emptyText: 'No transactions found' }}
          rowClassName={() => 'hover-row'}
          scroll={{ x: 1000 }}
        />
      </Card>

      <style>
        {`
          .ant-table-thead > tr > th {
            font-size: 11px !important;
            font-weight: 900 !important;
            color: #ffffff !important;
            text-transform: uppercase !important;
            letter-spacing: 0.1em !important;
            border-bottom: 2px solid #f0f0f0 !important;
          }
          .hover-row:hover > td {
            background-color: #F8FAFC !important;
          }
        `}
      </style>
    </div>
  );
};

export default TransactionHistory;
