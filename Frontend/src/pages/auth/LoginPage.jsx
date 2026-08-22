import React, { useState } from 'react';
import {
  Form,
  Input,
  Button,
  Card,
  Checkbox,
  message,
  Select,
} from 'antd';

import {
  UserOutlined,
  LockOutlined,
} from '@ant-design/icons';

import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { loginSuccess } from '../../store/slices/authSlice';
import axiosClient from '../../api/axiosClient';


export default function LoginPage() {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);


  const onFinish = async (values) => {

    setLoading(true);

    try {

      // =========================
      // LOGIN API
      // =========================

      const response = await axiosClient.post(
        '/accounts/login/',
        {
          username: values.username,
          password: values.password,
        }
      );

      const authData = response.data;
      const accessToken =
        authData.access ||
        authData.access_token ||
        authData.token;
      const refreshToken =
        authData.refresh ||
        authData.refresh_token;

      if (!accessToken) {
        throw new Error('Login response did not include an access token.');
      }


      // =========================
      // SAVE TOKENS
      // =========================

      localStorage.setItem(
        'upkaran_access_token',
        accessToken
      );

      localStorage.setItem(
        'upkaran_refresh_token',
        refreshToken
      );


      // =========================
      // SET AXIOS AUTH HEADER
      // =========================

      axiosClient.defaults.headers.common[
        'Authorization'
      ] = `Bearer ${accessToken}`;


      // The login endpoint already returns the authenticated user.
      const user = authData.user;

      if (!user) {
        throw new Error('Login response did not include user details.');
      }


      // =========================
      // SAVE USER IN REDUX
      // =========================

      dispatch(
        loginSuccess({
          user: user,
        })
      );


      message.success('Login successful!');


      // =========================
      // ROLE BASED REDIRECT
      // =========================

      if (user.role === 'admin') {

        navigate('/dashboard/admin');

      } else if (user.role === 'owner') {

        navigate('/dashboard/owner');

      } else if (user.role === 'dealer') {

        navigate('/dashboard/dealer');

      } else if (user.role === 'manufacturer') {

        navigate('/dashboard/manufacturer');

      } else {

        navigate('/dashboard/farmer');

      }

    } catch (error) {

      console.error(
        'LOGIN ERROR:',
        error
      );


      // =========================
      // ERROR MESSAGE
      // =========================

      let errorMessage =
        'Invalid username or password.';


      if (error.response) {

        const data = error.response.data;


        if (data.detail) {

          errorMessage = data.detail;

        } else if (
          data.non_field_errors &&
          data.non_field_errors.length > 0
        ) {

          errorMessage =
            data.non_field_errors[0];

        } else if (data.username) {

          errorMessage =
            data.username[0];

        } else if (data.password) {

          errorMessage =
            data.password[0];

        } else if (data.error) {

          errorMessage =
            data.error;

        }
      }


      message.error(errorMessage);

    } finally {

      setLoading(false);

    }
  };


  return (

    <div
      style={{
        minHeight: '85vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 24px',
        background:
          'radial-gradient(circle at 50% 50%, rgba(76, 175, 80, 0.1) 0%, transparent 60%), #f8fafc'
      }}
    >

      <Card
        style={{
          width: '100%',
          maxWidth: 460,
          borderRadius: 20,
          boxShadow:
            '0 20px 25px -5px rgba(0,0,0,0.08)'
        }}
        bodyStyle={{
          padding: 36
        }}
      >

        {/* =========================
            HEADER
        ========================= */}

        <div
          style={{
            textAlign: 'center',
            marginBottom: 28
          }}
        >

          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              background:
                'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)',
              color: 'white',
              fontSize: 28,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px auto'
            }}
          >
            🌾
          </div>


          <h2
            style={{
              fontSize: 26,
              fontWeight: 800,
              color: '#0f172a',
              marginBottom: 4
            }}
            className="brand-font"
          >
            Welcome Back to UPKARAN
          </h2>


          <p
            style={{
              color: '#64748b',
              fontSize: 14
            }}
          >
            Sign in to access your agricultural equipment portal
          </p>

        </div>


        {/* =========================
            LOGIN FORM
        ========================= */}

        <Form
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            role: 'farmer',
            remember: true
          }}
        >


          {/* ROLE */}

          <Form.Item
            name="role"
            label="Select Login Role"
            rules={[
              {
                required: true,
                message: 'Please select your role!'
              }
            ]}
          >

            <Select size="large">

              <Select.Option value="farmer">
                🚜 Farmer (Book & Rent Equipment)
              </Select.Option>

              <Select.Option value="owner">
                🛠️ Equipment Owner (Manage Listings)
              </Select.Option>

              <Select.Option value="dealer">
                🏪 Dealer (Manage Business Inventory)
              </Select.Option>

              <Select.Option value="manufacturer">
                🏬 Machinery Manufacturer
              </Select.Option>

              <Select.Option value="admin">
                ⚡ Platform Administrator
              </Select.Option>

            </Select>

          </Form.Item>


          {/* USERNAME */}

          <Form.Item
            name="username"
            label="Mobile Number"
            rules={[
              {
                required: true,
                message: 'Please enter your mobile number!'
              }
            ]}
          >

            <Input
              prefix={
                <UserOutlined
                  style={{
                    color: '#94a3b8'
                  }}
                />
              }
              placeholder="Enter your mobile number"
              size="large"
            />

          </Form.Item>


          {/* PASSWORD */}

          <Form.Item
            name="password"
            label="Password"
            rules={[
              {
                required: true,
                message: 'Please enter your password!'
              }
            ]}
          >

            <Input.Password
              prefix={
                <LockOutlined
                  style={{
                    color: '#94a3b8'
                  }}
                />
              }
              placeholder="Enter your password"
              size="large"
            />

          </Form.Item>


          {/* REMEMBER + FORGOT */}

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 24
            }}
          >

            <Form.Item
              name="remember"
              valuePropName="checked"
              noStyle
            >

              <Checkbox
                style={{
                  fontSize: 13,
                  color: '#475569'
                }}
              >
                Remember me
              </Checkbox>

            </Form.Item>


            <Link
              to="/forgot-password"
              style={{
                fontSize: 13,
                color: '#2E7D32',
                fontWeight: 600
              }}
            >
              Forgot password?
            </Link>

          </div>


          {/* LOGIN BUTTON */}

          <Form.Item
            style={{
              marginBottom: 16
            }}
          >

            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={loading}
              style={{
                background: '#2E7D32',
                height: 48,
                fontWeight: 700
              }}
            >
              {loading
                ? 'Signing In...'
                : 'Sign In'}
            </Button>

          </Form.Item>


          {/* REGISTER */}

          <div
            style={{
              textAlign: 'center',
              fontSize: 14,
              color: '#64748b'
            }}
          >

            Don't have an account?

            {' '}

            <Link
              to="/register"
              style={{
                color: '#2E7D32',
                fontWeight: 700
              }}
            >
              Register Now
            </Link>

          </div>

        </Form>

      </Card>

    </div>
  );
}