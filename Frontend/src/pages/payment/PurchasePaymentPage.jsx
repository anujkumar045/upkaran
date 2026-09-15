import React, { useEffect, useState } from 'react';
import { Button, Card, Result, Spin, message } from 'antd';
import { useNavigate, useParams, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axiosClient from '../../api/axiosClient';
import { formatCurrency } from '../../utils/formatters';

const RAZORPAY_SCRIPT = 'https://checkout.razorpay.com/v1/checkout.js';

export default function PurchasePaymentPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const equipment = useSelector((state) => state.equipment.equipments.find(
    (item) => String(item.id) === String(id)
  ));
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (!equipment || !equipment.purchasePrice) return undefined;

    const script = document.createElement('script');
    script.src = RAZORPAY_SCRIPT;
    script.async = true;
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, [equipment]);

  if (!isAuthenticated) {
    return <Navigate to="/register" replace state={{ from: `/payment/purchase/${id}` }} />;
  }

  const handlePayment = async () => {
    if (!equipment?.purchasePrice) {
      message.error('Purchase details are unavailable. Please return to the marketplace.');
      return;
    }

    setLoading(true);
    try {
      const { data } = await axiosClient.post('/payments/payments/create-purchase-order/', {
        equipment: equipment.id,
      });

      if (!window.Razorpay) {
        throw new Error('Payment gateway is still loading. Please try again.');
      }

      const razorpay = new window.Razorpay({
        key: data.key_id,
        amount: data.amount,
        currency: data.currency,
        name: 'UPKARAN',
        description: equipment.name,
        order_id: data.razorpay_order_id,
        prefill: {
          name: [user?.first_name, user?.last_name].filter(Boolean).join(' ') || user?.username,
          email: user?.email,
          contact: user?.phone,
        },
        handler: async (response) => {
          try {
            await axiosClient.post('/payments/payments/verify/', {
              payment_id: data.payment_id,
              ...response,
            });
            setCompleted(true);
          } catch (error) {
            message.error(error.response?.data?.error || 'Payment verification failed.');
          }
        },
        modal: {
          ondismiss: () => setLoading(false),
        },
        theme: { color: '#2E7D32' },
      });

      razorpay.open();
    } catch (error) {
      message.error(error.response?.data?.error || error.message || 'Unable to start payment.');
      setLoading(false);
    }
  };

  if (completed) {
    return (
      <div style={{ maxWidth: 700, margin: '60px auto', padding: '0 24px' }}>
        <Card style={{ borderRadius: 20 }}>
          <Result
            status="success"
            title="Payment Successful"
            subTitle={`${equipment.name} purchase payment was received by UPKARAN.`}
            extra={<Button type="primary" onClick={() => navigate('/marketplace')}>Return to Marketplace</Button>}
          />
        </Card>
      </div>
    );
  }

  if (!equipment) {
    return <div style={{ padding: 48, textAlign: 'center' }}><Spin /> Loading purchase details...</div>;
  }

  return (
    <div style={{ maxWidth: 700, margin: '60px auto', padding: '0 24px' }}>
      <Card style={{ borderRadius: 20 }}>
        <h1 className="brand-font">Complete Purchase</h1>
        <p style={{ color: '#64748b' }}>{equipment.name}</p>
        <p style={{ fontSize: 28, fontWeight: 800, color: '#2E7D32' }}>{formatCurrency(equipment.purchasePrice)}</p>
        <p style={{ color: '#64748b' }}>Payment will be securely collected into the UPKARAN admin Razorpay account.</p>
        <Button type="primary" size="large" block loading={loading} onClick={handlePayment}>
          Pay Securely with Razorpay
        </Button>
      </Card>
    </div>
  );
}
