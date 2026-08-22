import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Layout } from 'antd';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import CustomBreadcrumb from '../components/common/CustomBreadcrumb';
import Footer from '../components/common/Footer';

const { Content } = Layout;

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#F8FAFC' }}>
      <Navbar />
      <Layout style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
        <Sidebar collapsed={collapsed} onCollapse={(value) => setCollapsed(value)} />
        <Content style={{ padding: '24px 32px', minHeight: 280, maxWidth: 1400, width: '100%', margin: '0 auto' }}>
          <CustomBreadcrumb />
          <Outlet />
        </Content>
      </Layout>
      <Footer />
    </div>
  );
}
