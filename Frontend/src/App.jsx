import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ConfigProvider } from 'antd';
import { store } from './store';
import { customTheme } from './utils/themeConfig';
import AppRoutes from './routes/AppRoutes';
import BackendDataBootstrap from './components/common/BackendDataBootstrap';
import './index.css';

export default function App() {
  return (
    <Provider store={store}>
      <ConfigProvider theme={customTheme}>
        <BackendDataBootstrap />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </ConfigProvider>
    </Provider>
  );
}
