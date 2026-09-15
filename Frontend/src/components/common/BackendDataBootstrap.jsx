import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axiosClient from '../../api/axiosClient';
import { setEquipments, setWishlist } from '../../store/slices/equipmentSlice';
import { setCartItems } from '../../store/slices/cartSlice';
import { readUserCollection } from '../../utils/userStorage';
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
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const accessToken = localStorage.getItem('upkaran_access_token');
    const bootstrapConfig = { skipAuthRedirect: true };
    const loadUserCollections = (userId) => {
      dispatch(setWishlist(readUserCollection('wishlist', userId)));
      dispatch(setCartItems(readUserCollection('cart', userId)));
    };

    const loadPublicData = () => axiosClient.get(
      '/marketplace/equipments/',
      bootstrapConfig
    ).then((equipmentResponse) => {
      dispatch(setEquipments(resultsOf(equipmentResponse).map(normalizeEquipment)));
    });

    const loadPrivateData = () => Promise.all([
      axiosClient.get('/bookings/bookings/', bootstrapConfig),
      axiosClient.get('/community/posts/', bootstrapConfig),
    ]).then(([bookingResponse, postResponse]) => {
      dispatch(setBookings(resultsOf(bookingResponse)));
      dispatch(setPosts(resultsOf(postResponse)));
    });

    if (!accessToken) {
      loadPublicData().catch(() => {});
      return undefined;
    }

    if (isAuthenticated) {
      Promise.all([loadPublicData(), loadPrivateData()]).catch(() => {});
      loadUserCollections(user?.id);
      return undefined;
    }

    axiosClient.get('/accounts/profile/', { skipAuthRedirect: true })
      .then((response) => {
        dispatch(loginSuccess({ user: response.data }));
        loadUserCollections(response.data.id);
        return Promise.all([loadPublicData(), loadPrivateData()]);
      })
      .catch(() => {});
  }, [dispatch, isAuthenticated, user?.id]);

  return null;
}