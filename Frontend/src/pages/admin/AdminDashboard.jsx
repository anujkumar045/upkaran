import React from 'react';
import { Row, Col, Card, Table, Tag, Button, Avatar, Space } from 'antd';
import { UsergroupAddOutlined, ToolOutlined, DollarCircleOutlined, WarningOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import StatCard from '../../components/common/StatCard';
import { formatCurrency } from '../../utils/formatters';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const mockUserGrowth = [
  { month: 'Mar', users: 8200 },
  { month: 'Apr', users: 9800 },
  { month: 'May', users: 11400 },
  { month: 'Jun', users: 12600 },
  { month: 'Jul', users: 13500 },
  { month: 'Aug', users: 14250 },
];

export default function AdminDashboard() {
  const pendingColumns = [
    { title: 'Listing ID', dataIndex: 'id', key: 'id' },
    { title: 'Machinery Model', dataIndex: 'name', key: 'name', render: (t) => <strong>{t}</strong> },
    { title: 'Owner Name', dataIndex: 'owner', key: 'owner' },
    { title: 'Location', dataIndex: 'location', key: 'location' },
    { title: 'Daily Rate', dataIndex: 'rate', key: 'rate', render: (r) => formatCurrency(r) },
    {
      title: 'Verification Action',
      key: 'action',
      render: () => (
        <Space>
          <Button type="primary" size="small" icon={<CheckOutlined />} style={{ background: '#2E7D32' }}>Approve</Button>
          <Button danger size="small" icon={<CloseOutlined />}>Reject</Button>
        </Space>
      )
    }
  ];

  const pendingListings = [
    { id: 'EQ-PEND-01', name: 'Sonalika DI 745 III 50 HP Tractor', owner: 'Vikramjit Singh', location: 'Bathinda, Punjab', rate: 1600 },
    { id: 'EQ-PEND-02', name: 'New Holland 3630 TX Special', owner: 'Devendra Patel', location: 'Mehsana, Gujarat', rate: 1750 }
  ];

  return (
    <div>
      <div style={{
        background: 'linear-gradient(135deg, #111827 0%, #1f2937 100%)',
        borderRadius: 20,
        padding: '28px 32px',
        color: 'white',
        marginBottom: 32,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 16
      }}>
        <div>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: 'white', margin: 0 }} className="brand-font">
            UPKARAN Admin Control Center ⚡
          </h2>
          <p style={{ color: '#9ca3af', fontSize: 14, margin: '4px 0 0 0' }}>
            System health, compliance verifications & pan-India marketplace metrics
          </p>
        </div>
        <Tag color="red" style={{ fontWeight: 800, padding: '6px 16px', borderRadius: 20, fontSize: 13 }}>
          LIVE PLATFORM AGGREGATOR
        </Tag>
      </div>

      {/* Metrics Row */}
      <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard title="Total Platform Users" value="14,250" change={14} icon={<UsergroupAddOutlined />} iconBg="#e8f5e9" iconColor="#2E7D32" />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard title="Verified Machinery" value="3,190" icon={<ToolOutlined />} iconBg="#dbeafe" iconColor="#2563eb" />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard title="Monthly Gross GMV" prefix="₹" value="18.45 L" change={26} icon={<DollarCircleOutlined />} iconBg="#fef3c7" iconColor="#d97706" />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard title="Pending Approvals" value="14" icon={<WarningOutlined />} iconBg="#ffe4e6" iconColor="#e11d48" />
        </Col>
      </Row>

      {/* Growth Chart */}
      <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
        <Col xs={24} lg={16}>
          <Card title="Pan-India Farmer Registration Growth" style={{ borderRadius: 20 }}>
            <div style={{ width: '100%', height: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockUserGrowth}>
                  <defs>
                    <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="users" stroke="#2563eb" fillOpacity={1} fill="url(#userGrad)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title="System Health & Compliance" style={{ borderRadius: 20, height: '100%' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                  <span>KYC Identity Verification</span>
                  <strong style={{ color: '#2E7D32' }}>98.4%</strong>
                </div>
                <div style={{ background: '#e2e8f0', height: 8, borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ width: '98.4%', height: '100%', background: '#2E7D32' }}></div>
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                  <span>UPI Payment Gateway Success Rate</span>
                  <strong style={{ color: '#2563eb' }}>99.8%</strong>
                </div>
                <div style={{ background: '#e2e8f0', height: 8, borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ width: '99.8%', height: '100%', background: '#2563eb' }}></div>
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <Card title="Listings Pending Verification & Quality Inspection" style={{ borderRadius: 20 }}>
        <Table columns={pendingColumns} dataSource={pendingListings} rowKey="id" pagination={false} />
      </Card>
    </div>
  );
}
