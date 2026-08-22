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

export default function BackendDataBootstrap() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    const accessToken = localStorage.getItem('upkaran_access_token');
    if (!accessToken) {
      return undefined;
    }

    const loadBackendData = () => Promise.all([
      axiosClient.get('/marketplace/equipments/'),
      axiosClient.get('/bookings/bookings/'),
      axiosClient.get('/community/posts/'),
    ]).then(([equipmentResponse, bookingResponse, postResponse]) => {
      dispatch(setEquipments(resultsOf(equipmentResponse)));
      dispatch(setBookings(resultsOf(bookingResponse)));
      dispatch(setPosts(resultsOf(postResponse)));
    });

    if (isAuthenticated) {
      loadBackendData().catch(() => {});
      return undefined;
    }

    axiosClient.get('/accounts/profile/')
      .then((response) => {
        dispatch(loginSuccess({ user: response.data }));
        return loadBackendData();
      })
      .catch(() => {});
  }, [dispatch, isAuthenticated]);

  return null;
}