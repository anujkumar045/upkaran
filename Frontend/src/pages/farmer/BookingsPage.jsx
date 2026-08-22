import React from 'react';
import { Card, Table, Tag, Button, Space } from 'antd';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { formatCurrency, formatDate } from '../../utils/formatters';

export default function BookingsPage() {
  const navigate = useNavigate();
  const { bookings } = useSelector((state) => state.booking);

  const columns = [
    { title: 'Booking Ref', dataIndex: 'id', key: 'id', render: (t) => <code>{t}</code> },
    { title: 'Machinery', dataIndex: 'equipmentName', key: 'equipmentName' },
    { title: 'Owner Name', dataIndex: 'ownerName', key: 'ownerName' },
    { title: 'Start Date', dataIndex: 'startDate', key: 'startDate', render: (d) => formatDate(d) },
    { title: 'End Date', dataIndex: 'endDate', key: 'endDate', render: (d) => formatDate(d) },
    { title: 'Duration', dataIndex: 'totalDays', key: 'totalDays', render: (d) => `${d} Days` },
    { title: 'Total Paid', dataIndex: 'totalAmount', key: 'totalAmount', render: (a) => <strong>{formatCurrency(a)}</strong> },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (s) => <Tag color={s === 'Confirmed' ? 'success' : 'warning'}>{s}</Tag> },
    {
      title: 'Invoice',
      key: 'action',
      render: (_, r) => (
        <Button type="primary" size="small" style={{ background: '#2E7D32' }} onClick={() => navigate(`/payment/qr/${r.id}`)}>
          View QR Receipt
        </Button>
      )
    }
  ];

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: '#0f172a' }} className="brand-font">
          My Rental Bookings History
        </h1>
        <p style={{ color: '#64748b' }}>Manage your active, completed, and upcoming equipment rentals</p>
      </div>

      <Card style={{ borderRadius: 20 }}>
        <Table columns={columns} dataSource={bookings} rowKey="id" />
      </Card>
    </div>
  );
}
