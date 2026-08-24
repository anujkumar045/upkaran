import React from 'react';
import { Row, Col, Card, Table, Tag, Button, Avatar, Space, Badge } from 'antd';
import { DollarCircleOutlined, ToolOutlined, BookOutlined, CheckCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import StatCard from '../../components/common/StatCard';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const mockRevenueData = [
  { month: 'Mar', revenue: 18000 },
  { month: 'Apr', revenue: 24500 },
  { month: 'May', revenue: 38000 },
  { month: 'Jun', revenue: 29000 },
  { month: 'Jul', revenue: 42000 },
  { month: 'Aug', revenue: 48500 },
];

export default function OwnerDashboard() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { equipments } = useSelector((state) => state.equipment);
  const { bookings } = useSelector((state) => state.booking);

  const ownerEquipments = equipments.filter((equipment) => (
    String(equipment.owner_id ?? equipment.owner) === String(user?.id) ||
    equipment.owner === user?.username ||
    equipment.owner?.name === user?.username ||
    equipment.owner?.username === user?.username
  ));
  const ownerBookings = bookings.filter((booking) => (
    ownerEquipments.some((equipment) => String(equipment.id) === String(booking.equipment))
  ));
  const pendingRequests = ownerBookings.filter((booking) => booking.status === 'pending');
  const completedRentals = ownerBookings.filter((booking) => (
    ['completed', 'approved'].includes(booking.status)
  ));
  const monthlyRevenue = completedRentals.reduce(
    (total, booking) => total + Number(booking.total_amount ?? booking.totalAmount ?? 0),
    0
  );

  const requestColumns = [
    { title: 'Farmer Name', dataIndex: 'farmerName', key: 'farmerName', render: (t) => <strong>{t}</strong> },
    { title: 'Machinery Requested', dataIndex: 'equipment', key: 'equipment' },
    { title: 'Dates', dataIndex: 'dates', key: 'dates' },
    { title: 'Est. Earnings', dataIndex: 'amount', key: 'amount', render: (a) => <span style={{ fontWeight: 700, color: '#2E7D32' }}>{formatCurrency(a)}</span> },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (s) => <Tag color="warning">{s}</Tag> },
    {
      title: 'Action',
      key: 'action',
      render: () => (
        <Space>
          <Button type="primary" size="small" style={{ background: '#2E7D32' }}>Approve</Button>
          <Button type="default" danger size="small">Decline</Button>
        </Space>
      )
    }
  ];

  const requestsData = [
    { key: '1', farmerName: 'Balram Yadav', equipment: 'Mahindra 575 DI Tractor', dates: '12 Aug - 14 Aug', amount: 4500, status: 'Pending Approval' },
    { key: '2', farmerName: 'Harpreet Gill', equipment: 'Shaktiman 7-Ft Rotavator', dates: '16 Aug - 17 Aug', amount: 1800, status: 'Pending Approval' },
  ];

  return (
    <div>
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
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
            Owner Dashboard Portal 🛠️
          </h2>
          <p style={{ color: '#94a3b8', fontSize: 14, margin: '4px 0 0 0' }}>
            Monetize idle machinery & track direct UPI farmer payments
          </p>
        </div>
        <Button
          type="primary"
          size="large"
          icon={<PlusOutlined />}
          onClick={() => navigate('/dashboard/owner/add-equipment')}
          style={{ background: '#4CAF50', color: 'white', fontWeight: 800, border: 'none', height: 48 }}
        >
          Add New Equipment
        </Button>
      </div>

      {/* Metrics Row */}
      <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Monthly Revenue"
            prefix="₹"
            value={monthlyRevenue}
            icon={<DollarCircleOutlined />}
            iconBg="#e8f5e9"
            iconColor="#2E7D32"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Active Listings"
            value={ownerEquipments.length}
            icon={<ToolOutlined />}
            iconBg="#dbeafe"
            iconColor="#2563eb"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Pending Requests"
            value={pendingRequests.length}
            icon={<BookOutlined />}
            iconBg="#fef3c7"
            iconColor="#d97706"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Completed Rentals"
            value={completedRentals.length}
            icon={<CheckCircleOutlined />}
            iconBg="#f3e8ff"
            iconColor="#9333ea"
          />
        </Col>
      </Row>

      {/* Revenue Chart */}
      <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
        <Col xs={24} lg={16}>
          <Card title="Equipment Rental Revenue Growth (INR)" style={{ borderRadius: 20 }}>
            <div style={{ width: '100%', height: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockRevenueData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(val) => formatCurrency(val)} />
                  <Bar dataKey="revenue" fill="#2E7D32" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title="UPI Payment Setup" style={{ borderRadius: 20, height: '100%' }}>
            <div style={{ background: '#f8fafc', padding: 20, borderRadius: 14, border: '1px solid #e2e8f0', textAlign: 'center' }}>
              <Avatar size={64} style={{ background: '#2E7D32', marginBottom: 12 }}>UPI</Avatar>
              <h4 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a' }}>{user?.name || user?.username || 'Equipment Owner'}</h4>
              <Tag color="green" style={{ margin: '6px 0' }}><code>{user?.upiId || 'Add UPI ID'}</code></Tag>
              <p style={{ fontSize: 12, color: '#64748b', marginTop: 8 }}>
                Farmers pay directly to your bank account using QR code. 0% platform transaction fee.
              </p>
              <Button type="default" size="small" onClick={() => navigate('/profile')} style={{ marginTop: 8 }}>
                Update UPI Details
              </Button>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Pending Rental Requests Table */}
      <Card title="Incoming Farmer Rental Requests" style={{ borderRadius: 20 }}>
        <Table columns={requestColumns} dataSource={pendingRequests} rowKey="id" pagination={false} locale={{ emptyText: 'No rental requests yet' }} />
      </Card>
    </div>
  );
}
