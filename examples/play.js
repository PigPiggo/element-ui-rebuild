import Vue from 'vue';
import Element from 'main/index.js';
import App from './play/index.vue';
import 'packages/theme-chalk/src/index.scss';
require('babel-regenerator-runtime'); // add regenerator support for async await

document.getElementsByTagName("html")[0].style.fontSize =
  window.screen.width / 19.20 + "px";


Vue.use(Element);

new Vue({ // eslint-disable-line
  render: h => h(App)
}).$mount('#app');
