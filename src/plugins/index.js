/* 公共引入,勿随意修改,修改时需经过确认 */
import Vue from 'vue';
import './element';
import './echarts';
import '@/styles/vab.scss';
import '@/styles/custom.scss';
import '@/config/permission';
import '@/utils/errorLog';

import Vab from '@/utils/vab';
import VabQueryForm from '@/components/VabQueryForm/export';
import VueCropper from 'vue-cropper';

Vue.use(Vab);
Vue.use(VabQueryForm);
Vue.use(VueCropper);
