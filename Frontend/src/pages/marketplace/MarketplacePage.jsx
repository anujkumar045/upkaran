import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Row,
  Col,
  Input,
  Select,
  Slider,
  Radio,
  Card,
  Button,
  Pagination,
  Tag,
  Drawer,
  Space
} from 'antd';
import {
  FilterOutlined,
  SearchOutlined,
  ReloadOutlined,
  EnvironmentOutlined,
  AppstoreOutlined
} from '@ant-design/icons';
import ProductCard from '../../components/common/ProductCard';
import EmptyState from '../../components/common/EmptyState';
import { CATEGORIES } from '../../constants/mockData';
import { formatCurrency } from '../../utils/formatters';
import axiosClient from '../../api/axiosClient';

const { Search } = Input;

const getMediaUrl = (value, apiOrigin) => {
  if (!value) {
    return 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=900&q=80';
  }
  return value.startsWith('http') ? value : `${apiOrigin}/${value.replace(/^\//, '')}`;
};

const getEquipmentImages = (item, apiOrigin) => {
  const images = Array.isArray(item.images) && item.images.length
    ? item.images
    : [item.image_url || item.image].filter(Boolean);
  return images.length
    ? images.map((image) => getMediaUrl(image, apiOrigin))
    : [getMediaUrl('', apiOrigin)];
};

const getListingType = (salePrice, rentalPrice) => {
  const hasSalePrice = Number(salePrice || 0) > 0;
  const hasRentalPrice = Number(rentalPrice || 0) > 0;

  if (hasSalePrice && hasRentalPrice) return 'Rental & Sale';
  if (hasRentalPrice) return 'For Rent';
  return 'For Sale';
};

