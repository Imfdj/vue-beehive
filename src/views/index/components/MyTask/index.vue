<template>
  <div class="my-task">
    <div class="head">
      <div class="title"> 我的任务 - {{ taskData.count }}</div>
      <div class="wrap-ctrl">
        <el-select v-model="form.is_done" placeholder="请选择" style="width: 100px" @change="taskDoneStatesChange">
          <el-option v-for="item in taskDoneStates" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </div>
    </div>
    <div class="wrap-nav">
      <el-tabs v-model="navActiveName" @tab-click="navHandleClick">
        <el-tab-pane name="execute">
          <span slot="label"><i class="iconfont icon-caidan1"></i> 我执行的</span>
        </el-tab-pane>
        <el-tab-pane name="participation">
          <span slot="label"><i class="iconfont icon-duoren1"></i> 我参与的</span>
        </el-tab-pane>
        <el-tab-pane name="created">
          <span slot="label"><i class="iconfont icon-jia"></i> 我创建的</span>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div v-loading="loading" class="wrap-task-list">
      <div v-for="item in taskData.rows" :key="item.id" class="task-item">
        <el-tag
          effect="plain"
          size="mini"
          :style="`color: ${item.priority.color};border-color: ${item.priority.color};`"
        >
          {{ item.priority.name }}
        </el-tag>
        <div class="task-name ellipsis" @click="goToTask(item)">{{ item.name }}</div>
        <div class="project-name ellipsis" @click="goToProject(item.project)"
          >{{ item.project && item.project.name }}
        </div>
      </div>
      <EmptyImage
        v-if="!(taskData.rows && taskData.rows.length) && !loading"
        :height="510"
        :heightImg="160"
        text="空空如也~~"
      ></EmptyImage>
    </div>
    <div class="wrap-pagination">
      <el-pagination
        v-if="taskData.count"
        background
        layout="prev, pager, next"
        :page-size="pageSize"
        :current-page="currentPage"
        :total="taskData.count"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import { getList, permissions as taskPermissions } from '@/api/taskManagement';
  import { getList as getTaskPriorityList, permissions as taskPriorityPermissions } from '@/api/taskPriorityManagement';
  import EmptyImage from '@/components/EmptyImage';
  import { mapState } from 'vuex';

  export default {
    name: 'MyTask',
    components: {
      EmptyImage,
    },
    data() {
      return {
        taskPermissions,
        taskPriorityPermissions,
        loading: false,
        taskData: {},
        form: {
          is_done: 0,
          is_recycle: 0,
        },
        taskDoneStates: [
          {
            id: 0,
            color: '#7c7c7c',
            icon: 'iconfont icon-fangxing1',
            name: '未完成',
          },
          {
            id: 1,
            color: '#1ae54d',
            icon: 'iconfont icon-xuanzhong2',
            name: '已完成',
          },
        ],
        navActiveName: 'execute',
        currentPage: 1,
        pageSize: 10,
      };
    },
    computed: {
      ...mapState('user', ['userInfo']),
    },
    created() {
      this.init();
    },
    methods: {
      navHandleClick() {
        this.currentPage = 1;
        this.init();
      },
      init() {
        this.loading = true;
        Promise.all([this.getTaskPriorityList(), this.getList()]).then(
          ([
            {
              data: { rows },
            },
            { data },
          ]) => {
            data.rows.forEach(task => {
              task.priority = rows.find(priority => priority.id === task.task_priority_id);
              return task;
            });
            this.taskData = data;
            this.loading = false;
          }
        );
      },
      async getList() {
        const body = {};
        switch (this.navActiveName) {
          case 'execute':
            body.executor_ids = this.userInfo.id;
            break;
          case 'participation':
            body.participator_id = this.userInfo.id;
            break;
          case 'created':
            body.creator_id = this.userInfo.id;
            break;
          default:
            break;
        }
        return getList({
          limit: this.pageSize,
          offset: (this.currentPage - 1) * this.pageSize,
          ...this.form,
          ...body,
        });
      },
      async getTaskPriorityList() {
        return getTaskPriorityList();
      },
      handleCurrentChange(val) {
        this.currentPage = val;
        this.init();
      },
      taskDoneStatesChange() {
        this.currentPage = 1;
        this.init();
      },
      goToProject(project) {
        this.$router.push(`${this.$configSettings.project_path}/${project.id}`);
      },
      goToTask(task) {
        this.$router.push(`${this.$configSettings.project_path}/${task.project_id}?taskId=${task.id}`);
      },
    },
  };
</script>

<style lang="scss" scoped>
  .my-task {
    background-color: #fff;

    .head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 60px;
      padding: 0 20px;
      border-bottom: 1px solid $colorE8;

      .title {
        font-size: 16px;
      }
    }

    .wrap-nav {
      padding: 0 20px;

      & i {
        font-size: 14px;
        margin-right: 5px;
      }
    }

    .wrap-task-list {
      height: 500px;
      padding: 0 20px;

      .task-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 48px;
        border-bottom: 1px solid $colorE8;

        .task-name {
          flex: 1;
          padding: 0 10px;
          color: $colorBlue;
          cursor: pointer;
        }

        .project-name {
          width: 100px;
          cursor: pointer;
          color: $colorLight;

          &:hover {
            color: $colorBlue;
          }
        }
      }
    }

    .wrap-pagination {
      height: 32px;
      padding-bottom: 20px;
      margin-top: 20px;
    }
  }
</style>
