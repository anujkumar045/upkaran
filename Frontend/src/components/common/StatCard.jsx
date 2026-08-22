import React from 'react';
import { Card, Tag } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

export default function StatCard({ title, value, prefix = '', suffix = '', change, changeType = 'up', icon, iconBg = '#e8f5e9', iconColor = '#2E7D32' }) {
  return (
    <Card
      style={{
        borderRadius: 16,
        border: '1px solid #e2e8f0',
        boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
      }}
      bodyStyle={{ padding: 20 }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {title}
          </span>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', marginTop: 4, fontFamily: "'Outfit', sans-serif" }}>
            {prefix}{value}{suffix}
          </div>
        </div>

        <div style={{
          width: 48,
          height: 48,
          borderRadius: 12,
          background: iconBg,
          color: iconColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 22
        }}>
          {icon}
        </div>
      </div>

      {change !== undefined && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
          <Tag color={changeType === 'up' ? 'success' : 'error'} style={{ borderRadius: 10, margin: 0, fontWeight: 700 }}>
            {changeType === 'up' ? <ArrowUpOutlined /> : <ArrowDownOutlined />} {change}%
          </Tag>
          <span style={{ color: '#94a3b8' }}>vs last month</span>
        </div>
      )}
    </Card>
  );
}
