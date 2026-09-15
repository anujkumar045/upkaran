import React from 'react';
import { Button, Card, Col, Empty, List, Row, Space, Tag } from 'antd';
import { DeleteOutlined, ShoppingOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { removeFromCart } from '../../store/slices/cartSlice';
import { formatCurrency } from '../../utils/formatters';
import { writeUserCollection } from '../../utils/userStorage';

export default function CartPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  return (
    <div style={{ maxWidth: 1100, margin: '30px auto', padding: '0 24px' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: '#0f172a' }} className="brand-font">
          My Cart ({items.length})
        </h1>
        <p style={{ color: '#64748b' }}>Equipment saved for your next purchase or rental.</p>
      </div>

      {items.length === 0 ? (
        <Card style={{ borderRadius: 16 }}>
          <Empty
            image={<ShoppingOutlined style={{ fontSize: 48, color: '#2E7D32' }} />}
            description="Your cart is empty"
          >
            <Button type="primary" onClick={() => navigate('/marketplace')}>
              Browse Marketplace
            </Button>
          </Empty>
        </Card>
      ) : (
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={16}>
            <Card style={{ borderRadius: 16 }}>
              <List
                itemLayout="horizontal"
                dataSource={items}
                renderItem={(item) => (
                  <List.Item
                    actions={[
                      <Button
                        key="remove"
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => {
                          const nextItems = items.filter((cartItem) => cartItem.id !== item.id);
                          dispatch(removeFromCart(item.id));
                          writeUserCollection('cart', user?.id, nextItems);
                        }}
                      >
                        Remove
                      </Button>,
                    ]}
                  >
                    <List.Item.Meta
                      avatar={<img src={item.images?.[0]} alt={item.name} style={{ width: 96, height: 72, objectFit: 'cover', borderRadius: 8 }} />}
                      title={<strong>{item.name}</strong>}
                      description={(
                        <Space wrap>
                          {Number(item.purchasePrice) > 0 && <Tag color="orange">Buy {formatCurrency(item.purchasePrice)}</Tag>}
                          {Number(item.dailyRate) > 0 && <Tag color="green">Rent {formatCurrency(item.dailyRate)}/day</Tag>}
                        </Space>
                      )}
                    />
                  </List.Item>
                )}
              />
            </Card>
          </Col>
          <Col xs={24} lg={8}>
            <Card title="Cart Summary" style={{ borderRadius: 16 }}>
              <p style={{ color: '#64748b' }}>{items.length} equipment item{items.length === 1 ? '' : 's'} saved</p>
              <Button type="primary" block onClick={() => navigate('/marketplace')}>
                Continue Shopping
              </Button>
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
}
