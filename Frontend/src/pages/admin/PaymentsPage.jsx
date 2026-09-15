import React, { useEffect, useState } from 'react';
import { Card, Table, Tag, message } from 'antd';
import axiosClient from '../../api/axiosClient';
import { formatCurrency, formatDate } from '../../utils/formatters';

export default function PaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosClient.get('/payments/payments/')
      .then(({ data }) => setPayments(Array.isArray(data) ? data : data.results || []))
      .catch(() => message.error('Could not load payment records.'))
      .finally(() => setLoading(false));
  }, []);

  const columns = [
    { title: 'Payment ID', dataIndex: 'id', key: 'id' },
    { title: 'User', dataIndex: 'buyer_name', key: 'buyer_name' },
    { title: 'Email', dataIndex: 'buyer_email', key: 'buyer_email' },
    { title: 'Phone', dataIndex: 'buyer_phone', key: 'buyer_phone' },
    { title: 'Role', dataIndex: 'buyer_role', key: 'buyer_role', render: (role) => <Tag>{role}</Tag> },
    { title: 'Equipment', dataIndex: 'equipment_name', key: 'equipment_name' },
    { title: 'Owner / Dealer', dataIndex: 'seller_name', key: 'seller_name' },
    { title: 'Owner Email', dataIndex: 'seller_email', key: 'seller_email' },
    { title: 'Type', dataIndex: 'payment_type', key: 'payment_type', render: (type) => <Tag color={type === 'purchase' ? 'orange' : 'green'}>{type}</Tag> },
    { title: 'Amount', dataIndex: 'amount', key: 'amount', render: (amount) => formatCurrency(amount) },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (status) => <Tag color={status === 'captured' ? 'success' : 'warning'}>{status}</Tag> },
    { title: 'Date', dataIndex: 'created_at', key: 'created_at', render: formatDate },
  ];

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 className="brand-font">Admin Payment Gateway</h1>
        <p style={{ color: '#64748b' }}>All payments collected through the UPKARAN admin Razorpay account.</p>
      </div>
      <Card style={{ borderRadius: 20 }}>
        <Table columns={columns} dataSource={payments} rowKey="id" loading={loading} scroll={{ x: 1100 }} />
      </Card>
    </div>
  );
}
