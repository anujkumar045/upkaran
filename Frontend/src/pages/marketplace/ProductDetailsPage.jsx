import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Row,
  Col,
  Card,
  Tag,
  Button,
  Rate,
  Avatar,
  Divider,
  Tabs,
  Space,
  Calendar,
  Badge,
  Descriptions,
  List,
  Modal
} from 'antd';
import {
  HeartOutlined,
  HeartFilled,
  EnvironmentOutlined,
  ThunderboltOutlined,
  SafetyCertificateOutlined,
  PhoneOutlined,
  CheckCircleFilled,
  CalendarOutlined,
  ShareAltOutlined,
  StarFilled
} from '@ant-design/icons';
import { toggleWishlist } from '../../store/slices/equipmentSlice';
import { formatCurrency } from '../../utils/formatters';
import ProductCard from '../../components/common/ProductCard';
import axiosClient from '../../api/axiosClient';

const getListingType = (salePrice, rentalPrice) => {
  const hasSalePrice = Number(salePrice || 0) > 0;
  const hasRentalPrice = Number(rentalPrice || 0) > 0;

  if (hasSalePrice && hasRentalPrice) return 'Rental & Sale';
  if (hasRentalPrice) return 'For Rent';
  return 'For Sale';
};

const getMediaUrl = (value, apiOrigin) => {
  if (!value) {
    return 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=900&q=80';
  }
  return value.startsWith('http') ? value : `${apiOrigin}/${value.replace(/^\//, '')}`;
};

