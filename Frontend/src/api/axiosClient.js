import axios from 'axios';

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'http://127.0.0.1:8000/api/';


const axiosClient = axios.create({

  baseURL: BASE_URL,

  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },

  timeout: 15000,

});


/*
|--------------------------------------------------------------------------
| REQUEST INTERCEPTOR
|--------------------------------------------------------------------------
| Har request ke saath Access Token jayega
*/

axiosClient.interceptors.request.use(

  (config) => {

    const isPublicAuthRequest =
      config.url?.includes('/accounts/login/') ||
      config.url?.includes('/accounts/register/') ||
      config.url?.includes('/token/') ||
      config.url?.includes('/accounts/refresh/');

    if (isPublicAuthRequest) {
      delete config.headers.Authorization;
      return config;
    }

    const token =
      localStorage.getItem('upkaran_access_token');

    if (token) {

      config.headers.Authorization =
        `Bearer ${token}`;

    }

    return config;

  },

  (error) => {

    return Promise.reject(error);

  }

);


/*
|--------------------------------------------------------------------------
| RESPONSE INTERCEPTOR
|--------------------------------------------------------------------------
| Successful response ko directly return karenge
*/

axiosClient.interceptors.response.use(

  (response) => {

    return response;

  },

  async (error) => {

    const originalRequest =
      error.config;

    const skipAuthRedirect =
      originalRequest?.skipAuthRedirect;

    const isAuthRequest =
      originalRequest?.url?.includes('/accounts/login/') ||
      originalRequest?.url?.includes('/accounts/register/') ||
      originalRequest?.url?.includes('/token/');


        /*
        |--------------------------------------------------------------------------
        | ACCESS TOKEN EXPIRED
        |--------------------------------------------------------------------------
        */

    if (
      error.response?.status === 401 &&
      !originalRequest?._retry &&
      !isAuthRequest &&
      !skipAuthRedirect
    ) {

      originalRequest._retry = true;


      const refreshToken =
        localStorage.getItem(
          'upkaran_refresh_token'
        );


      /*
      | Refresh token available hai
      */

      if (refreshToken) {

        try {

          const refreshResponse =
            await axios.post(
              `${BASE_URL}accounts/refresh/`,
              {
                refresh: refreshToken,
              }
            );


          const newAccessToken =
            refreshResponse.data.access ||
            refreshResponse.data.access_token;

          if (!newAccessToken) {
            throw new Error('Refresh response did not include an access token.');
          }


          /*
          | New Access Token save
          */

          localStorage.setItem(
            'upkaran_access_token',
            newAccessToken
          );


          /*
          | Original request ko new token ke saath
          | dobara bhejna
          */

          originalRequest.headers.Authorization =
            `Bearer ${newAccessToken}`;


          return axiosClient(
            originalRequest
          );

        } catch (refreshError) {

          /*
          | Refresh token bhi expire/invalid
          */

          localStorage.removeItem(
            'upkaran_access_token'
          );

          localStorage.removeItem(
            'upkaran_refresh_token'
          );

          window.location.href =
            '/login';

          return Promise.reject(
            refreshError
          );

        }

      }

      /*
      | Refresh token nahi mila
      */

      localStorage.removeItem(
        'upkaran_access_token'
      );

      window.location.href =
        '/login';
    }


    /*
    |--------------------------------------------------------------------------
    | Other errors
    |--------------------------------------------------------------------------
    */

    return Promise.reject(
      error
    );

  }

);


export default axiosClient;