import React from 'react';
import { Card, Table, Tag } from 'antd';
import { useSelector } from 'react-redux';
import { formatCurrency } from '../../utils/formatters';

export default function BookingManagementPage() {
  const { bookings } = useSelector((state) => state.booking);

  const columns = [
    { title: 'Booking Ref', dataIndex: 'id', key: 'id' },
    { title: 'Equipment', dataIndex: 'equipmentName', key: 'equipmentName' },
    { title: 'Owner', dataIndex: 'ownerName', key: 'ownerName' },
    { title: 'Amount', dataIndex: 'totalAmount', key: 'totalAmount', render: (a) => formatCurrency(a) },
    { title: 'Payment Status', dataIndex: 'paymentStatus', key: 'paymentStatus', render: (p) => <Tag color="green">{p}</Tag> },
  ];

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: '#0f172a' }} className="brand-font">
          All Platform Bookings Monitor
        </h1>
        <p style={{ color: '#64748b' }}>Audit active transactions, disputes, and QR payments</p>
      </div>

      <Card style={{ borderRadius: 20 }}>
        <Table columns={columns} dataSource={bookings} rowKey="id" />
      </Card>
    </div>
  );
}
