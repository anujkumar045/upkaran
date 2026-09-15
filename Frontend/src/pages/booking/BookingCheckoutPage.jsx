import React, { useState } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Row,
  Col,
  Card,
  DatePicker,
  Button,
  Divider,
  Tag,
  Avatar,
  Form,
  Input,
  Space,
  message
} from 'antd';
import {
  CalendarOutlined,
  ThunderboltOutlined,
  EnvironmentOutlined,
  SafetyCertificateOutlined,
  ArrowRightOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { setBookingDraft } from '../../store/slices/bookingSlice';
import { formatCurrency } from '../../utils/formatters';
import axiosClient from '../../api/axiosClient';

const { RangePicker } = DatePicker;

export default function BookingCheckoutPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { equipments } = useSelector((state) => state.equipment);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const equipment = equipments.find((e) => e.id === id) || equipments[0];
  const [dateRange, setDateRange] = useState([
    dayjs().add(2, 'day'),
    dayjs().add(4, 'day')
  ]);
  const [submitting, setSubmitting] = useState(false);
  const ownerName = equipment?.owner?.name || equipment?.owner?.username || 'Verified Machine Owner';

  if (!isAuthenticated) {
    return <Navigate to="/register" replace state={{ from: `/booking/${id}` }} />;
  }

  if (!equipment) {
    return <div style={{ padding: 48, textAlign: 'center' }}>Equipment details are loading...</div>;
  }

  const totalDays = dateRange && dateRange[0] && dateRange[1]
    ? dateRange[1].diff(dateRange[0], 'day') + 1
    : 1;

  const subtotal = totalDays * equipment.dailyRate;
  const tax = Math.round(subtotal * 0.18);
  const platformFee = 150;
  const grandTotal = subtotal + tax + platformFee;

  const handleProceedToPayment = async () => {
    setSubmitting(true);
    try {
      const { data } = await axiosClient.post('/bookings/bookings/', {
        equipment: equipment.id,
        start_date: dateRange[0].format('YYYY-MM-DD'),
        end_date: dateRange[1].format('YYYY-MM-DD'),
      });

      dispatch(setBookingDraft({
        ...data,
        equipmentId: data.equipment,
        equipmentName: data.equipment_name || equipment.name,
        ownerName: data.owner_name || equipment.owner.name,
        startDate: data.start_date,
        endDate: data.end_date,
        totalDays: data.total_days,
        dailyRate: data.daily_rate,
        totalAmount: data.total_amount,
        paymentStatus: data.payment_status,
      }));
      navigate(`/payment/qr/${data.id}`);
    } catch (error) {
      message.error(error.response?.data?.equipment?.[0] || 'Unable to create the booking. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: 1100, margin: '30px auto', padding: '0 24px' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: '#0f172a' }} className="brand-font">
          Complete Equipment Booking
        </h1>
        <p style={{ color: '#64748b' }}>Select dates, review pricing breakdown & proceed to QR payment</p>
      </div>

      <Row gutter={[32, 32]}>
        {/* Left Column: Date Selector & Booking Form */}
        <Col xs={24} lg={14}>
          <Card style={{ borderRadius: 20, marginBottom: 24 }} bodyStyle={{ padding: 28 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', marginBottom: 16 }}>
              1. Select Rental Duration
            </h3>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontWeight: 600, color: '#334155', marginBottom: 8 }}>
                Rental Start & End Dates
              </label>
              <RangePicker
                value={dateRange}
                onChange={(dates) => setDateRange(dates)}
                size="large"
                style={{ width: '100%', borderRadius: 12 }}
                disabledDate={(current) => current && current < dayjs().startOf('day')}
              />
            </div>

            <div style={{ background: '#e8f5e9', padding: 16, borderRadius: 14, border: '1px solid #a5d6a7', marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, color: '#2E7D32' }}>Selected Duration:</span>
                <Tag color="green" style={{ fontSize: 14, fontWeight: 800, padding: '4px 12px' }}>
                  {totalDays} Days Selected
                </Tag>
              </div>
            </div>

            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', marginBottom: 16 }}>
              2. Delivery Address & Operator Preference
            </h3>

            <Form layout="vertical" initialValues={{ deliveryAddress: 'Farm No. 42, Anand, Gujarat', operatorNeeded: true }}>
              <Form.Item name="deliveryAddress" label="Farm Delivery Address">
                <Input.TextArea rows={2} placeholder="Enter village, farm number, landmark..." size="large" />
              </Form.Item>

              <Form.Item name="operatorNeeded" label="Do you need a certified equipment operator?">
                <Tag color="blue" style={{ fontSize: 13, padding: '4px 10px' }}>
                  ✓ Free operator included for rentals over 3 days
                </Tag>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        {/* Right Column: Price Calculator & Summary */}
        <Col xs={24} lg={10}>
          <Card style={{ borderRadius: 20, boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }} bodyStyle={{ padding: 28 }}>
            {/* Equipment Thumbnail */}
            <div style={{ display: 'flex', gap: 16, marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid #f1f5f9' }}>
              <img src={equipment.images[0]} alt={equipment.name} style={{ width: 90, height: 75, objectFit: 'cover', borderRadius: 12 }} />
              <div>
                <Tag color="green" style={{ fontSize: 10, fontWeight: 700 }}>{equipment.category}</Tag>
                <h4 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: '2px 0' }}>{equipment.name}</h4>
                <div style={{ fontSize: 12, color: '#64748b' }}><EnvironmentOutlined /> {equipment.location}</div>
              </div>
            </div>

            {/* Owner Info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <Avatar style={{ background: '#2E7D32' }}>{(ownerName || 'V').charAt(0).toUpperCase()}</Avatar>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{ownerName}</div>
                <div style={{ fontSize: 11, color: '#64748b' }}>Verified Machine Owner</div>
              </div>
            </div>

            <Divider style={{ margin: '16px 0' }} />

            {/* Price Calculator Table */}
            <h4 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 14 }}>
              Payment Summary
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Rental Rate ({totalDays} days x {formatCurrency(equipment.dailyRate)})</span>
                <strong>{formatCurrency(subtotal)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                <span>GST (18% Agricultural Service Tax)</span>
                <span>{formatCurrency(tax)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                <span>Platform Assurance Fee</span>
                <span>{formatCurrency(platformFee)}</span>
              </div>
              <Divider style={{ margin: '10px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 20, fontWeight: 800, color: '#2E7D32' }}>
                <span>Total Amount</span>
                <span>{formatCurrency(grandTotal)}</span>
              </div>
            </div>

            <Button
              type="primary"
              size="large"
              block
              icon={<ThunderboltOutlined />}
              onClick={handleProceedToPayment}
              loading={submitting}
              style={{ background: '#2E7D32', height: 50, fontSize: 16, fontWeight: 700, borderRadius: 12, marginTop: 24 }}
            >
              Proceed to UPI QR Payment <ArrowRightOutlined />
            </Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
