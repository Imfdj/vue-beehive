/**
 * @description 路由守卫，目前两种模式：all模式与intelligence模式
 */
import router from '@/router';
import store from '@/store';
import VabProgress from 'nprogress';
import 'nprogress/nprogress.css';
import getPageTitle from '@/utils/pageTitle';
import { routesWhiteList, progressBar, recordRoute } from './settings';

VabProgress.configure({
  easing: 'ease',
  speed: 500,
  trickleSpeed: 200,
  showSpinner: false,
});
router.beforeResolve(async (to, from, next) => {
  if (progressBar) VabProgress.start();
  let hasToken = store.getters['user/accessToken'];
  if (hasToken) {
    if (to.path === '/login') {
      next({ path: '/' });
      if (progressBar) VabProgress.done();
    } else {
      const hasPermissions = store.getters['user/permissions'] && store.getters['user/permissions'].length > 0;
      if (hasPermissions) {
        next();
      } else {
        try {
          await store.dispatch('user/getInfo');
          let accessRoutes = (await store.dispatch('routes/setAllRoutes')) || [];
          router.addRoutes(accessRoutes);
          next({ ...to, replace: true });
        } catch {
          await store.dispatch('user/resetAccessToken');
          if (progressBar) VabProgress.done();
        }
      }
    }
  } else {
    if (routesWhiteList.indexOf(to.path) !== -1) {
      next();
    } else {
      if (recordRoute) {
        next(`/login?redirect=${to.path}`);
      } else {
        next('/login');
      }

      if (progressBar) VabProgress.done();
    }
  }
  document.title = getPageTitle(to.meta.title);
});
router.afterEach(() => {
  if (progressBar) VabProgress.done();
});
