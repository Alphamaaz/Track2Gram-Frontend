import React from 'react';
import { Typography } from 'antd';

const { Title, Text } = Typography;

export const SectionTitle = ({ title, subtitle, centered = true }) => (
    <div style={{ textAlign: centered ? 'center' : 'left', marginBottom: '60px' }}>
        <Title level={1} style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 800, color: '#0f172a' }}>{title}</Title>
        <Text style={{ fontSize: '18px', color: '#64748b', maxWidth: '700px', display: 'block', margin: centered ? '0 auto' : '0' }}>{subtitle}</Text>
    </div>
);
