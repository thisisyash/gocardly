import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import { App as CapApp } from '@capacitor/app';

CapApp.addListener('backButton', ({ canGoBack }) => {

  const urlArray = window.location.href.split("/")

  if (urlArray[urlArray.length - 1] === 'auth') {
    CapApp.exitApp();
    return
  }

  if(canGoBack){
    window.history.back();
  } else {
    CapApp.exitApp();
  }
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

defineCustomElements(window);
reportWebVitals();
