<template>
  <div class="project-list wrap-content-main">
    <el-tabs v-model="activeName">
      <el-tab-pane v-for="(item, index) in titles" :key="index" :label="item" :name="(index + 1).toString()">
        <div v-loading="loading" class="list color-light">
          <div v-for="project in listDataFilter" :key="project.id" class="item-list">
            <BImage :src="project.cover"></BImage>
            <div class="item-info">
              <div class="name">
                <span class="name-text" @click="projectClick(project)">{{ project.name }}</span>
                <el-tag v-if="project.is_private === 0" style="margin-left: 10px" type="success">公开</el-tag>
              </div>
              <div class="intro">{{ project.intro }}</div>
            </div>
            <div class="item-manager">
              <div>创建日期</div>
              <div>{{ dateFormat(project.created_at, 'YYYY-MM-DD') }}</div>
            </div>
            <div class="item-create-date">
              <div>创建人</div>
              <div>{{ project.creator.username }}</div>
            </div>
            <div class="item-progress">
              <div>进度</div>
              <el-progress :percentage="project.progress"></el-progress>
            </div>
            <div class="item-control">
              <BtnTooltip
                v-if="is_recycle === 0 && is_archived === null"
                icon="iconfont icon-jiaren"
                tooltipContent="添加成员"
                @click="handleAddUser(project)"
              ></BtnTooltip>
              <BtnTooltip
                v-if="is_recycle === 0 && is_archived === null"
                icon="el-icon-setting"
                tooltipContent="项目设置"
                @click="handleEdit(project)"
              ></BtnTooltip>
              <BtnTooltip
                v-if="is_recycle === 0 && is_archived === null"
                :icon="project.collector.length ? 'el-icon-star-on' : 'el-icon-star-off'"
                :tooltipContent="project.collector.length ? '取消收藏' : '加入收藏'"
                :btnClass="project.collector.length ? 'el-icon-star-on-color' : ''"
                @click="handleStart(project)"
              ></BtnTooltip>
              <BtnTooltip
                v-if="is_archived === 1"
                icon="el-icon-refresh-left"
                tooltipContent="恢复项目"
                @click="handleUnarchive(project)"
              ></BtnTooltip>
              <BtnTooltip
                v-if="is_recycle === 1"
                icon="el-icon-refresh-left"
                tooltipContent="恢复项目"
                @click="handleRestore(project)"
              ></BtnTooltip>
              <BtnTooltip
                v-if="is_recycle !== 1"
                icon="el-icon-delete"
                tooltipContent="移至回收站"
                @click="handleRecycle(project)"
              ></BtnTooltip>
            </div>
          </div>
        </div>
        <EmptyImage v-if="!listData.length && !loading" :height="400" :heightImg="230" text=""></EmptyImage>
      </el-tab-pane>
    </el-tabs>
    <el-button class="create-project" type="primary" icon="el-icon-plus" @click="handleCreate">创建新项目</el-button>
    <ProjectCreate ref="create"></ProjectCreate>
    <ProjectEdit ref="edit" @fetchData="getList"></ProjectEdit>
    <AddMemberToProjectDialog ref="AddMemberToProjectDialog"></AddMemberToProjectDialog>
    <div v-if="listData.length > pageSize" class="wrap-el-pagination">
      <el-pagination
        background
        :total="count"
        :current-page="pageNo"
        :page-size="pageSize"
        @current-change="handleCurrentChange"
        layout="prev, pager, next"
      >
      </el-pagination>
    </div>
    <!--    TODO 全部项目需要包含归档-->
    <!--    TODO 裁剪图片样式bug-->
  </div>
</template>

