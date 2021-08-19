<template>
  <div v-if="currentNav.children && currentNav.children.length && !noNav" class="menu-vue-beehive">
    <el-menu
      :default-active="activeMenu"
      class="el-menu-vertical-demo"
      :collapse="isCollapse"
      background-color="#001529"
      text-color="#fff"
      active-text-color="#fff"
      @open="handleOpen"
      @close="handleClose"
    >
      <template v-for="route in currentNav.children">
        <side-bar-item
          v-if="!route.hidden"
          :key="route.path"
          :full-path="currentNav.path"
          :item="route"
        ></side-bar-item>
      </template>
    </el-menu>
    <div class="btn-isCollapse" @click="changeCollapse">
      <i :class="isCollapse ? 'el-icon-arrow-right' : 'el-icon-arrow-left'"></i>
    </div>
  </div>
</template>

<script>
  import SideBarItem from './SideBar/components/SideBarItem';
  import { mapState } from 'vuex';

  export default {
    name: 'Menu',
    components: {
      SideBarItem,
    },
    data() {
      return {
        isCollapse: false,
      };
    },
    computed: {
      ...mapState('routes', ['accessRoutesTree', 'routes', 'noNav']),
      currentNav() {
        const currentNav = this.$store.getters['routes/currentNav'];
        currentNav.children = currentNav.children?.filter(item => !item.hidden);
        return currentNav;
      },
      activeMenu() {
        const route = this.$route;
        const { meta, path } = route;
        if (meta.activeMenu) {
          return meta.activeMenu;
        }
        return path;
      },
      menuComponent() {
        if (
          this.handleChildren(this.item.children, this.item) &&
          (!this.routeChildren.children || this.routeChildren.notShowChildren) &&
          !this.item.alwaysShow
        ) {
          return 'MenuItem';
        } else {
          return 'Submenu';
        }
      },
    },
    watch: {
      isCollapse(newValue) {
        this.$emit('changeCollapse', newValue);
      },
      currentNav(newValue) {},
    },
    created() {},
    methods: {
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      },
      changeCollapse() {
        this.isCollapse = !this.isCollapse;
      },
    },
  };
</script>

<style lang="scss" scoped>
  .menu-vue-beehive {
    position: relative;
    height: calc(100vh - 65px);
    background-color: #001529;
    .el-menu-vertical-demo:not(.el-menu--collapse) {
      width: 256px;
    }
    ::v-deep {
      .iconfont {
        display: inline-block;
        vertical-align: middle;
        width: 24px;
        text-align: center;
      }
      .is-active {
        background-color: #1890ff !important;
      }
      .el-menu {
        border-right: none;
        .iconfont {
          font-size: 18px;
        }
        & i {
          color: #ffffff;
        }
      }
      .el-menu--collapse {
        width: 66px;
        .el-submenu__title {
        }
        .el-menu-item {
          color: #fff;
        }
      }
    }
    .btn-isCollapse {
      position: absolute;
      bottom: 0px;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 48px;
      background-color: #002140;
      cursor: pointer;
      i {
        font-size: 20px;
        color: #fff;
      }
    }
  }
</style>
