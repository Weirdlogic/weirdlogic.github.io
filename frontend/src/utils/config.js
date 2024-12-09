// src/utils/config.js
export const getBaseUrl = () => {
    const base = window.location.hostname.includes('github.dev')
      ? `https://${window.location.hostname.replace('3000', '8000')}`
      : 'http://127.0.0.1:8000';
      
    const fullUrl = `${base}/analysis`;
    console.log('API Base URL:', fullUrl); // Debug log
    return fullUrl;
  };