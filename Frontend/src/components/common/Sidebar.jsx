import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, Layout, Tag, Avatar } from 'antd';
import { useSelector } from 'react-redux';
import {
  FARMER_NAV_ITEMS,
  OWNER_NAV_ITEMS,
  MANUFACTURER_NAV_ITEMS,
  DEALER_NAV_ITEMS,
  ADMIN_NAV_ITEMS
} from '../../constants/navigation';

const { Sider } = Layout;

export default function Sidebar({ collapsed, onCollapse }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { role, user } = useSelector((state) => state.auth);

  let navItems = FARMER_NAV_ITEMS;
  let roleTitle = 'Farmer Portal';
  let badgeColor = 'green';

  if (role === 'owner') {
    navItems = OWNER_NAV_ITEMS;
    roleTitle = 'Equipment Owner';
    badgeColor = 'gold';
  } else if (role === 'manufacturer') {
    navItems = MANUFACTURER_NAV_ITEMS;
    roleTitle = 'Manufacturer Portal';
    badgeColor = 'blue';
  } else if (role === 'dealer') {
    navItems = DEALER_NAV_ITEMS;
    roleTitle = 'Dealer Portal';
    badgeColor = 'orange';
  } else if (role === 'admin') {
    navItems = ADMIN_NAV_ITEMS;
    roleTitle = 'Admin Console';
    badgeColor = 'red';
  }

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}
      theme="light"
      width={260}
      style={{
        borderRight: '1px solid #e2e8f0',
        minHeight: 'calc(100vh - 72px)',
        position: 'sticky',
        top: 72,
        left: 0,
      }}
    >
      <div style={{ padding: collapsed ? '16px 8px' : '20px 16px', transition: 'all 0.2s' }}>
        {!collapsed && (
          <div style={{
            background: 'linear-gradient(135deg, #f8fafc 0%, #edf7ed 100%)',
            padding: 12,
            borderRadius: 12,
            border: '1px solid #e2e8f0',
            marginBottom: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 12
          }}>
            <Avatar src={user?.avatar} size={40} style={{ border: '2px solid #2E7D32' }} />
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: '#0f172a', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {user?.name || 'User'}
              </div>
              <Tag color={badgeColor} style={{ marginTop: 2, fontSize: 10, borderRadius: 10 }}>
                {roleTitle}
              </Tag>
            </div>
          </div>
        )}
      </div>

      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        onClick={({ key }) => navigate(key)}
        items={navItems}
        style={{ borderRight: 0 }}
      />
    </Sider>
  );
}
