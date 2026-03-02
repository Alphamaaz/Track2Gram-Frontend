import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, Row, Col, Typography, DatePicker, Table, Space, Tag, Modal, List, Avatar, Button, Skeleton, App, Empty, Select } from 'antd';
import { CalendarOutlined, RiseOutlined, FallOutlined, UserOutlined, AimOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { useLocation } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { projectService } from '../services/project';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const METRIC_KEY_MAP = {
    visits: 'visits',
    visitors: 'visits',
    clicks: 'clicks',
    subscribers: 'subscribers',
    unsubscribers: 'unsubscribers',
    conversionRate: 'conversionRate',
    totalSpend: 'totalSpend',
};

const CHART_METRICS = [
    { value: 'visits', label: 'Visits' },
    { value: 'clicks', label: 'Clicks' },
    { value: 'subscribers', label: 'Subscribers' },
    { value: 'unsubscribers', label: 'Unsubscribers' },
    { value: 'conversionRate', label: 'Conversion Rate (%)' },
    { value: 'totalSpend', label: 'Ad Spend' },
];

const PLATFORM_FILTERS = [
    { value: 'all', label: 'All Platforms' },
    { value: 'google', label: 'Google Ads' },
    { value: 'meta', label: 'Meta Ads' },
];

const PLATFORM_COLORS = {
    google: '#084b8a',
    meta: '#6366f1',
    other: '#94a3b8',
};

const EMPTY_PLATFORM_METRICS = {
    totalVisits: 0,
    totalClicks: 0,
    totalSubscribers: 0,
    totalUnsubscribers: 0,
    netSubscribers: 0,
    conversionRate: 0,
    clickThroughRate: 0,
    unsubscribeRate: 0,
    totalSpend: 0,
    totalConversions: 0,
    costPerConversion: 0,
};

const Analytics = () => {
    const location = useLocation();
    const { message } = App.useApp();
    const project = location.state?.project;

    
    // State for data
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);
    const [chartData, setChartData] = useState([]);
    const [performanceReport, setPerformanceReport] = useState([]);
    const [activityLog, setActivityLog] = useState([]);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 20, total: 0 });

    // Filters
    const [dateRange, setDateRange] = useState([
        dayjs().subtract(30, 'day'),
        dayjs()
    ]);

    // UI state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDetail, setSelectedDetail] = useState(null);
    const [modalConfig, setModalConfig] = useState({ title: 'Subscribers', color: '#084b8a' });

    const { current, pageSize } = pagination;

    const [platformSummary, setPlatformSummary] = useState(null);
    const [rawChartByPlatform, setRawChartByPlatform] = useState(null);
    const [projectChartSeries, setProjectChartSeries] = useState(null);
    const [spendSeriesByPlatform, setSpendSeriesByPlatform] = useState(null);
    const [xAxisDates, setXAxisDates] = useState([]);
    const [selectedChartMetric, setSelectedChartMetric] = useState('visits');
    const [selectedChartPlatform, setSelectedChartPlatform] = useState('all');

    const resolveMetricSeries = useCallback((platformData, metric) => {
        if (!platformData) return [];
        const candidates = [METRIC_KEY_MAP[metric], metric];
        if (metric === 'visits') candidates.push('visitors');
        if (metric === 'visitors') candidates.push('visits');
        for (const key of candidates) {
            if (Array.isArray(platformData[key])) return platformData[key];
        }
        return [];
    }, []);

    const buildPlatformSummaryFromSeries = useCallback((seriesByPlatform = {}, spendByPlatform = {}) => {
        const out = {};
        Object.entries(seriesByPlatform || {}).forEach(([platform, series]) => {
            const visitsArr = Array.isArray(series?.visits) ? series.visits : [];
            const clicksArr = Array.isArray(series?.clicks) ? series.clicks : [];
            const subsArr = Array.isArray(series?.subscribers) ? series.subscribers : [];
            const unsubsArr = Array.isArray(series?.unsubscribers) ? series.unsubscribers : [];
            const spendArr = Array.isArray(spendByPlatform?.[platform]) ? spendByPlatform[platform] : [];

            const totalVisits = visitsArr.reduce((a, b) => a + Number(b || 0), 0);
            const totalClicks = clicksArr.reduce((a, b) => a + Number(b || 0), 0);
            const totalSubscribers = subsArr.reduce((a, b) => a + Number(b || 0), 0);
            const totalUnsubscribers = unsubsArr.reduce((a, b) => a + Number(b || 0), 0);
            const totalSpend = spendArr.reduce((a, b) => a + Number(b || 0), 0);
            const totalConversions = totalSubscribers;
            const netSubscribers = totalSubscribers - totalUnsubscribers;
            const conversionRate = totalClicks > 0 ? Number(((totalSubscribers / totalClicks) * 100).toFixed(2)) : 0;
            const clickThroughRate = totalVisits > 0 ? Number(((totalClicks / totalVisits) * 100).toFixed(2)) : 0;
            const unsubscribeRate = totalSubscribers > 0 ? Number(((totalUnsubscribers / totalSubscribers) * 100).toFixed(2)) : 0;
            const costPerConversion = totalSubscribers > 0 ? Number((totalSpend / totalSubscribers).toFixed(2)) : 0;

            out[platform] = {
                totalVisits,
                totalClicks,
                totalSubscribers,
                totalUnsubscribers,
                netSubscribers,
                conversionRate,
                clickThroughRate,
                unsubscribeRate,
                totalSpend,
                totalConversions,
                costPerConversion,
            };
        });
        return out;
    }, []);

    const normalizePlatformSummary = useCallback((apiSummary = {}) => {
        const normalizeOne = (obj = {}) => ({
            ...EMPTY_PLATFORM_METRICS,
            totalVisits: Number(obj.totalVisits || 0),
            totalClicks: Number(obj.totalClicks || 0),
            totalSubscribers: Number(obj.totalSubscribers || 0),
            totalUnsubscribers: Number(obj.totalUnsubscribers || 0),
            netSubscribers: Number(obj.netSubscribers || 0),
            conversionRate: Number(obj.conversionRate || 0),
            clickThroughRate: Number(obj.clickThroughRate || 0),
            unsubscribeRate: Number(obj.unsubscribeRate || 0),
            totalSpend: Number(obj.totalSpend || 0),
            totalConversions: Number(obj.totalConversions || 0),
            costPerConversion: Number(obj.costPerConversion || 0),
        });

        return {
            google: normalizeOne(apiSummary?.google),
            meta: normalizeOne(apiSummary?.meta),
        };
    }, []);

    // when the backend accidentally copies the google time-series into the meta
    // slot we end up with a perfectly valid meta array that just happens to be a
    // duplicate of google. the chart logic then treats those values as real data
    // and draws the spike even though the platformSummary reports zero. this
    // helper detects the condition and zeroes the offending arrays so the UI can
    // correctly render an empty chart.
    const sanitizeSeriesByPlatform = useCallback((seriesByPlatform = {}) => {
        const google = seriesByPlatform.google || {};
        const hasGoogleData = Object.values(google).some(arr =>
            Array.isArray(arr) && arr.some(v => Number(v) > 0)
        );
        const out = {};

        Object.entries(seriesByPlatform).forEach(([platform, data]) => {
            if (platform === 'google' || !hasGoogleData) {
                out[platform] = data;
                return;
            }

            // compare every array in `data` to the corresponding google array
            let identical = true;
            Object.entries(data || {}).forEach(([key, arr]) => {
                const garr = google[key] || [];
                if (!Array.isArray(arr) || arr.length !== garr.length) {
                    identical = false;
                    return;
                }
                for (let i = 0; i < arr.length; i++) {
                    if (Number(arr[i] || 0) !== Number(garr[i] || 0)) {
                        identical = false;
                        break;
                    }
                }
            });

            if (identical) {
                // replace with same-shaped zero arrays
                out[platform] = Object.keys(data || {}).reduce((acc, key) => {
                    acc[key] = (data[key] || []).map(() => 0);
                    return acc;
                }, {});
            } else {
                out[platform] = data;
            }
        });
        return out;
    }, []);

    // helper that ensures the platform summary is sane – if the API accidentally
    // duplicates google data into the "meta" key or otherwise returns two
    // identical non‑zero records we treat the second platform as empty so the UI
    // doesn’t show duplicate cards or double counts in the top stats.
    const sanitizePlatformSummary = useCallback((summary = {}) => {
        const google = summary.google || { ...EMPTY_PLATFORM_METRICS };
        const meta = summary.meta || { ...EMPTY_PLATFORM_METRICS };
        const identicalNonZero =
            google.totalVisits > 0 &&
            google.totalVisits === meta.totalVisits &&
            google.totalClicks === meta.totalClicks &&
            google.totalSubscribers === meta.totalSubscribers &&
            google.totalUnsubscribers === meta.totalUnsubscribers &&
            google.totalSpend === meta.totalSpend &&
            google.conversionRate === meta.conversionRate &&
            google.clickThroughRate === meta.clickThroughRate;
        if (identicalNonZero) {
            return { google, meta: { ...EMPTY_PLATFORM_METRICS } };
        }
        return { google, meta };
    }, []);


    const fetchAllData = useCallback(async () => {
        setLoading(true);
        if (!project?._id) {
            // Reset global analytics state before every fetch to avoid stale UI when responses change.
            setPlatformSummary(null);
            setStats(null);
        }
        const startDate = dateRange[0]?.format('YYYY-MM-DD');
        const endDate = dateRange[1]?.format('YYYY-MM-DD');

        try {
            if (project?._id) {
                // Project Specific Analytics
                const [statsRes, chartRes, reportRes, activityRes] = await Promise.all([
                    projectService.getStats(project._id, startDate, endDate),
                    projectService.getSubscriptionsChart(project._id, startDate, endDate),
                    projectService.getPerformanceReport(project._id),
                    projectService.getActivityLog(project._id, startDate, endDate, current, pageSize)
                ]);

                if (statsRes.success) setStats(statsRes.data);
                if (chartRes.success) {
                    const formattedChart = chartRes.data.chart.xAxis.values.map((val, idx) => ({
                        name: val,
                        value: chartRes.data.chart.yAxis.values[idx]
                    }));
                    setChartData(formattedChart);
                }
                if (reportRes.success) setPerformanceReport(reportRes.data.report || []);
                if (activityRes.success) {
                    setActivityLog(activityRes.data.items || []);
                    const newTotal = activityRes.data.pagination?.total || 0;
                    setPagination(prev => prev.total === newTotal ? prev : { ...prev, total: newTotal });
                }
            } else {
                // Global Analytics
                const analyticsRes = await projectService.getPlatformAnalytics(startDate, endDate);
                if (analyticsRes.success && analyticsRes.data) {
                    const { summaryByPlatform, chart } = analyticsRes.data;

                    const computedPlatformSummary = buildPlatformSummaryFromSeries(
                        chart?.byPlatform || {},
                        chart?.spendByPlatform || {}
                    );

                    const hasApiPlatformSummary = !!summaryByPlatform && Object.keys(summaryByPlatform).length > 0;
                    let effectivePlatformSummary = hasApiPlatformSummary
                        ? normalizePlatformSummary(summaryByPlatform)
                        : normalizePlatformSummary(computedPlatformSummary);

                    // make sure we don't accidentally show the same numbers twice
                    effectivePlatformSummary = sanitizePlatformSummary(effectivePlatformSummary);
                    setPlatformSummary(effectivePlatformSummary);

                    // derive global stats directly from the platform summary so that the
                    // top cards always match the breakdown below; this also avoids any
                    // weirdness if the backend returns a projectSummary that doesn’t
                    // line up with the per-platform totals.
                    const googleSummary = effectivePlatformSummary.google || { ...EMPTY_PLATFORM_METRICS };
                    const metaSummary = effectivePlatformSummary.meta || { ...EMPTY_PLATFORM_METRICS };
                    const totalVisits = googleSummary.totalVisits + metaSummary.totalVisits;
                    const totalClicks = googleSummary.totalClicks + metaSummary.totalClicks;
                    const totalSubscribers = googleSummary.totalSubscribers + metaSummary.totalSubscribers;
                    const totalUnsubscribers = googleSummary.totalUnsubscribers + metaSummary.totalUnsubscribers;
                    const totalSpend = googleSummary.totalSpend + metaSummary.totalSpend;
                    const conversionRate = totalClicks > 0
                        ? Number(((totalSubscribers / totalClicks) * 100).toFixed(2))
                        : 0;

                    setStats({
                        visitors: totalVisits,
                        clicks: totalClicks,
                        subscribers: totalSubscribers,
                        unsubscribers: totalUnsubscribers,
                        conversionRate: conversionRate.toFixed(2),
                        adSpend: totalSpend,
                    });

                    const chartProject = chart?.project || {};
                    const chartTotals = {
                        totalVisits: (chartProject.visits || []).reduce((a, b) => a + Number(b || 0), 0),
                        totalClicks: (chartProject.clicks || []).reduce((a, b) => a + Number(b || 0), 0),
                        totalSubscribers: (chartProject.subscribers || []).reduce((a, b) => a + Number(b || 0), 0),
                        totalUnsubscribers: (chartProject.unsubscribers || []).reduce((a, b) => a + Number(b || 0), 0),
                    };
                    const chartConversionRate = chartTotals.totalClicks > 0
                        ? Number(((chartTotals.totalSubscribers / chartTotals.totalClicks) * 100).toFixed(2))
                        : 0;

                    // Store raw chart data for metric switching
                    if (chart?.xAxis) {
                        // clean up any duplicated google-series before storing; this
                        // keeps the UI from plotting phantom spikes when only one
                        // platform has real data.
                        const cleanedByPlatform = sanitizeSeriesByPlatform(chart.byPlatform || {});
                        setRawChartByPlatform(cleanedByPlatform);

                        const cleanedSpend = sanitizeSeriesByPlatform(chart.spendByPlatform || {});
                        setSpendSeriesByPlatform(cleanedSpend);

                        setProjectChartSeries(chart.project || null);
                        // keep chart filter stable after refresh
                        setSelectedChartPlatform(prev => (['all', 'google', 'meta'].includes(prev) ? prev : 'all'));
                        setXAxisDates(chart.xAxis.values.map(val =>
                            dateRange[0] ? dateRange[0].add(val - 1, 'day').format('MMM DD') : `Day ${val}`
                        ));
                    }
                    setPerformanceReport([]);
                    setActivityLog([]);
                }
            }
        } catch (error) {
            console.error('Failed to fetch analytics data:', error);
            message.error(error?.message || 'Failed to load analytics data');
        } finally {
            setLoading(false);
        }
    }, [project?._id, dateRange, current, pageSize, message, buildPlatformSummaryFromSeries, normalizePlatformSummary]);


    useEffect(() => {
        fetchAllData();
    }, [fetchAllData]);

    // Build chart data reactively when metric or raw data changes
    const globalChartData = useMemo(() => {
        if (!xAxisDates.length) return [];
        const platformOnlyMetrics = new Set(['totalSpend']);
        const isPlatformOnly = platformOnlyMetrics.has(selectedChartMetric);
        const rows = xAxisDates.map((name, idx) => {
            const entry = { name };
            if (isPlatformOnly) {
                if (selectedChartPlatform === 'all') {
                    const google = Number(spendSeriesByPlatform?.google?.[idx] ?? 0);
                    const meta = Number(spendSeriesByPlatform?.meta?.[idx] ?? 0);
                    entry.google = google;
                    entry.meta = meta;
                } else {
                    entry[selectedChartPlatform] = Number(spendSeriesByPlatform?.[selectedChartPlatform]?.[idx] ?? 0);
                }
            } else if (selectedChartMetric === 'conversionRate') {
                if (selectedChartPlatform === 'all') {
                    const c = Number(projectChartSeries?.clicks?.[idx] ?? 0);
                    const s = Number(projectChartSeries?.subscribers?.[idx] ?? 0);
                    entry.all_projects = c > 0 ? Number(((s / c) * 100).toFixed(2)) : 0;
                } else {
                    const clicks = Number(rawChartByPlatform?.[selectedChartPlatform]?.clicks?.[idx] ?? 0);
                    const subscribers = Number(rawChartByPlatform?.[selectedChartPlatform]?.subscribers?.[idx] ?? 0);
                    entry[selectedChartPlatform] = clicks > 0 ? Number(((subscribers / clicks) * 100).toFixed(2)) : 0;
                }
            } else {
                if (selectedChartPlatform === 'all') {
                    const projectKey = selectedChartMetric === 'visits' ? 'visits' : selectedChartMetric;
                    entry.all_projects = Number(projectChartSeries?.[projectKey]?.[idx] ?? 0);
                } else {
                    const series = resolveMetricSeries(rawChartByPlatform?.[selectedChartPlatform], selectedChartMetric);
                    entry[selectedChartPlatform] = Number(series?.[idx] ?? 0);
                }
            }
            return entry;
        });

        // Fallback for sparse/misaligned platform series: use summary totals on last day.
        const hasAnyValue = rows.some((row) =>
            Object.entries(row).some(([k, v]) => k !== 'name' && Number(v) > 0)
        );
        if (!hasAnyValue && platformSummary && rows.length) {
            const summaryMetricKey = selectedChartMetric === 'visits'
                ? 'totalVisits'
                : selectedChartMetric === 'clicks'
                    ? 'totalClicks'
                    : selectedChartMetric === 'subscribers'
                        ? 'totalSubscribers'
                        : selectedChartMetric === 'unsubscribers'
                            ? 'totalUnsubscribers'
                            : selectedChartMetric === 'conversionRate'
                                ? 'conversionRate'
                                : null;

            if (summaryMetricKey) {
                const last = rows[rows.length - 1];
                if (selectedChartPlatform === 'all') {
                    if (isPlatformOnly) {
                        Object.entries(platformSummary).forEach(([platform, summary]) => {
                            last[String(platform).toLowerCase()] = Number(summary?.[summaryMetricKey] ?? 0);
                        });
                    } else {
                        const total = Object.values(platformSummary).reduce(
                            (sum, summary) => sum + Number(summary?.[summaryMetricKey] ?? 0),
                            0
                        );
                        last.all_projects = total;
                    }
                } else {
                    last[selectedChartPlatform] = Number(platformSummary?.[selectedChartPlatform]?.[summaryMetricKey] ?? 0);
                }
            }
        }

        return rows;
    }, [
        rawChartByPlatform,
        xAxisDates,
        selectedChartMetric,
        selectedChartPlatform,
        resolveMetricSeries,
        platformSummary,
        projectChartSeries,
        spendSeriesByPlatform,
    ]);

    // collect only keys for series that actually contain a non‑zero value.
    const globalSeriesKeys = useMemo(() => {
        if (!globalChartData.length) return [];
        const keys = new Set();
        globalChartData.forEach((row) => {
            Object.entries(row || {}).forEach(([k, v]) => {
                if (k === 'name') return;
                if (Number(v) > 0) keys.add(k);
            });
        });
        return Array.from(keys);
    }, [globalChartData]);

    const displaySeriesKeys = useMemo(() => {
        if (project) return [];
        // if we found any real data points, use those keys; otherwise render empty
        // placeholder (handled further down).
        if (globalSeriesKeys.length > 0) return globalSeriesKeys;
        return [];
    }, [project, globalSeriesKeys]);

    const chartIsEmpty = useMemo(() => {
        return !project && displaySeriesKeys.length === 0;
    }, [project, displaySeriesKeys.length]);

    const chartMaxValue = useMemo(() => {
        const src = project ? chartData : globalChartData;
        let max = 0;
        src.forEach((row) => {
            Object.entries(row || {}).forEach(([k, v]) => {
                if (k === 'name') return;
                const n = Number(v || 0);
                if (Number.isFinite(n) && n > max) max = n;
            });
        });
        return max;
    }, [project, chartData, globalChartData]);

    const showModal = (data, type = 'subscribers') => {
        setSelectedDetail(data);
        if (type === 'unsubscribers') {
            setModalConfig({ title: 'Unsubscriptions', color: '#ef4444' });
        } else {
            setModalConfig({ title: 'Subscribers', color: '#084b8a' });
        }
        setIsModalOpen(true);
    };

    const statCards = [
        { title: 'Total Visits', value: stats?.visitors?.toLocaleString() || 0 },
        { title: 'Total Clicks', value: stats?.clicks?.toLocaleString() || 0 },
        { title: 'Subscriptions', value: stats?.subscribers?.toLocaleString() || 0 },
        { title: 'Unsubscriptions', value: stats?.unsubscribers?.toLocaleString() || 0, isNegative: true },
        { title: 'Conversion Rate', value: `${stats?.conversionRate || 0}%` },
        { title: 'Total Ad Spend', value: `$${stats?.adSpend?.toLocaleString() || 0}` },
    ];

    // we always render both Google and Meta cards, even if their values are
    // zero; the sanitizer already clears out duplicates so the UI won’t show
    // twice the same numbers, but zero‑value platforms should still appear.
    const displayedPlatforms = useMemo(() => {
        if (!platformSummary) return [];
        return Object.entries(platformSummary);
    }, [platformSummary]);

    const campaignColumns = [
        {
            title: 'Campaign Name',
            dataIndex: 'campaignName',
            key: 'campaignName',
            width: '50%',
            render: text => <Text strong style={{ color: '#1e293b' }}>{text || 'Unattributed'}</Text>
        },
        {
            title: 'Conversions',
            dataIndex: 'subscribers',
            key: 'subscribers',
            align: 'right',
            render: (sub) => (
                <div style={{ cursor: 'pointer' }} onClick={() => showModal(sub, 'subscribers')}>
                    <Tag color="#eff6ff" style={{
                        color: '#084b8a', borderRadius: '12px', fontWeight: 600,
                        fontSize: '13px', border: '1px solid #dbeafe', margin: 0
                    }}>
                        +{sub?.count || 0}
                    </Tag>
                </div>
            )
        },
        {
            title: 'Unsubs',
            dataIndex: 'unsubscribers',
            key: 'unsubscribers',
            align: 'right',
            render: (unsub) => (
                <div style={{ cursor: 'pointer' }} onClick={() => showModal(unsub, 'unsubscribers')}>
                    <Tag color="#fef2f2" style={{
                        color: '#ef4444', borderRadius: '12px', fontWeight: 600,
                        fontSize: '13px', border: '1px solid #fee2e2', margin: 0
                    }}>
                        -{unsub?.count || 0}
                    </Tag>
                </div>
            )
        }
    ];

    const activityColumns = [
        {
            title: 'Source',
            dataIndex: 'source',
            key: 'source',
            width: 100,
            render: text => <Tag color="blue" style={{ borderRadius: '4px', textTransform: 'uppercase', fontSize: '10px', fontWeight: 700 }}>{text}</Tag>
        },
        {
            title: 'IP Address',
            dataIndex: 'ip',
            key: 'ip',
            width: 130,
            render: text => <Text type="secondary" style={{ fontFamily: 'monospace', fontSize: '12px' }}>{text}</Text>
        },
        {
            title: 'Country',
            dataIndex: 'country',
            key: 'country',
            width: 120,
            render: text => <Text type="secondary" style={{ fontSize: '12px' }}>{text || '-'}</Text>
        },
        {
            title: 'Device',
            dataIndex: 'device',
            key: 'device',
            width: 110,
            render: text => <Text type="secondary" style={{ fontSize: '12px' }}>{text || '-'}</Text>
        },
        {
            title: 'Browser',
            dataIndex: 'browser',
            key: 'browser',
            width: 120,
            render: text => <Text type="secondary" style={{ fontSize: '12px' }}>{text || '-'}</Text>
        },
        {
            title: 'Time',
            dataIndex: 'timestamp',
            key: 'time',
            width: 160,
            align: 'right',
            render: text => <Text type="secondary" style={{ fontSize: '12px' }}>{dayjs(text).format('MMM D, HH:mm')}</Text>
        },
    ];

    return (
        <div style={{ padding: '0 clamp(12px, 3vw, 24px)', paddingBottom: '40px', maxWidth: '1600px', margin: '0 auto', background: '#F8FAFC' }}>
            <div style={{ marginBottom: '32px', paddingTop: '24px' }}>
                <Title level={2} style={{ margin: 0, fontWeight: 800, letterSpacing: '-0.02em', color: '#084b8a' }}>
                    {project?.name || 'Overall'} Analytics
                </Title>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: '8px',
                    flexWrap: 'wrap',
                    gap: '16px'
                }}>
                    <Text style={{ color: '#64748b', fontSize: '14px', fontWeight: 500 }}>{project ? `Detailed performance metrics for ${project.name}.` : 'Combined performance metrics across all projects.'}</Text>
                    <RangePicker
                        value={dateRange}
                        onChange={setDateRange}
                        style={{ borderRadius: '8px', padding: '8px 12px' }}
                    />
                </div>
            </div>

            {loading ? (
                <Skeleton active paragraph={{ rows: 12 }} />
            ) : (
                <>
                    {/* Stats Grid */}
                    <Row gutter={[16, 16]} style={{ marginBottom: '32px' }}>
                        {statCards.map((stat, index) => (
                            <Col xs={12} sm={8} md={8} lg={4} key={index}>
                                <Card
                                    variant="borderless"
                                    style={{
                                        borderRadius: '16px',
                                        backgroundColor: '#E6ECF2',
                                        border: '1px solid rgba(8, 75, 138, 0.1)',
                                        boxShadow: 'none',
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center'
                                    }}
                                    styles={{ body: { padding: 'clamp(12px, 2vw, 20px)' } }}
                                >
                                    <Text style={{ color: '#475569', fontWeight: 600, fontSize: 'clamp(11px, 1.2vw, 13px)', display: 'block', marginBottom: '4px' }}>
                                        {stat.title}
                                    </Text>
                                    <Title level={4} style={{ margin: 0, fontWeight: 800, color: stat.isNegative ? '#ef4444' : '#084b8a', fontSize: 'clamp(18px, 2vw, 24px)' }}>
                                        {stat.value}
                                    </Title>
                                </Card>
                            </Col>
                        ))}
                    </Row>

                    {/* Per-Platform Breakdown (Global View Only) */}
                    {!project && displayedPlatforms.length > 0 && (
                        <Row gutter={[16, 16]} style={{ marginBottom: '32px' }}>
                            {displayedPlatforms.map(([platform, data]) => {
                                const isGoogle = platform === 'google';
                                const color = isGoogle ? '#084b8a' : '#6366f1';
                                const label = isGoogle ? '🔵 Google Ads' : '🟣 Meta Ads';
                                const metrics = [
                                    { label: 'Visits', value: data.totalVisits ?? 0 },
                                    { label: 'Clicks', value: data.totalClicks ?? 0 },
                                    { label: 'Subscribers', value: data.totalSubscribers ?? 0 },
                                    { label: 'Unsubscribers', value: data.totalUnsubscribers ?? 0 },
                                    { label: 'Conv. Rate', value: `${data.conversionRate ?? 0}%` },
                                    { label: 'CTR', value: `${data.clickThroughRate ?? 0}%` },
                                    { label: 'Ad Spend', value: `$${(data.totalSpend ?? 0).toLocaleString()}` },
                                    { label: 'Cost/Conv.', value: `$${data.costPerConversion ?? 0}` },
                                ];
                                return (
                                    <Col xs={24} md={12} key={platform}>
                                        <Card
                                            variant="borderless"
                                            style={{
                                                borderRadius: '20px',
                                                border: `1px solid ${color}22`,
                                                background: '#fff',
                                                boxShadow: '0 4px 20px -5px rgba(0,0,0,0.05)',
                                                height: '100%'
                                            }}
                                            styles={{ body: { padding: '24px' } }}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                                                <div style={{
                                                    width: '12px', height: '12px', borderRadius: '50%',
                                                    background: color, boxShadow: `0 0 8px ${color}88`
                                                }} />
                                                <Text strong style={{ color, fontSize: '15px', textTransform: 'capitalize' }}>
                                                    {label}
                                                </Text>
                                            </div>
                                            <Row gutter={[12, 12]}>
                                                {metrics.map(m => (
                                                    <Col xs={12} key={m.label}>
                                                        <div style={{
                                                            background: '#f8fafc',
                                                            borderRadius: '10px',
                                                            padding: '12px',
                                                            border: '1px solid #f1f5f9'
                                                        }}>
                                                            <Text style={{ color: '#64748b', fontSize: '11px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>{m.label}</Text>
                                                            <Text strong style={{ color: '#1e293b', fontSize: '16px' }}>{m.value}</Text>
                                                        </div>
                                                    </Col>
                                                ))}
                                            </Row>
                                        </Card>
                                    </Col>
                                );
                            })}
                        </Row>
                    )}

                    {/* Chart Section */}
                    <Card
                        variant="borderless"
                        
                        style={{ borderRadius: '20px', marginBottom: '32px', boxShadow: '0 4px 20px -5px rgba(0, 0, 0, 0.05)', background: '#fff' }}
                        styles={{ body: { padding: 'clamp(16px, 3vw, 32px)' } }}
                        title={
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                                <Text strong style={{ color: '#084b8a', fontSize: '15px' }}>
                                    {project ? 'Daily Subscriptions' : 'Platform Analytics'}
                                </Text>
                                {!project && (
                                    <Space>
                                        <Select
                                            value={selectedChartMetric}
                                            onChange={setSelectedChartMetric}
                                            style={{ width: 180 }}
                                            options={CHART_METRICS}
                                            size="middle"
                                        />
                                        <Select
                                            value={selectedChartPlatform}
                                            onChange={setSelectedChartPlatform}
                                            style={{ width: 160 }}
                                            options={PLATFORM_FILTERS}
                                            size="middle"
                                        />
                                    </Space>
                                )}
                            </div>
                        }
                    >
                        <div style={{ height: '380px', width: '100%' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={project ? chartData : globalChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorGoogle" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#084b8a" stopOpacity={0.4} />
                                            <stop offset="95%" stopColor="#084b8a" stopOpacity={0.02} />
                                        </linearGradient>
                                        <linearGradient id="colorMeta" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0.02} />
                                        </linearGradient>
                                        <linearGradient id="colorOther" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.4} />
                                            <stop offset="95%" stopColor="#94a3b8" stopOpacity={0.02} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94a3b8', fontSize: 11 }}
                                        dy={10}
                                        interval="preserveStartEnd"
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94a3b8', fontSize: 11 }}
                                        allowDecimals={false}
                                        domain={[0, chartMaxValue > 0 ? Math.ceil(chartMaxValue * 1.1) : 1]}
                                    />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', padding: '12px' }}
                                        labelStyle={{ fontWeight: 800, color: '#084b8a', marginBottom: '4px' }}
                                    />
                                    <Legend verticalAlign="top" height={36} iconType="circle" />
                                    {project && (
                                        <Area
                                            type="linear"
                                            dataKey="value"
                                            name="Subscriptions"
                                            stroke="#084b8a"
                                            strokeWidth={3}
                                            fillOpacity={1}
                                            fill="url(#colorGoogle)"
                                            dot={{ r: 4, fill: '#084b8a', strokeWidth: 2, stroke: '#fff' }}
                                            activeDot={{ r: 6, strokeWidth: 0 }}
                                            animationDuration={1500}
                                        />
                                    )}
                                    {!project && chartIsEmpty && (
                                        <Area
                                            type="linear"
                                            dataKey="__empty__"
                                            stroke="#cbd5e1"
                                            fillOpacity={0}
                                            isAnimationActive={false}
                                        />
                                    )}
                                    {!project && displaySeriesKeys.map((key) => {
                                        const normalized = key === 'all_projects'
                                            ? 'google'
                                            : (['google', 'meta'].includes(key) ? key : 'other');
                                        const color = PLATFORM_COLORS[normalized];
                                        const label =
                                            key === 'google' ? 'Google Ads'
                                                : key === 'meta' ? 'Meta Ads'
                                                    : key === 'all_projects' ? 'All Projects'
                                                    : key.charAt(0).toUpperCase() + key.slice(1);
                                        return (
                                            <Area
                                                key={key}
                                                type="linear"
                                                dataKey={key}
                                                name={label}
                                                stroke={color}
                                                strokeWidth={3}
                                                fillOpacity={1}
                                                fill={`url(#color${normalized.charAt(0).toUpperCase() + normalized.slice(1)})`}
                                                dot={{ r: 4, fill: color, strokeWidth: 2, stroke: '#fff' }}
                                                activeDot={{ r: 5, strokeWidth: 0 }}
                                                connectNulls
                                                animationDuration={chartIsEmpty ? 0 : 1500}
                                            />
                                        );
                                    })}
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>

                    {/* Vertical Tables Layout - Only show if project is selected or if there is data */}
                    {(project || activityLog.length > 0 || performanceReport.length > 0) && (
                        <Space direction="vertical" size={32} style={{ width: '100%' }}>
                            {performanceReport.length > 0 && (
                                <Card
                                    title={<Text strong style={{ fontSize: '16px', color: '#084b8a' }}>Campaign Performance</Text>}
                                    variant="borderless"
                                    style={{ borderRadius: '20px', boxShadow: '0 4px 20px -5px rgba(0, 0, 0, 0.05)', background: '#fff' }}
                                    styles={{ body: { padding: '8px 0' } }}
                                >
                                    <Table
                                        columns={campaignColumns}
                                        dataSource={performanceReport}
                                        pagination={false}
                                        rowKey={(record, index) => record.campaignName || `unattributed-${index}`}
                                        className="premium-table"
                                        scroll={{ x: 600 }}
                                    />
                                </Card>
                            )}

                            {activityLog.length > 0 && (
                                <Card
                                    title={<Text strong style={{ fontSize: '16px', color: '#084b8a' }}>Activity Log</Text>}
                                    variant="borderless"
                                    style={{ borderRadius: '20px', boxShadow: '0 4px 20px -5px rgba(0, 0, 0, 0.05)', background: '#fff' }}
                                    styles={{ body: { padding: '8px 0' } }}
                                >
                                    <Table
                                        columns={activityColumns}
                                        dataSource={activityLog}
                                        pagination={{
                                            ...pagination,
                                            size: 'small',
                                            showSizeChanger: false,
                                            onChange: (page) => setPagination(prev => ({ ...prev, current: page }))
                                        }}
                                        rowKey={(record) => record._id || Math.random()}
                                        className="premium-table"
                                        scroll={{ x: 800 }}
                                    />
                                </Card>
                            )}
                        </Space>
                    )}
                </>
            )}

            <Modal
                title={
                    <div style={{ background: modalConfig.color, padding: '20px 24px', margin: '-20px -24px 20px -24px', borderTopLeftRadius: '12px', borderTopRightRadius: '12px' }}>
                        <Text style={{ color: 'white', fontSize: '18px', fontWeight: 600 }}>{modalConfig.title}</Text>
                    </div>
                }
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
                width={500}
                centered
                styles={{ content: { borderRadius: '12px', overflow: 'hidden', padding: 0 } }}
            >
                <div style={{ padding: '0 24px 24px' }}>
                    <List
                        dataSource={selectedDetail?.users || []}
                        renderItem={(user) => (
                            <List.Item style={{ padding: '16px', background: '#f8fafc', borderRadius: '12px', marginBottom: '12px', border: '1px solid #f1f5f9' }}>
                                <List.Item.Meta
                                    avatar={<Avatar icon={<UserOutlined />} style={{ backgroundColor: '#e2e8f0', color: '#64748b' }} size="large" />}
                                    title={<Text strong style={{ color: '#0f172a' }}>{user.username || 'Anonymous User'}</Text>}
                                    description={<Text type="secondary" style={{ fontSize: '13px' }}>ID: {user.telegramUserId}</Text>}
                                />
                            </List.Item>
                        )}
                        locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No user details available" /> }}
                    />
                </div>
            </Modal>

            <style>
                {`
                    .premium-table .ant-table-thead > tr > th {
                        background: #f8fafc !important;
                        color: #64748b !important;
                        font-weight: 600 !important;
                        font-size: 11px !important;
                        text-transform: uppercase !important;
                        letter-spacing: 0.05em !important;
                        border-bottom: 1px solid #f1f5f9 !important;
                        padding: 16px 24px !important;
                    }
                    .premium-table .ant-table-tbody > tr > td {
                        border-bottom: 1px solid #f1f5f9 !important;
                        padding: 16px 24px !important;
                    }
                    .premium-table .ant-table-tbody > tr:hover > td {
                        background: #f8fafc !important;
                    }
                    .premium-table .ant-table {
                        background: transparent !important;
                    }
                    .premium-table .ant-pagination {
                        padding: 16px 24px !important;
                        margin: 0 !important;
                    }
                    @media (max-width: 576px) {
                        .ant-picker-range {
                            width: 100% !important;
                        }
                    }
                `}
            </style>
        </div>
    );
};

export default Analytics;
