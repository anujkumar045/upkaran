import React from 'react';
import { Empty, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

export default function EmptyState({ title = 'No Machinery Found', description = 'Try adjusting your search query or clear filters to view more equipments.', actionText, actionLink }) {
  const navigate = useNavigate();

  return (
    <div style={{
      background: 'white',
      borderRadius: 16,
      padding: '48px 24px',
      textAlign: 'center',
      border: '1px border #e2e8f0',
      margin: '20px 0'
    }}>
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description={
          <div>
            <h4 style={{ fontSize: 18, color: '#0f172a', marginBottom: 6 }}>{title}</h4>
            <p style={{ color: '#64748b', fontSize: 14, maxWidth: 400, margin: '0 auto 16px auto' }}>{description}</p>
          </div>
        }
      >
        {actionText && actionLink && (
          <Button type="primary" onClick={() => navigate(actionLink)}>
            {actionText}
          </Button>
        )}
      </Empty>
    </div>
  );
}
