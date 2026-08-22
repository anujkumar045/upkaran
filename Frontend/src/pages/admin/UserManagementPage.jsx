import React from 'react';
import { Card, Table, Tag, Button, Switch, Space, Avatar } from 'antd';

export default function UserManagementPage() {
  const users = [
    { id: 'USR-101', name: 'Farmer User', phone: '', role: 'Farmer', location: 'Gujarat', status: 'Active' },
    { id: 'USR-102', name: 'Equipment Owner', phone: '', role: 'Equipment Owner', location: 'Punjab', status: 'Active' },
    { id: 'USR-103', name: 'AgriTech Solutions', phone: '+91 731 400 9988', role: 'Manufacturer', location: 'Indore, MP', status: 'Active' },
  ];

  const columns = [
    { title: 'User ID', dataIndex: 'id', key: 'id' },
    { title: 'Name', dataIndex: 'name', key: 'name', render: (t) => <strong>{t}</strong> },
    { title: 'Phone Number', dataIndex: 'phone', key: 'phone' },
    { title: 'Primary Role', dataIndex: 'role', key: 'role', render: (r) => <Tag color={r === 'Farmer' ? 'green' : r === 'Equipment Owner' ? 'gold' : 'blue'}>{r}</Tag> },
    { title: 'Location', dataIndex: 'location', key: 'location' },
    { title: 'Account Status', key: 'status', render: () => <Switch defaultChecked checkedChildren="Active" unCheckedChildren="Suspended" /> },
    {
      title: 'Action',
      key: 'action',
      render: () => <Button size="small">Manage Access</Button>
    }
  ];

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: '#0f172a' }} className="brand-font">
          User Management & Verification
        </h1>
        <p style={{ color: '#64748b' }}>Monitor Farmers, Equipment Owners, and Manufacturer accounts</p>
      </div>

      <Card style={{ borderRadius: 20 }}>
        <Table columns={columns} dataSource={users} rowKey="id" />
      </Card>
    </div>
  );
}
