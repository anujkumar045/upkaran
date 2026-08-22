import React from 'react';
import { Row, Col, Card, Table, Tag, Button, Avatar, Space } from 'antd';
import { ShoppingOutlined, BarcodeOutlined, LineChartOutlined, UsergroupAddOutlined, PlusOutlined } from '@ant-design/icons';
import StatCard from '../../components/common/StatCard';
import { formatCurrency } from '../../utils/formatters';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useNavigate } from 'react-router-dom';

const mockSalesData = [
  { month: 'Jan', units: 12 },
  { month: 'Feb', units: 18 },
  { month: 'Mar', units: 25 },
  { month: 'Apr', units: 32 },
  { month: 'May', units: 40 },
  { month: 'Jun', units: 48 },
];

export default function ManufacturerDashboard() {
  const navigate = useNavigate();
  const columns = [
    { title: 'Inquiry ID', dataIndex: 'id', key: 'id' },
    { title: 'Dealer / Farmer', dataIndex: 'customer', key: 'customer', render: (t) => <strong>{t}</strong> },
    { title: 'Product Requested', dataIndex: 'product', key: 'product' },
    { title: 'Quantity', dataIndex: 'qty', key: 'qty' },
    { title: 'Value', dataIndex: 'value', key: 'value', render: (v) => <span style={{ fontWeight: 700, color: '#2E7D32' }}>{formatCurrency(v)}</span> },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (s) => <Tag color="processing">{s}</Tag> }
  ];

  const inquiries = [
    { id: 'INQ-101', customer: 'Karnal Agri Dealers Co.', product: 'Garuda Spray Drone 10L', qty: 5, value: 2400000, status: 'Quotation Sent' },
    { id: 'INQ-102', customer: 'Patel Farm Syndicate', product: '5 HP Solar Pump Set', qty: 10, value: 1850000, status: 'In Discussion' }
  ];

  return (
    <div>
      <div style={{
        background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
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
            Manufacturer & Dealer Showcase Portal 🏬
          </h2>
          <p style={{ color: '#93c5fd', fontSize: 14, margin: '4px 0 0 0' }}>
            Showcase new machinery, manage B2B dealer leads & inventory stock
          </p>
        </div>
        <Button type="primary" size="large" icon={<PlusOutlined />} onClick={() => navigate('/dashboard/manufacturer/products')} style={{ background: '#FFC107', color: '#0f172a', fontWeight: 800, border: 'none' }}>
          Add New Product Showcase
        </Button>
      </div>

      <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard title="Total Showcase Products" value={14} icon={<ShoppingOutlined />} iconBg="#dbeafe" iconColor="#2563eb" />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard title="Available Stock Inventory" value={85} suffix=" units" icon={<BarcodeOutlined />} iconBg="#e8f5e9" iconColor="#2E7D32" />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard title="B2B Dealer Inquiries" value={24} icon={<UsergroupAddOutlined />} iconBg="#fef3c7" iconColor="#d97706" />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard title="Gross Sales Order Pipeline" prefix="₹" value="42.5 L" icon={<LineChartOutlined />} iconBg="#f3e8ff" iconColor="#9333ea" />
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
        <Col xs={24} lg={16}>
          <Card title="Monthly Units Sold Pipeline" style={{ borderRadius: 20 }}>
            <div style={{ width: '100%', height: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockSalesData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="units" stroke="#3b82f6" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title="Top Performing Machinery" style={{ borderRadius: 20, height: '100%' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong>Garuda Spray Drone 10L</strong>
                  <div style={{ fontSize: 12, color: '#64748b' }}>38 Inquiries • ₹4.8 Lakh</div>
                </div>
                <Tag color="blue">High Demand</Tag>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong>Kirloskar 5 HP Solar Pump</strong>
                  <div style={{ fontSize: 12, color: '#64748b' }}>24 Inquiries • ₹1.85 Lakh</div>
                </div>
                <Tag color="green">Govt Subsidy</Tag>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <Card title="Recent B2B Dealer Lead Inquiries" style={{ borderRadius: 20 }}>
        <Table columns={columns} dataSource={inquiries} rowKey="id" pagination={false} />
      </Card>
    </div>
  );
}
