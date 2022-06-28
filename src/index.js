import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './shared/styles/vendors/index.css';
import { setDefaultOptions ,loadModules} from 'esri-loader';
// setDefaultOptions({ css: true });
loadModules([
    'esri/config',
    'esri/core/urlUtils',
  ]).then(async ([esriConfig, urlUtils]) => {
    esriConfig.apiKey =
      'AAPKf24959e55476492eb12c8cbaa4d1261etdgkaLK718fs8_EuvckemKt2gyRR-8p04PR7mC2G8Oi5oNli_65xV-C8u8BuPQTZ';
    urlUtils.addProxyRule({
      urlPrefix: 'https://nonpttarcgisserver.pttplc.com/arcgis/rest/services',
      proxyUrl: `${process.env.REACT_APP_PTT_PROXY}${btoa("user=dashboard&system=map")}/api/AppProxy`
    });

  });
ReactDOM.render(<App />, document.getElementById('root'));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