export default function MarketplacePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [remoteEquipments, setRemoteEquipments] = useState([]);

  useEffect(() => {
    let active = true;

    axiosClient.get('/marketplace/equipments/')
      .then((response) => {
        if (!active) return;

        const apiOrigin = (
          import.meta.env.VITE_API_BASE_URL ||
          'http://127.0.0.1:8000/api/'
        ).replace(/\/api\/?$/, '');

        const equipmentResults = Array.isArray(response.data)
          ? response.data
          : response.data?.results || [];

        setRemoteEquipments(equipmentResults.map((item) => ({
          id: String(item.id),
          name: item.name,
          category: item.category_name || 'Agricultural Equipment',
          type: getListingType(item.price, item.rental_price),
          condition: item.condition,
          location: item.location,
          state: 'All',
          dailyRate: Number(item.rental_price || 0),
          hourlyRate: Math.round(Number(item.rental_price || 0) / 6),
          purchasePrice: Number(item.price ?? item.purchase_price ?? 0),
          rating: Number(item.average_rating || 0),
          reviewCount: 0,
          images: getEquipmentImages(item, apiOrigin),
          videoUrl: item.video ? getMediaUrl(item.video, apiOrigin) : '',
          specs: { Quantity: `${item.quantity} units`, Brand: item.brand },
          owner: {
            name: item.owner_name || item.owner || 'Marketplace Seller',
            phone: item.owner_phone || '',
          },
          featured: false,
        })));
      })
      .catch(() => {
        if (active) setRemoteEquipments([]);
      });

    return () => {
      active = false;
    };
  }, []);

  const allMarketplaceItems = remoteEquipments;

  const [query, setQuery] = useState(searchParams.get('search') || '');
  const [selectedCat, setSelectedCat] = useState(searchParams.get('category') || 'All');
  const [selectedState, setSelectedState] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [maxPrice, setMaxPrice] = useState(50000);
  const [sortBy, setSortBy] = useState('featured');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  // Filtering Logic
  const filteredEquipments = useMemo(() => {
    return allMarketplaceItems.filter((item) => {
      const matchesQuery = !query || item.name.toLowerCase().includes(query.toLowerCase()) || item.location.toLowerCase().includes(query.toLowerCase());
      const matchesCat = selectedCat === 'All' || item.category === selectedCat;
      const matchesState = selectedState === 'All' || item.state === selectedState;
      const matchesType = selectedType === 'All' || item.type.includes(selectedType);
      const matchesPrice = item.dailyRate <= maxPrice || item.dailyRate === 0;

      return matchesQuery && matchesCat && matchesState && matchesType && matchesPrice;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.dailyRate - b.dailyRate;
      if (sortBy === 'price-high') return b.dailyRate - a.dailyRate;
      if (sortBy === 'rating') return b.rating - a.rating;
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [allMarketplaceItems, query, selectedCat, selectedState, selectedType, maxPrice, sortBy]);

  const paginatedEquipments = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredEquipments.slice(start, start + pageSize);
  }, [filteredEquipments, currentPage]);

  const handleResetFilters = () => {
    setQuery('');
    setSelectedCat('All');
    setSelectedState('All');
    setSelectedType('All');
    setMaxPrice(50000);
    setSortBy('featured');
  };

  const filterSidebarContent = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Category Filter */}
      <div>
        <h4 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', marginBottom: 12 }}>Categories</h4>
        <Radio.Group value={selectedCat} onChange={(e) => setSelectedCat(e.target.value)} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Radio value="All">All Categories ({allMarketplaceItems.length})</Radio>
          {CATEGORIES.map((c) => (
            <Radio key={c.id} value={c.name}>
              {c.icon} {c.name}
            </Radio>
          ))}
        </Radio.Group>
      </div>

      {/* Listing Type */}
      <div>
        <h4 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', marginBottom: 12 }}>Listing Type</h4>
        <Radio.Group value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
          <Radio.Button value="All">All</Radio.Button>
          <Radio.Button value="Rent">For Rent</Radio.Button>
          <Radio.Button value="Sale">For Sale</Radio.Button>
        </Radio.Group>
      </div>

      {/* Location Filter */}
      <div>
        <h4 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', marginBottom: 12 }}>State / Region</h4>
        <Select value={selectedState} onChange={setSelectedState} style={{ width: '100%' }}>
          <Select.Option value="All">All India</Select.Option>
          <Select.Option value="Punjab">Punjab</Select.Option>
          <Select.Option value="Haryana">Haryana</Select.Option>
          <Select.Option value="Maharashtra">Maharashtra</Select.Option>
          <Select.Option value="Gujarat">Gujarat</Select.Option>
          <Select.Option value="Tamil Nadu">Tamil Nadu</Select.Option>
          <Select.Option value="Madhya Pradesh">Madhya Pradesh</Select.Option>
        </Select>
      </div>

      {/* Max Daily Rate Slider */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <h4 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: 0 }}>Max Daily Rate</h4>
          <strong style={{ color: '#2E7D32' }}>{formatCurrency(maxPrice)}/day</strong>
        </div>
        <Slider
          min={500}
          max={50000}
          step={500}
          value={maxPrice}
          onChange={setMaxPrice}
          tooltip={{ formatter: (val) => formatCurrency(val) }}
        />
      </div>

      <Button icon={<ReloadOutlined />} onClick={handleResetFilters} block>
        Reset All Filters
      </Button>
    </div>
  );

  return (
    <div style={{ maxWidth: 1320, margin: '30px auto', padding: '0 24px' }}>
      {/* Header Bar */}
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: '#0f172a', margin: 0 }} className="brand-font">
            Agricultural Machinery Marketplace
          </h1>
          <p style={{ color: '#64748b', fontSize: 14, margin: 0 }}>
            Showing {filteredEquipments.length} verified listings available across India
          </p>
        </div>

        <Space wrap className="marketplace-controls">
          {/* Mobile Filter Button */}
          <Button
            icon={<FilterOutlined />}
            onClick={() => setMobileFilterOpen(true)}
            className="mobile-only"
            type="primary"
            style={{ background: '#2E7D32' }}
          >
            Filters
          </Button>

          {/* Sort By Dropdown */}
          <Select value={sortBy} onChange={setSortBy} className="marketplace-sort" style={{ width: 200 }}>
            <Select.Option value="featured">⚡ Featured & Recommended</Select.Option>
            <Select.Option value="price-low">Price: Low to High</Select.Option>
            <Select.Option value="price-high">Price: High to Low</Select.Option>
            <Select.Option value="rating">Top Rated Only</Select.Option>
          </Select>
        </Space>
      </div>

      {/* Search Input Bar */}
      <div style={{ marginBottom: 32 }}>
        <Input
          placeholder="Search by equipment model, brand, or village city..."
          prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          size="large"
          allowClear
          style={{ borderRadius: 14, boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}
        />
      </div>

      {/* Main Grid Layout */}
      <Row gutter={[32, 32]}>
        {/* Desktop Sidebar Filters */}
        <Col xs={0} lg={6}>
          <Card
            style={{ borderRadius: 18, border: '1px solid #e2e8f0', position: 'sticky', top: 96 }}
            bodyStyle={{ padding: 24 }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, paddingBottom: 12, borderBottom: '1px solid #f1f5f9' }}>
              <span style={{ fontSize: 16, fontWeight: 800, color: '#0f172a' }}>Filter Machinery</span>
              <FilterOutlined style={{ color: '#2E7D32' }} />
            </div>
            {filterSidebarContent}
          </Card>
        </Col>

        {/* Product Cards Area */}
        <Col xs={24} lg={18}>
          {paginatedEquipments.length > 0 ? (
            <>
              <Row gutter={[24, 24]}>
                {paginatedEquipments.map((eq) => (
                  <Col xs={24} sm={12} md={8} key={eq.id}>
                    <ProductCard equipment={eq} />
                  </Col>
                ))}
              </Row>

              {/* Pagination */}
              <div style={{ marginTop: 40, textAlign: 'center' }}>
                <Pagination
                  current={currentPage}
                  pageSize={pageSize}
                  total={filteredEquipments.length}
                  onChange={(page) => setCurrentPage(page)}
                  showSizeChanger={false}
                />
              </div>
            </>
          ) : (
            <EmptyState
              title="No Equipments Match Your Filters"
              description="Try adjusting your maximum price slider, location, or search keywords."
              actionText="Reset Filters"
              actionLink="#"
            />
          )}
        </Col>
      </Row>

      {/* Mobile Drawer Filter */}
      <Drawer
        title="Filter Machinery"
        placement="left"
        onClose={() => setMobileFilterOpen(false)}
        open={mobileFilterOpen}
      >
        {filterSidebarContent}
      </Drawer>
    </div>
  );
}
