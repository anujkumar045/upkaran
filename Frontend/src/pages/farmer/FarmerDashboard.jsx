import React from 'react';
import { Row, Col, Card, Table, Tag, Button, Avatar, Space, Progress } from 'antd';
import {
  BookOutlined,
  HeartOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ThunderboltOutlined,
  RightOutlined,
  UserOutlined
} from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import StatCard from '../../components/common/StatCard';
import ProductCard from '../../components/common/ProductCard';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const API_ORIGIN = (
  import.meta.env.VITE_API_BASE_URL ||
  'http://127.0.0.1:8000/api/'
).replace(/\/api\/?$/, '');

const getProfilePictureUrl = (picture) => {
  if (!picture) return undefined;
  if (picture.startsWith('http')) return picture;
  return `${API_ORIGIN}/${picture.replace(/^\//, '')}`;
};

const mockMonthlyExpenses = [
  { month: 'Mar', amount: 4500 },
  { month: 'Apr', amount: 8200 },
  { month: 'May', amount: 12400 },
  { month: 'Jun', amount: 6100 },
  { month: 'Jul', amount: 9800 },
  { month: 'Aug', amount: 5460 },
];

export default function FarmerDashboard() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { bookings } = useSelector((state) => state.booking);
  const { equipments, wishlist } = useSelector((state) => state.equipment);

  const wishlistedEquipments = equipments.filter((e) => wishlist.includes(e.id));
  const farmerName = [user?.first_name, user?.last_name]
    .filter(Boolean)
    .join(' ') || user?.name || user?.username || 'Farmer';

  const columns = [
    { title: 'Booking ID', dataIndex: 'id', key: 'id', render: (text) => <strong>{text}</strong> },
    { title: 'Machinery', dataIndex: 'equipmentName', key: 'equipmentName' },
    { title: 'Dates', key: 'dates', render: (_, r) => `${formatDate(r.startDate)} - ${formatDate(r.endDate)}` },
    { title: 'Amount', dataIndex: 'totalAmount', key: 'totalAmount', render: (val) => <span style={{ fontWeight: 700, color: '#2E7D32' }}>{formatCurrency(val)}</span> },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (st) => <Tag color={st === 'Confirmed' ? 'success' : 'warning'}>{st}</Tag> },
    {
      title: 'Action',
      key: 'action',
      render: (_, r) => (
        <Button type="default" size="small" onClick={() => navigate(`/payment/qr/${r.id}`)}>
          View Receipt
        </Button>
      )
    }
  ];

  return (
    <div>
      {/* Top Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%)',
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Avatar
            src={getProfilePictureUrl(user?.profile_picture || user?.avatar)}
            icon={<UserOutlined />}
            size={64}
            style={{ border: '3px solid #a5d6a7' }}
          />
          <div>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: 'white', margin: 0 }} className="brand-font">
            Namaste, {farmerName}! 👋
          </h2>
          <p style={{ color: '#a5d6a7', fontSize: 14, margin: '4px 0 0 0' }}>
            Farm Location: {user?.location} • Land Size: {user?.landSize}
          </p>
          </div>
        </div>
        <Button type="primary" size="large" icon={<ThunderboltOutlined />} onClick={() => navigate('/marketplace')} style={{ background: '#FFC107', color: '#0f172a', fontWeight: 800, border: 'none' }}>
          Rent Machinery Now
        </Button>
      </div>

      {/* Widget Cards Grid */}
      <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Total Bookings"
            value={bookings.length}
            change={12}
            icon={<BookOutlined />}
            iconBg="#e8f5e9"
            iconColor="#2E7D32"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Active Rentals"
            value={bookings.filter(b => b.status === 'Confirmed').length}
            icon={<CheckCircleOutlined />}
            iconBg="#fef3c7"
            iconColor="#d97706"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Wishlisted Equipment"
            value={wishlist.length}
            icon={<HeartOutlined />}
            iconBg="#ffe4e6"
            iconColor="#e11d48"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Total Rental Spent"
            prefix="₹"
            value="16,836"
            icon={<ClockCircleOutlined />}
            iconBg="#dbeafe"
            iconColor="#2563eb"
          />
        </Col>
      </Row>

      {/* Chart & Active Booking */}
      <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
        <Col xs={24} lg={16}>
          <Card title="Monthly Rental Expenses (INR)" style={{ borderRadius: 20 }}>
            <div style={{ width: '100%', height: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockMonthlyExpenses}>
                  <defs>
                    <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2E7D32" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#2E7D32" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(v) => formatCurrency(v)} />
                  <Area type="monotone" dataKey="amount" stroke="#2E7D32" fillOpacity={1} fill="url(#colorAmt)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title="Upcoming Equipment Delivery" style={{ borderRadius: 20, height: '100%' }}>
            {bookings.length > 0 ? (
              <div>
                <div style={{ background: '#e8f5e9', padding: 16, borderRadius: 14, marginBottom: 16 }}>
                  <Tag color="green" style={{ fontWeight: 700 }}>DELIVERY CONFIRMED</Tag>
                  <h4 style={{ fontSize: 16, fontWeight: 700, marginTop: 8, color: '#0f172a' }}>{bookings[0].equipmentName}</h4>
                  <p style={{ fontSize: 12, color: '#64748b', margin: '4px 0' }}>Owner: {bookings[0].ownerName} ({bookings[0].ownerPhone})</p>
                  <div style={{ marginTop: 12 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#2E7D32' }}>Delivery Status: 85% On Track</span>
                    <Progress percent={85} strokeColor="#2E7D32" size="small" />
                  </div>
                </div>
                <Button block type="primary" style={{ background: '#2E7D32' }} onClick={() => navigate(`/payment/qr/${bookings[0].id}`)}>
                  View Receipt & QR Invoice
                </Button>
              </div>
            ) : (
              <p>No upcoming rentals</p>
            )}
          </Card>
        </Col>
      </Row>

      {/* Table: Recent Bookings */}
      <Card title="Recent Bookings & Rental Orders" style={{ borderRadius: 20 }} extra={<Button type="link" onClick={() => navigate('/dashboard/farmer/bookings')}>View All</Button>}>
        <Table columns={columns} dataSource={bookings} rowKey="id" pagination={false} />
      </Card>
    </div>
  );
}