export default function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { wishlist } = useSelector((state) => state.equipment);
  const [equipment, setEquipment] = useState(null);
  const [selectedImg, setSelectedImg] = useState('');
  const [zoomOpen, setZoomOpen] = useState(false);

  useEffect(() => {
    const apiOrigin = (
      import.meta.env.VITE_API_BASE_URL ||
      'http://127.0.0.1:8000/api/'
    ).replace(/\/api\/?$/, '');

    axiosClient.get(`/marketplace/equipments/${id}/`).then((response) => {
      const item = response.data;
      const mappedEquipment = {
        id: String(item.id),
        name: item.name,
        category: item.category_name || 'Agricultural Equipment',
        type: getListingType(item.price, item.rental_price),
        condition: item.condition,
        location: item.location,
        dailyRate: Number(item.rental_price || 0),
        hourlyRate: Math.round(Number(item.rental_price || 0) / 6),
        purchasePrice: Number(item.price || 0),
        rating: Number(item.average_rating || 0),
        reviewCount: 0,
        images: [getMediaUrl(item.image_url || item.image, apiOrigin)],
        specs: { Quantity: `${item.quantity} units`, Brand: item.brand },
        description: item.description,
        owner: {
          name: item.owner_name || item.owner || 'Marketplace Seller',
          phone: item.owner_phone || '',
          joined: 'recently',
        },
      };
      setEquipment(mappedEquipment);
      setSelectedImg(mappedEquipment.images[0]);
    }).catch(() => setEquipment(null));
  }, [id]);

  if (!equipment) {
    return <div style={{ padding: 48, textAlign: 'center' }}>Loading product details...</div>;
  }

  const isWishlisted = wishlist.includes(equipment.id);

  const similarEquipments = [];

  return (
    <div style={{ maxWidth: 1320, margin: '30px auto', padding: '0 24px' }}>
      {/* Top Details Card */}
      <Card style={{ borderRadius: 24, overflow: 'hidden', marginBottom: 40 }} bodyStyle={{ padding: 36 }}>
        <Row gutter={[48, 36]}>
          {/* Left Column: Gallery */}
          <Col xs={24} lg={12}>
            <div style={{ borderRadius: 20, overflow: 'hidden', background: '#f1f5f9', height: 400, position: 'relative', marginBottom: 16, border: '1px solid #e2e8f0', cursor: 'zoom-in' }} onClick={() => setZoomOpen(true)}>
              <img
                src={selectedImg}
                alt={equipment.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <Tag color="#2E7D32" style={{ position: 'absolute', top: 16, left: 16, fontSize: 13, fontWeight: 700, padding: '4px 12px', borderRadius: 8 }}>
                {equipment.type}
              </Tag>
            </div>

            {/* Thumbnail Selectors */}
            <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 6 }}>
              {equipment.images.map((imgUrl, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedImg(imgUrl)}
                  style={{
                    width: 90,
                    height: 70,
                    borderRadius: 12,
                    overflow: 'hidden',
                    cursor: 'pointer',
                    border: selectedImg === imgUrl ? '3px solid #2E7D32' : '1px solid #cbd5e1',
                    opacity: selectedImg === imgUrl ? 1 : 0.7,
                    transition: 'all 0.2s'
                  }}
                >
                  <img src={imgUrl} alt="thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          </Col>

          {/* Right Column: Information & Actions */}
          <Col xs={24} lg={12}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <Tag color="green" style={{ fontWeight: 700, borderRadius: 8, marginBottom: 8 }}>
                  {equipment.category}
                </Tag>
                <h1 style={{ fontSize: 30, fontWeight: 800, color: '#0f172a', marginBottom: 8, lineHeight: 1.2 }} className="brand-font">
                  {equipment.name}
                </h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, fontSize: 14 }}>
                  <Rate disabled defaultValue={equipment.rating} allowHalf style={{ fontSize: 14 }} />
                  <strong style={{ color: '#0f172a' }}>{equipment.rating}</strong>
                  <span style={{ color: '#64748b' }}>({equipment.reviewCount} customer reviews)</span>
                  <span style={{ color: '#cbd5e1' }}>|</span>
                  <span style={{ color: '#475569' }}><EnvironmentOutlined /> {equipment.location}</span>
                </div>
              </div>

              <Button
                shape="circle"
                size="large"
                icon={isWishlisted ? <HeartFilled style={{ color: '#EF4444' }} /> : <HeartOutlined />}
                onClick={() => dispatch(toggleWishlist(equipment.id))}
              />
            </div>

            {/* Price Banner */}
            <div style={{ background: '#f8fafc', padding: 20, borderRadius: 16, border: '1px solid #e2e8f0', marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: 12, color: '#64748b', fontWeight: 600, display: 'block' }}>RENTAL PRICE</span>
                <span style={{ fontSize: 32, fontWeight: 800, color: '#2E7D32' }}>{formatCurrency(equipment.dailyRate)}</span>
                <span style={{ fontSize: 14, color: '#64748b' }}> / day</span>
              </div>
              {equipment.purchasePrice > 0 && (
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: 12, color: '#64748b', fontWeight: 600, display: 'block' }}>PURCHASE PRICE</span>
                  <span style={{ fontSize: 20, fontWeight: 800, color: '#0f172a' }}>{formatCurrency(equipment.purchasePrice)}</span>
                </div>
              )}
            </div>

            {/* Owner Profile Snippet */}
            <div style={{ background: '#e8f5e9', padding: 16, borderRadius: 16, border: '1px solid #a5d6a7', marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Avatar size={48} icon={<SafetyCertificateOutlined />} style={{ background: '#2E7D32' }} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: '#0f172a' }}>{equipment.owner.name}</div>
                  {equipment.owner.phone && (
                    <div style={{ fontSize: 12, color: '#475569', marginTop: 2 }}>
                      Mobile: {equipment.owner.phone}
                    </div>
                  )}
                  <div style={{ fontSize: 12, color: '#2E7D32', fontWeight: 600 }}>Verified Machine Owner • Joined {equipment.owner.joined}</div>
                </div>
              </div>
              <Button icon={<PhoneOutlined />} style={{ borderRadius: 10, borderColor: '#2E7D32', color: '#2E7D32' }}>
                Contact Owner
              </Button>
            </div>

            {/* Book Now Button */}
            <Button
              type="primary"
              size="large"
              block
              icon={<ThunderboltOutlined />}
              onClick={() => navigate(`/booking/${equipment.id}`)}
              style={{ background: '#2E7D32', height: 54, fontSize: 18, fontWeight: 700, borderRadius: 14 }}
            >
              Book Equipment Now
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Tabs for Details, Specs & Reviews */}
      <Card style={{ borderRadius: 24, marginBottom: 40 }} bodyStyle={{ padding: 32 }}>
        <Tabs defaultActiveKey="1" items={[
          {
            key: '1',
            label: 'Description & Usage',
            children: (
              <div style={{ fontSize: 15, lineHeight: 1.8, color: '#334155' }}>
                <p>{equipment.description}</p>
                <h4 style={{ fontSize: 16, fontWeight: 700, marginTop: 20 }}>Operator & Fuel Guidelines</h4>
                <ul>
                  <li>Tractor comes with full fuel tank. Additional diesel is responsibility of farmer.</li>
                  <li>Free operator included for rentals exceeding 3 consecutive days.</li>
                  <li>Complies with all Indian agricultural transport and safety regulations.</li>
                </ul>
              </div>
            )
          },
          {
            key: '2',
            label: 'Technical Specifications',
            children: (
              <Descriptions title="Machinery Specs" bordered column={{ xs: 1, sm: 2 }}>
                {Object.entries(equipment.specs).map(([k, v]) => (
                  <Descriptions.Item key={k} label={<span style={{ textTransform: 'capitalize', fontWeight: 600 }}>{k.replace(/([A-Z])/g, ' $1')}</span>}>
                    <strong>{v}</strong>
                  </Descriptions.Item>
                ))}
              </Descriptions>
            )
          },
          {
            key: '3',
            label: `Reviews (${equipment.reviewCount})`,
            children: (
              <List
                itemLayout="horizontal"
                dataSource={[
                  { name: 'Sukhwinder Singh', rating: 5, date: '2 days ago', text: 'Tractor was in pristine condition! Delivered on time in Ludhiana. Smooth operation with my Rotavator.' },
                  { name: 'Verified Customer', rating: 5, date: '1 week ago', text: 'The owner was very helpful. The operator handled the equipment safely.' }
                ]}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<Avatar style={{ background: '#4CAF50' }}>{item.name[0]}</Avatar>}
                      title={<div style={{ display: 'flex', gap: 10, alignItems: 'center' }}><strong>{item.name}</strong> <Rate disabled defaultValue={item.rating} style={{ fontSize: 12 }} /></div>}
                      description={<div><p style={{ margin: '4px 0', color: '#334155' }}>{item.text}</p><span style={{ fontSize: 12, color: '#94a3b8' }}>{item.date}</span></div>}
                    />
                  </List.Item>
                )}
              />
            )
          }
        ]} />
      </Card>

      {/* Similar Equipments */}
      {similarEquipments.length > 0 && (
        <div style={{ marginBottom: 60 }}>
          <h2 style={{ fontSize: 26, fontWeight: 800, color: '#0f172a', marginBottom: 24 }} className="brand-font">
            Similar Equipments You May Like
          </h2>
          <Row gutter={[24, 24]}>
            {similarEquipments.map((item) => (
              <Col xs={24} sm={12} lg={8} key={item.id}>
                <ProductCard equipment={item} />
              </Col>
            ))}
          </Row>
        </div>
      )}

      {/* Zoom Modal */}
      <Modal open={zoomOpen} footer={null} onCancel={() => setZoomOpen(false)} width={800}>
        <img src={selectedImg} alt="zoom" style={{ width: '100%', borderRadius: 12 }} />
      </Modal>
    </div>
  );
}
