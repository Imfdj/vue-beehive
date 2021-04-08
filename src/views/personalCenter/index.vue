<template>
  <div class="personalCenter-container wrap-content-main">
    <el-tabs :tab-position="tabPosition">
      <el-tab-pane label="基本设置">
        <base-setting></base-setting>
      </el-tab-pane>
      <el-tab-pane label="安全设置">安全设置</el-tab-pane>
      <el-tab-pane label="账户绑定">账户绑定</el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import BaseSetting from './components/BaseSetting';
  import { mapMutations } from 'vuex';

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
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.setNoNav(true);
        vm.setNavIndex(-1);
      });
    },
    beforeRouteLeave(to, from, next) {
      this.setNoNav(false);
      next();
    },
    created() {},
    methods: {
      ...mapMutations('routes', ['setNoNav', 'setNavIndex']),
    },
  };
</script>

<style lang="scss" scoped>
  .personalCenter-container {
    width: 1100px;
    margin: 0 auto;
  }
</style>
