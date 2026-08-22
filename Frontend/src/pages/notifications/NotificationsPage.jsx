import React from 'react';
import { Card, List, Tag, Button } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { markAllAsRead, markAsRead } from '../../store/slices/notificationSlice';

export default function NotificationsPage() {
  const dispatch = useDispatch();
  const { notifications } = useSelector((state) => state.notification);

  return (
    <div style={{ maxWidth: 800, margin: '30px auto', padding: '0 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: '#0f172a' }} className="brand-font">
          Notifications Center
        </h1>
        <Button onClick={() => dispatch(markAllAsRead())}>Mark All as Read</Button>
      </div>

      <Card style={{ borderRadius: 20 }}>
        <List
          itemLayout="horizontal"
          dataSource={notifications}
          renderItem={(item) => (
            <List.Item
              style={{
                cursor: 'pointer',
                background: item.read ? '#fff' : '#f0fdf4',
                padding: 16,
                borderRadius: 12,
                marginBottom: 8,
                border: '1px solid #e2e8f0'
              }}
              onClick={() => dispatch(markAsRead(item.id))}
            >
              <List.Item.Meta
                title={<div style={{ display: 'flex', justifyContent: 'space-between' }}><strong>{item.title}</strong><span style={{ fontSize: 12, color: '#94a3b8' }}>{item.time}</span></div>}
                description={<div style={{ color: '#475569', marginTop: 4 }}>{item.message}</div>}
              />
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
}
