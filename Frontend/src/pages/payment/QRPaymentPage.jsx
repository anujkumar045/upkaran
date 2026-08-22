import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Row,
  Col,
  Card,
  Button,
  Input,
  Tag,
  Upload,
  Result,
  Divider,
  Space,
  message
} from 'antd';
import {
  QrcodeOutlined,
  CopyOutlined,
  UploadOutlined,
  CheckCircleFilled,
  FileTextOutlined,
  ThunderboltOutlined
} from '@ant-design/icons';
import confetti from 'canvas-confetti';
import { createBooking } from '../../store/slices/bookingSlice';
import { formatCurrency, formatDate } from '../../utils/formatters';
import InvoiceDrawer from '../../components/payment/InvoiceDrawer';

export default function QRPaymentPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { currentBookingDraft, bookings } = useSelector((state) => state.booking);
  const activeBooking = currentBookingDraft || bookings.find((b) => b.id === bookingId) || bookings[0];

  const [transactionId, setTransactionId] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [invoiceDrawerOpen, setInvoiceDrawerOpen] = useState(false);

  const handleCopyUPI = () => {
    navigator.clipboard.writeText(activeBooking.ownerUpi || '');
    message.success('UPI ID copied to clipboard!');
  };

  const handleConfirmPayment = () => {
    if (!transactionId) {
      message.error('Please enter the 12-digit UPI Transaction ID / UTR number!');
      return;
    }

    const finalBooking = {
      ...activeBooking,
      status: 'Confirmed',
      paymentStatus: 'Paid',
      transactionId: transactionId || 'TXN9988112233',
    };

    dispatch(createBooking(finalBooking));
    setIsSuccess(true);

    // Confetti animation celebration!
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  return (
    <div style={{ maxWidth: 900, margin: '40px auto', padding: '0 24px' }}>
      {!isSuccess ? (
        <Card style={{ borderRadius: 24, boxShadow: '0 20px 25px -5px rgba(0,0,0,0.08)' }} bodyStyle={{ padding: 36 }}>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <Tag color="gold" style={{ fontWeight: 700, padding: '4px 12px', borderRadius: 10 }}>DIRECT OWNER UPI PAYOUT</Tag>
            <h1 style={{ fontSize: 30, fontWeight: 800, color: '#0f172a', marginTop: 8 }} className="brand-font">
              Scan QR Code to Complete Booking
            </h1>
            <p style={{ color: '#64748b', fontSize: 14 }}>
              Pay directly to Machine Owner <strong>{activeBooking.ownerName}</strong> with 0% platform commission.
            </p>
          </div>

          <Row gutter={[36, 36]} align="middle">
            {/* Left: QR Code Display */}
            <Col xs={24} md={12} style={{ textAlign: 'center' }}>
              <div style={{
                background: 'white',
                padding: 24,
                borderRadius: 20,
                border: '2px dashed #4CAF50',
                display: 'inline-block',
                boxShadow: '0 10px 20px rgba(0,0,0,0.04)'
              }}>
                <img
                  src={activeBooking.ownerQrUrl || ''}
                  alt="Owner Payment QR"
                  style={{ width: 220, height: 220, borderRadius: 12 }}
                />
                <div style={{ marginTop: 12, fontSize: 13, fontWeight: 700, color: '#0f172a' }}>
                  Scan with PhonePe, Google Pay, Paytm, or BHIM
                </div>
              </div>

              {/* Copy UPI VPA */}
              <div style={{ marginTop: 20, background: '#f8fafc', padding: 12, borderRadius: 12, border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 13, color: '#64748b' }}>
                  UPI VPA: <strong style={{ color: '#0f172a' }}>{activeBooking.ownerUpi || 'Not provided'}</strong>
                </span>
                <Button type="default" size="small" icon={<CopyOutlined />} onClick={handleCopyUPI}>
                  Copy VPA
                </Button>
              </div>
            </Col>

            {/* Right: Payment Amount & Transaction Verification */}
            <Col xs={24} md={12}>
              <div style={{ background: '#e8f5e9', padding: 20, borderRadius: 16, border: '1px solid #a5d6a7', marginBottom: 24 }}>
                <div style={{ fontSize: 13, color: '#2E7D32', fontWeight: 700 }}>PAYMENT AMOUNT DUE</div>
                <div style={{ fontSize: 36, fontWeight: 800, color: '#2E7D32' }}>
                  {formatCurrency(activeBooking.totalAmount || 5460)}
                </div>
                <div style={{ fontSize: 12, color: '#475569', marginTop: 4 }}>
                  Includes {activeBooking.totalDays || 3} days rental for {activeBooking.equipmentName}
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>
                  Enter 12-Digit Transaction Ref / UTR Number
                </label>
                <Input
                  placeholder="e.g. TXN9988112233 or UTR 421980776512"
                  size="large"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  style={{ borderRadius: 12 }}
                />
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', fontWeight: 600, color: '#475569', marginBottom: 6 }}>
                  Upload Payment Screenshot (Optional)
                </label>
                <Upload maxCount={1} beforeUpload={() => false}>
                  <Button icon={<UploadOutlined />} block style={{ borderRadius: 10 }}>
                    Select Payment Screenshot Image
                  </Button>
                </Upload>
              </div>

              <Button
                type="primary"
                size="large"
                block
                icon={<ThunderboltOutlined />}
                onClick={handleConfirmPayment}
                style={{ background: '#2E7D32', height: 50, fontSize: 16, fontWeight: 700, borderRadius: 12 }}
              >
                Submit Payment Verification
              </Button>
            </Col>
          </Row>
        </Card>
      ) : (
        <Card style={{ borderRadius: 24, textAlign: 'center' }} bodyStyle={{ padding: 48 }}>
          <Result
            status="success"
            title="Rental Booking Confirmed!"
            subTitle={`Your booking ${activeBooking.id} for ${activeBooking.equipmentName} has been confirmed. Transaction ID: ${transactionId || 'TXN9988112233'}`}
            extra={[
              <Button type="primary" key="invoice" icon={<FileTextOutlined />} style={{ background: '#2E7D32' }} onClick={() => setInvoiceDrawerOpen(true)}>
                View & Print Official Receipt
              </Button>,
              <Button key="dashboard" onClick={() => navigate('/dashboard/farmer/bookings')}>
                Go to My Bookings
              </Button>
            ]}
          />
        </Card>
      )}

      {/* Invoice Drawer */}
      <InvoiceDrawer
        open={invoiceDrawerOpen}
        onClose={() => setInvoiceDrawerOpen(false)}
        booking={activeBooking}
      />
    </div>
  );
}
