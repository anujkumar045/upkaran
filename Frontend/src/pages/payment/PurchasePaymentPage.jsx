import React, { useState } from 'react';
import { Button, Card, Result, Spin, Upload, message } from 'antd';
import { useNavigate, useParams, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axiosClient from '../../api/axiosClient';
import { formatCurrency } from '../../utils/formatters';
import { UploadOutlined } from '@ant-design/icons';

export default function PurchasePaymentPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const equipment = useSelector((state) => state.equipment.equipments.find(
    (item) => String(item.id) === String(id)
  ));
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [paymentProof, setPaymentProof] = useState(null);

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

      if (!paymentProof) {
        message.error('Please upload your payment proof first.');
        setLoading(false);
        return;
      }
      const formData = new FormData();
      formData.append('payment_id', data.payment_id);
      formData.append('payment_proof', paymentProof);
      await axiosClient.post('/payments/payments/verify/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setCompleted(true);
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
            subTitle={`${equipment.name} payment proof was submitted and is awaiting admin verification.`}
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
        <p style={{ color: '#64748b' }}>Pay using your preferred UPI app, then upload the payment screenshot for admin verification.</p>
        <Upload
          accept="image/*"
          maxCount={1}
          beforeUpload={(file) => { setPaymentProof(file); return false; }}
          onRemove={() => setPaymentProof(null)}
        >
          <Button block icon={<UploadOutlined />}>Upload Payment Screenshot</Button>
        </Upload>
        <Button type="primary" size="large" block loading={loading} disabled={!paymentProof} onClick={handlePayment} style={{ marginTop: 12 }}>
          Submit Payment for Verification
        </Button>
      </Card>
    </div>
  );
}
