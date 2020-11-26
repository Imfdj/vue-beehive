/* 公共引入,勿随意修改,修改时需经过确认 */
import Vue from 'vue';
import './element';
import './support';
import '@/styles/vab.scss';
import '@/remixIcon';
import '@/colorfulIcon';
import '@/config/permission';
import '@/utils/errorLog';
import './vabIcon';

import Vab from '@/utils/vab';
import VabDrag from 'zx-layouts/Drag';
import VabPermissions from 'zx-layouts/Permissions';
import VabCount from 'zx-count';
import VabQueryForm from 'zx-layouts/VabQueryForm/export';
import VueAMap from 'vue-amap';
import VueCropper from 'vue-cropper';

VueAMap.initAMapApiLoader({
  key: '19c9d4c0e4b9611cd931a1e4f70788dc',
  plugin: ['Autocomplete', 'PlaceSearch', 'PolyEditor', 'CircleEditor'],
  v: '1.4.4',
});
Vue.use(Vab);
Vue.use(VabPermissions);
Vue.use(VabDrag);
Vue.use(VabQueryForm);
Vue.use(VueAMap);
Vue.use(VabCount);
Vue.use(VueCropper);
