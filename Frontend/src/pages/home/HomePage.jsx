import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Input,
  Button,
  Row,
  Col,
  Card,
  Tag,
  Badge,
  Collapse,
  Rate,
  Avatar,
  Space
} from 'antd';
import {
  SearchOutlined,
  ThunderboltOutlined,
  SafetyCertificateOutlined,
  CheckCircleFilled,
  RightOutlined,
  ToolOutlined,
  DollarCircleOutlined,
  TeamOutlined,
  QuestionCircleOutlined,
  StarFilled,
  ArrowRightOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import ProductCard from '../../components/common/ProductCard';
import { CATEGORIES } from '../../constants/mockData';
import { formatCurrency } from '../../utils/formatters';

const { Search } = Input;

export default function HomePage() {
  const navigate = useNavigate();
  const { equipments = [] } = useSelector((state) => state.equipment);
  const [searchQuery, setSearchQuery] = useState('');

  const totalListings = equipments.length;
  const availableMachinery = equipments.filter((equipment) => equipment.is_available !== false).length;
  const coveredLocations = new Set(
    equipments.map((equipment) => equipment.location).filter(Boolean)
  ).size;
  const rentalListings = equipments.filter((equipment) => (
    Number(equipment.dailyRate ?? equipment.rental_price ?? 0) > 0
  )).length;

  const categoryCount = (categoryName) => equipments.filter((equipment) => (
    equipment.category === categoryName || equipment.category_name === categoryName
  )).length;

  const handleSearch = (value) => {
    navigate(`/marketplace?search=${encodeURIComponent(value)}`);
  };

  return (
    <div style={{ backgroundColor: '#F8FAFC', overflow: 'hidden' }}>
      {/* 1. HERO SECTION */}
      <section className="hero-gradient home-hero-section" style={{ padding: '80px 24px 100px 24px', position: 'relative' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <Row gutter={[48, 48]} align="middle">
            <Col xs={24} lg={13}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Tag color="#e8f5e9" style={{
                  color: '#2E7D32',
                  borderColor: '#a5d6a7',
                  fontSize: 13,
                  fontWeight: 700,
                  padding: '6px 16px',
                  borderRadius: 20,
                  marginBottom: 20,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8
                }}>
                  <span className="badge-pulse" style={{ width: 8, height: 8, borderRadius: '50%', background: '#4CAF50' }}></span>
                  India's #1 Agriculture Equipment SaaS & Rental Network
                </Tag>

                <h1 className="brand-font home-hero-title" style={{
                  fontSize: 52,
                  fontWeight: 800,
                  lineHeight: 1.15,
                  color: '#0f172a',
                  marginBottom: 20,
                  letterSpacing: '-1px'
                }}>
                  Rent Modern Farm Equipment. <br />
                  <span className="brand-gradient-text">Max Crop Yield, Zero Capital Waste.</span>
                </h1>

                <p className="home-hero-copy" style={{ fontSize: 18, color: '#475569', marginBottom: 36, maxWidth: 580, lineHeight: 1.6 }}>
                  Connect directly with verified machine owners & manufacturers across India. Hire high-horsepower tractors, combine harvesters, rotavators & spray drones on demand.
                </p>

                {/* Hero Search Bar */}
                <div className="glass-card home-hero-search" style={{ padding: 12, borderRadius: 16, maxWidth: 620, marginBottom: 36 }}>
                  <Input.Search
                    placeholder="Search by tractor, harvester, location (e.g. Ludhiana)..."
                    enterButton={
                      <Button type="primary" size="large" icon={<SearchOutlined />} style={{ background: '#2E7D32', height: 48, borderRadius: '0 10px 10px 0', fontSize: 15, fontWeight: 700 }}>
                        Search Marketplace
                      </Button>
                    }
                    size="large"
                    onSearch={handleSearch}
                    style={{ borderRadius: 12 }}
                  />
                </div>

                {/* CTA Buttons */}
                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
                  <Button
                    type="primary"
                    size="large"
                    icon={<ThunderboltOutlined />}
                    onClick={() => navigate('/marketplace')}
                    style={{ background: '#2E7D32', height: 50, padding: '0 32px', borderRadius: 12, fontSize: 16, fontWeight: 700 }}
                  >
                    Explore Marketplace
                  </Button>
                  <Button
                    type="default"
                    size="large"
                    icon={<ToolOutlined />}
                    onClick={() => navigate('/dashboard/owner/add-equipment')}
                    style={{ height: 50, padding: '0 28px', borderRadius: 12, fontSize: 16, fontWeight: 700, borderColor: '#2E7D32', color: '#2E7D32' }}
                  >
                    List Your Machine (Earn ₹50k/mo)
                  </Button>
                </div>
              </motion.div>
            </Col>

            {/* Hero Right Visuals & Floating Cards */}
            <Col xs={24} lg={11} className="home-hero-visual">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                style={{ position: 'relative' }}
              >
                {/* Main Hero Illustration */}
                <div style={{
                  borderRadius: 24,
                  overflow: 'hidden',
                  boxShadow: '0 25px 50px -12px rgba(46, 125, 50, 0.25)',
                  border: '4px solid white',
                  position: 'relative'
                }}>
                  <img
                    className="home-hero-image"
                    src="https://www.image2url.com/r2/default/files/1787583491537-ff4856b4-7566-4901-96a4-158f5a2d55f6.jpeg"
                    alt="Agricultural Tractor in Field"
                    style={{ width: '100%', height: 440, objectFit: 'cover' }}
                  />
                </div>

                {/* Floating Card 1: Verified Booking */}
                <motion.div
                  className="glass-card home-float-card home-float-card-left"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                  style={{
                    position: 'absolute',
                    top: -20,
                    left: -20,
                    padding: '14px 20px',
                    borderRadius: 16,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
                  }}
                >
                  <div style={{ width: 42, height: 42, borderRadius: 10, background: '#2E7D32', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                    <CheckCircleFilled />
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 14, color: '#0f172a' }}>Instant Confirmation</div>
                    <div style={{ fontSize: 12, color: '#64748b' }}>Zero Advance Cancellation Fee</div>
                  </div>
                </motion.div>

                {/* Floating Card 2: Earnings */}
                <motion.div
                  className="glass-card home-float-card home-float-card-right"
                  animate={{ y: [0, 10, 0] }}
                  transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut', delay: 1 }}
                  style={{
                    position: 'absolute',
                    bottom: -20,
                    right: -10,
                    padding: '16px 22px',
                    borderRadius: 16,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
                  }}
                >
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: '#FFC107', color: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
                    <DollarCircleOutlined />
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>MACHINE OWNER EARNING</div>
                    <div style={{ fontWeight: 800, fontSize: 18, color: '#2E7D32' }}>₹48,500 / month</div>
                  </div>
                </motion.div>
              </motion.div>
            </Col>
          </Row>
        </div>
      </section>

      {/* 2. STATS BANNER */}
      <section style={{ backgroundColor: '#0f172a', padding: '36px 24px', color: 'white' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <Row gutter={[24, 24]} justify="space-between" align="middle">
            <Col xs={12} md={6} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 36, fontWeight: 800, color: '#4CAF50' }} className="brand-font">{totalListings}</div>
              <div style={{ fontSize: 13, color: '#94a3b8' }}>Total Listings</div>
            </Col>
            <Col xs={12} md={6} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 36, fontWeight: 800, color: '#FFC107' }} className="brand-font">{availableMachinery}</div>
              <div style={{ fontSize: 13, color: '#94a3b8' }}>Available Machinery</div>
            </Col>
            <Col xs={12} md={6} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 36, fontWeight: 800, color: '#60A5FA' }} className="brand-font">{coveredLocations}</div>
              <div style={{ fontSize: 13, color: '#94a3b8' }}>Locations Covered</div>
            </Col>
            <Col xs={12} md={6} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 36, fontWeight: 800, color: '#F472B6' }} className="brand-font">{rentalListings}</div>
              <div style={{ fontSize: 13, color: '#94a3b8' }}>Rental Listings</div>
            </Col>
          </Row>
        </div>
      </section>

      {/* 3. CATEGORIES SECTION */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <Tag color="green" style={{ fontWeight: 700, borderRadius: 10 }}>EXPLORE BY CATEGORY</Tag>
            <h2 style={{ fontSize: 36, fontWeight: 800, color: '#0f172a', marginTop: 8 }} className="brand-font">
              Machinery Tailored For Every Farming Need
            </h2>
            <p style={{ color: '#64748b', fontSize: 16 }}>From seedbed preparation to precision drone spraying</p>
          </div>

          <Row gutter={[24, 24]}>
            {CATEGORIES.map((cat) => (
              <Col xs={12} sm={8} lg={4} key={cat.id}>
                <Card
                  hoverable
                  onClick={() => navigate(`/marketplace?category=${encodeURIComponent(cat.name)}`)}
                  style={{
                    borderRadius: 16,
                    textAlign: 'center',
                    border: '1px solid #e2e8f0',
                    transition: 'all 0.3s ease'
                  }}
                  bodyStyle={{ padding: 20 }}
                >
                  <div style={{ fontSize: 38, marginBottom: 10 }}>{cat.icon}</div>
                  <h4 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 4, minHeight: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {cat.name}
                  </h4>
                  <Tag color="default" style={{ borderRadius: 10, fontSize: 11 }}>{categoryCount(cat.name)} listings</Tag>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* 4. POPULAR EQUIPMENTS */}
      <section style={{ padding: '60px 24px', backgroundColor: '#f1f5f9' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 36, flexWrap: 'wrap', gap: 16 }}>
            <div>
              <Tag color="gold" style={{ fontWeight: 700, borderRadius: 10 }}>TOP RATED NEAR YOU</Tag>
              <h2 style={{ fontSize: 36, fontWeight: 800, color: '#0f172a', marginTop: 6 }} className="brand-font">
                Popular Agricultural Machinery
              </h2>
            </div>
            <Button type="link" onClick={() => navigate('/marketplace')} style={{ color: '#2E7D32', fontWeight: 700, fontSize: 16 }}>
              View All Marketplace Listings <RightOutlined />
            </Button>
          </div>

          <Row gutter={[24, 24]}>
            {equipments.slice(0, 3).map((eq) => (
              <Col xs={24} md={12} lg={8} key={eq.id}>
                <ProductCard equipment={eq} />
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* 5. HOW IT WORKS */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <Tag color="blue" style={{ fontWeight: 700, borderRadius: 10 }}>SIMPLE 3-STEP PROCESS</Tag>
            <h2 style={{ fontSize: 36, fontWeight: 800, color: '#0f172a', marginTop: 8 }} className="brand-font">
              How UPKARAN Rental Platform Works
            </h2>
          </div>

          <Row gutter={[32, 32]}>
            <Col xs={24} md={8}>
              <div style={{ background: 'white', padding: 32, borderRadius: 20, border: '1px solid #e2e8f0', textAlign: 'center', height: '100%' }}>
                <div style={{ width: 64, height: 64, borderRadius: 16, background: '#e8f5e9', color: '#2E7D32', fontSize: 28, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}>
                  1
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: '#0f172a', marginBottom: 12 }}>Search & Filter</h3>
                <p style={{ color: '#64748b', fontSize: 14 }}>Browse verified tractors, harvesters, or implements in your village or nearby district.</p>
              </div>
            </Col>

            <Col xs={24} md={8}>
              <div style={{ background: 'white', padding: 32, borderRadius: 20, border: '1px solid #e2e8f0', textAlign: 'center', height: '100%' }}>
                <div style={{ width: 64, height: 64, borderRadius: 16, background: '#fef3c7', color: '#d97706', fontSize: 28, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}>
                  2
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: '#0f172a', marginBottom: 12 }}>Book & Pay via QR</h3>
                <p style={{ color: '#64748b', fontSize: 14 }}>Select dates, review price breakdown, and scan owner’s UPI QR code with zero platform commission.</p>
              </div>
            </Col>

            <Col xs={24} md={8}>
              <div style={{ background: 'white', padding: 32, borderRadius: 20, border: '1px solid #e2e8f0', textAlign: 'center', height: '100%' }}>
                <div style={{ width: 64, height: 64, borderRadius: 16, background: '#dbeafe', color: '#2563eb', fontSize: 28, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}>
                  3
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: '#0f172a', marginBottom: 12 }}>Get Work Done</h3>
                <p style={{ color: '#64748b', fontSize: 14 }}>Machine delivered directly to your farm. Work with or without certified operators.</p>
              </div>
            </Col>
          </Row>
        </div>
      </section>

      {/* 6. PRICING TIERS */}
      <section style={{ padding: '80px 24px', backgroundColor: '#f8fafc' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <Tag color="purple" style={{ fontWeight: 700, borderRadius: 10 }}>TRANSPARENT PRICING</Tag>
            <h2 style={{ fontSize: 36, fontWeight: 800, color: '#0f172a', marginTop: 8 }} className="brand-font">
              Flexible SaaS Subscriptions & Rental Plans
            </h2>
          </div>

          <Row gutter={[32, 32]}>
            <Col xs={24} md={8}>
              <Card style={{ borderRadius: 20, border: '1px solid #e2e8f0', textAlign: 'center', padding: 12 }}>
                <h3 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a' }}>Farmer Pay-As-You-Go</h3>
                <div style={{ fontSize: 36, fontWeight: 800, color: '#2E7D32', margin: '16px 0' }}>FREE</div>
                <p style={{ color: '#64748b', fontSize: 14, marginBottom: 20 }}>For individual farmers looking to rent equipment</p>
                <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24, fontSize: 13 }}>
                  <div>✓ Unlimited Marketplace Browsing</div>
                  <div>✓ Direct Owner Contact</div>
                  <div>✓ QR Code Instant Payment</div>
                  <div>✓ Customer Support Helpline</div>
                </div>
                <Button type="primary" block style={{ background: '#2E7D32', height: 42 }} onClick={() => navigate('/register')}>
                  Join as Farmer
                </Button>
              </Card>
            </Col>

            <Col xs={24} md={8}>
              <Card style={{ borderRadius: 20, border: '2px solid #4CAF50', textAlign: 'center', padding: 12, position: 'relative', boxShadow: '0 10px 25px rgba(76,175,80,0.15)' }}>
                <Tag color="#4CAF50" style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', fontWeight: 700, padding: '2px 12px' }}>
                  MOST POPULAR
                </Tag>
                <h3 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', marginTop: 8 }}>Equipment Owner Pro</h3>
                <div style={{ fontSize: 36, fontWeight: 800, color: '#2E7D32', margin: '16px 0' }}>₹499 <span style={{ fontSize: 14, color: '#64748b' }}>/ month</span></div>
                <p style={{ color: '#64748b', fontSize: 14, marginBottom: 20 }}>For machine owners looking to monetize idle equipment</p>
                <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24, fontSize: 13 }}>
                  <div>✓ List up to 10 Equipments</div>
                  <div>✓ Instant Direct UPI Payouts</div>
                  <div>✓ Rental Request Management Console</div>
                  <div>✓ Availability Calendar & Tracking</div>
                </div>
                <Button type="primary" block style={{ background: '#2E7D32', height: 42 }} onClick={() => navigate('/dashboard/owner/add-equipment')}>
                  Start Listing Machine
                </Button>
              </Card>
            </Col>

            <Col xs={24} md={8}>
              <Card style={{ borderRadius: 20, border: '1px solid #e2e8f0', textAlign: 'center', padding: 12 }}>
                <h3 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a' }}>Manufacturer Enterprise</h3>
                <div style={{ fontSize: 36, fontWeight: 800, color: '#0f172a', margin: '16px 0' }}>₹2,499 <span style={{ fontSize: 14, color: '#64748b' }}>/ month</span></div>
                <p style={{ color: '#64748b', fontSize: 14, marginBottom: 20 }}>For implement manufacturers & dealers</p>
                <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24, fontSize: 13 }}>
                  <div>✓ Showcase B2B & New Product Catalog</div>
                  <div>✓ Lead Generation & Dealership Inquiries</div>
                  <div>✓ Dealer Inventory Management</div>
                  <div>✓ Dedicated Account Manager</div>
                </div>
                <Button type="default" block style={{ height: 42, borderColor: '#2E7D32', color: '#2E7D32' }} onClick={() => navigate('/dashboard/manufacturer')}>
                  Contact Enterprise Team
                </Button>
              </Card>
            </Col>
          </Row>
        </div>
      </section>

      {/* 7. CTA BANNER */}
      <section style={{ padding: '60px 24px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{
            borderRadius: 24,
            background: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%)',
            padding: '60px 40px',
            color: 'white',
            textAlign: 'center',
            boxShadow: '0 20px 40px rgba(27, 94, 32, 0.3)'
          }}>
            <h2 style={{ fontSize: 40, fontWeight: 800, color: 'white', marginBottom: 16 }} className="brand-font">
              Ready to Upgrade Your Agriculture Productivity?
            </h2>
            <p style={{ fontSize: 18, color: '#a5d6a7', maxWidth: 640, margin: '0 auto 32px auto' }}>
              Join thousands of farmers saving up to 40% on operational machinery costs every crop season.
            </p>
            <Space size="large" wrap>
              <Button type="primary" size="large" style={{ background: '#FFC107', color: '#0f172a', fontWeight: 800, height: 50, padding: '0 36px', borderRadius: 12, border: 'none' }} onClick={() => navigate('/register')}>
                Create Free Account
              </Button>
              <Button type="ghost" size="large" style={{ color: 'white', borderColor: 'white', fontWeight: 700, height: 50, padding: '0 32px', borderRadius: 12 }} onClick={() => navigate('/marketplace')}>
                Browse Equipment Marketplace
              </Button>
            </Space>
          </div>
        </div>
      </section>
    </div>
  );
}
