import Vue from 'vue';
import ECharts from 'vue-echarts';
import { use } from 'echarts/core';
// 手动引入 ECharts 各模块来减小打包体积

import { CanvasRenderer } from 'echarts/renderers';
import { PieChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent, LegendComponent } from 'echarts/components';

use([CanvasRenderer, PieChart, TitleComponent, TooltipComponent, LegendComponent]);

// 全局注册组件（也可以使用局部注册）
Vue.component('v-chart', ECharts);
