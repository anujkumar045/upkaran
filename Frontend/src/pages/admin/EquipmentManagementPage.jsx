import React from 'react';
import { Card, Table, Tag, Button, Space } from 'antd';
import { useSelector } from 'react-redux';
import { formatCurrency } from '../../utils/formatters';

export default function EquipmentManagementPage() {
  const { equipments } = useSelector((state) => state.equipment);

  const columns = [
    { title: 'Machinery Code', dataIndex: 'id', key: 'id' },
    { title: 'Title', dataIndex: 'name', key: 'name', render: (t) => <strong>{t}</strong> },
    { title: 'Category', dataIndex: 'category', key: 'category' },
    { title: 'Owner', key: 'owner', render: (_, r) => r.owner.name },
    { title: 'Daily Rate', dataIndex: 'dailyRate', key: 'dailyRate', render: (r) => formatCurrency(r) },
    { title: 'Status', key: 'status', render: () => <Tag color="success">Verified & Active</Tag> },
    {
      title: 'Action',
      key: 'action',
      render: () => (
        <Space>
          <Button size="small">Inspect Specs</Button>
          <Button danger size="small">Delist</Button>
        </Space>
      )
    }
  ];

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: '#0f172a' }} className="brand-font">
          Equipment Catalog Moderation
        </h1>
        <p style={{ color: '#64748b' }}>Approve, verify, or delist machinery listings across India</p>
      </div>

      <Card style={{ borderRadius: 20 }}>
        <Table columns={columns} dataSource={equipments} rowKey="id" />
      </Card>
    </div>
  );
}
