import React, { useState } from 'react';

import {
  Form,
  Input,
  Button,
  Card,
  Select,
  InputNumber,
  Tag,
  message,
} from 'antd';

import {
  CheckCircleOutlined,
} from '@ant-design/icons';

import {
  useNavigate,
  useLocation,
} from 'react-router-dom';

import { useDispatch } from 'react-redux';

import {
  updateProfile,
} from '../../store/slices/authSlice';

import axiosClient from '../../api/axiosClient';


export default function ProfileCompletionPage() {

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);


  // Register ke baad RegisterPage se user yahan aayega
  const user = location.state?.user;

  // User ka role
  const role = user?.role || 'farmer';


  const onFinish = async (values) => {

    setLoading(true);

    try {

      /*
       * Backend ke according data prepare karna
       */

      let profileData = {};


      // ==========================================
      // FARMER
      // ==========================================

      if (role === 'farmer') {

        profileData = {
          land_area: values.land_area,
          farming_type: values.farming_type,
        };

      }


      // ==========================================
      // OWNER
      // ==========================================

      else if (role === 'owner') {

        profileData = {
          total_equipments:
            values.total_equipments,
        };

      }


      // ==========================================
      // DEALER
      // ==========================================

      else if (role === 'dealer') {

        profileData = {
          shop_name: values.shop_name,
          shop_address: values.shop_address,
          license_number:
            values.license_number,
        };

      }


      // ==========================================
      // MANUFACTURER
      // ==========================================

      else if (role === 'manufacturer') {

        profileData = {
          company_name:
            values.company_name,

          gst_number:
            values.gst_number,

          website:
            values.website,

          phone:
            values.phone,

          address:
            values.address,

          description:
            values.description,
        };

      }


      console.log(
        'PROFILE DATA:',
        profileData
      );


      /*
       * Backend API
       */

      const response = await axiosClient.post(
        '/accounts/profile/complete/',
        profileData
      );


      console.log(
        'PROFILE RESPONSE:',
        response.data
      );


      /*
       * Redux mein profile save
       */

      dispatch(
        updateProfile(
          response.data.profile
        )
      );


      message.success(
        'Profile completed successfully!'
      );


      /*
       * Role ke according dashboard
       */

      if (role === 'farmer') {

        navigate('/dashboard/farmer');

      } else if (role === 'owner') {

        navigate('/dashboard/owner');

      } else if (role === 'dealer') {

        navigate('/dashboard/dealer');

      } else if (role === 'manufacturer') {

        navigate('/dashboard/manufacturer');

      } else {

        navigate('/dashboard');

      }

    } catch (error) {

      console.error(
        'PROFILE ERROR:',
        error
      );

      console.error(
        'BACKEND ERROR:',
        error.response?.data
      );


      const data =
        error.response?.data;


      if (data?.detail) {

        message.error(
          data.detail
        );

      } else if (data) {

        const firstError =
          Object.values(data)[0];

        if (
          Array.isArray(firstError)
          && firstError.length > 0
        ) {

          message.error(
            firstError[0]
          );

        } else {

          message.error(
            'Profile update failed.'
          );
        }

      } else {

        message.error(
          'Server se connection nahi ho raha.'
        );
      }

    } finally {

      setLoading(false);

    }
  };


  return (

    <div
      style={{
        maxWidth: 700,
        margin: '40px auto',
        padding: '0 24px',
      }}
    >

      <Card
        style={{
          borderRadius: 24,
          boxShadow:
            '0 20px 25px -5px rgba(0,0,0,0.08)',
        }}
        bodyStyle={{
          padding: 36,
        }}
      >

        {/* HEADER */}

        <div
          style={{
            textAlign: 'center',
            marginBottom: 32,
          }}
        >

          <Tag
            color="green"
            style={{
              fontWeight: 700,
              padding: '4px 12px',
              borderRadius: 10,
            }}
          >
            STEP 2 OF 2
          </Tag>


          <h2
            style={{
              fontSize: 28,
              fontWeight: 800,
              color: '#0f172a',
              marginTop: 8,
            }}
            className="brand-font"
          >
            Complete Your Profile
          </h2>


          <p
            style={{
              color: '#64748b',
              fontSize: 14,
            }}
          >
            Complete your details to continue
          </p>


          <p
            style={{
              color: '#2E7D32',
              fontWeight: 600,
            }}
          >
            Account Type: {role}
          </p>

        </div>


        <Form
          layout="vertical"
          onFinish={onFinish}
        >


          {/* ===================================== */}
          {/* FARMER */}
          {/* ===================================== */}

          {role === 'farmer' && (
            <>

              <Form.Item
                name="land_area"
                label="Farm Land Size (Acres)"
                rules={[
                  {
                    required: true,
                    message:
                      'Please enter land area',
                  },
                ]}
              >

                <InputNumber
                  min={0}
                  step={0.01}
                  size="large"
                  style={{
                    width: '100%',
                  }}
                  placeholder="e.g. 5.5"
                />

              </Form.Item>


              <Form.Item
                name="farming_type"
                label="Farming Type"
                rules={[
                  {
                    required: true,
                    message:
                      'Please select farming type',
                  },
                ]}
              >

                <Select
                  size="large"
                  placeholder="Select farming type"
                >

                  <Select.Option value="Crop Farming">
                    🌾 Crop Farming
                  </Select.Option>

                  <Select.Option value="Vegetable Farming">
                    🥕 Vegetable Farming
                  </Select.Option>

                  <Select.Option value="Fruit Farming">
                    🍎 Fruit Farming
                  </Select.Option>

                  <Select.Option value="Mixed Farming">
                    🌱 Mixed Farming
                  </Select.Option>

                  <Select.Option value="Organic Farming">
                    🌿 Organic Farming
                  </Select.Option>

                </Select>

              </Form.Item>

            </>
          )}


          {/* ===================================== */}
          {/* OWNER */}
          {/* ===================================== */}

          {role === 'owner' && (

            <Form.Item
              name="total_equipments"
              label="Total Equipment"
              rules={[
                {
                  required: true,
                  message:
                    'Please enter total equipment',
                },
              ]}
            >

              <InputNumber
                min={0}
                size="large"
                style={{
                  width: '100%',
                }}
                placeholder="e.g. 3"
              />

            </Form.Item>

          )}


          {/* ===================================== */}
          {/* DEALER */}
          {/* ===================================== */}

          {role === 'dealer' && (
            <>

              <Form.Item
                name="shop_name"
                label="Shop Name"
                rules={[
                  {
                    required: true,
                    message:
                      'Please enter shop name',
                  },
                ]}
              >

                <Input
                  size="large"
                  placeholder="ABC Agro Machinery"
                />

              </Form.Item>


              <Form.Item
                name="shop_address"
                label="Shop Address"
                rules={[
                  {
                    required: true,
                    message:
                      'Please enter shop address',
                  },
                ]}
              >

                <Input.TextArea
                  rows={3}
                  placeholder="Enter complete shop address"
                />

              </Form.Item>


              <Form.Item
                name="license_number"
                label="License Number"
                rules={[
                  {
                    required: true,
                    message:
                      'Please enter license number',
                  },
                ]}
              >

                <Input
                  size="large"
                  placeholder="LIC123456"
                />

              </Form.Item>

            </>
          )}


          {/* ===================================== */}
          {/* MANUFACTURER */}
          {/* ===================================== */}

          {role === 'manufacturer' && (
            <>

              <Form.Item
                name="company_name"
                label="Company Name"
                rules={[
                  {
                    required: true,
                    message:
                      'Please enter company name',
                  },
                ]}
              >

                <Input
                  size="large"
                  placeholder="ABC Agricultural Machines"
                />

              </Form.Item>


              <Form.Item
                name="gst_number"
                label="GST Number"
              >

                <Input
                  size="large"
                  placeholder="GST Number"
                />

              </Form.Item>


              <Form.Item
                name="website"
                label="Website"
              >

                <Input
                  size="large"
                  placeholder="https://example.com"
                />

              </Form.Item>


              <Form.Item
                name="phone"
                label="Company Phone"
              >

                <Input
                  size="large"
                  placeholder="9876543210"
                />

              </Form.Item>


              <Form.Item
                name="address"
                label="Company Address"
              >

                <Input.TextArea
                  rows={3}
                  placeholder="Enter company address"
                />

              </Form.Item>


              <Form.Item
                name="description"
                label="Company Description"
              >

                <Input.TextArea
                  rows={4}
                  placeholder="Describe your company"
                />

              </Form.Item>

            </>
          )}


          {/* SUBMIT */}

          <Form.Item
            style={{
              marginTop: 24,
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
                fontWeight: 700,
              }}
            >

              Complete Setup & Enter Dashboard

              <CheckCircleOutlined />

            </Button>

          </Form.Item>

        </Form>

      </Card>

    </div>
  );
}