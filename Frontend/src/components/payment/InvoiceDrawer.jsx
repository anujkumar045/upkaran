import React from 'react';
import { Drawer, Button, Tag, Divider, Descriptions, Space } from 'antd';
import { PrinterOutlined, DownloadOutlined, CheckCircleFilled } from '@ant-design/icons';
import { formatCurrency, formatDate } from '../../utils/formatters';

export default function InvoiceDrawer({ open, onClose, booking }) {
  if (!booking) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Drawer
      title="UPKARAN Official Rental Invoice"
      placement="right"
      width={600}
      onClose={onClose}
      open={open}
      extra={
        <Space>
          <Button icon={<PrinterOutlined />} onClick={handlePrint}>Print</Button>
          <Button type="primary" icon={<DownloadOutlined />} style={{ background: '#2E7D32' }}>Download PDF</Button>
        </Space>
      }
    >
      <div id="printable-invoice" style={{ padding: 12 }}>
        {/* Header Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 24, fontWeight: 800, color: '#2E7D32' }}>UPKARAN</span>
              <Tag color="success" icon={<CheckCircleFilled />}>PAID RECEIPT</Tag>
            </div>
            <span style={{ fontSize: 12, color: '#64748b' }}>Agri Equipment Rental SaaS</span>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>Invoice #{booking.id}</div>
            <div style={{ fontSize: 12, color: '#64748b' }}>Date: {formatDate(booking.bookedAt)}</div>
          </div>
        </div>

        <Divider style={{ margin: '12px 0' }} />

        {/* Details Grid */}
        <Descriptions title="Transaction Details" column={2} bordered size="small">
          <Descriptions.Item label="Equipment">{booking.equipmentName}</Descriptions.Item>
          <Descriptions.Item label="Machine Owner">{booking.ownerName}</Descriptions.Item>
          <Descriptions.Item label="Rental Duration">{booking.totalDays} Days ({formatDate(booking.startDate)} - {formatDate(booking.endDate)})</Descriptions.Item>
          <Descriptions.Item label="Daily Rate">{formatCurrency(booking.dailyRate)}/day</Descriptions.Item>
          <Descriptions.Item label="Transaction ID"><code>{booking.transactionId}</code></Descriptions.Item>
          <Descriptions.Item label="Payment Status">
            <Tag color="green">{booking.paymentStatus}</Tag>
          </Descriptions.Item>
        </Descriptions>

        <Divider style={{ margin: '20px 0' }} />

        {/* Price Breakdown */}
        <h4 style={{ fontSize: 15, color: '#0f172a', marginBottom: 12 }}>Payment Summary</h4>
        <div style={{ background: '#f8fafc', padding: 16, borderRadius: 12, border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14 }}>
            <span>Subtotal ({booking.totalDays} days x {formatCurrency(booking.dailyRate)})</span>
            <strong>{formatCurrency(booking.subtotal)}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14 }}>
            <span>GST (18%)</span>
            <span>{formatCurrency(booking.tax)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14 }}>
            <span>Platform Service Fee</span>
            <span>{formatCurrency(booking.platformFee)}</span>
          </div>
          <Divider style={{ margin: '10px 0' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 18, fontWeight: 800, color: '#2E7D32' }}>
            <span>Total Paid</span>
            <span>{formatCurrency(booking.totalAmount)}</span>
          </div>
        </div>

        {/* Footer info */}
        <div style={{ marginTop: 30, textAlign: 'center', fontSize: 12, color: '#94a3b8' }}>
          Thank you for using UPKARAN. For support, call 1800-419-8800 or email support@upkaran.com.
        </div>
      </div>
    </Drawer>
  );
}
