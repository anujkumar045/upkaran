import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Badge,
  Dropdown,
  Avatar,
  Button,
  Popover,
  List,
  Space,
  Tag,
  Drawer
} from 'antd';
import {
  BellOutlined,
  HeartOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  AppstoreOutlined,
  ShoppingOutlined,
  TeamOutlined,
  MenuOutlined,
  SafetyCertificateOutlined,
  SwapOutlined,
  ShoppingCartOutlined
} from '@ant-design/icons';
import { setUserRole, logout } from '../../store/slices/authSlice';
import { markAsRead } from '../../store/slices/notificationSlice';

const API_ORIGIN = (
  import.meta.env.VITE_API_BASE_URL ||
  'http://127.0.0.1:8000/api/'
).replace(/\/api\/?$/, '');

const getProfilePictureUrl = (picture) => {
  if (!picture) return undefined;
  if (picture.startsWith('http')) return picture;
  return `${API_ORIGIN}/${picture.replace(/^\//, '')}`;
};

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { user, role } = useSelector((state) => state.auth);
  const { wishlist } = useSelector((state) => state.equipment);
  const { notifications } = useSelector((state) => state.notification);
  const { items: cartItems } = useSelector((state) => state.cart);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleRoleChange = (newRole) => {
    dispatch(setUserRole(newRole));
    if (newRole === 'admin') navigate('/dashboard/admin');
    else if (newRole === 'owner') navigate('/dashboard/owner');
    else if (newRole === 'manufacturer') navigate('/dashboard/manufacturer');
    else navigate('/dashboard/farmer');
  };

  const notificationContent = (
    <div style={{ width: 320 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, paddingBottom: 8, borderBottom: '1px solid #f1f5f9' }}>
        <strong style={{ fontSize: 16 }}>Notifications</strong>
        <Tag color="green">{unreadCount} New</Tag>
      </div>
      <List
        itemLayout="horizontal"
        dataSource={notifications.slice(0, 4)}
        renderItem={(item) => (
          <List.Item
            style={{ cursor: 'pointer', background: item.read ? '#fff' : '#f0fdf4', padding: '8px 12px', borderRadius: 8, marginBottom: 4 }}
            onClick={() => dispatch(markAsRead(item.id))}
          >
            <List.Item.Meta
              title={<span style={{ fontSize: 13, fontWeight: item.read ? 500 : 700 }}>{item.title}</span>}
              description={<span style={{ fontSize: 12, color: '#64748b' }}>{item.message}</span>}
            />
          </List.Item>
        )}
      />
      <div style={{ textAlign: 'center', marginTop: 10, paddingTop: 8, borderTop: '1px solid #f1f5f9' }}>
        <Link to="/notifications" style={{ color: '#2E7D32', fontWeight: 600, fontSize: 13 }}>
          View All Notifications →
        </Link>
      </div>
    </div>
  );

  const roleMenu = [
    {
      key: 'role-header',
      label: <span style={{ fontWeight: 700, color: '#64748b', fontSize: 12 }}>SWITCH VIEW MODE</span>,
      disabled: true,
    },
    {
      key: 'farmer',
      label: '🚜 Farmer View',
      onClick: () => handleRoleChange('farmer'),
    },
    {
      key: 'owner',
      label: '🛠️ Equipment Owner Portal',
      onClick: () => handleRoleChange('owner'),
    },
    {
      key: 'manufacturer',
      label: '🏬 Manufacturer Portal',
      onClick: () => handleRoleChange('manufacturer'),
    },
    {
      key: 'admin',
      label: '⚡ Admin Control Center',
      onClick: () => handleRoleChange('admin'),
    },
    { type: 'divider' },
    {
      key: 'profile',
      label: 'User Profile',
      icon: <UserOutlined />,
      onClick: () => navigate('/profile'),
    },
    {
      key: 'logout',
      label: 'Sign Out',
      icon: <LogoutOutlined />,
      danger: true,
      onClick: () => {
        dispatch(logout());
        navigate('/login');
      },
    },
  ];

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid #e2e8f0',
      padding: '0 24px',
      height: 72,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      {/* Brand Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: 24,
            boxShadow: '0 4px 12px rgba(46, 125, 50, 0.25)'
          }}>
            🌾
          </div>
          <div>
            <span style={{ fontSize: 24, fontWeight: 800, color: '#2E7D32', letterSpacing: '-0.5px' }} className="brand-font">
              UPKARAN
            </span>
            <span style={{ display: 'block', fontSize: 10, color: '#64748b', fontWeight: 600, marginTop: -4 }}>
              Agri Marketplace & Rentals
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: 24 }} className="desktop-only">
        <Link to="/" style={{ color: location.pathname === '/' ? '#2E7D32' : '#334155', fontWeight: 600, fontSize: 15, textDecoration: 'none' }}>
          Home
        </Link>
        <Link to="/marketplace" style={{ color: location.pathname.startsWith('/marketplace') ? '#2E7D32' : '#334155', fontWeight: 600, fontSize: 15, textDecoration: 'none' }}>
          Marketplace
        </Link>
        <Link to="/community" style={{ color: location.pathname === '/community' ? '#2E7D32' : '#334155', fontWeight: 600, fontSize: 15, textDecoration: 'none' }}>
          Community
        </Link>
        <Link to={role === 'admin' ? '/dashboard/admin' : role === 'owner' ? '/dashboard/owner' : role === 'manufacturer' ? '/dashboard/manufacturer' : '/dashboard/farmer'} style={{ color: '#334155', fontWeight: 600, fontSize: 15, textDecoration: 'none' }}>
          Dashboard
        </Link>
      </nav>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {/* Role Switcher Pill */}
        <Dropdown menu={{ items: roleMenu }} trigger={['click']} placement="bottomRight">
          <Button style={{
            borderRadius: 20,
            background: '#e8f5e9',
            borderColor: '#a5d6a7',
            color: '#2E7D32',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 6
          }}>
            <SwapOutlined /> Role: <span style={{ textTransform: 'capitalize' }}>{role}</span>
          </Button>
        </Dropdown>

        {/* Wishlist Icon */}
        <Link to="/dashboard/farmer/wishlist">
          <Badge count={wishlist.length} size="small" offset={[-2, 4]} color="#FFC107">
            <Button shape="circle" icon={<HeartOutlined style={{ fontSize: 18, color: '#334155' }} />} />
          </Badge>
        </Link>

        {/* Notifications Bell */}
        <Link to="/cart">
          <Badge count={cartItems.length} size="small" offset={[-2, 4]} color="#d97706">
            <Button shape="circle" icon={<ShoppingCartOutlined style={{ fontSize: 18, color: '#334155' }} />} />
          </Badge>
        </Link>

        {/* Notifications Bell */}
        <Popover content={notificationContent} trigger="click" placement="bottomRight">
          <Badge count={unreadCount} size="small" offset={[-2, 4]} color="#2E7D32">
            <Button shape="circle" icon={<BellOutlined style={{ fontSize: 18, color: '#334155' }} />} />
          </Badge>
        </Popover>

        {/* User Profile Avatar */}
        {user ? (
          <Dropdown menu={{ items: roleMenu }} trigger={['click']}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <Avatar src={getProfilePictureUrl(user.profile_picture || user.avatar)} icon={<UserOutlined />} size={40} style={{ border: '2px solid #4CAF50' }} />
              <div style={{ lineHeight: 1.2 }} className="desktop-only">
                <div style={{ fontWeight: 700, fontSize: 14, color: '#0f172a' }}>{[user.first_name, user.last_name].filter(Boolean).join(' ') || user.name || user.username}</div>
                <div style={{ fontSize: 11, color: '#64748b' }}>{user.location}</div>
              </div>
            </div>
          </Dropdown>
        ) : (
          <Space>
            <Button type="default" onClick={() => navigate('/login')}>Sign In</Button>
            <Button type="primary" onClick={() => navigate('/register')}>Register</Button>
          </Space>
        )}

        {/* Mobile Menu Button */}
        <Button
          type="text"
          icon={<MenuOutlined style={{ fontSize: 20 }} />}
          onClick={() => setMobileMenuOpen(true)}
          style={{ display: 'none' }}
          className="mobile-toggle"
        />
      </div>

      {/* Mobile Drawer */}
      <Drawer
        title="UPKARAN Navigation"
        placement="right"
        onClose={() => setMobileMenuOpen(false)}
        open={mobileMenuOpen}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Link to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
          <Link to="/marketplace" onClick={() => setMobileMenuOpen(false)}>Marketplace</Link>
          <Link to="/community" onClick={() => setMobileMenuOpen(false)}>Community</Link>
          <Link to="/dashboard/farmer" onClick={() => setMobileMenuOpen(false)}>Farmer Dashboard</Link>
          <Link to="/dashboard/owner" onClick={() => setMobileMenuOpen(false)}>Owner Portal</Link>
          <Link to="/dashboard/manufacturer" onClick={() => setMobileMenuOpen(false)}>Manufacturer Portal</Link>
          <Link to="/dashboard/admin" onClick={() => setMobileMenuOpen(false)}>Admin Panel</Link>
        </div>
      </Drawer>
    </header>
  );
}
