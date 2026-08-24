import React, { useState } from 'react';
import { Form, Input, Button, Card, Result, message } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const onFinish = async ({ emailOrPhone }) => {
    setLoading(true);

    try {
      await axiosClient.post('/accounts/password-reset/request/', {
        email: emailOrPhone,
      });
      localStorage.setItem('upkaran_reset_email', emailOrPhone.trim());
      setSubmitted(true);
    } catch (error) {
      message.error(error.response?.data?.detail || 'Unable to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <Card style={{ width: '100%', maxWidth: 450, borderRadius: 20 }}>
        {!submitted ? (
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', textAlign: 'center', marginBottom: 8 }} className="brand-font">
              Reset Your Password
            </h2>
            <p style={{ color: '#64748b', fontSize: 14, textAlign: 'center', marginBottom: 24 }}>
              Enter your registered mobile number or email address and we'll send you an OTP verification code.
            </p>
            <Form layout="vertical" onFinish={onFinish}>
              <Form.Item name="emailOrPhone" label="Registered Email" rules={[{ required: true, type: 'email' }]}>
                <Input prefix={<MailOutlined style={{ color: '#94a3b8' }} />} placeholder="you@example.com" size="large" />
              </Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} block size="large" style={{ background: '#2E7D32', height: 46 }}>
                Send Reset OTP
              </Button>
              <div style={{ textAlign: 'center', marginTop: 16 }}>
                <Link to="/login" style={{ color: '#64748b' }}>← Back to Login</Link>
              </div>
            </Form>
          </div>
        ) : (
          <Result
            status="success"
            title="OTP Reset Link Sent!"
            subTitle="Check your SMS or email for the 6-digit verification code to reset password."
            extra={[
              <Link to="/reset-password" key="reset">
                <Button type="primary" style={{ background: '#2E7D32' }}>Enter Reset OTP Code</Button>
              </Link>
            ]}
          />
        )}
      </Card>
    </div>
  );
}
