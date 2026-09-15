import React, { useEffect, useState } from 'react';
import { Button, Card, Result, Spin, Tag, message } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { SafetyCertificateOutlined, ThunderboltOutlined } from '@ant-design/icons';
import axiosClient from '../../api/axiosClient';
import { formatCurrency } from '../../utils/formatters';
import InvoiceDrawer from '../../components/payment/InvoiceDrawer';

const RAZORPAY_SCRIPT = 'https://checkout.razorpay.com/v1/checkout.js';

export default function QRPaymentPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { currentBookingDraft, bookings } = useSelector((state) => state.booking);
  const { user } = useSelector((state) => state.auth);
  const activeBooking = currentBookingDraft || bookings.find((booking) => String(booking.id) === String(bookingId));
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [invoiceDrawerOpen, setInvoiceDrawerOpen] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = RAZORPAY_SCRIPT;
    script.async = true;
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, []);

  const amount = activeBooking?.totalAmount ?? activeBooking?.total_amount;

  const handlePayment = async () => {
    if (!activeBooking?.id || !amount) {
      message.error('Booking details are unavailable. Please return to checkout.');
      return;
    }

    setLoading(true);
    try {
      const { data } = await axiosClient.post('/payments/payments/create-order/', {
        booking: activeBooking.id,
      });

      if (!window.Razorpay) throw new Error('Razorpay is still loading. Please try again.');

      const razorpay = new window.Razorpay({
        key: data.key_id,
        amount: data.amount,
        currency: data.currency,
        name: 'UPKARAN',
        description: `${activeBooking.equipmentName || activeBooking.equipment_name} rental`,
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
            setTransactionId(response.razorpay_payment_id);
            setCompleted(true);
          } catch (error) {
            message.error(error.response?.data?.error || 'Payment verification failed.');
          } finally {
            setLoading(false);
          }
        },
        modal: { ondismiss: () => setLoading(false) },
        theme: { color: '#2E7D32' },
      });
      razorpay.open();
    } catch (error) {
      message.error(error.response?.data?.error || error.message || 'Unable to start payment.');
      setLoading(false);
    }
  };

  if (!activeBooking) {
    return <div style={{ padding: 48, textAlign: 'center' }}><Spin /> Loading booking details...</div>;
  }

  if (completed) {
    return (
      <div style={{ maxWidth: 700, margin: '60px auto', padding: '0 24px' }}>
        <Card style={{ borderRadius: 20 }}>
          <Result
            status="success"
            title="Payment Successful"
            subTitle={`Booking ${activeBooking.id} is paid. Razorpay payment ID: ${transactionId}`}
            extra={[
              <Button type="primary" key="invoice" onClick={() => setInvoiceDrawerOpen(true)}>View Receipt</Button>,
              <Button key="dashboard" onClick={() => navigate('/dashboard/farmer/bookings')}>Go to My Bookings</Button>,
            ]}
          />
        </Card>
        <InvoiceDrawer open={invoiceDrawerOpen} onClose={() => setInvoiceDrawerOpen(false)} booking={activeBooking} />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 700, margin: '60px auto', padding: '0 24px' }}>
      <Card style={{ borderRadius: 20 }} bodyStyle={{ padding: 36 }}>
        <div style={{ textAlign: 'center' }}>
          <Tag color="green">SECURE RAZORPAY PAYMENT</Tag>
          <h1 className="brand-font">Pay for your booking</h1>
          <p style={{ color: '#64748b' }}>
            Your payment is collected by UPKARAN through Razorpay. The admin will settle the owner payout separately.
          </p>
          <div style={{ margin: '28px 0', padding: 20, background: '#e8f5e9', borderRadius: 16 }}>
            <div style={{ color: '#2E7D32', fontWeight: 700 }}>AMOUNT DUE</div>
            <div style={{ fontSize: 38, fontWeight: 800, color: '#2E7D32' }}>{formatCurrency(amount)}</div>
            <div style={{ color: '#475569' }}>{activeBooking.equipmentName || activeBooking.equipment_name}</div>
          </div>
          <Button type="primary" size="large" block loading={loading} icon={<ThunderboltOutlined />} onClick={handlePayment}>
            Pay Securely with Razorpay
          </Button>
          <div style={{ marginTop: 18, color: '#64748b', fontSize: 13 }}>
            <SafetyCertificateOutlined /> Secure checkout with UPI, cards and net banking
          </div>
        </div>
      </Card>
    </div>
  );
}
