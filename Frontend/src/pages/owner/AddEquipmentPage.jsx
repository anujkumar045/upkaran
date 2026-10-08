import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Card, Select, InputNumber, Upload, Row, Col, message } from 'antd';
import { UploadOutlined, PlusOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addEquipment } from '../../store/slices/equipmentSlice';
import { CATEGORIES } from '../../constants/mockData';
import axiosClient from '../../api/axiosClient';

export default function AddEquipmentPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  const { role, user } = useSelector((state) => state.auth);
  const dashboardPath = role === 'dealer' ? '/dashboard/dealer' : '/dashboard/owner';
  const [equipmentImages, setEquipmentImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [equipmentVideo, setEquipmentVideo] = useState(null);
  const [equipmentVideoPreviewUrl, setEquipmentVideoPreviewUrl] = useState('');
  const [existingVideoUrl, setExistingVideoUrl] = useState('');
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(Boolean(id));
  const [isAvailable, setIsAvailable] = useState(true);

  useEffect(() => {
    if (!equipmentVideo) {
      setEquipmentVideoPreviewUrl('');
      return undefined;
    }

    const previewUrl = URL.createObjectURL(equipmentVideo);
    setEquipmentVideoPreviewUrl(previewUrl);
    return () => URL.revokeObjectURL(previewUrl);
  }, [equipmentVideo]);

  useEffect(() => {
    if (!id) return;

    axiosClient.get(`/marketplace/equipments/${id}/`)
      .then(({ data }) => {
        const apiOrigin = (
          import.meta.env.VITE_API_BASE_URL ||
          'http://127.0.0.1:8000/api/'
        ).replace(/\/api\/?$/, '');
        const videoUrl = data.video
          ? data.video.startsWith('http')
            ? data.video
            : `${apiOrigin}/${data.video.replace(/^\//, '')}`
          : '';
        const imageValues = Array.isArray(data.images) && data.images.length
          ? data.images
          : [data.image_url || data.image].filter(Boolean);
        const imageUrls = imageValues.map((image) => (
          image.startsWith('http')
            ? image
            : `${apiOrigin}/${image.replace(/^\//, '')}`
        ));

        form.setFieldsValue({
          name: data.name,
          category: data.category_name,
          location: data.location,
          dailyRate: Number(data.rental_price || 0),
          purchasePrice: Number(data.price || 0),
          condition: data.condition === 'new' ? 'Like New' : 'Good',
          imageUrl: data.image_url || '',
          description: data.description,
        });
        setExistingImages(imageUrls);
        setExistingVideoUrl(videoUrl);
        setIsAvailable(data.is_available);
      })
      .catch(() => {
        message.error('Could not load this equipment listing.');
        navigate(`${dashboardPath}/equipments`);
      })
      .finally(() => setLoading(false));
  }, [id, form, navigate, dashboardPath]);

  const onFinish = async (values) => {
    const rentalPrice = Number(values.dailyRate || 0);
    const salePrice = Number(values.purchasePrice || 0);
    const listingType = rentalPrice > 0 && salePrice > 0
      ? 'Rental & Sale'
      : rentalPrice > 0
        ? 'For Rent'
        : 'For Sale';

    const equipmentSpecs = {
      fuelType: values.fuelType || 'Diesel',
      year: '2024'
    };

    if (values.hp) {
      equipmentSpecs.power = `${values.hp} HP`;
    }

    const newEq = {
      id: `eq-${Date.now()}`,
      name: values.name,
      category: values.category,
      type: listingType,
      condition: values.condition === 'Like New' ? 'new' : 'used',
      location: values.location,
      state: values.state || 'Punjab',
      dailyRate: rentalPrice,
      hourlyRate: Math.round(rentalPrice / 6),
      purchasePrice: salePrice,
      rating: 5.0,
      reviewCount: 1,
      images: [
        values.imageUrl || 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=900&q=80'
      ],
      specs: equipmentSpecs,
      description: values.description,
      owner: {
        id: 'owner-current',
        name: user?.name || user?.username || 'Equipment Owner',
        phone: '+91 98980 12345',
        rating: 5.0,
        totalListings: 4,
        joined: '2024',
        upiId: ''
      },
      availability: ['Always Available'],
      featured: true,
    };

    try {
      const listingData = new FormData();
      listingData.append('category_label', values.category);
      listingData.append('name', values.name);
      listingData.append('brand', values.name.split(' ')[0]);
      listingData.append('description', values.description);
      listingData.append('price', salePrice);
      listingData.append('rental_price', rentalPrice);
      listingData.append('condition', newEq.condition);
      listingData.append('location', values.location);
      listingData.append('quantity', 1);
      listingData.append('is_available', id ? isAvailable : true);
      listingData.append('image_url', values.imageUrl || '');

      equipmentImages.forEach((file, index) => {
        listingData.append(`additional_images[${index}]`, file);
      });
      if (equipmentVideo) {
        listingData.append('video', equipmentVideo);
      }

      const request = id
        ? axiosClient.put(`/marketplace/equipments/${id}/`, listingData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          timeout: 120000,
        })
        : axiosClient.post('/marketplace/equipments/', listingData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          timeout: 120000,
        });

      await request;
      if (!id) {
        dispatch(addEquipment(newEq));
      }
      message.success(id ? 'Equipment listing updated.' : 'Equipment published to the marketplace.');
      navigate(`${dashboardPath}/equipments`);
    } catch (error) {
      const data = error.response?.data;
      const firstError = data && Object.values(data).flat()[0];
      message.error(firstError || data?.detail || (id ? 'Could not update equipment.' : 'Could not publish equipment.'));
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: '#0f172a' }} className="brand-font">
          {id ? 'Edit Equipment Listing' : 'List New Agricultural Equipment'}
        </h1>
        <p style={{ color: '#64748b' }}>Provide specs, daily rental pricing, and photos of your machinery</p>
      </div>

      <Card style={{ borderRadius: 20, boxShadow: '0 10px 20px rgba(0,0,0,0.03)' }} bodyStyle={{ padding: 32 }}>
        <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ type: 'Rental', condition: 'Excellent', fuelType: 'Diesel' }}>
          <Form.Item name="name" label="Equipment Title / Model Name" rules={[{ required: true, message: 'Please enter machinery title!' }]}>
            <Input placeholder="e.g. John Deere 5310 55 HP 4WD Tractor" size="large" />
          </Form.Item>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item name="category" label="Category" rules={[{ required: true }]}>
                <Select size="large" placeholder="Select Category">
                  {CATEGORIES.map((c) => (
                    <Select.Option key={c.id} value={c.name}>{c.icon} {c.name}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item name="location" label="Location (District, State)" rules={[{ required: true }]}>
                <Input placeholder="e.g. Ludhiana, Punjab" size="large" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item name="dailyRate" label="Daily Rental Rate (INR ₹) - Optional">
                <InputNumber style={{ width: '100%' }} size="large" placeholder="Leave empty if sale only" min={0} />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item name="purchasePrice" label="Selling Price (Optional if for Sale)">
                <InputNumber style={{ width: '100%' }} size="large" placeholder="e.g. 750000" min={0} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item name="hp" label="Horsepower (HP) - Optional" tooltip="Leave blank if the equipment does not have a horsepower rating.">
                <Input placeholder="e.g. 55 HP (optional)" size="large" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item name="condition" label="Machine Condition">
                <Select size="large">
                  <Select.Option value="Like New">Brand New / Like New</Select.Option>
                  <Select.Option value="Excellent">Excellent</Select.Option>
                  <Select.Option value="Good">Good Working Condition</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Equipment Photos">
            <Upload
              accept="image/*"
              multiple
              listType="picture"
              showUploadList={{ showPreviewIcon: true }}
              beforeUpload={(file) => {
                setEquipmentImages((images) => [...images, file]);
                return false;
              }}
              onRemove={(file) => {
                setEquipmentImages((images) => images.filter((image) => image.uid !== file.uid));
              }}
            >
              <Button icon={<UploadOutlined />}>Upload Equipment Photos</Button>
            </Upload>
            {existingImages.length > 0 && (
              <div
                aria-label="Current equipment photos"
                style={{ display: 'flex', gap: 12, overflowX: 'auto', padding: '12px 0' }}
              >
                {existingImages.map((imageUrl, index) => (
                  <img
                    key={`${imageUrl}-${index}`}
                    src={imageUrl}
                    alt={`Equipment photo ${index + 1}`}
                    style={{
                      width: 120,
                      height: 90,
                      objectFit: 'cover',
                      borderRadius: 10,
                      flex: '0 0 auto',
                    }}
                  />
                ))}
              </div>
            )}
          </Form.Item>

          <Form.Item
            name="imageUrl"
            label="Or paste an online image URL"
            rules={[{ type: 'url', message: 'Please enter a valid image URL.' }]}
          >
            <Input placeholder="https://example.com/equipment-image.jpg" />
          </Form.Item>

          <Form.Item label="Equipment Video (optional, up to 15 seconds)">
            <Upload
              accept="video/*"
              maxCount={1}
              beforeUpload={(file) => new Promise((resolve) => {
                if (!file.type.startsWith('video/')) {
                  message.error('Please choose a video file.');
                  resolve(false);
                  return;
                }

                const previewUrl = URL.createObjectURL(file);
                const videoElement = document.createElement('video');
                videoElement.preload = 'metadata';
                videoElement.onloadedmetadata = () => {
                  URL.revokeObjectURL(previewUrl);
                  if (!Number.isFinite(videoElement.duration)) {
                    message.error('Could not read the video duration.');
                  } else if (videoElement.duration > 15) {
                    message.error('The equipment video must be 15 seconds or shorter.');
                  } else {
                    setEquipmentVideo(file);
                  }
                  resolve(false);
                };
                videoElement.onerror = () => {
                  URL.revokeObjectURL(previewUrl);
                  message.error('Could not read this video file.');
                  resolve(false);
                };
                videoElement.src = previewUrl;
              })}
              onRemove={() => setEquipmentVideo(null)}
            >
              <Button icon={<UploadOutlined />}>
                {equipmentVideo ? 'Replace Equipment Video' : 'Upload Equipment Video'}
              </Button>
            </Upload>
            {(equipmentVideo || existingVideoUrl) && (
              <video
                controls
                src={equipmentVideo ? equipmentVideoPreviewUrl : existingVideoUrl}
                style={{ display: 'block', marginTop: 12, maxWidth: '100%', maxHeight: 240 }}
              />
            )}
          </Form.Item>

          <Form.Item name="description" label="Detailed Description & Operator Availability" rules={[{ required: true }]}>
            <Input.TextArea rows={4} placeholder="Describe machine maintenance status, accessories included (plow/rotavator), and operator availability..." />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" block loading={loading} style={{ background: '#2E7D32', height: 48, fontWeight: 700 }}>
              {id ? 'Update Equipment Listing' : 'Publish Equipment Listing'} <CheckCircleOutlined />
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
