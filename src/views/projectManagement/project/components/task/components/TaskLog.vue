<template>
  <div class="task-log">
    <div class="wrap-log">
      <div class="wrap-filter">
        <el-dropdown trigger="click">
          <span class="el-dropdown-link"> 所有动态<i class="el-icon-arrow-down el-icon--right"></i> </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>所有动态</el-dropdown-item>
            <el-dropdown-item>仅评论</el-dropdown-item>
            <el-dropdown-item>仅动态</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div class="log-list color-light">
        <div v-for="log in dataList" :key="log.id" class="item">
          <div class="info">
            <i class="el-icon-plus icon"></i>
            <div class="username-and-remark">{{ log.operator && log.operator.username }} {{ log.remark }}</div>
            <span class="create-date">{{ log.created_at }}</span>
          </div>
          <div v-if="log.content" class="content" v-html="log.content"></div>
        </div>
      </div>
    </div>
    <div class="wrap-comment"> </div>
  </div>
</template>

<script>
  import { getList } from '@/api/taskLogManagement';

  export default {
    name: 'TaskLog',
    data() {
      return {
        dataList: [],
      };
    },
    methods: {
      async getList() {
        const {
          data: { rows },
        } = await getList({
          task_id: 46,
        });
        this.dataList = rows;
      },
    },
  };
</script>

<style lang="scss" scoped>
  .task-log {
    height: 100%;
    .wrap-log {
      height: calc(100vh - 300px);
      padding: 20px;
      /*background-color: #ccc;*/
      .wrap-filter {
        padding-bottom: 10px;
        .el-dropdown-link {
          cursor: pointer;
        }
        .el-dropdown-link:hover {
          color: #1b9aee;
        }
      }
      .log-list {
        height: calc(100% - 30px);
        overflow-x: hidden;
        overflow-x: auto;
        .item {
          .info {
            display: flex;
            align-items: center;
            .icon {
              margin-right: 15px;
              font-size: 16px;
            }
            .username-and-remark {
              flex: 1;
            }
            .create-date {
              width: 130px;
              text-align: right;
            }
          }
          .content {
          }
        }
      }
    }
    .wrap-comment {
      height: 50px;
      border-top: 1px solid #ccc;
    }
  }
</style>
