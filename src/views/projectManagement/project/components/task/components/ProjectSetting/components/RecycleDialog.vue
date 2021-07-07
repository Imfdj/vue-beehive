<template>
  <el-dialog title="查看回收站" :visible.sync="dialogVisible" custom-class="recycle-dialog" width="40%">
    <div class="wrap-content-recycle-dialog">
      <el-tabs v-model="activeName" tab-position="left" @tab-click="handleClick">
        <el-tab-pane name="task">
          <span slot="label"><i class="iconfont icon-xuanzhong2"></i> 任务</span>
        </el-tab-pane>
        <el-tab-pane name="file">
          <span slot="label"><i class="iconfont icon-fujian"></i> 文件</span>
        </el-tab-pane>
      </el-tabs>
      <div v-loading="loading" class="wrap-recycle-list">
        <div v-if="false" class="title">
          <span>名称</span>
          <span>修改时间</span>
        </div>
        <div v-for="item in data" :key="item.id" class="item">
          <div class="info">
            <div class="name ellipsis">{{ activeName === 'task' ? item.name : item.filename }}</div>
            <div v-if="activeName === 'task'" class="status">
              <el-tag v-if="item.is_done === 1" type="success">已完成</el-tag>
              <el-tag v-else type="info">未完成</el-tag>
            </div>
          </div>
          <div class="ctrl">
            <el-button
              :disabled="
                (activeName === 'file' && !$checkPermission(projectFilePermissions.doEdit)) ||
                (activeName === 'task' && !$checkPermission(taskPermissions.doEdit))
              "
              type="text"
              @click="recoverHandler(item)"
              ><i class="el-icon-refresh-left"></i
            ></el-button>
            <div class="line"></div>
            <el-button
              :disabled="
                (activeName === 'file' && !$checkPermission(projectFilePermissions.doDelete)) ||
                (activeName === 'task' && !$checkPermission(taskPermissions.doDelete))
              "
              type="text"
              @click="deleteHandler(item)"
              ><i class="el-icon-delete"></i
            ></el-button>
          </div>
        </div>
        <div v-if="data.length === 0 && !loading" class="no-data">
          <i class="iconfont icon-zanwu"></i>
          <div class="text">空空如也...</div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
  import { getList } from '@/api/taskManagement';
  import {
    getList as projectFileList,
    doEdit as doProjectFileListEdit,
    doDelete as doProjectFileListDelete,
    permissions as projectFilePermissions,
  } from '@/api/projectFileManagement';
  import { permissions as taskPermissions } from '@/api/taskManagement';
  import { mapState } from 'vuex';
  import mixin from '@/mixins';

  export default {
    name: 'RecycleDialog',
    mixins: [mixin],
    data() {
      return {
        projectFilePermissions,
        taskPermissions,
        dialogVisible: false,
        loading: false,
        data: [],
        activeName: 'task',
      };
    },
    computed: {
      ...mapState('project', ['currentProjectId']),
    },
    sockets: {
      sync: function (data) {
        const { params, action } = data;
        switch (action) {
          case 'update:task':
          case 'update:project_file':
            this.data.forEach(item => {
              if (item.id === params.id) {
                Object.assign(item, params);
              }
            });
            this.data = this.data.filter(item => item.is_recycle === 1);
            break;
          case 'delete:task':
          case 'delete:project_file':
            this.data = this.data.filter(item => item.id !== params.id);
            break;
          default:
            break;
        }
      },
    },
    methods: {
      show() {
        this.dialogVisible = true;
        this.getData();
      },
      async getList() {
        this.loading = true;
        const {
          data: { rows },
        } = await getList({ project_id: this.currentProjectId, is_recycle: 1 });
        this.loading = false;
        this.data = rows;
      },
      async projectFileList() {
        this.loading = true;
        const {
          data: { rows },
        } = await projectFileList({ project_id: this.currentProjectId, is_recycle: 1 });
        this.loading = false;
        this.data = rows;
      },
      async recoverHandler(item) {
        switch (this.activeName) {
          case 'task':
            await this.recoverTask(item);
            break;
          case 'file':
            this.$confirm('您确定要恢复文件吗？', '恢复文件', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
            }).then(async () => {
              await this.doProjectFileListEdit(item);
              this.$baseNotify('可在我的文件中查看', '成功恢复文件');
            });
            break;
          default:
            break;
        }
      },
      async deleteHandler(item) {
        switch (this.activeName) {
          case 'task':
            await this.deleteTask(item);
            break;
          case 'file':
            this.$confirm('您确定要永久删除文件吗？', '删除文件', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
            }).then(async () => {
              await this.doProjectFileListDelete(item);
              this.$baseNotify('', '成功删除文件');
            });
            break;
          default:
            break;
        }
      },
      async doProjectFileListEdit(item) {
        await doProjectFileListEdit({
          ...item,
          is_recycle: 0,
        });
      },
      async doProjectFileListDelete(item) {
        await doProjectFileListDelete({
          ids: [item.id],
        });
      },
      getData() {
        switch (this.activeName) {
          case 'task':
            this.getList();
            break;
          case 'file':
            this.projectFileList();
            break;
          default:
            break;
        }
      },
      handleClick() {
        this.getData();
      },
    },
  };
</script>

<style lang="scss" scoped>
  .recycle-dialog {
    .wrap-content-recycle-dialog {
      display: flex;
      .wrap-recycle-list {
        width: calc(100% - 88px);
        min-height: 40vh;
        .title {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          border-bottom: 1px solid $colorLight;
          padding-bottom: 10px;
        }
        .item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 50px;
          border-bottom: 1px solid $colorE8;
          padding: 10px 0;
          .info {
            display: flex;
            flex-direction: column;
            justify-content: center;

            width: calc(100% - 50px - 10px);
            height: 100%;
            padding-right: 10px;
            .name {
            }
            .status {
              margin-top: 10px;
            }
          }
          .ctrl {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 50px;
            .line {
              width: 1px;
              height: 15px;
              background-color: #ccc;
            }
            & i {
              font-size: 16px;
              cursor: pointer;
              color: $colorLight2;
            }
            ::v-deep {
              .el-button--small {
                margin-left: 0px;
              }
            }
          }
        }
        .no-data {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 300px;

          .iconfont {
            font-size: 60px;
            color: #4eb0f3;
          }

          .text {
            line-height: 30px;
          }
        }
      }
    }
  }
</style>
