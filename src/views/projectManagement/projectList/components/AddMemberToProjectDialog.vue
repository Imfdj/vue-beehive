<template>
  <el-dialog
    title="邀请新成员"
    :visible.sync="dialogVisible"
    custom-class="add-member-to-project-dialog"
    width="530px"
    append-to-body
  >
    <div class="wrap-content">
      <div class="wrap-intro">
        账号邀请
        <el-button type="text" size="medium">通过链接邀请</el-button>
      </div>
      <el-input
        v-model="keyword"
        placeholder="请输入用户名或邮箱查找"
        prefix-icon="el-icon-search"
        @keyup.native="keywordChange"
      ></el-input>
      <div class="user-list">
        <div v-for="(item, index) in userList" :key="index" class="wrap-list-item">
          <BImage class="user-avatar" :src="item.avatar || ''" :width="32" :height="32" :borderRadius="32"></BImage>
          <div class="user-info">
            <div class="user-name">{{ item.username }}</div>
            <div class="foot color-light">
              <div class="user-emial">{{ item.email }}</div>
            </div>
          </div>
          <div class="wrap-ctrl color-light">
            <el-button v-if="!item.projectIds.includes(projectId)" size="mini" plain @click="add(item)">
              <i class="iconfont icon-jiaren"></i> 邀请
            </el-button>
            <span v-else><i class="iconfont icon-ren" style="margin-right: 5px"></i>已加入</span>
          </div>
        </div>
      </div>
      <div v-if="userData.count > pageSize" class="wrap-pagination">
        <el-pagination
          layout="prev, pager, next"
          :total="userData.count"
          :current-page="pageNo"
          :page-size="pageSize"
          @current-change="handleCurrentChange"
        >
        </el-pagination>
      </div>
    </div>
  </el-dialog>
</template>

<script>
  import { getList } from '@/api/user';
  import { doCreate } from '@/api/userProjectManagement';
  import BImage from '@/components/B-image';
  import { waitTimeout } from '@/utils';

  export default {
    name: 'AddMemberToProjectDialog',
    components: {
      BImage,
    },
    data() {
      return {
        dialogVisible: false,
        keyword: '',
        timer: 0,
        projectId: null,
        userData: [],
        pageNo: 1,
        pageSize: 6,
      };
    },
    computed: {
      userList() {
        return (
          this.userData.rows &&
          this.userData.rows.map(item => {
            return {
              ...item,
              projectIds: item.projects && item.projects.map(project => project.id),
            };
          })
        );
      },
    },
    watch: {
      dialogVisible(newValue, oldValue) {
        if (newValue) {
          this.getUserList();
        }
      },
      userList(newValue, oldValue) {
        this.$emit('getUserList', newValue);
      },
    },
    created() {
      this.getUserList();
    },
    methods: {
      show(projectId) {
        this.projectId = projectId;
        this.dialogVisible = true;
      },
      keywordChange() {
        this.pageNo = 1;
        waitTimeout(300, this.getUserList);
      },
      handleCurrentChange(val) {
        this.pageNo = val;
        this.getUserList();
      },
      async getUserList() {
        const { data } = await getList({
          keyword: this.keyword,
          limit: this.pageSize,
          offset: (this.pageNo - 1) * this.pageSize,
        });
        this.userData = data;
        console.log(data);
      },
      async doCreateExec(body) {
        const { data } = await doCreate(body);
        this.$message.success('添加成功');
        this.getUserList();
        this.$emit('doCreateSuccess');
      },
      add(user) {
        this.doCreateExec({
          user_id: user.id,
          project_id: this.projectId,
        });
      },
    },
  };
</script>

<style>
  .add-member-to-project-dialog .el-dialog__body {
    padding: 10px 20px;
  }
</style>
<style lang="scss" scoped>
  .add-member-to-project-dialog {
    .iconfont {
      font-size: 14px;
    }

    .wrap-content {
      .wrap-intro {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 40px;
      }

      .user-list {
        min-height: 300px;
        padding-top: 10px;

        .wrap-list-item {
          display: flex;
          padding: 12px 0px;
          border-top: 1px solid #e8e8e8;

          .user-avatar {
            width: 32px;
            height: 32px;
            margin-right: 15px;
            border-radius: 50%;
          }

          .user-info {
            flex: 1;
            line-height: 22px;

            .foot {
              display: flex;

              .user-emial {
                margin-right: 10px;
              }
            }
          }

          .wrap-ctrl {
            display: flex;
            align-items: center;
            justify-content: space-around;
            width: 64px;

            .line {
              width: 1px;
              height: 14px;
              background-color: #ccc;
            }

            & i {
              cursor: pointer;
            }
          }
        }
      }
    }
  }
</style>
