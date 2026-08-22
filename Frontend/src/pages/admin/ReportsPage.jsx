import React from 'react';
import { Card, Table, Tag, Button, Space } from 'antd';
import { WarningOutlined } from '@ant-design/icons';

export default function ReportsPage() {
  const reports = [
    { id: 'REP-101', reportedBy: 'Harpreet Gill', target: 'Equipment Listing #eq-103', reason: 'Incorrect HP specs reported', status: 'Pending Review' },
    { id: 'REP-102', reportedBy: 'Vikram Singh', target: 'Community Post #post-1', reason: 'Spam / Off-topic advertisement', status: 'Resolved' },
  ];

  const columns = [
    { title: 'Report ID', dataIndex: 'id', key: 'id' },
    { title: 'Reported By', dataIndex: 'reportedBy', key: 'reportedBy' },
    { title: 'Target Content', dataIndex: 'target', key: 'target', render: (t) => <strong>{t}</strong> },
    { title: 'Reason', dataIndex: 'reason', key: 'reason' },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (s) => <Tag color={s === 'Resolved' ? 'default' : 'error'}>{s}</Tag> },
    {
      title: 'Action',
      key: 'action',
      render: () => (
        <Space>
          <Button type="primary" size="small" style={{ background: '#2E7D32' }}>Review Item</Button>
          <Button size="small">Dismiss</Button>
        </Space>
      )
    }
  ];

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: '#0f172a' }} className="brand-font">
          Flagged Reports & Disputes
        </h1>
        <p style={{ color: '#64748b' }}>Manage user complaints, safety violations, and listing reports</p>
      </div>

      <Card style={{ borderRadius: 20 }}>
        <Table columns={columns} dataSource={reports} rowKey="id" />
      </Card>
    </div>
  );
}
