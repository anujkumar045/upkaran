import React, { useEffect, useState } from 'react';
import { Card, Table, Tag, Button, Space, Empty, message } from 'antd';
import { CheckOutlined, CloseOutlined, PhoneOutlined } from '@ant-design/icons';
import { formatCurrency } from '../../utils/formatters';
import axiosClient from '../../api/axiosClient';

export default function RentalRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadRequests = async () => {
    try {
      const response = await axiosClient.get('/bookings/bookings/');
      const results = Array.isArray(response.data)
        ? response.data
        : response.data?.results || [];

      setRequests(results.map((booking) => ({
        id: booking.id,
        farmer: booking.user_name || 'Farmer',
        phone: booking.user_phone || 'Not provided',
        equipment: booking.equipment_name,
        dates: `${booking.start_date} - ${booking.end_date}`,
        total: Number(booking.total_amount || 0),
        status: booking.status,
      })));
    } catch (error) {
      message.error('Could not load rental requests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const updateRequest = async (id, action) => {
    try {
      const response = await axiosClient.post(`/bookings/bookings/${id}/${action}/`);
      const updated = response.data;
      setRequests((current) => current.map((request) => (
        request.id === id
          ? { ...request, status: updated.status }
          : request
      )));
      message.success(`Request ${action === 'approve' ? 'approved' : 'declined'}.`);
    } catch (error) {
      message.error(error.response?.data?.detail || 'Could not update request.');
    }
  };

  const columns = [
    { title: 'Request ID', dataIndex: 'id', key: 'id' },
    { title: 'Farmer Name', dataIndex: 'farmer', key: 'farmer', render: (t) => <strong>{t}</strong> },
    { title: 'Contact', dataIndex: 'phone', key: 'phone' },
    { title: 'Equipment', dataIndex: 'equipment', key: 'equipment' },
    { title: 'Rental Dates', dataIndex: 'dates', key: 'dates' },
    { title: 'Amount Payable', dataIndex: 'total', key: 'total', render: (a) => <span style={{ fontWeight: 700, color: '#2E7D32' }}>{formatCurrency(a)}</span> },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (s) => <Tag color={s === 'approved' ? 'success' : ['rejected', 'cancelled'].includes(s) ? 'error' : 'warning'}>{s}</Tag> },
    {
      title: 'Action',
      key: 'action',
      render: (_, r) => (
        r.status === 'pending' ? (
          <Space>
            <Button type="primary" icon={<CheckOutlined />} size="small" style={{ background: '#2E7D32' }} onClick={() => updateRequest(r.id, 'approve')}>
              Approve
            </Button>
            <Button type="default" danger icon={<CloseOutlined />} size="small" onClick={() => updateRequest(r.id, 'reject')}>
              Decline
            </Button>
          </Space>
        ) : (
          <span style={{ color: '#94a3b8', fontSize: 12 }}>Resolved</span>
        )
      )
    }
  ];

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: '#0f172a' }} className="brand-font">
          Farmer Rental Requests
        </h1>
        <p style={{ color: '#64748b' }}>Approve or decline booking requests from nearby farmers</p>
      </div>

      <Card style={{ borderRadius: 20 }}>
        <Table
          loading={loading}
          columns={columns}
          dataSource={requests}
          rowKey="id"
          locale={{ emptyText: <Empty description="No rental requests found" /> }}
        />
      </Card>
    </div>
  );
}
