import React, { useEffect, useState } from 'react';
import { Card, Table, Tag, Button, Switch, Space, Popconfirm, Empty, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { formatCurrency } from '../../utils/formatters';
import axiosClient from '../../api/axiosClient';

export default function MyEquipmentsPage() {
  const navigate = useNavigate();
  const role = useSelector((state) => state.auth.role);
  const dashboardPath = role === 'dealer' ? '/dashboard/dealer' : '/dashboard/owner';
  const [ownerEquipments, setOwnerEquipments] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadEquipments = () => {
    setLoading(true);
    return axiosClient.get('/marketplace/equipments/?mine=true')
      .then((response) => {
        const results = Array.isArray(response.data)
          ? response.data
          : response.data?.results || [];

        setOwnerEquipments(results.map((item) => ({
          id: item.id,
          name: item.name,
          category: item.category_name || 'Agricultural Equipment',
          location: item.location,
          dailyRate: Number(item.rental_price || 0),
          isAvailable: item.is_available,
        })));
      })
      .catch(() => message.error('Could not load your listed equipment.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadEquipments();
  }, []);

  const deleteEquipment = async (id) => {
    try {
      await axiosClient.delete(`/marketplace/equipments/${id}/`);
      setOwnerEquipments((items) => items.filter((item) => item.id !== id));
      message.success('Equipment listing deleted.');
    } catch (error) {
      message.error(error.response?.data?.detail || 'Could not delete equipment listing.');
    }
  };

  const updateAvailability = async (id, isAvailable) => {
    try {
      await axiosClient.patch(`/marketplace/equipments/${id}/`, { is_available: isAvailable });
      setOwnerEquipments((items) => items.map((item) => (
        item.id === id ? { ...item, isAvailable } : item
      )));
    } catch (error) {
      message.error(error.response?.data?.detail || 'Could not update availability.');
    }
  };

  const columns = [
    { title: 'Machinery Name', dataIndex: 'name', key: 'name', render: (t) => <strong>{t}</strong> },
    { title: 'Category', dataIndex: 'category', key: 'category' },
    { title: 'Location', dataIndex: 'location', key: 'location' },
    { title: 'Daily Rate', dataIndex: 'dailyRate', key: 'dailyRate', render: (r) => <span style={{ fontWeight: 700, color: '#2E7D32' }}>{formatCurrency(r)}/day</span> },
    { title: 'Availability Status', key: 'status', render: (_, record) => <Switch checked={record.isAvailable} onChange={(checked) => updateAvailability(record.id, checked)} checkedChildren="Available" unCheckedChildren="Booked" /> },
    {
      title: 'Action',
      key: 'action',
      render: (_, r) => (
        <Space>
          <Button icon={<EditOutlined />} size="small" onClick={() => navigate(`${dashboardPath}/edit-equipment/${r.id}`)}>Edit</Button>
          <Popconfirm title="Delete listing?" description="This action cannot be undone." onConfirm={() => deleteEquipment(r.id)}>
            <Button icon={<DeleteOutlined />} danger size="small">Delete</Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#0f172a' }} className="brand-font">
            {role === 'dealer' ? 'My Dealer Inventory' : 'My Listed Equipments'}
          </h1>
          <p style={{ color: '#64748b' }}>{role === 'dealer' ? 'Manage franchise products and active rental listings' : 'Manage your tractors, harvesters, and active rental listings'}</p>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate(`${dashboardPath}/add-equipment`)} style={{ background: '#2E7D32' }}>
          Add Equipment
        </Button>
      </div>

      <Card style={{ borderRadius: 20 }}>
        <Table
          loading={loading}
          columns={columns}
          dataSource={ownerEquipments}
          rowKey="id"
          locale={{ emptyText: <Empty description={role === 'dealer' ? 'You have not listed any dealer equipment yet' : 'You have not listed any equipment yet'} /> }}
        />
      </Card>
    </div>
  );
}
