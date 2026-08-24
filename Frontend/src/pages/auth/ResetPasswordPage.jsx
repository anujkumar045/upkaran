import React, { useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { LockOutlined, SafetyOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async ({ otp, newPassword, confirmPassword }) => {
    if (newPassword !== confirmPassword) {
      message.error('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await axiosClient.post('/accounts/password-reset/confirm/', {
        email: localStorage.getItem('upkaran_reset_email'),
        otp,
        new_password: newPassword,
      });
      localStorage.removeItem('upkaran_reset_email');
      message.success('Password reset successful.');
      navigate('/login');
    } catch (error) {
      message.error(error.response?.data?.detail || 'Unable to reset password.');
    } finally {
      setLoading(false);
    }
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
          <Button type="primary" htmlType="submit" loading={loading} block size="large" style={{ background: '#2E7D32', height: 46 }}>
            Update Password & Login
          </Button>
        </Form>
      </Card>
    </div>
  );
}
