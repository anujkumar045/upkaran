import React, { useState } from 'react';
import { Card, Table, Tag, Button, Modal, Form, Input, InputNumber, Select, Upload, message } from 'antd';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { formatCurrency } from '../../utils/formatters';
import { useDispatch, useSelector } from 'react-redux';
import { addProduct } from '../../store/slices/productSlice';
import axiosClient from '../../api/axiosClient';

export default function ProductsPage() {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.products);
  const user = useSelector((state) => state.auth.user);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productImage, setProductImage] = useState(null);
  const [form] = Form.useForm();

  const ownerName = [user?.first_name, user?.last_name]
    .filter(Boolean)
    .join(' ') || user?.name || user?.username || 'Manufacturer';

  const handleAddProduct = async (values) => {
    try {
      const listingData = new FormData();
      listingData.append('category_label', values.category);
      listingData.append('name', values.name);
      listingData.append('brand', values.name.split(' ')[0]);
      listingData.append('description', values.name);
      listingData.append('price', values.price);
      listingData.append('rental_price', 0);
      listingData.append('condition', 'new');
      listingData.append('location', 'All India');
      listingData.append('quantity', values.stock);
      listingData.append('is_available', true);

      if (productImage) {
        listingData.append('image', productImage);
      }

      await axiosClient.post('/marketplace/equipments/', listingData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

    dispatch(addProduct({
        id: `PROD-${Date.now().toString().slice(-6)}`,
        name: values.name,
        category: values.category,
        price: values.price,
        stock: values.stock,
        status: 'Active',
        ownerName,
    }));
    form.resetFields();
    setProductImage(null);
    setIsModalOpen(false);
    message.success('Product added to your catalog.');
    } catch (error) {
      message.error(error.response?.data?.detail || 'Could not publish product.');
    }
  };

  const columns = [
    { title: 'SKU Code', dataIndex: 'id', key: 'id' },
    { title: 'Product Name', dataIndex: 'name', key: 'name', render: (t) => <strong>{t}</strong> },
    { title: 'Category', dataIndex: 'category', key: 'category' },
    { title: 'MSRP Price', dataIndex: 'price', key: 'price', render: (p) => <span style={{ fontWeight: 700, color: '#2E7D32' }}>{formatCurrency(p)}</span> },
    { title: 'In Stock', dataIndex: 'stock', key: 'stock', render: (s) => <Tag color="blue">{s} units</Tag> },
    { title: 'Showcase Status', dataIndex: 'status', key: 'status', render: (st) => <Tag color="success">{st}</Tag> },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#0f172a' }} className="brand-font">
            Manufacturer Products Catalog
          </h1>
          <p style={{ color: '#64748b' }}>Showcase new models to farmers & deal network</p>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)} style={{ background: '#2E7D32' }}>Add Product</Button>
      </div>

      <Card style={{ borderRadius: 20 }}>
        <Table columns={columns} dataSource={products} rowKey="id" />
      </Card>

      <Modal
        title="Add Product"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        okText="Add Product"
      >
        <Form form={form} layout="vertical" onFinish={handleAddProduct}>
          <Form.Item name="name" label="Product Name" rules={[{ required: true, message: 'Enter product name' }]}>
            <Input placeholder="e.g. 5 HP Solar Pump" />
          </Form.Item>
          <Form.Item name="category" label="Category" rules={[{ required: true, message: 'Select a category' }]}>
            <Select placeholder="Select category">
              <Select.Option value="Solar Pumps">Solar Pumps</Select.Option>
              <Select.Option value="Agri Drones">Agri Drones</Select.Option>
              <Select.Option value="Tractors">Tractors</Select.Option>
              <Select.Option value="Harvesters">Harvesters</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="price" label="MSRP Price" rules={[{ required: true, message: 'Enter price' }]}>
            <InputNumber min={0} style={{ width: '100%' }} placeholder="Enter price" />
          </Form.Item>
          <Form.Item name="stock" label="Stock Units" rules={[{ required: true, message: 'Enter stock quantity' }]}>
            <InputNumber min={0} style={{ width: '100%' }} placeholder="Enter stock units" />
          </Form.Item>
          <Form.Item label="Product Image">
            <Upload
              accept="image/*"
              maxCount={1}
              beforeUpload={(file) => {
                setProductImage(file);
                return false;
              }}
              onRemove={() => setProductImage(null)}
            >
              <Button icon={<UploadOutlined />}>Upload Product Image</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
