import React from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { LockOutlined, SafetyOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

export default function ResetPasswordPage() {
  const navigate = useNavigate();

  const onFinish = () => {
    navigate('/login');
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <Card style={{ width: '100%', maxWidth: 450, borderRadius: 20 }}>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', textAlign: 'center', marginBottom: 8 }} className="brand-font">
          Set New Password
        </h2>
        <p style={{ color: '#64748b', fontSize: 14, textAlign: 'center', marginBottom: 24 }}>
          Enter the OTP code sent to your phone and create your new secure password.
        </p>

        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item name="otp" label="6-Digit OTP Code" rules={[{ required: true }]}>
            <Input prefix={<SafetyOutlined style={{ color: '#94a3b8' }} />} placeholder="e.g. 589210" size="large" maxLength={6} />
          </Form.Item>
          <Form.Item name="newPassword" label="New Password" rules={[{ required: true }]}>
            <Input.Password prefix={<LockOutlined style={{ color: '#94a3b8' }} />} placeholder="••••••••" size="large" />
          </Form.Item>
          <Form.Item name="confirmPassword" label="Confirm New Password" rules={[{ required: true }]}>
            <Input.Password prefix={<LockOutlined style={{ color: '#94a3b8' }} />} placeholder="••••••••" size="large" />
          </Form.Item>
          <Button type="primary" htmlType="submit" block size="large" style={{ background: '#2E7D32', height: 46 }}>
            Update Password & Login
          </Button>
        </Form>
      </Card>
    </div>
  );
}
