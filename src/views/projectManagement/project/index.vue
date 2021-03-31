<template>
  <div class="project-task">
    <div class="wrap-nav">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><i class="el-icon-s-home"></i>首页</el-breadcrumb-item>
        <el-breadcrumb-item>
          <el-dropdown trigger="click" placement="top" class="project-task-project-dropdown" @command="dropdownCommand">
            <span class="el-dropdown-link">
              <span class="project-name">{{ currentProject.name }}</span>
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <div class="wrap-project-task-dropdown">
                <el-input
                  v-model="keywordProjectName"
                  size="medium"
                  class="project-task-wrap-dropdown-input"
                  placeholder="搜索"
                  prefix-icon="el-icon-search"
                ></el-input>
                <el-dropdown-item v-for="item in listProjectDataFilter" :key="item.id" :command="item.id">
                  <div class="project-task-wrap-dropdown-item">
                    <div class="info">
                      <BImage :src="item.cover || ''" :width="32" :height="32" :borderRadius="32"></BImage>
                      <div class="name">{{ item.name }}</div>
                    </div>
                    <i v-if="item.id === currentProject.id" class="el-icon-check"></i>
                  </div>
                </el-dropdown-item>
              </div>
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
        <TaskFilter @search="taskSearch">
          <el-button type="text" icon="el-icon-search">筛选</el-button>
        </TaskFilter>
        <span
          ><el-button type="text" icon="el-icon-user" @click="handleAddUser">{{ projectUser.length }}</el-button>
        </span>
        <ProjectSetting>
          <el-button type="text" icon="el-icon-s-unfold">菜单</el-button>
        </ProjectSetting>
      </div>
    </div>
    <div class="wrap-content">
      <TaskList ref="TaskList"></TaskList>
    </div>
    <AddMemberToProjectDialog ref="AddMemberToProjectDialog" @getUserList="getUserList"></AddMemberToProjectDialog>
  </div>
</template>

<script>
  import TaskList from './components/task/TaskList';
  import TaskFilter from './components/task/components/TaskFilter';
  import ProjectSetting from './components/task/components/ProjectSetting';
  import store from '@/store';
  import { mapState } from 'vuex';
  import BImage from '@/components/B-image';
  import AddMemberToProjectDialog from '@/views/projectManagement/projectList/components/AddMemberToProjectDialog';

  export default {
    name: 'ProjectTask',
    components: {
      TaskList,
      BImage,
      AddMemberToProjectDialog,
      TaskFilter,
      ProjectSetting,
    },
    data() {
      return {
        tabs: ['任务', '文件', '概览', '版本', '日程'],
        indexTab: 0,
        userList: [],
        keywordProjectName: '',
      };
    },
    computed: {
      ...mapState('project', ['currentProjectId', 'projectList']),
      currentProject() {
        return this.projectList.find(item => item.id === this.currentProjectId) || {};
      },
      listProjectDataFilter() {
        return this.projectList.filter(item => item.name.includes(this.keywordProjectName));
      },
      projectUser() {
        return this.userList.filter(item => item.projectIds.includes(this.currentProjectId));
      },
    },
    async created() {
      store.dispatch('project/setProjectList');
      store.dispatch('project/setTaskTypes');
      store.dispatch('project/setTaskStates');
      store.dispatch('project/setTaskPrioritys');
      await store.commit('project/setCurrentProjectId', parseInt(this.$route.params.id));
      store.dispatch('project/setTaskTags');
      store.dispatch('project/setProjectMembers');
    },
    sockets: {
      sync: function (data) {
        const { params, action } = data;
        switch (action) {
          case 'update:project':
            this.projectList?.forEach(item => {
              if (params.id === item.id) {
                Object.assign(item, params);
              }
            });
            break;
          default:
            break;
        }
      },
    },
    methods: {
      tabClick(index) {
        this.indexTab = index;
      },
      dropdownCommand(projectId) {
        this.$router.push(this.$route.path.replace(/\/\d+$/, `/${projectId}`));
      },
      handleAddUser() {
        this.$refs.AddMemberToProjectDialog.show(this.currentProjectId);
      },
      getUserList(userList) {
        this.userList = userList;
      },
      taskSearch(form) {
        const params = {};
        for (const argumentsKey in form) {
          if (form[argumentsKey].length) {
            params[argumentsKey] = form[argumentsKey];
          }
        }
        if (form.is_done !== -1) {
          params.is_done = form.is_done;
        }
        this.$refs.TaskList.searchTask(params);
      },
    },
  };
</script>

<style lang="scss" scoped>
  .wrap-project-task-dropdown {
    max-height: 500px;
    overflow-x: hidden;
    overflow-y: auto;

    .project-task-wrap-dropdown-input {
      width: 94%;
      margin: 5px 3% 5px 3%;

      ::v-deep .el-input__inner {
        border-radius: 4px;
      }
    }

    .project-task-wrap-dropdown-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 220px;
      height: 60px;

      .info {
        display: flex;
        align-items: center;

        .name {
          width: 140px;
          line-height: 20px;
          padding-left: 10px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
      }

      & i {
        font-size: 18px;
      }
    }
  }

  .project-task {
    background-color: #f7f7f7;

    .project-task-project-dropdown {
      cursor: pointer;

      .project-name {
        display: inline-block;
        max-width: 160px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }

    .wrap-nav {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 46px;
      padding: 0 20px;
      font-size: 15px;
      border-bottom: 1px solid #d9d9d9;
      background-color: #fff;

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
        justify-content: space-between;
        width: 223px;
        ::v-deep .el-button--small {
          font-size: 14px;
        }
      }
    }

    .wrap-content {
      padding: 20px;
      height: calc(100% - 46px);
      overflow-x: auto;
      white-space: nowrap;
    }
  }
</style>
