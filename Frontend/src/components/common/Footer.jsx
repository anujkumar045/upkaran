import React from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Input, Button, Divider, Space } from 'antd';
import {
  SafetyCertificateOutlined,
  ThunderboltOutlined,
  CustomerServiceOutlined,
  SendOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined
} from '@ant-design/icons';
import { FaFacebook, FaTwitter, FaLinkedin, FaYoutube, FaInstagram } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#0f172a', color: '#94a3b8', paddingTop: 60, paddingBottom: 30 }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
        {/* Top Feature Highlights */}
        <Row gutter={[24, 24]} style={{ marginBottom: 40, paddingBottom: 30, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <Col xs={24} md={8}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(76, 175, 80, 0.15)', color: '#4CAF50', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
                <SafetyCertificateOutlined />
              </div>
              <div>
                <h4 style={{ color: 'white', fontSize: 16, marginBottom: 2 }}>Verified Equipment & Owners</h4>
                <p style={{ fontSize: 13, margin: 0 }}>Every listed machine undergoes physical quality inspection & RC verification.</p>
              </div>
            </div>
          </Col>
          <Col xs={24} md={8}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(255, 193, 7, 0.15)', color: '#FFC107', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
                <ThunderboltOutlined />
              </div>
              <div>
                <h4 style={{ color: 'white', fontSize: 16, marginBottom: 2 }}>Instant Booking & Direct UPI</h4>
                <p style={{ fontSize: 13, margin: 0 }}>Book machinery on-demand with zero commission fees & instant owner payout.</p>
              </div>
            </div>
          </Col>
          <Col xs={24} md={8}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(59, 130, 246, 0.15)', color: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
                <CustomerServiceOutlined />
              </div>
              <div>
                <h4 style={{ color: 'white', fontSize: 16, marginBottom: 2 }}>24/7 Farmer Support Helpline</h4>
                <p style={{ fontSize: 13, margin: 0 }}>Multilingual customer service available in Hindi, Punjabi, Gujarati & Tamil.</p>
              </div>
            </div>
          </Col>
        </Row>

        {/* Footer Navigation Columns */}
        <Row gutter={[32, 32]}>
          <Col xs={24} sm={12} md={8}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: '#2E7D32', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 20 }}>
                🌾
              </div>
              <span style={{ fontSize: 22, fontWeight: 800, color: 'white' }} className="brand-font">
                UPKARAN
              </span>
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.7, marginBottom: 20 }}>
              Empowering Indian agriculture by democratizing high-tech equipment access for smallholder farmers and creating sustainable passive income for machine owners.
            </p>
            <Space size="middle" style={{ fontSize: 20 }}>
              <a href="#" style={{ color: '#94a3b8' }}><FaFacebook /></a>
              <a href="#" style={{ color: '#94a3b8' }}><FaTwitter /></a>
              <a href="#" style={{ color: '#94a3b8' }}><FaInstagram /></a>
              <a href="#" style={{ color: '#94a3b8' }}><FaLinkedin /></a>
              <a href="#" style={{ color: '#94a3b8' }}><FaYoutube /></a>
            </Space>
          </Col>

          <Col xs={12} sm={6} md={4}>
            <h4 style={{ color: 'white', fontSize: 16, marginBottom: 16 }}>Quick Links</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 14 }}>
              <Link to="/marketplace" style={{ color: '#94a3b8', textDecoration: 'none' }}>Marketplace</Link>
              <Link to="/community" style={{ color: '#94a3b8', textDecoration: 'none' }}>Krishi Community</Link>
              <Link to="/dashboard/owner/add-equipment" style={{ color: '#94a3b8', textDecoration: 'none' }}>List Equipment</Link>
              <Link to="/dashboard/manufacturer" style={{ color: '#94a3b8', textDecoration: 'none' }}>Manufacturer Portal</Link>
              <Link to="/dashboard/farmer" style={{ color: '#94a3b8', textDecoration: 'none' }}>Farmer Dashboard</Link>
            </div>
          </Col>

          <Col xs={12} sm={6} md={4}>
            <h4 style={{ color: 'white', fontSize: 16, marginBottom: 16 }}>Categories</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 14 }}>
              <span style={{ color: '#94a3b8' }}>Tractors & Tillers</span>
              <span style={{ color: '#94a3b8' }}>Harvesters & Threshers</span>
              <span style={{ color: '#94a3b8' }}>Tillage & Rotavators</span>
              <span style={{ color: '#94a3b8' }}>Solar Pump Systems</span>
              <span style={{ color: '#94a3b8' }}>Agri Spray Drones</span>
            </div>
          </Col>

          <Col xs={24} md={8}>
            <h4 style={{ color: 'white', fontSize: 16, marginBottom: 16 }}>Subscribe to Agri Updates</h4>
            <p style={{ fontSize: 13, marginBottom: 16 }}>Get weekly crop equipment tips, government subsidy alerts & rental discount coupons.</p>
            <Space.Compact style={{ width: '100%', marginBottom: 16 }}>
              <Input placeholder="Enter your email or phone" style={{ borderRadius: '8px 0 0 8px' }} />
              <Button type="primary" icon={<SendOutlined />} style={{ borderRadius: '0 8px 8px 0', background: '#2E7D32' }}>
                Join
              </Button>
            </Space.Compact>
            <div style={{ fontSize: 13, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div><PhoneOutlined /> Helpline: 1800-419-8800 (Toll Free)</div>
              <div><MailOutlined /> Email: support@upkaran.com</div>
              <div><EnvironmentOutlined /> HQ: AgriTech Tower, Sector 62, Gurugram, India</div>
            </div>
          </Col>
        </Row>

        <Divider style={{ borderColor: 'rgba(255, 255, 255, 0.1)', margin: '30px 0 20px 0' }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, fontSize: 13 }}>
          <div>
            © {new Date().getFullYear()} UPKARAN Agri Platform Pvt Ltd. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: 20 }}>
            <a href="#" style={{ color: '#94a3b8' }}>Privacy Policy</a>
            <a href="#" style={{ color: '#94a3b8' }}>Terms of Service</a>
            <a href="#" style={{ color: '#94a3b8' }}>Safety Guidelines</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
