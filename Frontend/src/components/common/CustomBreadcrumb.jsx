import React from 'react';
import { Breadcrumb } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { HomeOutlined } from '@ant-design/icons';

export default function CustomBreadcrumb() {
  const location = useLocation();
  const pathSnippets = location.pathname.split('/').filter((i) => i);

  const breadcrumbItems = [
    {
      title: (
        <Link to="/">
          <HomeOutlined /> Home
        </Link>
      ),
    },
    ...pathSnippets.map((snippet, index) => {
      const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
      const title = snippet.charAt(0).toUpperCase() + snippet.slice(1).replace('-', ' ');
      const isLast = index === pathSnippets.length - 1;

      return {
        title: isLast ? title : <Link to={url}>{title}</Link>,
      };
    }),
  ];

  if (location.pathname === '/') return null;

  return (
    <div style={{ marginBottom: 16 }}>
      <Breadcrumb items={breadcrumbItems} />
    </div>
  );
}
