import React from 'react';
import {
  AppstoreOutlined,
  ShoppingOutlined,
  BookOutlined,
  HeartOutlined,
  BellOutlined,
  TeamOutlined,
  UserOutlined,
  SettingOutlined,
  DollarCircleOutlined,
  ToolOutlined,
  BarcodeOutlined,
  LineChartOutlined,
  UsergroupAddOutlined,
  FileTextOutlined,
  TagsOutlined,
  WarningOutlined,
} from '@ant-design/icons';

export const FARMER_NAV_ITEMS = [
  { key: '/dashboard/farmer', label: 'Dashboard', icon: <AppstoreOutlined /> },
  { key: '/marketplace', label: 'Marketplace', icon: <ShoppingOutlined /> },
  { key: '/dashboard/farmer/bookings', label: 'My Bookings', icon: <BookOutlined /> },
  { key: '/dashboard/farmer/wishlist', label: 'Wishlist', icon: <HeartOutlined /> },
  { key: '/community', label: 'Community', icon: <TeamOutlined /> },
  { key: '/notifications', label: 'Notifications', icon: <BellOutlined /> },
  { key: '/profile', label: 'My Profile', icon: <UserOutlined /> },
  { key: '/settings', label: 'Settings', icon: <SettingOutlined /> },
];

export const OWNER_NAV_ITEMS = [
  { key: '/dashboard/owner', label: 'Overview', icon: <AppstoreOutlined /> },
  { key: '/dashboard/owner/equipments', label: 'My Equipments', icon: <ToolOutlined /> },
  { key: '/dashboard/owner/add-equipment', label: 'Add Equipment', icon: <ShoppingOutlined /> },
  { key: '/dashboard/owner/requests', label: 'Rental Requests', icon: <BookOutlined /> },
  { key: '/dashboard/owner/revenue', label: 'Revenue Analytics', icon: <DollarCircleOutlined /> },
  { key: '/notifications', label: 'Notifications', icon: <BellOutlined /> },
  { key: '/profile', label: 'Owner Profile', icon: <UserOutlined /> },
];

export const MANUFACTURER_NAV_ITEMS = [
  { key: '/dashboard/manufacturer', label: 'Overview', icon: <AppstoreOutlined /> },
  { key: '/dashboard/manufacturer/products', label: 'Showcase Products', icon: <ShoppingOutlined /> },
  { key: '/dashboard/manufacturer/inventory', label: 'Inventory', icon: <BarcodeOutlined /> },
  { key: '/dashboard/manufacturer/orders', label: 'B2B Orders', icon: <BookOutlined /> },
  { key: '/dashboard/manufacturer/analytics', label: 'Sales Analytics', icon: <LineChartOutlined /> },
  { key: '/profile', label: 'Company Profile', icon: <UserOutlined /> },
];

export const DEALER_NAV_ITEMS = [
  { key: '/dashboard/dealer', label: 'Overview', icon: <AppstoreOutlined /> },
  { key: '/marketplace', label: 'Browse Equipment', icon: <ShoppingOutlined /> },
  { key: '/dashboard/dealer/equipments', label: 'My Inventory', icon: <BarcodeOutlined /> },
  { key: '/dashboard/dealer/add-equipment', label: 'List Equipment', icon: <ToolOutlined /> },
  { key: '/dashboard/dealer/requests', label: 'Rental Requests', icon: <BookOutlined /> },
  { key: '/dashboard/dealer/revenue', label: 'Revenue Analytics', icon: <DollarCircleOutlined /> },
  { key: '/profile', label: 'Business Profile', icon: <UserOutlined /> },
  { key: '/notifications', label: 'Notifications', icon: <BellOutlined /> },
];

export const ADMIN_NAV_ITEMS = [
  { key: '/dashboard/admin', label: 'Overview', icon: <AppstoreOutlined /> },
  { key: '/dashboard/admin/users', label: 'Users', icon: <UsergroupAddOutlined /> },
  { key: '/dashboard/admin/equipments', label: 'Equipments', icon: <ToolOutlined /> },
  { key: '/dashboard/admin/bookings', label: 'Bookings', icon: <BookOutlined /> },
  { key: '/dashboard/admin/payments', label: 'Payments', icon: <DollarCircleOutlined /> },
  { key: '/dashboard/admin/categories', label: 'Categories', icon: <TagsOutlined /> },
  { key: '/dashboard/admin/reports', label: 'Reports & Flagged', icon: <WarningOutlined /> },
  { key: '/settings', label: 'System Settings', icon: <SettingOutlined /> },
];
