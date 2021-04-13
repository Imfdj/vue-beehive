import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './plugins';

Vue.config.productionTip = false;

// 注册一个全局自定义指令,验证资源权限 `v-permission`
Vue.directive('permission', {
  // 当被绑定的元素插入到 DOM 中时……
  inserted: function (el, binding, vnode) {
    const permission = binding.value; // 获取权限值
    const allPermissions = store.getters['user/permissions'] || ''; // 当前用户拥有的权限
    if (!allPermissions.includes(permission)) {
      el.parentElement.removeChild(el); //不拥有该权限移除dom元素
    }
  },
});

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
