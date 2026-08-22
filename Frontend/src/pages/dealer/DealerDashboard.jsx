import React from 'react';
import { Button, Card, Col, Row, Table, Tag } from 'antd';
import {
  BarcodeOutlined,
  DollarCircleOutlined,
  PlusOutlined,
  ShoppingCartOutlined,
  UsergroupAddOutlined,
} from '@ant-design/icons';
import StatCard from '../../components/common/StatCard';
import { formatCurrency } from '../../utils/formatters';
import { useNavigate } from 'react-router-dom';

const orders = [
  { id: 'ORD-2048', product: 'Garuda Spray Drone 10L', supplier: 'AgriTech India', quantity: 2, value: 960000, status: 'Processing' },
  { id: 'ORD-2045', product: '5 HP Solar Pump Set', supplier: 'Surya Equipments', quantity: 5, value: 925000, status: 'Dispatched' },
  { id: 'ORD-2041', product: 'Rotavator', supplier: 'Kisan Implements', quantity: 1, value: 145000, status: 'Delivered' },
];

const statusColors = {
  Processing: 'warning',
  Dispatched: 'processing',
  Delivered: 'success',
};

export default function DealerDashboard() {
  const navigate = useNavigate();
  const columns = [
    { title: 'Order', dataIndex: 'id', key: 'id', render: (value) => <strong>{value}</strong> },
    { title: 'Product', dataIndex: 'product', key: 'product' },
    { title: 'Supplier', dataIndex: 'supplier', key: 'supplier' },
    { title: 'Qty', dataIndex: 'quantity', key: 'quantity' },
    { title: 'Order Value', dataIndex: 'value', key: 'value', render: (value) => <strong style={{ color: '#2E7D32' }}>{formatCurrency(value)}</strong> },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (status) => <Tag color={statusColors[status]}>{status}</Tag> },
  ];

  return (
    <div>
      <div style={{
        background: 'linear-gradient(135deg, #9a3412 0%, #ea580c 100%)',
        borderRadius: 20,
        padding: '28px 32px',
        color: 'white',
        marginBottom: 32,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 16,
        flexWrap: 'wrap',
      }}>
        <div>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: 'white', margin: 0 }} className="brand-font">
            Dealer Business Dashboard
          </h2>
          <p style={{ color: '#fed7aa', fontSize: 14, margin: '4px 0 0' }}>
            Track inventory, supplier orders, and your equipment business in one place.
          </p>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/dashboard/dealer/add-equipment')} style={{ background: '#fef3c7', color: '#9a3412', border: 'none', fontWeight: 700 }}>
          List Equipment
        </Button>
      </div>

      <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard title="Inventory Items" value={38} icon={<BarcodeOutlined />} iconBg="#ffedd5" iconColor="#ea580c" change={12} />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard title="Open Orders" value={7} icon={<ShoppingCartOutlined />} iconBg="#dbeafe" iconColor="#2563eb" change={8} />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard title="Supplier Inquiries" value={11} icon={<UsergroupAddOutlined />} iconBg="#fef3c7" iconColor="#d97706" />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard title="Monthly Sales" prefix="₹" value="18.4 L" icon={<DollarCircleOutlined />} iconBg="#dcfce7" iconColor="#16a34a" change={16} />
        </Col>
      </Row>

      <Card title="Recent Supplier Orders" style={{ borderRadius: 20 }}>
        <Table columns={columns} dataSource={orders} rowKey="id" pagination={false} scroll={{ x: 760 }} />
      </Card>
    </div>
  );
}