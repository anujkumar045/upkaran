// Currency & Date formatters for UPKARAN
export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

export const getStatusTagColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'confirmed':
    case 'approved':
    case 'available':
    case 'active':
    case 'delivered':
      return 'success';
    case 'pending':
    case 'in_review':
    case 'booked':
      return 'warning';
    case 'rejected':
    case 'cancelled':
    case 'out_of_stock':
      return 'error';
    case 'completed':
    case 'paid':
      return 'processing';
    default:
      return 'default';
  }
};
