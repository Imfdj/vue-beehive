<template>
  <div class="participator">
    <div class="title">参与者 <span class="point"></span>{{ users.length }}</div>
    <div class="user-list">
      <div v-for="user in users" :key="user.id" class="item">
        <BImage class="user-avatar" :src="user.avatar || ''" :width="24" :height="24" :borderRadius="24"></BImage>
      </div>
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
            <div class="title color-light">参与者</div>
            <div
              v-for="user in users"
              :key="user.id"
              class="current-executor"
              :class="[{ disabled: user.id === creatorId }]"
              @click="selectHandler(user)"
            >
              <div class="wrap-info">
                <BImage
                  class="user-avatar"
                  :src="user.avatar || ''"
                  :width="32"
                  :height="32"
                  :borderRadius="32"
                ></BImage>
                <span class="name ellipsis">{{ user.username }}</span>
              </div>
              <i class="el-icon-check"></i>
            </div>
            <div class="title color-light">其他成员</div>
            <div
              v-for="user in dataListFilter"
              :key="user.id"
              class="current-executor"
              @click="selectHandler(user, true)"
            >
              <div class="wrap-info">
                <BImage
                  class="user-avatar"
                  :src="user.avatar || ''"
                  :width="32"
                  :height="32"
                  :borderRadius="32"
                ></BImage>
                <span class="name ellipsis">{{ user.username }}</span>
              </div>
            </div>
          </div>
          <div v-if="isManager" class="wrap-footer">
            <el-button type="primary" style="width: 100%" @click="handleAddUser">邀请新成员</el-button>
          </div>
        </div>
        <el-button type="text" :disabled="!isCurrentProjectMember" slot="reference" class="btn">
          <i class="el-icon-circle-plus"></i>
        </el-button>
      </el-popover>
    </div>
    <AddMemberToProjectDialog ref="AddMemberToProjectDialog"></AddMemberToProjectDialog>
  </div>
</template>

<script>
  import BImage from '@/components/B-image';
  import { getList } from '@/api/user';
  import { doChange } from '@/api/userTaskManagement';
  import { waitTimeout } from '@/utils';
  import { mapState, mapGetters } from 'vuex';
  import AddMemberToProjectDialog from '@/views/projectManagement/projectList/components/AddMemberToProjectDialog';

  export default {
    name: 'Participator',
    components: {
      BImage,
      AddMemberToProjectDialog,
    },
    props: {
      users: {
        type: Array,
        required: true,
      },
      taskId: {
        type: Number,
        required: true,
      },
      creatorId: {
        type: Number,
        required: true,
      },
    },
    data() {
      return {
        visible: false,
        name: '',
        dataList: {},
      };
    },
    computed: {
      ...mapState('user', ['userInfo']),
      ...mapState('project', ['currentProjectId']),
      ...mapGetters('project', ['currentProject', 'isCurrentProjectMember']),
      isManager() {
        return this.userInfo.id === this.currentProject.manager_id;
      },
      dataListFilter() {
        const data = this.$baseLodash.cloneDeep(this.dataList.rows) || [];
        return data.filter(user => {
          const one = this.users.find(item => {
            return item.id === user.id;
          });
          return !one;
        });
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
      },
      async selectHandler(user, isAdd) {
        // 不可删除创建者
        if (!isAdd && user.id === this.creatorId) {
          return;
        }
        await doChange({
          user_id: user.id,
          task_id: this.taskId,
        });
        if (isAdd) {
          const userExisting = this.users.find(item => item.id === user.id);
          // 如果不存在，则添加
          if (!userExisting) {
            this.$emit('change', [...this.users, user]);
          }
        } else {
          this.$emit(
            'change',
            this.users.filter(userItem => userItem.id !== user.id)
          );
        }
      },
      handleAddUser() {
        this.$refs.AddMemberToProjectDialog.show(this.currentProject);
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
      .disabled {
        cursor: not-allowed;
      }
    }

    .wrap-footer {
      padding: 10px 0px 0px 0px;
      border-top: 1px solid #e5e5e5;
      margin-top: 5px;
    }
  }

  .participator {
    padding: 5px 20px 10px 20px;
    border-bottom: 1px solid #e5e5e5;

    .title {
      display: flex;
      align-items: center;

      .point {
        display: inline-block;
        width: 2px;
        height: 2px;
        margin: 0 4px;
        background-color: #606266;
        border-radius: 2px;
      }
    }

    .user-list {
      display: flex;
      align-items: center;
      padding: 10px 0;

      .item {
        margin-right: 8px;
        cursor: pointer;
      }
      .btn {
        padding: 0px;
        .el-icon-circle-plus {
          font-size: 28px;
          color: #1890ff;
        }
      }
    }
  }
</style>
