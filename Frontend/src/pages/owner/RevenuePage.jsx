import React from 'react';
import { Card, Table, Tag, Row, Col } from 'antd';
import { DollarCircleOutlined, BankOutlined, QrcodeOutlined } from '@ant-design/icons';
import StatCard from '../../components/common/StatCard';
import { formatCurrency } from '../../utils/formatters';

export default function RevenuePage() {
  const payoutLogs = [
    { id: 'PAY-101', date: '04 Aug 2026', farmer: 'Farmer User', amount: 5460, method: 'Direct UPI QR', txnId: 'TXN9988112233', status: 'Received' },
    { id: 'PAY-102', date: '28 Jul 2026', farmer: 'Harpreet Gill', amount: 9800, method: 'Direct UPI QR', txnId: 'TXN5544332211', status: 'Received' },
    { id: 'PAY-103', date: '15 Jul 2026', farmer: 'Baldev Singh', amount: 4500, method: 'Direct UPI QR', txnId: 'TXN1122334455', status: 'Received' },
  ];

  const columns = [
    { title: 'Payout Ref', dataIndex: 'id', key: 'id', render: (t) => <code>{t}</code> },
    { title: 'Date', dataIndex: 'date', key: 'date' },
    { title: 'Payer Farmer', dataIndex: 'farmer', key: 'farmer', render: (t) => <strong>{t}</strong> },
    { title: 'Amount', dataIndex: 'amount', key: 'amount', render: (a) => <span style={{ fontWeight: 800, color: '#2E7D32' }}>{formatCurrency(a)}</span> },
    { title: 'Payment Channel', dataIndex: 'method', key: 'method', render: (m) => <Tag color="blue"><QrcodeOutlined /> {m}</Tag> },
    { title: 'Bank Status', dataIndex: 'status', key: 'status', render: (s) => <Tag color="success">{s}</Tag> },
  ];

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: '#0f172a' }} className="brand-font">
          Revenue Analytics & Payout History
        </h1>
        <p style={{ color: '#64748b' }}>Real-time earnings tracking & direct bank credit settlement logs</p>
      </div>

      <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
        <Col xs={24} sm={8}>
          <StatCard title="Total Cumulative Earnings" prefix="₹" value="1,84,500" icon={<DollarCircleOutlined />} iconBg="#e8f5e9" iconColor="#2E7D32" />
        </Col>
        <Col xs={24} sm={8}>
          <StatCard title="This Month Revenue" prefix="₹" value="48,500" change={22} icon={<BankOutlined />} iconBg="#dbeafe" iconColor="#2563eb" />
        </Col>
        <Col xs={24} sm={8}>
          <StatCard title="Platform Commission Fee" prefix="₹" value="0" suffix=" (0%)" icon={<QrcodeOutlined />} iconBg="#fef3c7" iconColor="#d97706" />
        </Col>
      </Row>

      <Card title="UPI Payout Transaction History" style={{ borderRadius: 20 }}>
        <Table columns={columns} dataSource={payoutLogs} rowKey="id" />
      </Card>
    </div>
  );
}
