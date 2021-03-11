<template>
  <div class="executor-select">
    <el-popover v-model="visible" placement="bottom" width="240" trigger="click" @show="show">
      <div class="popover-content-executor-selector">
        <el-input
          v-model="name"
          placeholder="搜索"
          size="medium"
          prefix-icon="el-icon-search"
          @keyup.native="keywordChange"
        ></el-input>
        <div class="wrap-current-executor">
          <div class="title color-light">执行者</div>
          <div class="current-executor">
            <div class="wrap-info">
              <BImage
                class="user-avatar"
                :src="executor.avatar || ''"
                :width="32"
                :height="32"
                :borderRadius="32"
              ></BImage>
              <span class="name ellipsis">{{ executor.username }}</span>
            </div>
            <i class="el-icon-check"></i>
          </div>
          <div class="title color-light">其他成员</div>
          <div v-for="user in dataListFilter" :key="user.id" class="current-executor" @click="selectHandler(user)">
            <div class="wrap-info">
              <BImage class="user-avatar" :src="user.avatar || ''" :width="32" :height="32" :borderRadius="32"></BImage>
              <span class="name ellipsis">{{ user.username }}</span>
            </div>
            <i v-if="executor.id === user.id" class="el-icon-check"></i>
          </div>
        </div>
        <div v-if="showAddUser" class="wrap-footer">
          <el-button type="primary" style="width: 100%;" @click="handleAddUser">邀请新成员</el-button>
        </div>
      </div>
      <div slot="reference" class="btn">
        <BImage class="user-avatar" :src="executor.avatar || ''" :width="32" :height="32" :borderRadius="32"></BImage>
        {{ executor.username }} <i class="el-icon-question"></i>
      </div>
    </el-popover>
    <AddMemberToProjectDialog ref="AddMemberToProjectDialog" @doCreateSuccess="getList"></AddMemberToProjectDialog>
  </div>
</template>

<script>
  import BImage from '@/components/B-image';
  import { getList } from '@/api/userManagement';
  import { waitTimeout } from '@/utils';
  import AddMemberToProjectDialog from '@/views/projectManagement/projectList/components/AddMemberToProjectDialog';
  import { mapState } from 'vuex';

  export default {
    name: 'ExecutorSelect',
    components: {
      BImage,
      AddMemberToProjectDialog,
    },
    props: {
      executorId: {
        type: Number,
        default: 0,
      },
      showAddUser: {
        type: Boolean,
        default: true,
      },
    },
    data() {
      return {
        visible: false,
        name: '',
        dataList: {},
        executor: {
          id: 0,
          username: '待认领',
        },
      };
    },
    computed: {
      ...mapState('project', ['currentProjectId']),
      dataListFilter() {
        const data = this.$baseLodash.cloneDeep(this.dataList.rows) || [];
        data.unshift({
          id: 0,
          username: '待认领',
        });
        return data.filter(user => user.id !== this.executor.id);
      },
    },
    watch: {
      executorId(newValue) {
        this.executor = (this.dataList.rows && this.dataList.rows.find(user => user.id === newValue)) || {
          id: 0,
          username: '待认领',
        };
      },
    },
    created() {
      this.getList();
    },
    methods: {
      setHide() {
        this.visible = false;
      },
      show() {
        this.getList();
        this.visible = true;
      },
      keywordChange() {
        waitTimeout(300, this.getList);
      },
      async getList() {
        const { data } = await getList({
          keyword: this.name,
          project_id: this.currentProjectId,
        });
        this.dataList = data;
        if (this.executorId !== this.executor.id) {
          this.executor = this.dataList.rows.find(user => user.id === this.executorId) || {
            id: 0,
            username: '待认领',
          };
        }
      },
      selectHandler(user) {
        console.log(333);
        console.log(333);
        console.log(333);
        console.log(user);
        this.executor = user;
        this.$emit('select', user);
        this.setHide();
      },
      handleAddUser() {
        this.$refs.AddMemberToProjectDialog.show(this.currentProjectId);
      },
    },
  };
</script>

<style lang="scss" scoped>
  .popover-content-executor-selector {
    .wrap-current-executor {
      min-height: 240px;
      max-height: 500px;
      overflow-x: hidden;
      overflow-y: auto;

      .title {
        line-height: 40px;
      }

      .current-executor {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 5px 3px;
        cursor: pointer;

        .wrap-info {
          display: flex;
          align-items: center;

          .name {
            display: inline-block;
            width: 130px;
            margin-left: 5px;
          }
        }

        & i {
          font-size: 18px;
        }
      }

      .current-executor:hover {
        background-color: #f5f5f5;
      }
    }

    .wrap-footer {
      padding: 10px 0px 0px 0px;
      border-top: 1px solid #e5e5e5;
      margin-top: 5px;
    }
  }

  .executor-select {
    .btn {
      display: inline-flex;
      align-items: center;
      padding: 5px 0px;
      cursor: pointer;

      .user-avatar {
        margin-right: 5px;
      }

      .el-icon-question {
        margin-left: 5px;
      }
    }
  }
</style>
