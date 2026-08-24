import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axiosClient from '../../api/axiosClient';
import { setEquipments } from '../../store/slices/equipmentSlice';
import { setBookings } from '../../store/slices/bookingSlice';
import { setPosts } from '../../store/slices/communitySlice';
import { loginSuccess } from '../../store/slices/authSlice';

const resultsOf = (response) => (
  Array.isArray(response.data) ? response.data : response.data?.results || []
);

const apiOrigin = (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/')
  .replace(/\/api\/?$/, '');

const absoluteUrl = (value) => {
  if (!value) return '';
  return value.startsWith('http') ? value : `${apiOrigin}/${value.replace(/^\//, '')}`;
};

const normalizeEquipment = (equipment) => ({
  ...equipment,
  type: equipment.type || 'Rental',
  category: equipment.category_name || equipment.category || 'Agricultural Equipment',
  condition: equipment.condition || 'Available',
  location: equipment.location || 'Location not specified',
  images: [absoluteUrl(equipment.image || equipment.image_url)].filter(Boolean),
  specs: equipment.specs || {},
  dailyRate: Number(equipment.dailyRate ?? equipment.rental_price ?? 0),
  purchasePrice: Number(equipment.purchasePrice ?? equipment.price ?? 0),
  rating: Number(equipment.rating ?? equipment.average_rating ?? 0),
  reviewCount: Number(equipment.reviewCount ?? 0),
  owner: equipment.owner && typeof equipment.owner === 'object'
    ? equipment.owner
    : {
        id: equipment.owner_id,
        name: equipment.owner_name || equipment.owner || 'Equipment Owner',
        username: equipment.owner,
        phone: equipment.owner_phone || '',
      },
});

export default function BackendDataBootstrap() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    const accessToken = localStorage.getItem('upkaran_access_token');
    if (!accessToken) {
      return undefined;
    }

    const bootstrapConfig = { skipAuthRedirect: true };
    const loadBackendData = () => Promise.all([
      axiosClient.get('/marketplace/equipments/', bootstrapConfig),
      axiosClient.get('/bookings/bookings/', bootstrapConfig),
      axiosClient.get('/community/posts/', bootstrapConfig),
    ]).then(([equipmentResponse, bookingResponse, postResponse]) => {
      dispatch(setEquipments(resultsOf(equipmentResponse).map(normalizeEquipment)));
      dispatch(setBookings(resultsOf(bookingResponse)));
      dispatch(setPosts(resultsOf(postResponse)));
    });

    if (isAuthenticated) {
      loadBackendData().catch(() => {});
      return undefined;
    }

    axiosClient.get('/accounts/profile/', { skipAuthRedirect: true })
      .then((response) => {
        dispatch(loginSuccess({ user: response.data }));
        return loadBackendData();
      })
      .catch(() => {});
  }, [dispatch, isAuthenticated]);

  return null;
}