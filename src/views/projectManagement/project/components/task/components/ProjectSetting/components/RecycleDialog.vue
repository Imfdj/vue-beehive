<template>
  <el-dialog title="回收站" :visible.sync="dialogVisible" custom-class="recycle-dialog" width="40%">
    <div v-loading="loading" class="wrap-recycle-list">
      <div v-for="item in data" :key="item.id" class="item">
        <div class="info">
          <div class="name ellipsis">{{ item.name }}</div>
          <div class="status">
            <el-tag v-if="item.is_done === 1" type="success">已完成</el-tag>
            <el-tag v-else type="info">未完成</el-tag>
          </div>
        </div>
        <div class="ctrl">
          <i class="el-icon-refresh-left" @click="recoverHandler(item)"></i>
          <div class="line"></div>
          <i class="el-icon-delete" @click="deleteHandler(item)"></i>
        </div>
      </div>
      <div v-if="data.length === 0 && !loading" class="no-data">
        <i class="iconfont icon-zanwu"></i>
        <div class="text">空空如也...</div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
  import { getList, doEdit, doDelete } from '@/api/taskManagement';
  import { mapState } from 'vuex';
  import mixin from '@/mixins';

  export default {
    name: 'RecycleDialog',
    mixins: [mixin],
    data() {
      return {
        dialogVisible: false,
        loading: false,
        data: [],
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
            this.data.forEach(item => {
              if (item.id === params.id) {
                Object.assign(item, params);
              }
            });
            this.data = this.data.filter(item => item.is_recycle === 1);
            break;
          default:
            break;
        }
      },
    },
    methods: {
      show() {
        this.dialogVisible = true;
        this.getList();
      },
      async getList() {
        this.loading = true;
        const {
          data: { rows },
        } = await getList({ project_id: this.currentProjectId, is_recycle: 1 });
        this.loading = false;
        this.data = rows;
      },
      async recoverHandler(task) {
        await this.recoverTask(task);
      },
      async deleteHandler(task) {
        await this.deleteTask(task);
      },
    },
  };
</script>

<style lang="scss" scoped>
  .recycle-dialog {
    @import '@/styles/custom.scss';
    .wrap-recycle-list {
      min-height: 40vh;
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
          justify-content: space-between;
          width: calc(100% - 50px - 10px);
          height: 100%;
          padding-right: 10px;
          .name {
          }
          .status {
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
</style>
