<template>
  <div class="project-task">
    <div class="wrap-nav">
      <el-dropdown trigger="click" placement="top" class="project-task-project-dropdown" @command="dropdownCommand">
        <span class="el-dropdown-link">
          <span class="wrap-link">
            <span class="project-name">{{ currentProject.name }}</span>
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
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
            <div class="wrap-el-dropdown-item">
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
          </div>
        </el-dropdown-menu>
      </el-dropdown>

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
          ><el-button type="text" icon="el-icon-user" @click="handleAddUser">{{ userProjectCount }}</el-button>
        </span>
        <ProjectSetting>
          <el-button type="text" icon="el-icon-s-unfold">菜单</el-button>
        </ProjectSetting>
      </div>
    </div>
    <div class="wrap-content">
      <TaskList v-if="indexTab === 0" ref="TaskList"></TaskList>
      <File v-if="indexTab === 1" ref="File"></File>
      <Overview v-if="indexTab === 2" ref="Overview"></Overview>
    </div>
    <AddMemberToProjectDialog ref="AddMemberToProjectDialog"></AddMemberToProjectDialog>
  </div>
</template>

<script>
  import TaskList from './components/task/TaskList';
  import TaskFilter from './components/task/components/TaskFilter';
  import ProjectSetting from './components/task/components/ProjectSetting';
  import File from './components/File';
  import Overview from './components/Overview';
  import { mapState, mapMutations } from 'vuex';
  import BImage from '@/components/B-image';
  import AddMemberToProjectDialog from '@/views/projectManagement/projectList/components/AddMemberToProjectDialog';
  import { getList as getUserList } from '@/api/user';

  export default {
    name: 'ProjectTask',
    components: {
      TaskList,
      BImage,
      AddMemberToProjectDialog,
      TaskFilter,
      ProjectSetting,
      File,
      Overview,
    },
    data() {
      return {
        tabs: ['任务', '文件', '概览', '版本', '日程'],
        keywordProjectName: '',
        userProjectCount: 0,
      };
    },
    computed: {
      ...mapState('project', ['currentProjectId', 'projectList', 'indexTab']),
      currentProject() {
        return this.projectList.find(item => item.id === this.currentProjectId) || {};
      },
      listProjectDataFilter() {
        return this.projectList.filter(item => item.name.includes(this.keywordProjectName));
      },
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.setNoNav(true);
      });
    },
    async beforeRouteUpdate(to, from, next) {
      if (to.name === 'Project') {
        // 重置项目关联
        await this.initProjectRelevancy(to.params.id);
        this.setIndexTab(0);
      }
      next();
      // 在当前路由改变，但是该组件被复用时调用
      // 举例来说，对于一个带有动态参数的路径 /foo/:id，在 /foo/1 和 /foo/2 之间跳转的时候，
      // 由于会渲染同样的 Foo 组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用。
      // 可以访问组件实例 `this`
    },
    beforeRouteLeave(to, from, next) {
      this.setNoNav(false);
      next();
    },
    async created() {
      this.$store.dispatch('project/setProjectList');
      this.$store.dispatch('project/setTaskTypes');
      this.$store.dispatch('project/setTaskStates');
      this.$store.dispatch('project/setTaskPrioritys');
      this.initProjectRelevancy(this.$route.params.id);
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
      ...mapMutations('routes', ['setNoNav', 'setNavIndex']),
      ...mapMutations('project', ['setIndexTab']),
      // 初始化项目关联
      async initProjectRelevancy(projectId) {
        await this.$store.commit('project/setCurrentProjectId', parseInt(projectId));
        this.getUserList();
        this.$store.dispatch('project/setTaskTags');
        this.$store.dispatch('project/setProjectMembers');
      },
      tabClick(index) {
        this.setIndexTab(index);
      },
      dropdownCommand(projectId) {
        this.$router.push(this.$route.path.replace(/\/\d+$/, `/${projectId}`));
      },
      handleAddUser() {
        this.$refs.AddMemberToProjectDialog.show(this.currentProjectId);
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
      async getUserList() {
        const {
          data: { count },
        } = await getUserList({ project_id: this.currentProjectId });
        this.userProjectCount = count;
      },
    },
  };
</script>

<style lang="scss" scoped>
  .wrap-project-task-dropdown {
    .project-task-wrap-dropdown-input {
      width: 94%;
      margin: 5px 3% 5px 3%;

      ::v-deep .el-input__inner {
        border-radius: 4px;
      }
    }
    .wrap-el-dropdown-item {
      max-height: 500px;
      overflow-x: hidden;
      overflow-y: auto;
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
  }

  .project-task {
    background-color: #f7f7f7;

    .project-task-project-dropdown {
      cursor: pointer;
      width: 223px;
      .wrap-link {
        display: flex;
        align-items: center;
        .project-name {
          display: inline-block;
          min-width: 60px;
          max-width: 223px;
          line-height: 100%;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          text-align: center;
        }
        .el-icon-arrow-down {
          font-size: 16px;
          font-weight: 600;
        }
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
      height: calc(100vh - 192px);
      padding: 20px;
      overflow: auto;
      white-space: nowrap;
    }
  }
</style>
