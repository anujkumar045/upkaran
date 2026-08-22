import React from 'react';
import { Card, Switch, Select, Button, Form, Divider } from 'antd';

export default function SettingsPage() {
  return (
    <div style={{ maxWidth: 800, margin: '30px auto', padding: '0 24px' }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', marginBottom: 24 }} className="brand-font">
        Platform Account Settings
      </h1>

      <Card style={{ borderRadius: 20 }}>
        <Form layout="vertical">
          <Form.Item label="Preferred App Language">
            <Select defaultValue="en" size="large">
              <Select.Option value="en">English</Select.Option>
              <Select.Option value="hi">हिंदी (Hindi)</Select.Option>
              <Select.Option value="pa">ਪੰਜਾਬੀ (Punjabi)</Select.Option>
              <Select.Option value="gu">ગુજરાતી (Gujarati)</Select.Option>
              <Select.Option value="ta">தமிழ் (Tamil)</Select.Option>
            </Select>
          </Form.Item>

          <Divider />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <strong style={{ color: '#0f172a' }}>SMS Booking Alerts</strong>
              <div style={{ fontSize: 12, color: '#64748b' }}>Receive instant SMS updates for confirmed bookings</div>
            </div>
            <Switch defaultChecked />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <strong style={{ color: '#0f172a' }}>WhatsApp Notifications</strong>
              <div style={{ fontSize: 12, color: '#64748b' }}>Get QR code invoices directly on WhatsApp</div>
            </div>
            <Switch defaultChecked />
          </div>

          <Button type="primary" style={{ background: '#2E7D32', marginTop: 16 }}>
            Save Preferences
          </Button>
        </Form>
      </Card>
    </div>
  );
}
