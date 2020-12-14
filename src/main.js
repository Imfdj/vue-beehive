import 'core-js/stable';
import 'regenerator-runtime/runtime';
import Vue from 'vue';
import App from './App';
import store from './store';
import router from './router';
import './plugins';
import * as Sentry from '@sentry/browser';
import * as Integrations from '@sentry/integrations';

if (process.env.NODE_ENV === 'preview') {
  const { mockXHR } = require('../mock/static');
  mockXHR();
}
if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: 'http://c13799e6f0cd4fb8bf999763badf8bc8@sentry.imfdj.top/3',
    integrations: [new Integrations.Vue({Vue, attachProps: true})],
  });
}

Vue.config.productionTip = false;

new Vue({
  el: '#vue-admin-beautiful',
  router,
  store,
  render: h => h(App),
});
