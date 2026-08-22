import React, { useState } from 'react';
import {
  Form,
  Input,
  Button,
  Card,
  Select,
  Checkbox,
  message,
  Upload,
  Avatar,
} from 'antd';

import {
  UserOutlined,
  LockOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  CameraOutlined,
} from '@ant-design/icons';

import { Link, useNavigate } from 'react-router-dom';

import axiosClient from '../../api/axiosClient';


export default function RegisterPage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);


  // ==========================================
  // REGISTER FUNCTION
  // ==========================================

  const onFinish = async (values) => {
    setLoading(true);

    try {

      // Do not let an old access/refresh token affect a new registration.
      localStorage.removeItem('upkaran_access_token');
      localStorage.removeItem('upkaran_refresh_token');
      delete axiosClient.defaults.headers.common.Authorization;

      // ==========================================
      // SPLIT FULL NAME
      // ==========================================

      const nameParts = values.name
        .trim()
        .split(/\s+/);

      const firstName = nameParts[0] || '';

      const lastName =
        nameParts.slice(1).join(' ') || '';


      // ==========================================
      // REGISTER API
      // ==========================================

      const registrationData = new FormData();
      registrationData.append('username', values.phone);
      registrationData.append(
        'email',
        values.email || `${values.phone}@upkaran.local`
      );
      registrationData.append('password', values.password);
      registrationData.append('phone', values.phone);
      registrationData.append('first_name', firstName);
      registrationData.append('last_name', lastName);
      registrationData.append('role', values.role);
      registrationData.append('city', values.state);

      if (profilePicture) {
        registrationData.append('profile_picture', profilePicture);
      }

      const response = await axiosClient.post(
        '/accounts/register/',
        registrationData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );


      // ==========================================
      // SUCCESS RESPONSE
      // ==========================================

      console.log(
        'REGISTER RESPONSE:',
        response.data
      );


     // Registration successful
message.success('Registration successful!');

// Automatically login
const loginResponse = await axiosClient.post(
  '/accounts/login/',
  {
    username: values.phone,
    password: values.password,
  }
);

// Save tokens
localStorage.setItem(
  'upkaran_access_token',
  loginResponse.data.access
);

localStorage.setItem(
  'upkaran_refresh_token',
  loginResponse.data.refresh
);

// Now go to profile completion
navigate('/profile-completion', {
  state: {
    user: response.data.user,
  },
});



    } catch (error) {

      // ==========================================
      // ERROR
      // ==========================================

      console.error(
        'REGISTER ERROR:',
        error
      );


      if (error.response) {

        console.log(
          'STATUS:',
          error.response.status
        );

        console.log(
          'BACKEND RESPONSE:',
          error.response.data
        );


        const data =
          error.response.data;


        let errorMessage =
          'Registration failed. Please try again.';


        // ==========================================
        // BACKEND VALIDATION ERRORS
        // ==========================================

        if (data.username) {

          errorMessage =
            `Username: ${data.username[0]}`;

        } else if (data.email) {

          errorMessage =
            `Email: ${data.email[0]}`;

        } else if (data.phone) {

          errorMessage =
            `Phone: ${data.phone[0]}`;

        } else if (data.password) {

          errorMessage =
            `Password: ${data.password[0]}`;

        } else if (data.role) {

          errorMessage =
            `Role: ${data.role[0]}`;

        } else if (data.city) {

          errorMessage =
            `City: ${data.city[0]}`;

        } else if (data.non_field_errors) {

          errorMessage =
            data.non_field_errors[0];

        } else if (data.detail) {

          errorMessage =
            data.detail;

        } else if (typeof data === 'string') {

          errorMessage = data;

        }


        message.error(errorMessage);

      } else {

        message.error(
          'Backend server se connection nahi ho pa raha.'
        );

      }


    } finally {

      setLoading(false);

    }
  };


  return (
    <div
      style={{
        minHeight: '90vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 24px',
        background:
          'radial-gradient(circle at 50% 50%, rgba(76, 175, 80, 0.1) 0%, transparent 60%), #f8fafc',
      }}
    >

      <Card
        style={{
          width: '100%',
          maxWidth: 520,
          borderRadius: 20,
          boxShadow:
            '0 20px 25px -5px rgba(0,0,0,0.08)',
        }}
        bodyStyle={{
          padding: 36,
        }}
      >

        {/* ========================================
            HEADER
        ======================================== */}

        <div
          style={{
            textAlign: 'center',
            marginBottom: 28,
          }}
        >

          <h2
            style={{
              fontSize: 26,
              fontWeight: 800,
              color: '#0f172a',
              marginBottom: 4,
            }}
            className="brand-font"
          >
            Create UPKARAN Account
          </h2>

          <p
            style={{
              color: '#64748b',
              fontSize: 14,
            }}
          >
            Join India’s premier agriculture
            equipment SaaS network
          </p>

        </div>


        {/* ========================================
            FORM
        ======================================== */}

        <Form
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            role: 'farmer',
          }}
        >

          {/* FULL NAME */}

          <Form.Item
            name="name"
            label="Full Name"
            rules={[
              {
                required: true,
                message:
                  'Please enter your full name!',
              },
            ]}
          >

            <Input
              prefix={
                <UserOutlined
                  style={{
                    color: '#94a3b8',
                  }}
                />
              }
              placeholder="e.g. Your Full Name"
              size="large"
            />

          </Form.Item>


          {/* MOBILE NUMBER */}

          <Form.Item
            name="phone"
            label="Mobile Number"
            rules={[
              {
                required: true,
                message:
                  'Please enter your mobile number!',
              },
              {
                pattern: /^[6-9]\d{9}$/,
                message:
                  'Please enter a valid 10-digit mobile number!',
              },
            ]}
          >

            <Input
              prefix={
                <PhoneOutlined
                  style={{
                    color: '#94a3b8',
                  }}
                />
              }
              placeholder="e.g. 9898012345"
              maxLength={10}
              size="large"
            />

          </Form.Item>


          {/* PROFILE PICTURE */}

          <Form.Item label="Profile Picture">
            <Upload
              accept="image/*"
              maxCount={1}
              showUploadList={false}
              beforeUpload={(file) => {
                setProfilePicture(file);
                return false;
              }}
              onRemove={() => setProfilePicture(null)}
            >
              <Button icon={<CameraOutlined />}>
                {profilePicture ? 'Change Profile Picture' : 'Upload Profile Picture'}
              </Button>
            </Upload>
            {profilePicture && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 10 }}>
                <Avatar src={URL.createObjectURL(profilePicture)} icon={<UserOutlined />} />
                <span style={{ color: '#64748b', fontSize: 13 }}>{profilePicture.name}</span>
              </div>
            )}
          </Form.Item>


          {/* EMAIL */}

          <Form.Item
            name="email"
            label="Email"
            rules={[
              {
                type: 'email',
                message:
                  'Please enter a valid email!',
              },
            ]}
          >

            <Input
              placeholder="e.g. your@email.com"
              size="large"
            />

          </Form.Item>


          {/* ROLE */}

          <Form.Item
            name="role"
            label="Account Primary Type"
            rules={[
              {
                required: true,
                message:
                  'Please select your account type!',
              },
            ]}
          >

            <Select size="large">

              <Select.Option value="farmer">
                🚜 Farmer (Looking to Rent Machinery)
              </Select.Option>

              <Select.Option value="owner">
                🛠️ Equipment Owner (Monetize Tractors/Harvesters)
              </Select.Option>

              <Select.Option value="dealer">
                🏪 Dealer (Manage Business Inventory)
              </Select.Option>

              <Select.Option value="manufacturer">
                🏬 Machinery Manufacturer
              </Select.Option>

            </Select>

          </Form.Item>


          {/* LOCATION */}

          <Form.Item
            name="state"
            label="State / District"
            rules={[
              {
                required: true,
                message:
                  'Please enter your location!',
              },
            ]}
          >

            <Input
              prefix={
                <EnvironmentOutlined
                  style={{
                    color: '#94a3b8',
                  }}
                />
              }
              placeholder="e.g. Bettiah, Bihar"
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
                message:
                  'Create a password!',
              },
              {
                min: 8,
                message:
                  'Password must contain at least 8 characters!',
              },
            ]}
          >

            <Input.Password
              prefix={
                <LockOutlined
                  style={{
                    color: '#94a3b8',
                  }}
                />
              }
              placeholder="At least 8 characters"
              size="large"
            />

          </Form.Item>


          {/* CONFIRM PASSWORD */}

          <Form.Item
            name="confirmPassword"
            label="Confirm Password"
            dependencies={['password']}
            rules={[
              {
                required: true,
                message:
                  'Please confirm your password!',
              },

              ({ getFieldValue }) => ({
                validator(_, value) {

                  if (
                    !value ||
                    getFieldValue('password') === value
                  ) {
                    return Promise.resolve();
                  }

                  return Promise.reject(
                    new Error(
                      'Passwords do not match!'
                    )
                  );
                },
              }),
            ]}
          >

            <Input.Password
              prefix={
                <LockOutlined
                  style={{
                    color: '#94a3b8',
                  }}
                />
              }
              placeholder="Confirm your password"
              size="large"
            />

          </Form.Item>


          {/* TERMS */}

          <Form.Item
            name="terms"
            valuePropName="checked"
            rules={[
              {
                validator: (_, value) =>
                  value
                    ? Promise.resolve()
                    : Promise.reject(
                        new Error(
                          'Accept terms to continue'
                        )
                      ),
              },
            ]}
          >

            <Checkbox
              style={{
                fontSize: 13,
                color: '#475569',
              }}
            >

              I agree to UPKARAN{' '}

              <a
                href="#"
                style={{
                  color: '#2E7D32',
                }}
              >
                Terms of Service
              </a>

              {' '} & {' '}

              <a
                href="#"
                style={{
                  color: '#2E7D32',
                }}
              >
                Privacy Policy
              </a>

            </Checkbox>

          </Form.Item>


          {/* REGISTER BUTTON */}

          <Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={loading}
              style={{
                background: '#2E7D32',
                height: 48,
                fontWeight: 700,
              }}
            >

              {loading
                ? 'Creating Account...'
                : 'Continue to Profile Completion →'}

            </Button>

          </Form.Item>


          {/* LOGIN LINK */}

          <div
            style={{
              textAlign: 'center',
              fontSize: 14,
              color: '#64748b',
            }}
          >

            Already have an account?{' '}

            <Link
              to="/login"
              style={{
                color: '#2E7D32',
                fontWeight: 700,
              }}
            >
              Sign In
            </Link>

          </div>

        </Form>

      </Card>

    </div>
  );
}