import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { App as AntdApp, ConfigProvider, theme as antdTheme } from 'antd';
import viVN from 'antd/locale/vi_VN';
import 'dayjs/locale/vi';

import App from './App';
import { store } from './store';
import { ThemeProvider, useThemeMode } from './theme/ThemeContext';
import './index.css';

function ThemedApp() {
  const { mode } = useThemeMode();
  return (
    <ConfigProvider
      locale={viVN}
      theme={{
        algorithm: mode === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
        token: {
          colorPrimary: '#1677ff',
          borderRadius: 6,
        },
      }}
    >
      <AntdApp>
        <App />
      </AntdApp>
    </ConfigProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider>
          <ThemedApp />
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
);
