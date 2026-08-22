import React from 'react';
import { Card, Table, Tag, Progress } from 'antd';

export default function InventoryPage() {
  const inventory = [
    { id: 'INV-01', item: 'Solar Pump Motor Assembly', location: 'Indore Warehouse', stock: 45, reorder: 15 },
    { id: 'INV-02', item: 'Drone RTK GPS Battery Module', location: 'Coimbatore Plant', stock: 12, reorder: 20 },
  ];

  const columns = [
    { title: 'Item ID', dataIndex: 'id', key: 'id' },
    { title: 'Item Name', dataIndex: 'item', key: 'item', render: (t) => <strong>{t}</strong> },
    { title: 'Warehouse Location', dataIndex: 'location', key: 'location' },
    { title: 'Current Stock', dataIndex: 'stock', key: 'stock', render: (s) => <strong style={{ color: s < 15 ? '#ef4444' : '#2E7D32' }}>{s} units</strong> },
    { title: 'Stock Level Status', key: 'status', render: (_, r) => <Progress percent={Math.round((r.stock / 50) * 100)} status={r.stock < r.reorder ? 'exception' : 'active'} size="small" /> }
  ];

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: '#0f172a' }} className="brand-font">
          Factory Inventory Management
        </h1>
        <p style={{ color: '#64748b' }}>Track real-time component stock levels & reorder alerts</p>
      </div>

      <Card style={{ borderRadius: 20 }}>
        <Table columns={columns} dataSource={inventory} rowKey="id" />
      </Card>
    </div>
  );
}
