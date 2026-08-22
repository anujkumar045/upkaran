import React, { useState } from 'react';
import { Card, Form, Input, Button, Avatar, Switch, Tag, Row, Col, Divider, Upload, message } from 'antd';
import { UserOutlined, PhoneOutlined, MailOutlined, QrcodeOutlined, CheckCircleFilled, CameraOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { updateProfile, toggleOwnerMode } from '../../store/slices/authSlice';
import { formatCurrency } from '../../utils/formatters';
import axiosClient from '../../api/axiosClient';

const API_ORIGIN = (
  import.meta.env.VITE_API_BASE_URL ||
  'http://127.0.0.1:8000/api/'
).replace(/\/api\/?$/, '');

const getProfilePictureUrl = (picture) => {
  if (!picture) return undefined;
  if (picture.startsWith('http')) return picture;
  return `${API_ORIGIN}/${picture.replace(/^\//, '')}`;
};

export default function UserProfilePage() {
  const dispatch = useDispatch();
  const { user, role } = useSelector((state) => state.auth);
  const [uploading, setUploading] = useState(false);
  const displayName = [user?.first_name, user?.last_name]
    .filter(Boolean)
    .join(' ') || user?.name || user?.username || 'Farmer';

  const handleProfilePictureUpload = async ({ file }) => {
    const formData = new FormData();
    formData.append('profile_picture', file);
    setUploading(true);

    try {
      const response = await axiosClient.patch('/accounts/profile/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      dispatch(updateProfile(response.data));
      message.success('Profile picture updated successfully.');
    } catch (error) {
      message.error(error.response?.data?.profile_picture?.[0] || 'Profile picture upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const onFinish = async (values) => {
    const nameParts = (values.name || '').trim().split(/\s+/);
    const profileData = {
      first_name: nameParts[0] || '',
      last_name: nameParts.slice(1).join(' '),
      phone: values.phone,
      email: values.email,
      city: values.location,
    };

    try {
      const response = await axiosClient.patch('/accounts/profile/', profileData);
      dispatch(updateProfile({
        ...response.data,
        name: values.name,
        location: values.location,
        upiId: values.upiId,
        qrCodeUrl: values.qrCodeUrl,
      }));
      message.success('Profile changes saved successfully.');
    } catch (error) {
      const data = error.response?.data;
      const firstError = data && Object.values(data).flat()[0];
      message.error(firstError || 'Could not save profile changes.');
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: '30px auto', padding: '0 24px' }}>
      <Card style={{ borderRadius: 24, boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }} bodyStyle={{ padding: 36 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 32 }}>
          <Upload
            accept="image/*"
            showUploadList={false}
            customRequest={handleProfilePictureUpload}
          >
            <Button
              type="text"
              loading={uploading}
              icon={<CameraOutlined />}
              style={{ padding: 0, height: 'auto', borderRadius: '50%' }}
              aria-label="Upload profile picture"
            >
              <Avatar src={getProfilePictureUrl(user?.profile_picture || user?.avatar)} size={84} icon={<UserOutlined />} style={{ border: '3px solid #2E7D32' }} />
            </Button>
          </Upload>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <h2 style={{ fontSize: 26, fontWeight: 800, color: '#0f172a', margin: 0 }}>{displayName}</h2>
              <Tag color="green" icon={<CheckCircleFilled />}>KYC VERIFIED</Tag>
            </div>
            <p style={{ color: '#64748b', fontSize: 14, margin: '4px 0 0 0' }}>
              {user?.location} • Farm Size: {user?.landSize}
            </p>
          </div>
        </div>

        {/* Enable Equipment Owner Mode */}
        <div style={{ background: '#e8f5e9', padding: 20, borderRadius: 16, border: '1px solid #a5d6a7', marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h4 style={{ fontSize: 16, fontWeight: 700, color: '#2E7D32', margin: 0 }}>Enable Equipment Owner Mode</h4>
            <p style={{ fontSize: 13, color: '#475569', margin: '4px 0 0 0' }}>Monetize your tractors & implements to earn passive rental income</p>
          </div>
          <Switch
            checked={user?.isOwnerEnabled}
            onChange={(val) => dispatch(toggleOwnerMode(val))}
            checkedChildren="ON"
            unCheckedChildren="OFF"
          />
        </div>

        <Form
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            ...user,
            name: displayName,
            location: user?.location || user?.city,
          }}
        >
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item name="name" label="Full Name">
                <Input size="large" prefix={<UserOutlined />} />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="phone" label="Mobile Number">
                <Input size="large" prefix={<PhoneOutlined />} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item name="email" label="Email Address">
                <Input size="large" prefix={<MailOutlined />} />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="location" label="District / Village">
                <Input size="large" />
              </Form.Item>
            </Col>
          </Row>

          <Divider />

          <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <QrcodeOutlined style={{ color: '#2E7D32' }} /> Direct UPI Payout Details
          </h3>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item name="upiId" label="Your UPI VPA Address">
                <Input placeholder="e.g. yourname@upi" size="large" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="qrCodeUrl" label="Custom Payment QR Image URL">
                <Input placeholder="https://api.qrserver.com/v1/..." size="large" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item style={{ marginTop: 16 }}>
            <Button type="primary" htmlType="submit" size="large" style={{ background: '#2E7D32', height: 48, padding: '0 36px', fontWeight: 700 }}>
              Save Profile Changes
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
