
import React, { useState } from 'react';
import { Button, Card, Result, Spin, Tag, message } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  SafetyCertificateOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';

import axiosClient from '../../api/axiosClient';
import { formatCurrency } from '../../utils/formatters';
import InvoiceDrawer from '../../components/payment/InvoiceDrawer';
import { QRCodeSVG } from "qrcode.react";

export default function QRPaymentPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const { currentBookingDraft, bookings } = useSelector(
    (state) => state.booking
  );

  const activeBooking =
    currentBookingDraft ||
    bookings.find(
      (booking) => String(booking.id) === String(bookingId)
    );

  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [paymentReference, setPaymentReference] = useState('');
  const [invoiceDrawerOpen, setInvoiceDrawerOpen] = useState(false);

  const amount =
    activeBooking?.totalAmount ??
    activeBooking?.total_amount;

  const handleDummyPayment = async () => {
    if (!activeBooking?.id || !amount) {
      message.error(
        'Booking details are unavailable. Please return to checkout.'
      );
      return;
    }

    setLoading(true);

    try {
      /*
       * DEMO PAYMENT
       * No real money is transferred.
       */

      const response = await axiosClient.post(
        '/payments/payments/demo-payment/',
        {
          booking: activeBooking.id,
          amount: amount,
        }
      );

      setPaymentReference(
        response.data.payment_reference ||
        `DEMO_UPI_${Date.now()}`
      );

      setCompleted(true);

      message.success('Demo payment completed successfully!');
    } catch (error) {
      message.error(
        error.response?.data?.error ||
        'Demo payment failed.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (!activeBooking) {
    return (
      <div
        style={{
          padding: 48,
          textAlign: 'center',
        }}
      >
        <Spin />
        Loading booking details...
      </div>
    );
  }

  /*
   * PAYMENT SUCCESS
   */
  if (completed) {
    return (
      <div
        style={{
          maxWidth: 700,
          margin: '60px auto',
          padding: '0 24px',
        }}
      >
        <Card style={{ borderRadius: 20 }}>
          <Result
            status="success"
            icon={<CheckCircleOutlined />}
            title="Demo Payment Successful"
            subTitle={
              <>
                Booking <b>#{activeBooking.id}</b> has been
                successfully paid using the demo payment system.
                <br />
                Reference: <b>{paymentReference}</b>
              </>
            }
            extra={[
              <Button
                type="primary"
                key="invoice"
                onClick={() => setInvoiceDrawerOpen(true)}
              >
                View Receipt
              </Button>,

              <Button
                key="dashboard"
                onClick={() =>
                  navigate('/dashboard/farmer/bookings')
                }
              >
                Go to My Bookings
              </Button>,
            ]}
          />
        </Card>

        <InvoiceDrawer
          open={invoiceDrawerOpen}
          onClose={() => setInvoiceDrawerOpen(false)}
          booking={activeBooking}
        />
      </div>
    );
  }

  /*
   * PAYMENT PAGE
   */
  return (
    <div
      style={{
        maxWidth: 700,
        margin: '60px auto',
        padding: '0 24px',
      }}
    >
      <Card
        style={{ borderRadius: 20 }}
        bodyStyle={{ padding: 36 }}
      >
        <div style={{ textAlign: 'center' }}>

          <Tag color="blue">
            DEMO UPI PAYMENT
          </Tag>

          <h1 className="brand-font">
            Pay for your booking
          </h1>

          <p style={{ color: '#64748b' }}>
            This is a demo payment system for the UPKARAN
            project. No real money will be charged.
          </p>

          {/* AMOUNT */}
          <div
            style={{
              margin: '28px 0',
              padding: 20,
              background: '#e8f5e9',
              borderRadius: 16,
            }}
          >
            <div
              style={{
                color: '#2E7D32',
                fontWeight: 700,
              }}
            >
              AMOUNT DUE
            </div>

            <div
              style={{
                fontSize: 38,
                fontWeight: 800,
                color: '#2E7D32',
              }}
            >
              {formatCurrency(amount)}
            </div>

            <div style={{ color: '#475569' }}>
              {activeBooking.equipmentName ||
                activeBooking.equipment_name}
            </div>
          </div>

          {/* QR */}
          <div
  style={{
    margin: "20px auto",
    width: 250,
    padding: 20,
    border: "1px solid #e2e8f0",
    borderRadius: 16,
    background: "#fff",
  }}
>
  <QRCodeSVG
    value={`UPKARAN-DEMO-PAYMENT-${activeBooking.id}`}
    size={210}
    level="H"
  />

  <div
    style={{
      marginTop: 12,
      fontWeight: 700,
      color: "#2563eb",
    }}
  >
    DEMO QR — TEST ONLY
  </div>
</div>
          <p
            style={{
              color: '#64748b',
              fontSize: 13,
              marginTop: 10,
            }}
          >
            Scan the QR for demonstration purposes only.
            <br />
            No real payment will be processed.
          </p>

          {/* PAYMENT BUTTON */}
          <Button
            type="primary"
            size="large"
            block
            loading={loading}
            onClick={handleDummyPayment}
            style={{ marginTop: 20 }}
          >
            <CheckCircleOutlined />
            I Have Completed Payment
          </Button>

          <div
            style={{
              marginTop: 18,
              color: '#64748b',
              fontSize: 13,
            }}
          >
            <SafetyCertificateOutlined /> Demo payment —
            no real money is transferred.
          </div>

        </div>
      </Card>
    </div>
  );
}
