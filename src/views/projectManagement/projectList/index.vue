<template>
  <div class="project-list">
    <el-tabs v-model="activeName">
      <el-tab-pane v-for="(item, index) in titles" :key="index" :label="item" :name="(index + 1).toString()">
        <div v-loading="loading" class="list color-light">
          <div v-for="project in listData" :key="project.id" class="item-list">
            <BImage :src="project.cover"></BImage>
            <div class="item-info">
              <div class="name">
                <span class="name-text" @click="projectClick(project)">{{ project.name }}</span>
                <el-tag v-if="project.is_private === 0" style="margin-left: 10px;" type="success">公开</el-tag>
              </div>
              <div class="intro">{{ project.intro }}</div>
            </div>
            <div class="item-manager">
              <div>创建日期</div>
              <div>2020-08-19</div>
            </div>
            <div class="item-create-date">
              <div>创建人</div>
              <div>2020-08-19</div>
            </div>
            <div class="item-progress">
              <div>进度</div>
              <el-progress :percentage="project.progress"></el-progress>
            </div>
            <div class="item-control">
              <el-button
                v-if="project.state === 1"
                icon="iconfont icon-jiaren"
                circle
                size="mini"
                @click="handleAddUser(project)"
              ></el-button>
              <el-button
                v-if="project.state === 1"
                icon="el-icon-setting"
                circle
                size="mini"
                @click="handleEdit(project)"
              ></el-button>
              <el-button
                v-if="project.state === 1"
                icon="el-icon-star-off"
                circle
                size="mini"
                @click="handleStart(project)"
              ></el-button>
              <el-button
                v-if="project.state !== 1"
                icon="el-icon-refresh-left"
                circle
                size="mini"
                @click="handleBackNormal(project)"
              ></el-button>
              <el-button
                v-if="project.state === 2"
                icon="el-icon-delete"
                circle
                size="mini"
                @click="handleRecycle(project)"
              ></el-button>
              <el-button
                v-if="project.state === 1"
                icon="el-icon-delete"
                circle
                size="mini"
                @click="handleDelete(project)"
              ></el-button>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    <el-button class="create-project" type="primary" icon="el-icon-plus" @click="handleCreate">创建新项目</el-button>
    <ProjectCreate ref="create" @fetchData="getList"></ProjectCreate>
    <ProjectEdit ref="edit" @fetchData="getList"></ProjectEdit>
    <!--    TODO 空数据提示-->
    <!--    TODO 分页-->
  </div>
</template>

<script>
  import store from '@/store';
  import BImage from '@/components/B-image';
  import { getList, doDelete, doEdit } from '@/api/projectManagement';
  import ProjectCreate from './components/ProjectCreate';
  import ProjectEdit from './components/ProjectEdit';

  export default {
    name: 'ProjectList',
    components: {
      BImage,
      ProjectCreate,
      ProjectEdit,
    },
    data() {
      return {
        activeName: '1',
        titles: [],
        listData: [],
        state: 1,
      };
    },
    watch: {
      activeName(newValue, oldValue) {
        switch (newValue) {
          case '1':
            this.state = 1;
            break;
          case '3':
            this.state = 2;
            break;
          case '4':
            this.state = 3;
            break;
          default:
            break;
        }
        this.getList();
      },
    },
    created() {
      const path = this.$route.path;
      this.activeName = path.substring(path.lastIndexOf('/') + 1);

      this.getList();
    },
    mounted() {
      const routes = store.getters['routes/routes'];
      const projectRouter = routes && routes.find(item => item.id === 27);
      const projectListRouter = projectRouter && projectRouter.children.find(item => item.id === 32);
      this.titles = projectListRouter && projectListRouter.children.map(item => item.title);
    },
    methods: {
      async getList() {
        this.loading = true;
        const {
          data: { rows, count },
        } = await getList({ state: this.state, limit: 1000, offset: 0 });
        this.loading = false;
        this.listData = rows;
      },
      handleAddUser(item) {
        // TODO 项目增加成员
      },
      handleEdit(item) {
        this.$refs['edit'].showEdit(item);
      },
      handleStart(item) {
        // TODO 项目收藏
      },
      handleBackNormal(item) {
        this.$baseConfirm('你确定要还原当前项吗', null, async () => {
          item.state = 1;
          const { msg } = await doEdit(item);
          this.$baseMessage(msg, 'success');
          this.getList();
        });
      },
      handleDelete(item) {
        this.$baseConfirm('你确定要删除当前项吗', null, async () => {
          await doDelete({ ids: [item.id] });
          this.$baseMessage('删除成功', 'success');
          this.getList();
        });
      },
      handleRecycle(item) {
        this.$baseConfirm('你确定要将当前项移至回收站吗', null, async () => {
          item.state = 3;
          const { msg } = await doEdit(item);
          this.$baseMessage(msg, 'success');
          this.getList();
        });
      },
      handleCreate() {
        this.$refs['create'].showCreate();
      },
      projectClick(project) {
        this.$router.push(`/pojectManagement/Project/${project.id}`);
      },
    },
  };
</script>

<style lang="scss" scoped>
  .project-list {
    padding: 20px;
    .create-project {
      position: absolute;
      top: 13px;
      right: 20px;
    }
    .list {
      .item-list {
        display: flex;
        height: 50px;
        padding: 12px 0;
        line-height: 25px;
        border-bottom: 1px solid #e8e8e8;
        .item-img {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 50px;
          height: 50px;
          background-color: #f1f1f1;
          border-radius: 3px;
        }
        .item-info {
          flex: 1;
          width: 0;
          margin-left: 10px;
          line-height: 25px;
          .name {
            .name-text {
              color: #1890ff;
              cursor: pointer;
            }
          }
          .intro {
            padding-right: 10px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
        .item-tasks {
          display: flex;
          flex: 1;
          justify-content: flex-end;
          padding-right: 40px;
          line-height: 50px;
          text-align: right;
          .task {
            margin-left: 6px;
          }
        }
        .item-manager {
          width: 150px;
        }
        .item-create-date {
          width: 120px;
        }
        .item-progress {
          width: 200px;
        }
        .item-control {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          width: 160px;
          ::v-deep .iconfont {
            font-size: 12px;
          }
        }
      }
    }
  }
</style>
