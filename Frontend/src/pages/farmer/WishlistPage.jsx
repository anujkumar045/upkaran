import React from 'react';
import { Row, Col } from 'antd';
import { useSelector } from 'react-redux';
import ProductCard from '../../components/common/ProductCard';
import EmptyState from '../../components/common/EmptyState';

export default function WishlistPage() {
  const { equipments, wishlist } = useSelector((state) => state.equipment);

  const wishlistedItems = equipments.filter((e) => wishlist.includes(e.id));

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: '#0f172a' }} className="brand-font">
          My Saved Wishlist ({wishlistedItems.length})
        </h1>
        <p style={{ color: '#64748b' }}>Equipments you saved for upcoming crop season hiring</p>
      </div>

      {wishlistedItems.length > 0 ? (
        <Row gutter={[24, 24]}>
          {wishlistedItems.map((eq) => (
            <Col xs={24} sm={12} lg={8} key={eq.id}>
              <ProductCard equipment={eq} />
            </Col>
          ))}
        </Row>
      ) : (
        <EmptyState
          title="Your Wishlist is Empty"
          description="Explore our marketplace to save tractors, harvesters, and drones to your wishlist."
          actionText="Browse Marketplace"
          actionLink="/marketplace"
        />
      )}
    </div>
  );
}