<script>
  import store from '@/store';
  import BImage from '@/components/B-image';
  import EmptyImage from '@/components/EmptyImage';
  import BtnTooltip from '@/components/Btn-tooltip';
  import { getList, doEdit } from '@/api/projectManagement';
  import { doChange as doChangeCollect } from '@/api/userProjectCollectManagement';
  import ProjectCreate from './components/ProjectCreate';
  import ProjectEdit from './components/ProjectEdit';
  import AddMemberToProjectDialog from './components/AddMemberToProjectDialog';
  import { mapState } from 'vuex';
  import mixin from '@/mixins';

  export default {
    name: 'ProjectList',
    components: {
      BImage,
      BtnTooltip,
      ProjectCreate,
      ProjectEdit,
      AddMemberToProjectDialog,
      EmptyImage,
    },
    mixins: [mixin],
    data() {
      return {
        loading: false,
        activeName: '',
        titles: [],
        listData: [],
        is_recycle: 0,
        is_archived: null,
        collection: 0,
        count: 0,
        pageNo: 1,
        pageSize: 10,
      };
    },
    computed: {
      ...mapState('user', ['userInfo']),
      listDataFilter() {
        let data = this.$baseLodash.sortBy(this.listData, 'collector');
        data = this.$baseLodash.sortBy(data.reverse(), o => {
          return o.is_private;
        });
        data = data.filter((item, index) => {
          return index >= (this.pageNo - 1) * this.pageSize && index <= this.pageNo * this.pageSize;
        });
        return data;
      },
    },
    watch: {
      activeName(newValue, oldValue) {
        this.collection = 0;
        switch (newValue) {
          case '1':
            this.is_recycle = 0;
            this.is_archived = null;
            break;
          case '2':
            this.is_recycle = 0;
            this.is_archived = null;
            this.collection = 1;
            break;
          case '3':
            this.is_recycle = null;
            this.is_archived = 1;
            break;
          case '4':
            this.is_recycle = 1;
            this.is_archived = null;
            break;
          default:
            break;
        }
        this.getList();
      },
    },
    sockets: {
      sync: function (data) {
        const { params, action } = data;
        switch (action) {
          case 'create:project':
            {
              // 如果是自己创建的
              if (params.manager_id === this.userInfo.id) {
                this.pageNo = 1;
                this.getList();
              }
              // const taskExisting = this.listData.find(item => item.id === params.id);
              // // 如果不存在，则添加
              // if (!taskExisting) {
              //   this.listData?.push(params);
              // }
            }
            break;
          default:
            break;
        }
      },
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        const path = vm.$route.path;
        vm.activeName = path.substring(path.lastIndexOf('/') + 1);
      });
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
        const params = {
          collection: this.collection,
        };
        this.is_recycle !== null ? (params.is_recycle = this.is_recycle) : null;
        this.is_archived !== null ? (params.is_archived = this.is_archived) : null;
        const {
          data: { rows, count },
        } = await getList(params);
        this.loading = false;
        this.listData = rows;
        this.count = count;
        this.pageNo = 1;
      },
      handleAddUser(item) {
        this.$refs.AddMemberToProjectDialog.show(item.id);
      },
      handleEdit(item) {
        this.$refs['edit'].showEdit(item);
      },
      async handleStart(item) {
        const { msg } = await doChangeCollect({
          user_id: this.userInfo.id,
          project_id: item.id,
        });
        this.getList();
        this.$baseMessage(msg, 'success');
      },
      handleUnarchive(item) {
        this.$baseConfirm('你确定要还原当前项吗', null, async () => {
          item.is_archived = 0;
          const { msg } = await doEdit(item);
          this.$baseMessage(msg, 'success');
          this.getList();
        });
      },
      handleRestore(item) {
        this.$baseConfirm('你确定要还原当前项吗', null, async () => {
          item.is_recycle = 0;
          const { msg } = await doEdit(item);
          this.$baseMessage(msg, 'success');
          this.getList();
        });
      },
      handleRecycle(item) {
        this.$baseConfirm('你确定要将当前项移至回收站吗', null, async () => {
          item.is_recycle = 1;
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
      handleCurrentChange(val) {
        this.pageNo = val;
      },
    },
  };
</script>

<style lang="scss" scoped>
  .project-list {
    position: relative;
    min-height: 790px;
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
        padding: 10px 0;
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
          .el-icon-star-on-color {
            color: #ffaf38;
          }
        }
      }
    }
  }
</style>
