import VabQueryForm from './index';
import VabQueryFormTopPanel from './VabQueryFormTopPanel';
import VabQueryFormBottomPanel from './VabQueryFormBottomPanel';
import VabQueryFormLeftPanel from './VabQueryFormLeftPanel';
import VabQueryFormRightPanel from './VabQueryFormRightPanel';
export default {
  install(Vue) {
    Vue.component('vab-query-form', VabQueryForm);
    Vue.component('vab-query-form-left-panel', VabQueryFormLeftPanel);
    Vue.component('vab-query-form-right-panel', VabQueryFormRightPanel);
    Vue.component('vab-query-form-top-panel', VabQueryFormTopPanel);
    Vue.component('vab-query-form-bottom-panel', VabQueryFormBottomPanel);
  },
};
