<template>
  <div class="project-task">
    <div class="wrap-nav">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><i class="el-icon-s-home"></i>首页</el-breadcrumb-item>
        <el-breadcrumb-item>
          <el-dropdown>
            <span class="el-dropdown-link"> 下拉菜单<i class="el-icon-arrow-down el-icon--right"></i> </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>黄金糕</el-dropdown-item>
              <el-dropdown-item>狮子头</el-dropdown-item>
              <el-dropdown-item>螺蛳粉</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-breadcrumb-item>
      </el-breadcrumb>

      <div class="tab">
        <div
          v-for="(item, index) in tabs"
          :key="index"
          class="item-tab"
          :class="[{ active: indexTab === index }]"
          @click="tabClick(index)"
        >
          {{ item }}
        </div>
      </div>

      <div class="wrap-controller">
        <el-button type="text" icon="el-icon-notebook-2">看板视图</el-button>
        <el-button type="text" icon="el-icon-search">筛选</el-button>
        <el-button type="text" icon="el-icon-user">1</el-button>
        <el-button type="text" icon="el-icon-s-unfold">菜单</el-button>
      </div>
    </div>
    <div class="wrap-content">
      <TaskList></TaskList>
    </div>
  </div>
</template>

<script>
  import TaskList from './conponents/task/TaskList';

  export default {
    name: 'ProjectTask',
    components: {
      TaskList,
    },
    data() {
      return {
        tabs: ['任务', '文件', '概览', '版本', '日程'],
        indexTab: 0,
      };
    },
    methods: {
      tabClick(index) {
        this.indexTab = index;
      },
    },
  };
</script>

<style lang="scss" scoped>
  .project-task {
    .wrap-nav {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 46px;
      padding: 0 20px;
      font-size: 15px;
      border-bottom: 1px solid #d9d9d9;
      .tab {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 300px;
        height: 100%;
        .item-tab {
          display: flex;
          align-items: center;
          height: calc(100% - 3px);
          border-bottom: 3px solid transparent;
          cursor: pointer;
        }
        .item-tab:hover {
          border-bottom: 3px solid #3da8f5;
        }
        .active {
          border-bottom: 3px solid #3da8f5;
        }
      }
      .wrap-controller {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        ::v-deep .el-button--small {
          font-size: 14px;
        }
      }
    }
    .wrap-content {
      padding: 20px;
    }
  }
</style>
