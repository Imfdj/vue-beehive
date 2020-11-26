<template>
  <div class="personalCenter-container">
    <el-tabs :tab-position="tabPosition">
      <el-tab-pane label="基本设置">
        <base-setting></base-setting>
      </el-tab-pane>
      <el-tab-pane label="安全设置">安全设置</el-tab-pane>
      <el-tab-pane label="账户绑定">安全设置</el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import BaseSetting from './components/BaseSetting';

  export default {
    name: 'PersonalCenter',
    components: {
      BaseSetting,
    },
    data() {
      return {
        tabPosition: 'left',
      };
    },
    created() {},
    methods: {},
  };
</script>
