<template>
  <div class="wrap-vue-beehive">
    <Header :isMenuCollapse="isMenuCollapse"></Header>
    <div class="main-view-vue-beehive">
      <Menu @changeCollapse="changeCollapse"></Menu>
      <div class="wrap-router-view">
        <router-view />
      </div>
    </div>
    <el-backtop target=".wrap-router-view"></el-backtop>
  </div>
</template>

<script>
  import Header from './components/Header';
  import Menu from './components/Menu';

  export default {
    name: 'Layout',
    components: {
      Header,
      Menu,
    },
    data() {
      return {
        isMenuCollapse: false,
      };
    },
    methods: {
      changeCollapse(collapse) {
        this.isMenuCollapse = collapse;
      },
    },
  };
</script>

<style lang="scss" scoped>
  .wrap-vue-beehive {
    .main-view-vue-beehive {
      display: flex;
      .wrap-router-view {
        position: relative;
        flex: 1;
        padding: 20px;
        height: calc(100vh - 105px);
        overflow: auto;
      }
    }
  }
</style>
