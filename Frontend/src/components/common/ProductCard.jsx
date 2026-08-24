import React from 'react';
import { Card, Tag, Button, Rate, Tooltip, Space, message } from 'antd';
import { HeartOutlined, HeartFilled, EnvironmentOutlined, ThunderboltOutlined, SafetyCertificateOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleWishlist } from '../../store/slices/equipmentSlice';
import { addToCart } from '../../store/slices/cartSlice';
import { formatCurrency } from '../../utils/formatters';

export default function ProductCard({ equipment }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { wishlist } = useSelector((state) => state.equipment);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const isWishlisted = wishlist.includes(equipment.id);
  const rentalPrice = Number(equipment.dailyRate ?? equipment.rental_price ?? 0);
  const salePrice = Number(equipment.purchasePrice ?? equipment.price ?? 0);
  const listingType = String(equipment.type || '').toLowerCase();
  const canRent = rentalPrice > 0 || listingType.includes('rent');
  const canBuy = salePrice > 0 || listingType.includes('sale');

  const handleBooking = () => {
    if (!isAuthenticated) {
      navigate('/register', { state: { from: `/booking/${equipment.id}` } });
      return;
    }
    navigate(`/booking/${equipment.id}`);
  };

  const handlePurchase = () => {
    if (!isAuthenticated) {
      navigate('/register', { state: { from: `/marketplace/${equipment.id}` } });
      return;
    }
    message.info('Please contact the equipment owner to complete this purchase.');
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate('/register', { state: { from: `/marketplace/${equipment.id}` } });
      return;
    }
    dispatch(addToCart(equipment));
    message.success(`${equipment.name} added to your cart.`);
  };

  return (
    <Card
      hoverable
      className="hover-lift"
      style={{
        borderRadius: 16,
        overflow: 'hidden',
        border: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
      bodyStyle={{ padding: 18, display: 'flex', flexDirection: 'column', flex: 1 }}
      cover={
        <div
          style={{ position: 'relative', height: 210, overflow: 'hidden', background: '#f1f5f9', cursor: 'pointer' }}
          onClick={() => navigate(`/marketplace/${equipment.id}`)}
        >
          <img
            alt={equipment.name}
            src={equipment.images[0]}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=600&q=80';
            }}
          />
          {/* Wishlist Button */}
          <Button
            shape="circle"
            icon={isWishlisted ? <HeartFilled style={{ color: '#EF4444' }} /> : <HeartOutlined style={{ color: '#64748b' }} />}
            onClick={(e) => {
              e.stopPropagation();
              dispatch(toggleWishlist(equipment.id));
            }}
            style={{
              position: 'absolute',
              top: 12,
              right: 12,
              background: 'rgba(255, 255, 255, 0.9)',
              border: 'none',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            }}
          />

          {/* Badges */}
          <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <Tag color="#2E7D32" style={{ fontWeight: 700, borderRadius: 6, margin: 0, padding: '2px 8px' }}>
              {equipment.type}
            </Tag>
            {equipment.featured && (
              <Tag color="#FFC107" style={{ fontWeight: 700, borderRadius: 6, margin: 0, color: '#0f172a' }}>
                ⚡ Featured
              </Tag>
            )}
          </div>

          <div style={{
            position: 'absolute',
            bottom: 8,
            left: 12,
            background: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(4px)',
            color: 'white',
            padding: '2px 8px',
            borderRadius: 6,
            fontSize: 12,
            display: 'flex',
            alignItems: 'center',
            gap: 4
          }}>
            <EnvironmentOutlined /> {equipment.location}
          </div>
        </div>
      }
    >
      {/* Category Tag */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: '#4CAF50', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          {equipment.category}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Rate disabled defaultValue={equipment.rating} allowHalf style={{ fontSize: 12 }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: '#334155' }}>{equipment.rating}</span>
          <span style={{ fontSize: 11, color: '#94a3b8' }}>({equipment.reviewCount})</span>
        </div>
      </div>

      {/* Equipment Name */}
      <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 8, lineHeight: 1.3 }}>
        {equipment.name}
      </h3>

      {/* Specs Highlights */}
      <div style={{
        background: '#f8fafc',
        padding: '8px 10px',
        borderRadius: 8,
        fontSize: 12,
        color: '#475569',
        marginBottom: 14,
        display: 'flex',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 6
      }}>
        {Object.entries(equipment.specs).slice(0, 2).map(([key, val]) => (
          <span key={key} style={{ textTransform: 'capitalize' }}>
            <strong style={{ color: '#0f172a' }}>{key.replace(/([A-Z])/g, ' $1')}:</strong> {val}
          </span>
        ))}
      </div>

      {/* Owner Info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, marginTop: 'auto' }}>
        <SafetyCertificateOutlined style={{ color: '#2E7D32', fontSize: 16 }} />
        <span style={{ fontSize: 12, color: '#64748b' }}>
          Owner: <strong style={{ color: '#334155' }}>{equipment.owner.name}</strong>
          {equipment.owner.phone && (
            <span style={{ display: 'block', marginTop: 2 }}>
              Mobile: {equipment.owner.phone}
            </span>
          )}
        </span>
      </div>

      {/* Pricing & Actions */}
      <div style={{ paddingTop: 10, borderTop: '1px solid #f1f5f9' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: 42 }}>
          {canRent && (
            <div>
              <span style={{ fontSize: 20, fontWeight: 800, color: '#2E7D32' }}>
                {formatCurrency(equipment.dailyRate)}
              </span>
              <span style={{ fontSize: 12, color: '#64748b' }}> / day</span>
            </div>
          )}
          {canBuy && (
            <div style={{ fontSize: 11, color: '#64748b' }}>
              Buy: <strong style={{ color: '#0f172a' }}>{formatCurrency(equipment.purchasePrice)}</strong>
            </div>
          )}
        </div>

        <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginTop: 8 }}>
          {canRent && (
            <Button
              type="primary"
              size="middle"
              icon={<ThunderboltOutlined />}
              onClick={handleBooking}
              style={{ marginRight: 'auto' }}
            >
              Book Now
            </Button>
          )}
          {canBuy && (
            <Button
              type="primary"
              size="middle"
              onClick={handlePurchase}
              style={{ marginLeft: 'auto', background: '#d97706', borderColor: '#d97706' }}
            >
              Buy Now
            </Button>
          )}
        </div>

        <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: 12, marginTop: 12 }}>
          <Button
            type="default"
            size="middle"
            icon={<ShoppingCartOutlined />}
            onClick={handleAddToCart}
            style={{ marginRight: 'auto' }}
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </Card>
  );
}
