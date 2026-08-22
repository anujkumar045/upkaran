import React from 'react';
import { Result, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Result
        status="404"
        title="404 - Page Not Found"
        subTitle="Sorry, the agricultural equipment page you visited does not exist."
        extra={
          <Button type="primary" style={{ background: '#2E7D32' }} onClick={() => navigate('/')}>
            Back to UPKARAN Home
          </Button>
        }
      />
    </div>
  );
}
