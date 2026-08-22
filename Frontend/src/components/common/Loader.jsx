import React from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

export default function Loader({ tip = 'Loading UPKARAN Agriculture Portal...' }) {
  const antIcon = <LoadingOutlined style={{ fontSize: 36, color: '#2E7D32' }} spin />;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '50vh',
      width: '100%',
      gap: 16
    }}>
      <Spin indicator={antIcon} />
      <span style={{ color: '#64748b', fontWeight: 600, fontSize: 14 }}>{tip}</span>
    </div>
  );
}
